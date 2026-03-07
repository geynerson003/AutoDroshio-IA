# AutoDropship AI - Backend Setup

## Descripción

Backend de AutoDropship AI construido con **Python + FastAPI**, **PostgreSQL** para almacenamiento de datos, y **Redis** para caching.

## Estructura de Carpetas

```
backend/
├── app/
│   ├── api/
│   │   ├── endpoints/
│   │   │   ├── auth.py          # Autenticación
│   │   │   ├── products.py      # Gestión de productos
│   │   │   ├── campaigns.py     # Gestión de campañas
│   │   │   └── orders.py        # Gestión de órdenes
│   │   ├── dependencies.py      # Dependencias compartidas
│   │   └── __init__.py
│   ├── core/
│   │   ├── config.py            # Configuración (Settings)
│   │   ├── database.py          # SQLAlchemy setup
│   │   ├── security.py          # JWT y hashing
│   │   └── __init__.py
│   ├── models/
│   │   ├── database.py          # Modelos ORM
│   │   └── __init__.py
│   ├── services/                # Servicios (OpenAI, Meta, Scraping)
│   └── main.py                  # Aplicación FastAPI principal
├── requirements.txt             # Dependencias Python
├── .env.example                 # Variables de entorno ejemplo
└── Dockerfile                   # Docker image
```

## Modelos de Base de Datos

### User
- Email, username, hashed_password, full_name
- Multi-usuario SaaS

### Team
- Multi-tenant support
- Owner, plan, created_at

### Product
- name, description, price, cost
- trending_score, source (tiktok, amazon, aliexpress)
- Status: active, paused, archived

### Campaign
- Meta Ads campaign
- budget, spent, revenue, roas
- Status: draft, active, paused, completed

### Order
- Fulfillment tracking
- supplier_order_id, tracking_number
- Status: pending, processing, shipped, delivered

### Integration
- Guardacredenciales API (Meta, Shopify, etc.)
- Encriptado

### CampaignAnalytics
- Daily metrics: impressions, clicks, conversions, spend

## Endpoints Implementados (FASE 1)

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Login y obtener JWT token
- `GET /api/auth/me` - Obtener info del usuario actual

### Productos (CRUD básico)
- `POST /api/products/` - Crear producto
- `GET /api/products/` - Listar productos
- `GET /api/products/{id}` - Obtener producto

### Campañas (CRUD básico)
- `POST /api/campaigns/` - Crear campaña
- `GET /api/campaigns/` - Listar campañas

### Órdenes (CRUD básico)
- `POST /api/orders/` - Crear orden
- `GET /api/orders/` - Listar órdenes

### Salud
- `GET /health` - Health check
- `GET /` - Root endpoint

## Setup Rápido (Con Docker)

### 1. Clonar y entrar al directorio
```bash
cd IADropshoping
```

### 2. Crear archivos .env
```bash
cp backend/.env.example backend/.env
cp .env.example .env
```

### 3. Editar las variables (opcional)
```bash
# backend/.env
DATABASE_URL=postgresql://autodropship:autodropship@db:5432/autodropship_db
SECRET_KEY=your-secret-key-here
```

### 4. Iniciar con Docker Compose
```bash
docker-compose up --build
```

Esto iniciará:
- PostgreSQL en puerto 5432
- Redis en puerto 6379
- FastAPI Backend en puerto 8000
- React Frontend en puerto 3001

### 5. Acceder a los endpoints
```bash
# Health check
curl http://localhost:8000/health

# API Docs (Swagger UI)
http://localhost:8000/docs

# ReDoc
http://localhost:8000/redoc
```

## Setup Manual (Sin Docker)

### 1. Instalar Python 3.11+
```bash
python --version  # >= 3.11
```

### 2. Crear virtual environment
```bash
cd backend
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
```

### 3. Instalar dependencias
```bash
pip install -r requirements.txt
```

### 4. Instalar PostgreSQL
```bash
# macOS
brew install postgresql

# Ubuntu
sudo apt-get install postgresql postgresql-contrib

# Windows
# Descargar desde https://www.postgresql.org/download/windows/
```

### 5. Crear base de datos
```bash
createdb -U postgres autodropship_db
psql -U postgres -c "CREATE USER autodropship WITH PASSWORD 'autodropship';"
psql -U postgres -c "ALTER ROLE autodropship WITH CREATEDB;"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE autodropship_db TO autodropship;"
```

### 6. Configurar .env
```bash
cp backend/.env.example backend/.env
# Editar backend/.env con tus valores
```

### 7. Instalar Redis (opcional para caching)
```bash
# macOS
brew install redis

# Ubuntu
sudo apt-get install redis-server

# Windows: https://github.com/microsoftarchive/redis/releases
```

### 8. Iniciar el servidor
```bash
cd backend
python -m uvicorn app.main:app --reload --port 8000
```

Servidor disponible en: `http://localhost:8000`

## Testing de Endpoints

### Register
```bash
curl -X POST "http://localhost:8000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "testuser",
    "password": "securepassword",
    "full_name": "Test User"
  }'
```

### Login
```bash
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword"
  }'
```

Response incluirá `access_token` para usar en requests posteriores.

### Get Current User (required token)
```bash
curl -X GET "http://localhost:8000/api/auth/me" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Create Product
```bash
curl -X POST "http://localhost:8000/api/products/" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Wireless Earbuds",
    "description": "Premium noise-cancelling earbuds",
    "price": 79.99,
    "cost": 25.00,
    "source": "aliexpress",
    "trending_score": 8.5
  }'
```

## Swagger UI Documentation

Documentación interactiva disponible en:
```
http://localhost:8000/docs
```

Aquí puedes:
- Ver todos los endpoints
- Probar requests directamente
- Ver esquemas de respuesta

## Próximos Pasos (FASE 2-6)

### Fase 2: Meta Ads Integration
- [ ] Implementar OAuth flow Meta
- [ ] Create campaigns en Meta Ads
- [ ] Fetch analytics
- [ ] Endpoint para connected Meta account

### Fase 3: Product Scraping
- [ ] TikTok trends scraping
- [ ] Amazon product scraping
- [ ] AliExpress product scraping
- [ ] Trend analyzer

### Fase 4: OpenAI Integration
- [ ] Content generation endpoints
- [ ] Title, description, FAQ generation
- [ ] Sales copy generation

### Fase 5: Additional Integrations
- [ ] Shopify API
- [ ] CJ Dropshipping
- [ ] Printful
- [ ] Advanced analytics

### Fase 6: Frontend Integration
- [ ] Connect frontend a real API
- [ ] Real login flow
- [ ] Real product search
- [ ] Real campaign creation

## Troubleshooting

### Problema: "Cannot connect to database"
```bash
# Verificar PostgreSQL está corriendo
psql -U autodropship -d autodropship_db -c "SELECT 1;"

# Si usa Docker
docker-compose logs db
```

### Problema: "Module not found"
```bash
# Asegurar venv está activado
source venv/bin/activate  # Linux/macOS
venv\Scripts\activate     # Windows

# Reinstalar dependencias
pip install -r requirements.txt
```

### Problema: "Port already in use"
```bash
# Cambiar puerto en comando
uvicorn app.main:app --reload --port 8001

# O en docker-compose.yml
ports:
  - "8001:8000"
```

## Seguridad en Producción

- [ ] Cambiar `SECRET_KEY` a valor random seguro
- [ ] Usar variables de entorno para todos los secrets
- [ ] Enable HTTPS
- [ ] Setup rate limiting
- [ ] Add CORS allowlist específico
- [ ] Enable database encryption
- [ ] Setup logging y monitoring
- [ ] Usar autenticación externa (OAuth2)

## Performance Tips

- Usar indexed queries en productos
- Implementar paging en lista endpoints
- Cache ttl en Redis
- Database connection pooling
- Async/await para I/O operations

## Documentación Completa

Ver docs por tipo:
- `../docs/API.md` - Especificación API completa
- `../docs/ARCHITECTURE.md` - Arquitectura del sistema
- `../docs/API_KEYS.md` -Cómo obtener API keys

---

**Versión**: 1.0.0
**Estado**: FASE 1 - Backend Base Completada ✅
