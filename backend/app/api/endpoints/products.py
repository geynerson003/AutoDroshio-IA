"""Products endpoints"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
from app.core.database import get_db
from app.models import Product, Team, User
from app.api.dependencies import get_current_user

router = APIRouter()


class ProductCreate(BaseModel):
    """Create product request"""
    name: str
    description: str = None
    price: float
    cost: float = None
    image_url: str = None
    source: str = None
    trending_score: float = 0.0


class ProductResponse(BaseModel):
    """Product response"""
    id: int
    name: str
    description: str
    price: float
    cost: float
    image_url: str
    source: str
    trending_score: float
    status: str

    class Config:
        from_attributes = True


@router.post("/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(
    product_data: ProductCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new product"""
    # Get user's first team
    team = db.query(Team).filter(Team.owner_id == current_user.id).first()
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found. Please create a team first."
        )

    new_product = Product(
        team_id=team.id,
        **product_data.dict()
    )
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product


@router.get("/", response_model=List[ProductResponse])
async def list_products(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List all products for current user"""
    team = db.query(Team).filter(Team.owner_id == current_user.id).first()
    if not team:
        return []

    products = db.query(Product).filter(Product.team_id == team.id).all()
    return products


@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(
    product_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific product"""
    team = db.query(Team).filter(Team.owner_id == current_user.id).first()

    product = db.query(Product).filter(
        (Product.id == product_id) & (Product.team_id == team.id)
    ).first()

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )

    return product
