# 🚀 Guía de Instalación - AutoDropship AI

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:
- **Node.js** 16 o superior
- **npm** 7 o superior (incluido con Node.js)
- **Git** (para clonar el repositorio)

## Verificar Instalación

Para verificar que tienes las herramientas correctas instaladas, ejecuta:

```bash
# Verificar Node.js
node --version

# Verificar npm
npm --version

# Verificar Git
git --version
```

## Pasos de Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/autodropship-ai.git
cd autodropship-ai
```

### 2. Instalar Dependencias

```bash
npm install
```

Esto instalará todas las dependencias necesarias listadas en `package.json`:
- React 18
- React DOM
- Vite
- Plugin de React para Vite
- ESLint y plugins

### 3. Iniciar Servidor de Desarrollo

```bash
npm run dev
```

La aplicación se abrirá automáticamente en tu navegador en `http://localhost:3000`

Si no se abre automáticamente, abre tu navegador e ingresa manualmente la URL.

## Comandos Disponibles

### Desarrollo
```bash
npm run dev
```
Inicia el servidor de desarrollo con hot module replacement (HMR).

### Build para Producción
```bash
npm run build
```
Crea una versión optimizada para producción en la carpeta `dist/`.

### Preview del Build
```bash
npm run preview
```
Previsualizando la versión compilada localmente antes de desplegar.

### Linting
```bash
npm run lint
```
Verifica la calidad del código y busca errores potenciales.

## Estructura del Proyecto

```
autodropship-ai/
├── src/                          # Código fuente
│   ├── components/
│   │   └── AutoDropshipAI.jsx    # Componente principal
│   └── index.js                  # Entry point
├── index.html                    # Template HTML
├── vite.config.js                # Configuración Vite
├── package.json                  # Dependencias y scripts
├── .eslintrc.json                # Configuración ESLint
├── .editorconfig                 # Configuración del editor
├── .gitignore                    # Archivos a ignorar en Git
├── README.md                     # Documentación principal
├── SETUP.md                      # Esta guía
└── install.sh                    # Script de instalación

```

## Solución de Problemas

### Error: "npm: command not found"
Node.js no está instalado o no está en el PATH. Descarga e instala desde https://nodejs.org/

### Error: "node_modules not found"
Ejecuta `npm install` nuevamente

### Puerto 3000 ya está en uso
El servidor de desarrollo usará el siguiente puerto disponible automáticamente, o puedes cambiar el puerto en `vite.config.js`

### Build falla
Asegúrate de que todas las dependencias están instaladas: `npm install`

### Problemas con ESLint
Ejecuta: `npm run lint -- --fix` para intentar corregir automáticamente los errores

## Variables de Entorno

Actualmente el proyecto no requiere variables de entorno. Si necesitas agregar:

1. Crea un archivo `.env.local` en la raíz del proyecto
2. Agrega tus variables: `VITE_API_URL=http://localhost:3001`
3. Están disponibles en el código como: `import.meta.env.VITE_API_URL`

## Desplegar en Producción

### GitHub Pages
```bash
# Build
npm run build

# Commit y push
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

### Vercel
1. Conecta tu repositorio a Vercel
2. Vercel automáticamente detectará Vite y configurará el build
3. Los cambios se despliegan automáticamente con cada push

### Netlify
1. Conecta tu repositorio a Netlify
2. Configura el comando de build: `npm run build`
3. Directorio de publicación: `dist`

## Próximos Pasos

1. **Explorar el código**: Abre `src/components/AutoDropshipAI.jsx` para entender la estructura
2. **Personalizar**: Modifica colores, textos y componentes según tus necesidades
3. **Agregar características**: Integra con APIs reales
4. **Desplegar**: Sigue una de las opciones de deployment anterior

## Soporte

Si encuentras problemas durante la instalación, abre un issue en GitHub o revisa la documentación en README.md

---

¡Listo para comenzar! `npm run dev` 🚀
