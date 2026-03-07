"""
Database models (SQLAlchemy ORM)
"""

from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, JSON, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base


class User(Base):
    """User model for account management"""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    teams = relationship("Team", back_populates="owner")
    integrations = relationship("Integration", back_populates="user")


class Team(Base):
    """Team model for multi-tenant support"""
    __tablename__ = "teams"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    plan = Column(String(50), default="free")  # free, pro, enterprise
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    owner = relationship("User", back_populates="teams")
    products = relationship("Product", back_populates="team")
    campaigns = relationship("Campaign", back_populates="team")
    orders = relationship("Order", back_populates="team")


class Product(Base):
    """Product model"""
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    cost = Column(Float, nullable=True)
    image_url = Column(String(500), nullable=True)
    source = Column(String(100), nullable=True)  # tiktok, amazon, aliexpress
    trending_score = Column(Float, default=0.0)
    status = Column(String(50), default="active")  # active, paused, archived
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    team = relationship("Team", back_populates="products")
    campaigns = relationship("Campaign", back_populates="product")


class Campaign(Base):
    """Campaign model for ad campaigns"""
    __tablename__ = "campaigns"

    id = Column(Integer, primary_key=True, index=True)
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    name = Column(String(255), nullable=False)
    meta_campaign_id = Column(String(255), nullable=True)  # Meta Ads ID
    budget = Column(Float, nullable=False)
    spent = Column(Float, default=0.0)
    revenue = Column(Float, default=0.0)
    roas = Column(Float, default=0.0)  # Return on ad spend
    status = Column(String(50), default="draft")  # draft, active, paused, completed
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    team = relationship("Team", back_populates="campaigns")
    product = relationship("Product", back_populates="campaigns")
    analytics = relationship("CampaignAnalytics", back_populates="campaign")


class Order(Base):
    """Order model for fulfillment"""
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=True)
    order_number = Column(String(100), unique=True, nullable=False)
    customer_email = Column(String(255), nullable=False)
    price = Column(Float, nullable=False)
    supplier = Column(String(100), nullable=True)  # cj_dropshipping, aliexpress
    supplier_order_id = Column(String(255), nullable=True)
    tracking_number = Column(String(100), nullable=True)
    status = Column(String(50), default="pending")  # pending, processing, shipped, delivered
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    team = relationship("Team", back_populates="orders")


class Integration(Base):
    """Integration credentials and settings"""
    __tablename__ = "integrations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    service = Column(String(100), nullable=False)  # meta, shopify, cj_dropshipping
    credentials = Column(JSON, nullable=False)  # Encrypted credentials
    is_active = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="integrations")


class CampaignAnalytics(Base):
    """Daily campaign analytics"""
    __tablename__ = "campaign_analytics"

    id = Column(Integer, primary_key=True, index=True)
    campaign_id = Column(Integer, ForeignKey("campaigns.id"), nullable=False)
    date = Column(DateTime, default=datetime.utcnow)
    impressions = Column(Integer, default=0)
    clicks = Column(Integer, default=0)
    conversions = Column(Integer, default=0)
    spend = Column(Float, default=0.0)
    revenue = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    campaign = relationship("Campaign", back_populates="analytics")
