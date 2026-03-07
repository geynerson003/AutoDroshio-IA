"""Campaigns endpoints"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
from app.core.database import get_db
from app.models import Campaign, Team, User
from app.api.dependencies import get_current_user

router = APIRouter()


class CampaignCreate(BaseModel):
    """Create campaign request"""
    product_id: int
    name: str
    budget: float


class CampaignResponse(BaseModel):
    """Campaign response"""
    id: int
    name: str
    budget: float
    spent: float
    revenue: float
    roas: float
    status: str

    class Config:
        from_attributes = True


@router.post("/", response_model=CampaignResponse, status_code=status.HTTP_201_CREATED)
async def create_campaign(
    campaign_data: CampaignCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new campaign"""
    team = db.query(Team).filter(Team.owner_id == current_user.id).first()
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found"
        )

    new_campaign = Campaign(
        team_id=team.id,
        **campaign_data.dict()
    )
    db.add(new_campaign)
    db.commit()
    db.refresh(new_campaign)
    return new_campaign


@router.get("/", response_model=List[CampaignResponse])
async def list_campaigns(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List all campaigns for current user"""
    team = db.query(Team).filter(Team.owner_id == current_user.id).first()
    if not team:
        return []

    campaigns = db.query(Campaign).filter(Campaign.team_id == team.id).all()
    return campaigns
