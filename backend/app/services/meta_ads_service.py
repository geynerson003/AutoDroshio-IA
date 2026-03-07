"""
Meta Ads Service - Integración con Facebook Ads API
Maneja toda la lógica de creación, gestión y análisis de campañas en Meta
"""

import logging
from typing import Optional, Dict, List, Any
from datetime import datetime, timedelta
from facebook_business.api import FacebookAdsApi
from facebook_business.adobjects.adaccount import AdAccount
from facebook_business.adobjects.campaign import Campaign
from facebook_business.adobjects.adset import AdSet
from facebook_business.adobjects.ad import Ad
from facebook_business.adobjects.adcreative import AdCreative
from facebook_business.adobjects.adimage import AdImage
from app.core.config import settings
from sqlalchemy.orm import Session
from app.models import Campaign as CampaignModel, Integration

logger = logging.getLogger(__name__)


class MetaAdsService:
    """Servicio para integración con Meta Ads (Facebook Ads)"""

    def __init__(self):
        """Inicializar Facebook Ads API"""
        self.app_id = settings.META_APP_ID
        self.app_secret = settings.META_APP_SECRET
        self.access_token = settings.META_ACCESS_TOKEN

        # Solo inicializar si tenemos credenciales
        if self.app_id and self.app_secret and self.access_token:
            try:
                FacebookAdsApi.init(
                    access_token=self.access_token,
                    app_secret=self.app_secret,
                )
                logger.info("✅ Meta Ads API inicializado correctamente")
            except Exception as e:
                logger.error(f"❌ Error al inicializar Meta Ads API: {e}")
                self.api_ready = False
        else:
            logger.warning("⚠️  Meta Ads credentials no configuradas")
            self.api_ready = False

    def get_ad_account(self, account_id: str) -> Optional[AdAccount]:
        """
        Obtener Ad Account de Meta

        Args:
            account_id: ID de la cuenta publicitaria (ej: act_123456789)

        Returns:
            Objeto AdAccount o None si hay error
        """
        try:
            ad_account = AdAccount(account_id)
            ad_account.remote_read()  # Validar que existe
            logger.info(f"✅ Ad Account obtenido: {account_id}")
            return ad_account
        except Exception as e:
            logger.error(f"❌ Error al obtener Ad Account: {e}")
            return None

    def create_campaign(
        self,
        ad_account_id: str,
        campaign_name: str,
        objective: str = "CONVERSIONS",
        **kwargs
    ) -> Optional[Dict[str, Any]]:
        """
        Crear una campaña en Meta Ads

        Args:
            ad_account_id: ID de la cuenta publicitaria
            campaign_name: Nombre de la campaña
            objective: Objetivo de la campaña (CONVERSIONS, REACH, CLICKS, etc.)
            **kwargs: Parámetros adicionales

        Returns:
            Dict con campaignId y detalles, o None si hay error
        """
        try:
            ad_account = self.get_ad_account(ad_account_id)
            if not ad_account:
                raise Exception("Ad Account no encontrado")

            params = {
                "name": campaign_name,
                "objective": objective,
                "status": "PAUSED",  # Crear pausado para validar antes
            }
            params.update(kwargs)

            # Crear campaña
            campaign = ad_account.create_campaign(params=params)
            campaign_id = campaign["id"]

            logger.info(f"✅ Campaña creada: {campaign_id} - {campaign_name}")

            return {
                "campaign_id": campaign_id,
                "name": campaign_name,
                "objective": objective,
                "status": "PAUSED",
                "created_at": datetime.utcnow().isoformat(),
            }

        except Exception as e:
            logger.error(f"❌ Error al crear campaña: {e}")
            return None

    def create_ad_set(
        self,
        ad_account_id: str,
        campaign_id: str,
        ad_set_name: str,
        daily_budget: int,  # En centavos (ej: 100000 = $1000)
        targeting: Dict[str, Any],
        **kwargs
    ) -> Optional[Dict[str, Any]]:
        """
        Crear un Ad Set (conjunto de anuncios)

        Args:
            ad_account_id: ID de la cuenta
            campaign_id: ID de la campaña
            ad_set_name: Nombre del Ad Set
            daily_budget: Presupuesto diario en centavos
            targeting: Dict con opciones de targeting
            **kwargs: Parámetros adicionales

        Returns:
            Dict con ad_set_id, o None si hay error
        """
        try:
            ad_account = self.get_ad_account(ad_account_id)
            if not ad_account:
                raise Exception("Ad Account no encontrado")

            params = {
                "campaign_id": campaign_id,
                "name": ad_set_name,
                "daily_budget": daily_budget,
                "targeting": targeting,
                "status": "PAUSED",
                "billing_event": "IMPRESSIONS",
                "optimization_goal": "CONVERSIONS",
            }
            params.update(kwargs)

            # Crear ad set
            ad_set = ad_account.create_ad_set(params=params)
            ad_set_id = ad_set["id"]

            logger.info(f"✅ Ad Set creado: {ad_set_id}")

            return {
                "ad_set_id": ad_set_id,
                "name": ad_set_name,
                "daily_budget": daily_budget,
                "status": "PAUSED",
            }

        except Exception as e:
            logger.error(f"❌ Error al crear Ad Set: {e}")
            return None

    def create_ad(
        self,
        ad_set_id: str,
        ad_name: str,
        creative_id: str,
        **kwargs
    ) -> Optional[Dict[str, Any]]:
        """
        Crear un Ad (anuncio individual)

        Args:
            ad_set_id: ID del Ad Set
            ad_name: Nombre del anuncio
            creative_id: ID del creativo
            **kwargs: Parámetros adicionales

        Returns:
            Dict con ad_id, o None si hay error
        """
        try:
            ad_set = AdSet(ad_set_id)

            params = {
                "name": ad_name,
                "creative": {"creative_id": creative_id},
                "status": "PAUSED",
            }
            params.update(kwargs)

            # Crear anuncio
            ad = ad_set.create_ad(params=params)
            ad_id = ad["id"]

            logger.info(f"✅ Anuncio creado: {ad_id}")

            return {
                "ad_id": ad_id,
                "name": ad_name,
                "creative_id": creative_id,
                "status": "PAUSED",
            }

        except Exception as e:
            logger.error(f"❌ Error al crear anuncio: {e}")
            return None

    def upload_creative_image(
        self, ad_account_id: str, image_path: str, name: str
    ) -> Optional[str]:
        """
        Subir imagen creativa a Meta Ads

        Args:
            ad_account_id: ID de la cuenta
            image_path: Ruta local o URL de la imagen
            name: Nombre del creativo

        Returns:
            creative_id o None si hay error
        """
        try:
            ad_account = self.get_ad_account(ad_account_id)
            if not ad_account:
                raise Exception("Ad Account no encontrado")

            params = {
                "name": name,
            }

            # Si es URL, subir desde URL
            if image_path.startswith("http"):
                params["url"] = image_path
            else:
                # Si es archivo local, subir el archivo
                with open(image_path, "rb") as f:
                    params["file"] = f
                    ad_image = ad_account.create_ad_image(params=params)

            # Alternativamente, usar URL
            ad_image = ad_account.create_ad_image(params={
                "name": name,
                "url": image_path if image_path.startswith("http") else None,
            })

            image_hash = ad_image["images"][name][0]["hash"]
            logger.info(f"✅ Imagen creativa subida: {image_hash}")

            return image_hash

        except Exception as e:
            logger.error(f"❌ Error al subir imagen: {e}")
            return None

    def get_campaign_insights(
        self,
        campaign_id: str,
        date_start: Optional[str] = None,
        date_end: Optional[str] = None,
    ) -> Optional[Dict[str, Any]]:
        """
        Obtener insights/analytics de una campaña

        Args:
            campaign_id: ID de la campaña
            date_start: Fecha inicio (YYYY-MM-DD)
            date_end: Fecha fin (YYYY-MM-DD)

        Returns:
            Dict con métricas, o None si hay error
        """
        try:
            campaign = Campaign(campaign_id)

            params = {
                "fields": [
                    "spend",
                    "impressions",
                    "clicks",
                    "conversions",
                    "purchase_roas",
                    "cpc",
                    "cpm",
                    "ctr",
                ],
                "time_range": {
                    "since": date_start or (datetime.utcnow() - timedelta(days=7)).strftime(
                        "%Y-%m-%d"
                    ),
                    "until": date_end or datetime.utcnow().strftime("%Y-%m-%d"),
                },
            }

            insights = campaign.get_insights(params=params)

            if insights:
                data = insights[0] if isinstance(insights, list) else insights
                metrics = {
                    "spend": float(data.get("spend", 0)),
                    "impressions": int(data.get("impressions", 0)),
                    "clicks": int(data.get("clicks", 0)),
                    "conversions": int(data.get("conversions", 0)),
                    "roas": float(data.get("purchase_roas", 0)),
                    "cpc": float(data.get("cpc", 0)),
                    "cpm": float(data.get("cpm", 0)),
                    "ctr": float(data.get("ctr", 0)),
                    "date_start": date_start,
                    "date_end": date_end,
                }
                logger.info(f"✅ Insights obtenido para campaña {campaign_id}")
                return metrics
            else:
                logger.warning(f"⚠️  Sin datos para campaña {campaign_id}")
                return None

        except Exception as e:
            logger.error(f"❌ Error al obtener insights: {e}")
            return None

    def update_campaign_status(
        self, campaign_id: str, status: str
    ) -> bool:
        """
        Actualizar estado de campaña (ACTIVE, PAUSED, ARCHIVED, etc.)

        Args:
            campaign_id: ID de la campaña
            status: Nuevo estado

        Returns:
            True si éxitoso, False si hay error
        """
        try:
            campaign = Campaign(campaign_id)
            campaign.update({
                "status": status,
            })
            logger.info(f"✅ Campaña {campaign_id} actualizada a {status}")
            return True
        except Exception as e:
            logger.error(f"❌ Error al actualizar campaña: {e}")
            return False

    def pause_campaign(self, campaign_id: str) -> bool:
        """Pausar campaña"""
        return self.update_campaign_status(campaign_id, "PAUSED")

    def activate_campaign(self, campaign_id: str) -> bool:
        """Activar campaña"""
        return self.update_campaign_status(campaign_id, "ACTIVE")

    def save_credentials(
        self,
        user_id: int,
        access_token: str,
        ad_account_id: str,
        business_account_id: str,
        db: Session,
    ) -> bool:
        """
        Guardar credenciales Meta Ads encriptadas en BD

        Args:
            user_id: ID del usuario
            access_token: Token de acceso Meta
            ad_account_id: ID de cuenta publicitaria
            business_account_id: ID de cuenta de negocio
            db: Sesión de base de datos

        Returns:
            True si guardó exitosamente
        """
        try:
            # Verificar si ya existe integración
            integration = (
                db.query(Integration)
                .filter(
                    Integration.user_id == user_id,
                    Integration.service == "meta"
                )
                .first()
            )

            credentials = {
                "access_token": access_token,
                "ad_account_id": ad_account_id,
                "business_account_id": business_account_id,
            }

            if integration:
                # Actualizar
                integration.credentials = credentials
                integration.is_active = True
            else:
                # Crear nueva
                integration = Integration(
                    user_id=user_id,
                    service="meta",
                    credentials=credentials,
                    is_active=True,
                )
                db.add(integration)

            db.commit()
            logger.info(f"✅ Credenciales Meta guardadas para usuario {user_id}")
            return True

        except Exception as e:
            logger.error(f"❌ Error al guardar credenciales: {e}")
            return False


# Instancia global del servicio
meta_ads_service = MetaAdsService()
