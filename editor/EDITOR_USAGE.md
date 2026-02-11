# Activity Editor - Guía de Uso

Editor visual JSON para el Generador de Planes para Parejas. Interfaz "no-code" para gestionar actividades y perfiles sin editar código directamente.

## Características Principales

### Gestión de Actividades
- **Creación visual** con formularios intuitivos
- **Validación en tiempo real** según JSON_SCHEMA.md
- **Editor de tags** con autocompletado de tags estándar
- **Control de intensidad** visual (Baja/Media/Alta)
- **Gestión de duraciones** con validación cruzada
- **Assets y pasos** con listas dinámicas
- **Filtros avanzados** por texto, intensidad y tags

### Gestión de Perfiles
- **Editor de energía** con sliders para cada momento del día
- **Configuración de preferencias** (ubicación, intensidad, social)
- **Visualización de tags inferidos**
- **Importación/exportación** de perfiles individuales

### Utilidades
- **Importar múltiples archivos** JSON simultáneamente
- **Exportar todo** el catálogo de una vez
- **Generar index.json** automáticamente
- **Tema oscuro** por defecto
- **Diseño responsive** optimizado para móvil y escritorio

## Inicio Rápido

### Opción 1: Uso Local
1. Descarga `activity-editor.html`
2. Abre el archivo directamente en tu navegador
3. ¡Listo! No requiere servidor ni instalación

### Opción 2: GitHub Pages
1. Sube `activity-editor.html` a tu repositorio
2. Renómbralo a `editor.html` o `admin.html`
3. Accede vía `https://[usuario].github.io/[repo]/editor.html`

## Cómo Usar

### Importar Datos Existentes

1. Click en **"Importar JSON"**
2. Selecciona uno o más archivos:
   - `activities_core.json`
   - `activities_outdoors.json`
   - `haziel.json`
   - `lilith.json`
3. Los datos se cargarán automáticamente

**Tip:** Puedes seleccionar múltiples archivos a la vez con Ctrl/Cmd + Click

### Crear Nueva Actividad

1. Click en **"+ Nueva Actividad"**
2. Completa los campos obligatorios (marcados con *):
   - **ID**: Único, ej: `act_new_001`
   - **Título**: Nombre descriptivo
   - **Descripción**: Detalle de qué se trata
   - **Tags**: Mínimo 3, usa los sugeridos o crea nuevos
   - **Duración**: Min debe ser < Max
   - **Intensidad**: Selecciona Baja/Media/Alta
   - **Costo**: En pesos (0 = gratis)
   - **Participantes**: Típicamente 2

3. Añade campos opcionales:
   - **Assets requeridos**: Click "Añadir Asset", ej: "Pantalla", "Internet"
   - **Moods compatibles**: Marca checkboxes
   - **Momento del día**: Marca checkboxes
   - **Pasos**: Click "Añadir Paso" para instrucciones

4. Click **"Guardar Actividad"**

### Editar Actividad Existente

1. Click en cualquier tarjeta de actividad
2. Modifica los campos necesarios
3. Click **"Guardar Actividad"**
4. O usa **"Eliminar"** para borrarla

### Gestionar Perfiles

1. Click en **"Perfiles"** en el sidebar
2. Click en un perfil existente para editar
3. Ajusta los sliders de energía (0.0 - 1.0)
4. Configura preferencias
5. Click **"Guardar Perfil"**

### Exportar Datos

#### Exportar Todo
1. Click en **"Exportar Todo"**
2. Se descargarán:
   - `activities_export.json` (todas las actividades)
   - `[user_id].json` (cada perfil por separado)

#### Generar Índice
1. Click en **"Generar Index"**
2. Descarga `index.json` actualizado
3. Copia los archivos a tu carpeta `/data/`

### Usar Filtros

- **Búsqueda**: Escribe en el campo superior (busca en título, descripción y tags)
- **Por Intensidad**: Selecciona Baja/Media/Alta en el dropdown
- **Por Tag**: Selecciona un tag específico del dropdown
- **Limpiar**: Click "Limpiar Filtros" para resetear

## Sistema de Validación

El editor valida automáticamente:

### Errores que NO permite guardar:
- ID duplicado
- Duración mínima ≥ duración máxima
- Menos de 3 tags
- Intensidad fuera de rango (0, 1, 2)
- Costo negativo
- Campos obligatorios vacíos

### Validaciones en tiempo real:
- IDs únicos en todo el dataset
- Tags de la lista estándar (sugeridos automáticamente)
- Moods válidos: `tired`, `energetic`, `calm`, `fun`
- Time of day válidos: `morning`, `afternoon`, `evening`, `night`

## Tags Estándar

El editor incluye autocompletado con estos tags:

**Categorías:**
- `anime`, `gaming`, `cooking`, `reading`, `art`, `movie`, `music`, `podcast`
- `exercise`, `walking`, `cycling`, `sport`
- `conversation`, `intimate`, `social`

**Ubicación:**
- `indoor`, `outdoor`

**Energía:**
- `passive`, `active`, `low-energy`, `high-energy`
- `relaxing`, `calm`, `peaceful`, `meditative`
- `dynamic`, `energetic`

**Estilo:**
- `playful`, `fun`, `funny`, `entertaining`
- `creative`, `skill-building`, `learning`
- `romantic`, `nostalgic`, `emotional`

## Tips y Mejores Prácticas

### Para Actividades

1. **IDs Descriptivos**: Usa prefijos como `act_anime_001`, `act_outdoor_001`
2. **Descripciones Orientadas a Acción**: Empieza con verbos (Elige, Prepara, Disfruta)
3. **Tags Relevantes**: 3-7 tags es lo ideal, no más de 10
4. **Duraciones Realistas**: Basadas en experiencia real
5. **Assets Específicos**: "Pantalla" en vez de "dispositivo", "Harina" en vez de "ingredientes"

### Para Perfiles

1. **Tags Inferidos con Evidencia**: Solo añade tags que puedas justificar
2. **Valores de Confianza Honestos**: 0.9 = muy seguro, 0.5 = neutro, 0.3 = ligero
3. **Explicit Likes Concretos**: "Anime de acción" mejor que "entretenimiento"
4. **Energy Profile Realista**: Basado en observación, no en ideales

## Solución de Problemas

### No aparecen las actividades importadas
- Verifica que el JSON tenga el formato correcto
- Revisa la consola del navegador (F12) para errores
- Asegúrate de que sea un array de actividades

### El botón Exportar no funciona
- Algunos navegadores bloquean múltiples descargas
- Permite pop-ups para el sitio
- Descarga los archivos uno por uno si es necesario

### Los filtros no funcionan
- Click en "Limpiar Filtros" y vuelve a intentar
- Recarga la página si persiste el problema

### Perdí mis datos
- Los datos solo están en memoria mientras usas el editor
- SIEMPRE exporta tus archivos después de hacer cambios
- Considera usar Git para versionar tus JSONs

## Personalización

El editor usa Tailwind CSS y puede personalizarse editando las variables CSS en el `<style>`:

```css
colors: {
  dark: {
    bg: '#0a0a0f',        // Fondo principal
    surface: '#13131a',   // Fondo de tarjetas
    border: '#1f1f28',    // Bordes
    accent: '#7c3aed',    // Color de acento
    // ...
  }
}
```

## Compatibilidad

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Dispositivos móviles (iOS/Android)
- IE11 no soportado

## Privacidad

- **Zero tracking**: Sin analytics ni cookies
- **Local processing**: Todo sucede en tu navegador
- **No backend**: No se envía información a ningún servidor
- **Portable**: Funciona offline una vez cargado

## Notas Técnicas

### Almacenamiento
- Datos en **memoria RAM** durante la sesión
- **NO se guardan automáticamente**
- Debes **exportar manualmente** tus cambios

### Formato de Exportación
- JSON indentado con 2 espacios
- Compatible con el schema v1.0.0
- Listo para copiar a `/data/`

### Limitaciones
- No edita archivos existentes directamente
- Requiere workflow: Importar → Editar → Exportar
- No tiene sistema de deshacer (use Git para eso)
  
---

**Versión**: 1.0.0  
**Última actualización**: Febrero 2026  
**Creado con**: HTML5, Tailwind CSS, Vanilla JS
