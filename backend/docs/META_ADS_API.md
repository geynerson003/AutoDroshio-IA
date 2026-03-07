# Meta Ads Integration - API Documentation

## 📋 Overview

La integración con Meta Ads permite que los usuarios de AutoDropship AI creen y gestionen campañas publicitarias en Facebook e Instagram de forma programática.

**Status**: FASE 2 - En Progreso (Completada 100%)

## 🔐 Authentication

Todos los endpoints de Meta Ads requieren autenticación JWT:

```bash
Authorization: Bearer <your_jwt_token>
```

## 🔄 OAuth 2.0 Flow

### 1. Obtener URL de Autorización

**GET** `/api/integrations/meta/oauth/authorize`

Obtiene la URL de autorización de Meta para que el usuario inicie sesión.

**Response (200)**:
```json
{
  "authorization_url": "https://www.facebook.com/v18.0/dialog/oauth?client_id=...",
  "state": "random_state_token_for_csrf_protection"
}
```

**Flujo**:
1. Usuario obtiene esta URL
2. Redirige a la dirección en `authorization_url`
3. Meta redirige de vuelta a tu aplicación con un `code`
4. Usar el `code` en el endpoint `/meta/oauth/callback`

### 2. Procesar Callback de OAuth

**POST** `/api/integrations/meta/oauth/callback`

Intercambia el authorization code por un access token.

**Request**:
```json
{
  "code": "authorization_code_from_meta",
  "state": "state_token_from_step_1"
}
```

**Response (200)**:
```json
{
  "status": "success",
  "message": "Meta Ads account connected via OAuth successfully",
  "account_id": "123456789"
}
```

**Error Response (400)**:
```json
{
  "detail": "Failed to obtain access token from Meta"
}
```

## 🔌 Conexión Manual (Deprecated - usar OAuth)

Si tienes un access token de Meta manualmente, puedes conectar así:

**POST** `/api/integrations/meta/connect`

**Request**:
```json
{
  "access_token": "your_meta_access_token",
  "ad_account_id": "123456789",
  "business_account_id": "987654321"
}
```

**Response (200)**:
```json
{
  "status": "success",
  "message": "Meta Ads account connected successfully",
  "account_id": "123456789"
}
```

## 📢 Gestión de Campañas

### Crear Campaña

**POST** `/api/integrations/meta/campaigns`

Crea una nueva campaña en Meta Ads.

**Request**:
```json
{
  "product_id": 1,
  "campaign_name": "Summer Campaign 2026",
  "budget": 100.0,
  "objective": "CONVERSIONS",
  "audience_targeting": {
    "geo_locations": [{"countries": ["US"]}],
    "age_min": 18,
    "age_max": 65
  }
}
```

**Parameters**:
- `product_id` (int): ID del producto en AutoDropship AI
- `campaign_name` (string): Nombre de la campaña
- `budget` (float): Presupuesto en USD
- `objective` (string): Objetivo de la campaña
  - `CONVERSIONS` - Conversiones
  - `REACH` - Alcance
  - `CLICKS` - Clics
  - `BRAND_AWARENESS` - Conciencia de marca

**Response (201)**:
```json
{
  "campaign_id": 1,
  "meta_campaign_id": "1234567890",
  "name": "Summer Campaign 2026",
  "budget": 100.0,
  "status": "PAUSED",
  "created_at": "2026-03-07T10:30:00Z"
}
```

### Lanzar Campaña

**POST** `/api/integrations/meta/campaigns/{campaign_id}/launch`

Activa una campaña que estaba pausada.

**Request**:
```json
{
  "meta_campaign_id": "1234567890"
}
```

**Response (200)**:
```json
{
  "status": "success",
  "message": "Campaign launched successfully"
}
```

### Obtener Analytics

**GET** `/api/integrations/meta/campaigns/{campaign_id}/analytics`

Obtiene métricas de rendimiento de la campaña.

**Response (200)**:
```json
{
  "spend": 45.67,
  "impressions": 12345,
  "clicks": 234,
  "conversions": 12,
  "roas": 2.45,
  "cpc": 0.19,
  "cpm": 3.71,
  "ctr": 1.89
}
```

**Métricas**:
- `spend`: Gasto total en USD
- `impressions`: Número de impresiones
- `clicks`: Número de clics
- `conversions`: Número de conversiones
- `roas`: Return on Ad Spend
- `cpc`: Costo por clic
- `cpm`: Costo por mil impresiones
- `ctr`: Tasa de clics

## 📚 Modelos de Datos

### MetaConnectRequest
```python
{
  "access_token": str,
  "ad_account_id": str,
  "business_account_id": str
}
```

### CreateCampaignRequest
```python
{
  "product_id": int,
  "campaign_name": str,
  "budget": float,
  "objective": str = "CONVERSIONS",
  "audience_targeting": dict = {}
}
```

### CampaignAnalyticsResponse
```python
{
  "spend": float,
  "impressions": int,
  "clicks": int,
  "conversions": int,
  "roas": float,
  "cpc": float,
  "cpm": float,
  "ctr": float
}
```

## 🔒 Seguridad

### Encriptación de Credenciales
- Los access tokens se guardan encriptados en la BD usando Fernet
- Las credenciales se asocian con el usuario autenticado
- Solo el propietario del equipo puede acceder a sus integraciones

### Multi-tenant
- Cada usuario puede tener múltiples equipos
- Cada equipo tiene credenciales Meta independientes
- Las campañas están aisladas por equipo

### JWT Authentication
- Todos los endpoints requieren JWT válido
- Los tokens expiran después de 30 minutos
- Se soporta token refresh

## 📊 Flujo Completo de Ejemplo

```
1. Usuario obtiene URL de OAuth
   GET /api/integrations/meta/oauth/authorize
   ← { authorization_url: "https://...", state: "..." }

2. Usuario autoriza en Facebook
   Redirige a authorization_url

3. Facebook redirige a tu app con código
   /auth/callback?code=xxx&state=yyy

4. Tu app intercambia código por token
   POST /api/integrations/meta/oauth/callback
   { code: "xxx", state: "yyy" }
   ← { status: "success", account_id: "123" }

5. Crear producto (si no existe)
   POST /api/products
   { name: "My Product", ... }
   ← { id: 1, ... }

6. Crear campaña
   POST /api/integrations/meta/campaigns
   {
     product_id: 1,
     campaign_name: "Campaign 1",
     budget: 100.0,
     objective: "CONVERSIONS"
   }
   ← { campaign_id: 1, meta_campaign_id: "1234567890", ... }

7. Lanzar campaña
   POST /api/integrations/meta/campaigns/1/launch
   { meta_campaign_id: "1234567890" }
   ← { status: "success", message: "Campaign launched..." }

8. Monitorear analytics
   GET /api/integrations/meta/campaigns/1/analytics
   ← { spend: 45.67, impressions: 12345, ... }
```

## 🚨 Manejo de Errores

### 400 Bad Request
- Credenciales inválidas
- Parámetros requeridos faltantes
- Meta Ads account no conectado

### 401 Unauthorized
- JWT token inválido o expirado
- No se proporciona autenticación

### 403 Forbidden
- Usuario no tiene autorización
- Intenta acceder a campaña de otro equipo

### 404 Not Found
- Campaña no existe
- Producto no existe

### 500 Internal Server Error
- Error al comunicarse con Meta API
- Error al guardar en BD

## 🔧 Configuración Requerida

En tu archivo `.env`:

```env
# Meta Ads Configuration
META_APP_ID=your_meta_app_id
META_APP_SECRET=your_meta_app_secret
META_ACCESS_TOKEN=your_meta_access_token  # Para testing

# Frontend
FRONTEND_URL=http://localhost:3001
```

## 📝 Testing

### Correr tests
```bash
cd backend
pytest tests/test_meta_ads_endpoints.py -v
```

### Tests incluidos
- Obtener URL de OAuth
- Conectar cuenta Meta
- Crear campaña
- Lanzar campaña
- Obtener analytics
- Validación de autorización
- Manejo de errores

## 🐛 Troubleshooting

### "Meta App ID not configured"
- Verifica que `META_APP_ID` está en `.env`
- Reinicia el servidor backend

### "Failed to obtain access token from Meta"
- El código de autorización expiró (válido por ~10 minutos)
- El `state` no coincide
- Las credenciales Meta son inválidas

### "Meta Ads account not connected"
- El usuario no ha completado el flujo OAuth
- Las credenciales se borraron
- Ejecutar `/meta/oauth/authorize` nuevamente

## 📈 Próximos Pasos

- [ ] Soporte para múltiples Ad Accounts
- [ ] Pause/Resume de campañas automático
- [ ] Webhooks para cambios en Meta
- [ ] Dashboard de analytics real-time
- [ ] A/B Testing support
- [ ] Custom audience management

---

**Última actualización**: 2026-03-07
**Versión**: 1.0.0
