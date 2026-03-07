"""
Integrations Endpoints - Meta Ads, Shopify, etc.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from app.core.database import get_db
from app.models import User, Team, Campaign, Integration, Product
from app.api.dependencies import get_current_user
from app.services.meta_ads_service import meta_ads_service
from datetime import datetime

router = APIRouter()


# ==================== MODELOS ====================

class MetaConnectRequest(BaseModel):
    """Solicitud para conectar cuenta Meta"""
    access_token: str
    ad_account_id: str
    business_account_id: str


class MetaConnectResponse(BaseModel):
    """Respuesta de conexión Meta"""
    status: str
    message: str
    account_id: Optional[str] = None


class CreateCampaignRequest(BaseModel):
    """Solicitud para crear campaña en Meta"""
    product_id: int
    campaign_name: str
    budget: float  # En USD
    objective: str = "CONVERSIONS"
    audience_targeting: dict = {}


class CreateCampaignResponse(BaseModel):
    """Respuesta de creación de campaña"""
    campaign_id: int  # ID en nuestra BD
    meta_campaign_id: Optional[str]
    name: str
    budget: float
    status: str = "PAUSED"
    created_at: str


class LaunchCampaignRequest(BaseModel):
    """Solicitud para lanzar campaña"""
    meta_campaign_id: str


class LaunchCampaignResponse(BaseModel):
    """Respuesta de lanzamiento"""
    status: str
    message: str


class CampaignAnalyticsResponse(BaseModel):
    """Respuesta de analytics"""
    spend: float
    impressions: int
    clicks: int
    conversions: int
    roas: float
    cpc: float
    cpm: float
    ctr: float


# ==================== ENDPOINTS ====================

@router.post("/meta/connect", response_model=MetaConnectResponse)
async def connect_meta_ads(
    request: MetaConnectRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Conectar cuenta Meta Ads con AutoDropship AI

    Pasos:
    1. Validar que el access token sea válido
    2. Obtener información de la cuenta
    3. Guardar credenciales encriptadas en BD
    4. Marcar integración como activa
    """
    try:
        # Validar credenciales con Meta
        ad_account = meta_ads_service.get_ad_account(f"act_{request.ad_account_id}")
        if not ad_account:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid Meta Ads credentials"
            )

        # Guardar credenciales
        success = meta_ads_service.save_credentials(
            user_id=current_user.id,
            access_token=request.access_token,
            ad_account_id=request.ad_account_id,
            business_account_id=request.business_account_id,
            db=db,
        )

        if not success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to save credentials"
            )

        return MetaConnectResponse(
            status="success",
            message="Meta Ads account connected successfully",
            account_id=request.ad_account_id,
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post("/meta/campaigns", response_model=CreateCampaignResponse, status_code=status.HTTP_201_CREATED)
async def create_meta_campaign(
    request: CreateCampaignRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Crear campaña en Meta Ads

    El flujo:
    1. Validar que el usuario tiene Meta conectado
    2. Obtener credenciales
    3. Crear campaña con Meta Ads API
    4. Guardar en nuestra BD
    5. Retornar detalles
    """
    try:
        # Obtener equipo del usuario
        team = db.query(Team).filter(Team.owner_id == current_user.id).first()
        if not team:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Team not found"
            )

        # Verificar que el producto existe
        product = db.query(Product).filter(Product.id == request.product_id).first()
        if not product or product.team_id != team.id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product not found"
            )

        # Obtener credenciales Meta
        integration = (
            db.query(Integration)
            .filter(
                Integration.user_id == current_user.id,
                Integration.service == "meta",
                Integration.is_active == True,
            )
            .first()
        )

        if not integration:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Meta Ads account not connected"
            )

        meta_creds = integration.credentials
        ad_account_id = f"act_{meta_creds['ad_account_id']}"

        # Crear campaña en Meta
        result = meta_ads_service.create_campaign(
            ad_account_id=ad_account_id,
            campaign_name=request.campaign_name,
            objective=request.objective,
        )

        if not result:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create campaign on Meta"
            )

        # Guardar en nuestra BD
        campaign = Campaign(
            team_id=team.id,
            product_id=request.product_id,
            name=request.campaign_name,
            meta_campaign_id=result["campaign_id"],
            budget=request.budget,
            status="PAUSED",
        )
        db.add(campaign)
        db.commit()
        db.refresh(campaign)

        return CreateCampaignResponse(
            campaign_id=campaign.id,
            meta_campaign_id=result["campaign_id"],
            name=campaign.name,
            budget=campaign.budget,
            status=campaign.status,
            created_at=campaign.created_at.isoformat(),
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.post("/meta/campaigns/{campaign_id}/launch", response_model=LaunchCampaignResponse)
async def launch_campaign(
    campaign_id: int,
    request: LaunchCampaignRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Lanzar campaña activándola en Meta Ads
    """
    try:
        # Obtener campaña
        campaign = db.query(Campaign).filter(Campaign.id == campaign_id).first()
        if not campaign:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Campaign not found"
            )

        # Verificar que el usuario es dueño del equipo
        team = db.query(Team).filter(Team.id == campaign.team_id).first()
        if team.owner_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized"
            )

        # Activar en Meta
        success = meta_ads_service.activate_campaign(request.meta_campaign_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to launch campaign on Meta"
            )

        # Actualizar en BD
        campaign.status = "ACTIVE"
        db.commit()

        return LaunchCampaignResponse(
            status="success",
            message="Campaign launched successfully"
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/meta/campaigns/{campaign_id}/analytics", response_model=CampaignAnalyticsResponse)
async def get_campaign_analytics(
    campaign_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Obtener analytics/insights de una campaña desde Meta Ads
    """
    try:
        # Obtener campaña
        campaign = db.query(Campaign).filter(Campaign.id == campaign_id).first()
        if not campaign:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Campaign not found"
            )

        # Verificar autorización
        team = db.query(Team).filter(Team.id == campaign.team_id).first()
        if team.owner_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized"
            )

        # Obtener datos de Meta
        analytics = meta_ads_service.get_campaign_insights(campaign.meta_campaign_id)
        if not analytics:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to fetch analytics from Meta"
            )

        return CampaignAnalyticsResponse(**analytics)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )