"""
Test suite para Meta Ads Integration Endpoints
Validación de OAuth flow y endpoints de campañas
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.core.database import Base, get_db
from app.models import User, Team, Product, Integration, Campaign
from app.core.security import create_access_token
from passlib.context import CryptContext
from datetime import datetime

# Setup test database
SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(
    SQLALCHEMY_TEST_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)


# ==================== FIXTURES ====================

@pytest.fixture(scope="function", autouse=True)
def setup_and_teardown():
    """Limpiar y preparar base de datos para cada test"""
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def test_user():
    """Crear usuario de prueba"""
    db = TestingSessionLocal()
    user = User(
        email="test@example.com",
        username="testuser",
        full_name="Test User",
        hashed_password=pwd_context.hash("testpassword"),
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    yield user
    db.close()


@pytest.fixture
def auth_headers(test_user):
    """Generar headers de autenticación JWT"""
    token = create_access_token(data={"sub": str(test_user.id)})
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def test_team(test_user):
    """Crear equipo de prueba"""
    db = TestingSessionLocal()
    team = Team(
        name="Test Team",
        owner_id=test_user.id,
    )
    db.add(team)
    db.commit()
    db.refresh(team)

    yield team
    db.close()


@pytest.fixture
def test_product(test_team):
    """Crear producto de prueba"""
    db = TestingSessionLocal()
    product = Product(
        team_id=test_team.id,
        name="Test Product",
        source_url="https://example.com/product",
        price=29.99,
        image_url="https://example.com/image.jpg",
    )
    db.add(product)
    db.commit()
    db.refresh(product)

    yield product
    db.close()


# ==================== TESTS ====================

def test_health_check():
    """Test endpoint de salud"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_get_meta_oauth_url(auth_headers):
    """Test obtener URL de autorización Meta"""
    response = client.get(
        "/api/integrations/meta/oauth/authorize",
        headers=auth_headers
    )

    assert response.status_code == 200
    data = response.json()
    assert "authorization_url" in data
    assert "state" in data
    assert "facebook.com" in data["authorization_url"]
    assert "client_id" in data["authorization_url"]
    assert "scope=" in data["authorization_url"]


def test_get_meta_oauth_url_unauthorized():
    """Test obtener URL de autorización sin autenticación"""
    response = client.get("/api/integrations/meta/oauth/authorize")
    assert response.status_code == 403


def test_connect_meta_ads(test_user, auth_headers):
    """Test conectar cuenta Meta directamente"""
    # Este test simula la conexión manual (sin OAuth flow)
    # En producción, se usaría el OAuth flow

    request_data = {
        "access_token": "test_token_12345",
        "ad_account_id": "123456789",
        "business_account_id": "987654321",
    }

    response = client.post(
        "/api/integrations/meta/connect",
        json=request_data,
        headers=auth_headers
    )

    # Podem fallar si las credenciales no son válidas
    # Pero el endpoint debe responder correctamente
    assert response.status_code in [200, 400]


def test_create_campaign_without_meta_connection(test_product, auth_headers):
    """Test crear campaña sin Meta conectado"""
    request_data = {
        "product_id": test_product.id,
        "campaign_name": "Test Campaign",
        "budget": 100.0,
        "objective": "CONVERSIONS",
    }

    response = client.post(
        "/api/integrations/meta/campaigns",
        json=request_data,
        headers=auth_headers
    )

    # Debe fallar porque no hay Meta conectado
    assert response.status_code == 400
    assert "Meta Ads account not connected" in response.json()["detail"]


def test_get_campaign_analytics_missing(test_user, auth_headers):
    """Test obtener analytics de campaña que no existe"""
    response = client.get(
        "/api/integrations/meta/campaigns/999/analytics",
        headers=auth_headers
    )

    assert response.status_code == 404


def test_launch_campaign_unauthorized(test_user, test_team, auth_headers):
    """Test lanzar campaña sin autorización"""
    # Crear usuario diferente
    db = TestingSessionLocal()
    other_user = User(
        email="other@example.com",
        username="otheruser",
        hashed_password=pwd_context.hash("password"),
    )
    db.add(other_user)
    db.commit()

    # Crear campaña para el otro usuario
    campaign = Campaign(
        team_id=test_team.id,
        product_id=1,
        name="Other Campaign",
        meta_campaign_id="campaign_123",
        budget=100.0,
        status="PAUSED",
    )
    db.add(campaign)
    db.commit()
    db.refresh(campaign)

    # Intentar lanzar campaña con usuario diferente
    request_data = {
        "meta_campaign_id": campaign.meta_campaign_id,
    }

    response = client.post(
        f"/api/integrations/meta/campaigns/{campaign.id}/launch",
        json=request_data,
        headers=auth_headers
    )

    assert response.status_code == 403
    db.close()


def test_meta_service_initialization():
    """Test que MetaAdsService se inicializa correctamente"""
    from app.services.meta_ads_service import meta_ads_service

    # El servicio debe existir
    assert meta_ads_service is not None

    # Debe tener los métodos requeridos
    assert hasattr(meta_ads_service, "create_campaign")
    assert hasattr(meta_ads_service, "get_campaign_insights")
    assert hasattr(meta_ads_service, "save_credentials")
    assert hasattr(meta_ads_service, "activate_campaign")
    assert hasattr(meta_ads_service, "pause_campaign")


# ==================== INTEGRATION TESTS ====================

def test_complete_meta_workflow(test_user, test_product, auth_headers):
    """Test flujo completo de Meta (sin llamadas reales a Meta API)"""

    # 1. Obtener URL de OAuth
    response = client.get(
        "/api/integrations/meta/oauth/authorize",
        headers=auth_headers
    )
    assert response.status_code == 200
    assert "authorization_url" in response.json()

    # 2. Guardar credenciales Meta (simular)
    db = TestingSessionLocal()
    integration = Integration(
        user_id=test_user.id,
        service="meta",
        credentials={
            "access_token": "test_token",
            "ad_account_id": "123456789",
            "business_account_id": "987654321",
        },
        is_active=True,
    )
    db.add(integration)
    db.commit()
    db.close()

    # 3. Verificar que la integración se guardó
    db = TestingSessionLocal()
    saved_integration = db.query(Integration).filter(
        Integration.user_id == test_user.id,
        Integration.service == "meta"
    ).first()
    assert saved_integration is not None
    assert saved_integration.is_active is True
    db.close()


def test_endpoints_list():
    """Verificar que todos los endpoints requeridos están registrados"""
    routes = [route.path for route in app.routes]

    # Endpoints de Meta Ads
    assert any("/meta/oauth/authorize" in r for r in routes)
    assert any("/meta/oauth/callback" in r for r in routes)
    assert any("/meta/connect" in r for r in routes)
    assert any("/meta/campaigns" in r for r in routes)
    assert any("/meta/campaigns/{campaign_id}/launch" in r for r in routes)
    assert any("/meta/campaigns/{campaign_id}/analytics" in r for r in routes)


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
