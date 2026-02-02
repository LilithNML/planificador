# Planes Juntos - Generador de Planes para Parejas

Una página web progresiva diseñada para ayudar a las parejas a decidir qué hacer juntos, eliminando la indecisión y descubriendo nuevas experiencias basadas en sus gustos, energía y estado de ánimo del momento.

## Características Principales

- **Sin backend**: Toda la lógica funciona en el cliente
- **Privacidad total**: Los datos nunca salen del dispositivo
- **Mobile-first**: Diseñada primero para móviles, responsiva en todas las pantallas
- **Almacenamiento local**: Utiliza IndexedDB vía localForage
- **Extensible**: Sistema de listas JSON fácil de ampliar
- **Inteligente**: Motor de recomendación con estrategia 70/20/10

## Inicio Rápido

### Requisitos
- Navegador moderno (Chrome, Firefox, Safari, Edge)
- No requiere instalación de dependencias
- No requiere servidor

### Instalación

1. **Clonar o descargar** este repositorio
2. **Abrir** el archivo `parejas-planes.html` en tu navegador
3. **¡Listo!** La app está funcionando

```bash
# Opción 1: Abrir directamente
open parejas-planes.html

# Opción 2: Servidor local simple (opcional)
python -m http.server 8000
# Abrir http://localhost:8000/parejas-planes.html
```

## Estructura del Proyecto

```
.
├── parejas-planes.html          # Aplicación principal (todo incluido)
├── data/
│   └── lists/                   # Colecciones de actividades
│       ├── peliculas_thriller.json
│       ├── actividades_casa.json
│       ├── actividades_exterior.json
│       └── conversacion_conexion.json
└── README.md
```

## Formato de Datos

### Estructura de Lista JSON

Cada archivo en `/data/lists/` debe seguir este schema:

```json
{
  "collection": "nombre_coleccion",
  "version": "1.0",
  "description": "Descripción de la colección",
  "items": [
    {
      "id": "unique_id_001",
      "title": "Título descriptivo de la actividad",
      "categories": ["casa", "entretenimiento"],
      "subcategories": ["películas", "thriller"],
      "tags": ["atmósfera", "misterio", "noche"],
      "durationMin": 90,
      "energy": 2,
      "emotionalIntensity": 3,
      "cost": 0,
      "notes": "Información adicional útil"
    }
  ]
}
```

### Campos Obligatorios

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | string | Identificador único (ej: `act_001`) |
| `title` | string | Nombre de la actividad |
| `categories` | array | Categorías principales |
| `durationMin` | number | Duración estimada en minutos |
| `energy` | number | Nivel de energía requerido (1-5) |
| `emotionalIntensity` | number | Intensidad emocional (1-5) |
| `cost` | number | Costo estimado en la moneda local |

### Campos Opcionales

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `subcategories` | array | Subcategorías específicas |
| `tags` | array | Etiquetas para matching |
| `notes` | string | Consejos o información extra |
| `steps` | array | Pasos para realizar la actividad |

## Escalas de Valoración

### Energía (1-5)
- **1**: Muy bajo - Acostado, mínimo movimiento
- **2**: Bajo - Sentado, actividad pasiva
- **3**: Medio - Movimiento ligero, participación activa
- **4**: Alto - Actividad física moderada
- **5**: Muy alto - Ejercicio intenso, mucha actividad

### Intensidad Emocional (1-5)
- **1**: Muy ligera - Entretenimiento casual
- **2**: Ligera - Diversión sin compromiso emocional
- **3**: Media - Algo de vulnerabilidad o emoción
- **4**: Alta - Conversaciones profundas, vulnerabilidad
- **5**: Muy alta - Experiencias intensas, muy emocionales

## Motor de Generación de Planes

### Algoritmo de Selección

El motor utiliza un pipeline de filtros y scoring:

1. **Filtro de Duración**: Elimina actividades que excedan el tiempo disponible (+15 min buffer)
2. **Filtro de Energía**: Filtra por nivel de energía actual (+1 nivel de tolerancia)
3. **Filtro de Restricciones**: Elimina actividades marcadas como "No hoy"
4. **Scoring por Afinidad**: 
   - Match de tags con preferencias
   - Boost por mood match
   - Penalización por repetición reciente
5. **Estrategia 70/20/10**:
   - 70% probabilidad: Top recomendación
   - 20% probabilidad: Opción intermedia
   - 10% probabilidad: Exploración

### Contexto Considerado

- Estado de ánimo (1-5)
- Nivel de energía (1-5)
- Tipo de conexión deseada (reír/conectar/desconectar)
- Duración disponible (minutos)
- Presupuesto (opcional)
- Historial reciente (evita repeticiones)

## Añadir Nuevas Listas

### Paso 1: Crear Archivo JSON

Crea un nuevo archivo en `/data/lists/` con formato:

```json
{
  "collection": "tu_coleccion",
  "version": "1.0",
  "description": "Descripción",
  "items": [
    // tus items aquí
  ]
}
```

### Paso 2: Convenciones de Naming

- Usa `snake_case` para nombres de archivo
- Usa nombres descriptivos (ej: `comedia_standups.json`)
- Mantén consistencia con el idioma

### Paso 3: Validación

Valida tu JSON antes de agregarlo:

```bash
# Usando jq (si está instalado)
jq . tu_coleccion.json

# O en línea: https://jsonlint.com/
```

### Ejemplos de Nuevas Colecciones

Ideas para expandir:

- `series_comedias.json` - Series de comedia recomendadas
- `podcasts_parejas.json` - Podcasts para escuchar juntos
- `recetas_rapidas.json` - Recetas fáciles de cocinar
- `ejercicios_parejas.json` - Rutinas de ejercicio en pareja
- `juegos_mesa.json` - Juegos de mesa específicos
- `lugares_cdmx.json` - Lugares específicos de tu ciudad

## Almacenamiento Local

### Datos Guardados

La app guarda localmente:

- **Perfiles**: Nombres de las personas
- **Historial**: Actividades realizadas y valoraciones
- **Preferencias**: Configuraciones personalizadas (futuro)

### Tecnología

- **localForage**: Abstracción sobre IndexedDB
- **Capacidad**: ~50MB típico (depende del navegador)
- **Persistencia**: Los datos persisten entre sesiones

### Borrar Datos

Para resetear completamente la app:

```javascript
// Abrir consola del navegador (F12)
localforage.clear().then(() => {
  console.log('Datos borrados');
  location.reload();
});
```

## Personalización de UI

### Variables CSS

Las principales variables de color están en `:root`:

```css
:root {
  --warm-cream: #FFF8F0;
  --soft-terracotta: #E89B7B;
  --deep-terracotta: #D47456;
  --warm-brown: #8B5A3C;
  --deep-purple: #4A3B5C;
  --soft-lavender: #B8A8C8;
  /* ... */
}
```

### Modificar Paleta

1. Edita las variables CSS en `<style>`
2. Los cambios se aplican automáticamente
3. Mantén buen contraste (WCAG AA)

## Funcionalidades Futuras (Roadmap)

### v1.1 (Próxima)
- [ ] Preferencias avanzadas por usuario
- [ ] Exportar/importar listas personalizadas
- [ ] Rating mejorado con comentarios
- [ ] Filtros adicionales (interior/exterior, costo max)

### v1.2
- [ ] Modo oscuro
- [ ] PWA completa (instalable)
- [ ] Notificaciones de recordatorio
- [ ] Estadísticas de actividades

### v2.0
- [ ] Sistema de logros/badges
- [ ] Integración con calendarios
- [ ] Sugerencias por temporada/clima
- [ ] Modo multi-pareja (grupos)

### Debugging

```javascript
// Ver estado actual
localforage.getItem('profiles').then(console.log);
localforage.getItem('history').then(console.log);

// Ver actividades cargadas
console.log(SAMPLE_ACTIVITIES);
```

## Compatibilidad

### Navegadores Soportados

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Dispositivos

- iPhone (iOS 14+)
- Android (Chrome 90+)
- iPad / Tablets
- Desktop (todos los sistemas)

## Privacidad y Seguridad

### Compromiso de Privacidad

- **Cero tracking**: No hay analytics
- **Sin servidor**: Los datos nunca salen del dispositivo
- **Sin cookies**: No usamos cookies de terceros
- **Local-first**: Todo funciona offline después de la primera carga

### Validación de Inputs

El código incluye validación básica:

- Sanitización de texto en inputs
- Validación de JSON al cargar listas
- Límites en longitud de campos

### Tecnologías

- React 18 (CDN)
- localForage (almacenamiento)
- Fraunces & DM Sans (tipografía de Google Fonts)
