"""Orders endpoints"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
from app.core.database import get_db
from app.models import Order, Team, User
from app.api.dependencies import get_current_user

router = APIRouter()


class OrderCreate(BaseModel):
    """Create order request"""
    order_number: str
    customer_email: str
    price: float
    product_id: int = None


class OrderResponse(BaseModel):
    """Order response"""
    id: int
    order_number: str
    customer_email: str
    price: float
    supplier: str
    tracking_number: str
    status: str

    class Config:
        from_attributes = True


@router.post("/", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def create_order(
    order_data: OrderCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new order"""
    team = db.query(Team).filter(Team.owner_id == current_user.id).first()
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found"
        )

    new_order = Order(
        team_id=team.id,
        **order_data.dict()
    )
    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    return new_order


@router.get("/", response_model=List[OrderResponse])
async def list_orders(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List all orders for current user"""
    team = db.query(Team).filter(Team.owner_id == current_user.id).first()
    if not team:
        return []

    orders = db.query(Order).filter(Order.team_id == team.id).all()
    return orders
