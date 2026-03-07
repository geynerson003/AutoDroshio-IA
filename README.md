# 🤖 AutoDropship AI

> **Plataforma SaaS Full Stack para Automatización Inteligente de Dropshipping con IA**

[![Python](https://img.shields.io/badge/Python-3.11+-blue?logo=python)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green?logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18+-blue?logo=react)](https://react.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-336791?logo=postgresql)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](./LICENSE)

AutoDropship AI es una plataforma completa que automatiza casi todo el proceso de dropshipping utilizando inteligencia artificial. Permite a los usuarios investigar productos ganadores, generar contenido optimizado, crear anuncios automáticamente y gestionar su tienda de manera inteligente.

## ✨ Características Principales

### 1. 🔍 **Product Research AI**
- Análisis automático de productos trending en TikTok, Amazon y AliExpress
- Evaluación de métricas: volumen de búsqueda, engagement, ventas, margen de ganancia
- Identificación de nichos rentables

### 2. ✍️ **AI Product Page Generator**
- Generación automática de títulos optimizados
- Descripciones persuasivas con beneficios del producto
- FAQ automático
- Copy de ventas con IA
- Mejora de imágenes con IA
- Generación de videos promocionales cortos

### 3. 🏪 **Store Automation**
- Integración con Shopify mediante API
- Creación automática de páginas de producto
- Sincronización de inventario y precios
- Control automático de variantes

### 4. 📢 **AI Ads Generator**
- Creación de copies publicitarios
- Generación de variaciones de anuncios
- Generación de creativos (imagen/video) con IA
- Diferentes audiencias objetivo

### 5. 💰 **Ads Automation**
- Integración con Meta Ads API
- Creación automática de campañas
- Gestión de presupuestos inteligente
- Lanzamiento automático de anuncios

### 6. 📦 **Auto Fulfillment**
- Integración con CJ Dropshipping
- Integración con AliExpress
- Creación automática de órdenes
- Tracking de envíos en tiempo real

### 7. 🎯 **AI Optimization Engine**
- Análisis de rendimiento de anuncios
- Detección de anuncios ganadores
- Escalado automático de presupuesto
- Pausa automática de anuncios de bajo rendimiento

### 8. 📊 **Dashboard completo**
- Métricas en tiempo real
- Análisis de conversiones
- ROI tracking
- Reportes detallados

## 🚀 Quick Start

### Requisitos Previos
- Docker y Docker Compose
- Node.js 18+
- Python 3.11+
- Git

### Instalación con Docker (Recomendado)

```bash
# 1. Clonar el repositorio
git clone https://github.com/geynerson003/AutoDropship-IA.git
cd AutoDropship-IA

# 2. Copiar variables de entorno
cp .env.example .env
cp backend/.env.example backend/.env

# 3. Iniciar con Docker Compose
docker-compose up --build

# 4. Esperar a que se inicialicen todos los servicios
# PostgreSQL: puerto 5432
# Redis: puerto 6379
# Backend API: puerto 8000
# Frontend: puerto 3001
```

Accede a:
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Setup Manual (Sin Docker)

#### Backend

```bash
cd backend

# Crear virtual environment
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Crear .env
cp .env.example .env

# Ejecutar
uvicorn app.main:app --reload --port 8000
```

#### Frontend

```bash
# Instalar dependencias
npm install

# Ejecutar
npm run dev
```

## 🏗️ Arquitectura

### Stack Tecnológico

**Frontend:**
- React 18 con Vite
- Axios para llamadas API
- CSS-in-JS

**Backend:**
- Python 3.11+
- FastAPI 0.104+
- SQLAlchemy ORM
- JWT Authentication
- Bcrypt para password hashing

**Base de Datos:**
- PostgreSQL 15
- Redis 7 (Cache)

**Infraestructura:**
- Docker & Docker Compose
- CI/CD ready

### Estructura de Directorios

```
AutoDropship-IA/
├── frontend/                    # React SPA
│   ├── src/
│   │   ├── components/          # Componentes UI
│   │   ├── pages/               # Páginas
│   │   ├── services/            # API Client
│   │   └── index.jsx
│   ├── Dockerfile
│   └── vite.config.js
│
├── backend/                     # FastAPI API
│   ├── app/
│   │   ├── api/
│   │   │   ├── endpoints/       # Rutas
│   │   │   └── dependencies.py
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── database.py
│   │   │   └── security.py
│   │   ├── models/
│   │   │   └── database.py
│   │   ├── services/            # Servicios de negocio
│   │   └── main.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
│
├── docker-compose.yml
├── README.md
├── SETUP.md
└── docs/
    ├── BACKEND.md
    ├── ARCHITECTURE.md
    └── API_KEYS.md
```

## 📚 Documentación

- **[SETUP.md](./SETUP.md)** - Guía de instalación detallada
- **[docs/BACKEND.md](./docs/BACKEND.md)** - Documentación del backend
- **[CHANGELOG.md](./CHANGELOG.md)** - Historial de cambios
- **[CHECKLIST.md](./CHECKLIST.md)** - Checklist de verificación

## 🔌 Endpoints API (FASE 1)

### Autenticación
```
POST   /api/auth/register         Registrar usuario
POST   /api/auth/login            Login con JWT token
GET    /api/auth/me               Obtener usuario actual
```

### Productos
```
POST   /api/products/             Crear producto
GET    /api/products/             Listar productos
GET    /api/products/{id}         Obtener producto
```

### Campañas
```
POST   /api/campaigns/            Crear campaña
GET    /api/campaigns/            Listar campañas
```

### Órdenes
```
POST   /api/orders/               Crear orden
GET    /api/orders/               Listar órdenes
```

**Documentación interactiva**: http://localhost:8000/docs

## 🗄️ Modelos de Base de Datos

### User
- Multi-usuario SaaS
- Email, username, hashed_password

### Team
- Multi-tenant support
- Owner, plan (free/pro/enterprise)

### Product
- Naming: name, description, price, cost
- Trending: source, trending_score
- Status: active, paused, archived

### Campaign
- Meta Ads integration
- Budget, spent, revenue, ROAS

### Order
- Fulfillment tracking
- supplier_order_id, tracking_number
- Status tracking

### Integration
- API credentials (encrypted)
- Multi-service support

### CampaignAnalytics
- Daily metrics
- impressions, clicks, conversions

## 🔐 Seguridad

- ✅ JWT Authentication con tokens seguros
- ✅ Bcrypt password hashing
- ✅ CORS configurado
- ✅ Environment variables para secrets
- ✅ Multi-tenant architecture
- ✅ Input validation con Pydantic

**Requisitos para Producción:**
- [ ] Cambiar `SECRET_KEY` a valor random
- [ ] Setup HTTPS
- [ ] Rate limiting
- [ ] Database encryption
- [ ] Logging y monitoring

## 📋 Roadmap

### ✅ FASE 1: Backend Base (COMPLETADA)
- Backend FastAPI
- PostgreSQL setup
- JWT Authentication
- CRUD endpoints básicos
- Docker setup

### 🚀 FASE 2: Meta Ads Integration (EN PROGRESO)
- OAuth flow para Meta
- Crear campañas automáticamente
- Analytics desde Meta

### 📱 FASE 3: Product Scraping (PRÓXIMA)
- TikTok trends scraping
- Amazon/AliExpress scraping
- Trend analyzer

### 🤖 FASE 4: OpenAI Integration
- Content generation
- Title, description, FAQ generation
- Sales copy generation

### 🛍️ FASE 5: Shopify Integration
- OAuth flow
- Product creation
- Inventory sync

### 📊 FASE 6: Frontend Integration
- Connect to real API
- Real authentication flow
- Real product search
- Real campaign management

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest

# Coverage
pytest --cov=app

# Frontend tests
npm test
```

## 🐛 Troubleshooting

### PostgreSQL connection error
```bash
# Verificar que PostgreSQL está corriendo
docker-compose logs db

# Reiniciar servicio
docker-compose restart db
```

### Port already in use
```bash
# Cambiar puerto en docker-compose.yml
ports:
  - "8001:8000"  # Cambiar de 8000 a 8001
```

### Module not found en backend
```bash
cd backend
pip install -r requirements.txt
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver [LICENSE](./LICENSE) para más detalles.

## 📧 Contacto

- **GitHub**: [@geynerson003](https://github.com/geynerson003)
- **Repositorio**: https://github.com/geynerson003/AutoDropship-IA

## 🙏 Agradecimientos

- FastAPI por el excelente framework
- React team por una librería increíble
- PostgreSQL por ser una base de datos sólida
- La comunidad open source

---

<div align="center">

**[Inicio](#autodropship-ai)** • **[Documentación](./docs/)** • **[Issues](https://github.com/geynerson003/AutoDropship-IA/issues)** • **[Discussions](https://github.com/geynerson003/AutoDropship-IA/discussions)**

Hecho con ❤️ para la comunidad de ecommerce

</div>
