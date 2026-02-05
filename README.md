# Generador de Planes para Parejas

Un generador inteligente de planes personalizados para parejas, completamente client-side y diseñado para GitHub Pages.

## Características

- **Generación inteligente de planes** basada en estados de ánimo, preferencias y contexto
- **100% privado** - Todo el procesamiento sucede en el navegador
- **Diseño mobile-first** con tema oscuro por defecto
- **Sistema de feedback** que mejora las recomendaciones
- **Exportación a calendario** (.ics)
- **Compartir planes** vía URL
- **Sin backend** - Hospedado en GitHub Pages

## Inicio Rápido

1. Clona este repositorio
2. Abre `index.html` en tu navegador
3. ¡Empieza a generar planes!

Para hospedar en GitHub Pages:
1. Ve a Settings > Pages
2. Selecciona la rama `main` como source
3. Tu sitio estará disponible en `https://[usuario].github.io/[repositorio]`

## Estructura del Proyecto

```
planificador/
├── index.html              # Página principal
├── src/
│   ├── js/
│   │   ├── main.js        # Punto de entrada
│   │   ├── planner.js     # Motor de generación
│   │   ├── scoring.js     # Sistema de puntuación
│   │   ├── store.js       # Gestión de almacenamiento
│   │   └── ui/
│   │       ├── ui.js      # Gestión de UI
│   │       └── theme.js   # Sistema de temas
│   └── css/
│       └── styles.css     # Estilos principales
├── data/
│   ├── index.json         # Índice de archivos de actividades
│   ├── activities_core.json
│   ├── activities_outdoors.json
│   └── profiles/
│       ├── lilith.json
│       └── haziel.json
└── docs/
    ├── JSON_SCHEMA.md     # Esquemas de datos
    └── CONTRIBUTING.md    # Guía de contribución
```

## Cómo Funciona

### 1. Entrada del Usuario
El usuario proporciona:
- Estado de ánimo actual (cansado, energético, tranquilo, divertido)
- Duración deseada
- Nivel de sorpresa (qué tan aventurero quieren ser)
- Pesos de preferencias de cada persona
- Filtros opcionales (ubicación, intensidad, costo)

### 2. Procesamiento
El motor de planificación:
1. Filtra actividades según restricciones
2. Calcula puntuaciones basadas en perfiles y contexto
3. Selecciona secuencia óptima usando algoritmo greedy knapsack
4. Inserta transiciones automáticas
5. Ajusta duración total

### 3. Salida
Genera un plan con:
- Timeline de actividades secuenciadas
- Duraciones y horarios estimados
- Assets requeridos (auriculares, pantalla, etc.)
- Pasos detallados para cada actividad
- Explicación del porqué del plan

## Personalización

### Agregar Nuevas Actividades

1. Abre el archivo JSON correspondiente en `/data/`
2. Agrega una nueva entrada siguiendo el esquema:

```json
{
  "id": "act_xxx",
  "title": "Nombre de la actividad",
  "description": "Descripción detallada",
  "tags": ["tag1", "tag2"],
  "min_duration_min": 20,
  "max_duration_min": 60,
  "intensity": 0,
  "cost": 0,
  "participants": 2,
  "required_assets": ["Asset 1", "Asset 2"],
  "suitability": {
    "mood": ["calm", "fun"],
    "time_of_day": ["evening", "night"]
  },
  "steps": ["Paso 1", "Paso 2"]
}
```

### Modificar Perfiles

Edita los archivos en `/data/profiles/` para ajustar:
- Tags inferidos y sus pesos (0.0 - 1.0)
- Gustos y disgustos explícitos
- Perfil de energía por hora del día
- Preferencias de intensidad y ubicación

### Ajustar Heurísticas

Las heurísticas del motor están en `src/js/planner.js`:
- `tagMatchWeight`: Peso de coincidencia de tags
- `intensityMatchWeight`: Peso de coincidencia de intensidad
- `varietyBonus`: Bonus por variedad
- `recencyPenalty`: Penalización por actividades recientes
- `feedbackWeight`: Peso del feedback histórico

## Sistema de Feedback

El sistema aprende de tus elecciones:
- 👍 Thumbs up en actividades → aumenta probabilidad futura
- 👎 Thumbs down → disminuye probabilidad futura
- ✅ Marcar como completado → refuerza preferencia
- ⏭️ Saltar actividad → penaliza levemente

Todo se guarda en localStorage del navegador.

## Temas

- **Tema oscuro** (default): Optimizado para uso nocturno
- **Tema claro**: Disponible con toggle en el header

El tema se guarda en localStorage y persiste entre sesiones.

## Compartir y Exportar

### Compartir Plan
- Genera URL con plan codificado en base64
- No incluye información de perfiles (solo el plan)
- Funciona con Web Share API en móviles

### Exportar a Calendario
- Genera archivo .ics estándar
- Compatible con Google Calendar, Apple Calendar, Outlook
- Incluye todas las actividades con duraciones

## Privacidad

- **Zero tracking**: No se envía información a servidores
- **Local processing**: Todo sucede en tu navegador
- **No cookies**: Solo localStorage para preferencias
- **No analytics**: Completamente privado

## Testing

Para probar localmente:
1. Abre `index.html` en un navegador moderno
2. Usa las DevTools para inspeccionar el localStorage
3. Prueba diferentes combinaciones de parámetros

## Licencia

Este proyecto es de código abierto. Úsalo, modifícalo y mejóralo como quieras.

## ❤️ Creado con amor
