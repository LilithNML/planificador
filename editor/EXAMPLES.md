# Ejemplos Prácticos - Activity Editor

Casos de uso comunes con screenshots paso a paso (conceptuales).

## Ejemplo 1: Importar y Editar Actividad Existente

### Escenario
Tienes `activities_core.json` con 12 actividades y quieres editar "Ver un episodio de anime".

### Pasos

**1. Importar archivo**
```
[Sidebar] → Importar JSON → Seleccionar activities_core.json
```
**Resultado**: Toast verde "Importadas 12 actividades de activities_core.json"

**2. Buscar actividad**
```
[Filtros] → Búsqueda: "anime"
```
**Resultado**: Se muestra solo 1 tarjeta con la actividad de anime

**3. Editar**
```
[Click en tarjeta] → Modal se abre
Cambiar: max_duration_min de 45 a 60
Añadir tag: "japanese"
Añadir paso: "Comentar qué les pareció"
[Guardar Actividad]
```

**4. Exportar**
```
[Sidebar] → Exportar Todo
```
**Resultado**: Descarga `activities_export.json` con los cambios

## Ejemplo 2: Crear Actividad desde Cero

### Escenario
Quieres añadir "Maratón de películas de Studio Ghibli"

### Datos de la Actividad
```json
{
  "id": "act_ghibli_001",
  "title": "Maratón de películas de Studio Ghibli",
  "description": "Elige 2-3 películas del estudio favorito y disfrútenlas en orden",
  "tags": ["anime", "movie", "indoor", "passive", "relaxing", "japanese"],
  "min_duration_min": 180,
  "max_duration_min": 360,
  "intensity": 0,
  "cost": 0,
  "participants": 2,
  "required_assets": ["Pantalla grande", "Internet", "Snacks", "Mantas"],
  "suitability": {
    "mood": ["tired", "calm"],
    "time_of_day": ["afternoon", "evening", "night"]
  },
  "steps": [
    "Elijan 2-3 películas (ej: Totoro, Mononoke, Chihiro)",
    "Preparen un espacio cómodo",
    "Preparen snacks y bebidas",
    "Vean sin interrupciones",
    "Comenten sus favoritas"
  ]
}
```

### Pasos en el Editor

**1. Abrir modal**
```
[+ Nueva Actividad]
```

**2. Campos básicos**
```
ID: act_ghibli_001
Título: Maratón de películas de Studio Ghibli
Descripción: [copiar de arriba]
Participantes: 2
```

**3. Tags**
```
[Tag Input] → "anime" [Enter]
[Tag Input] → "movie" [Enter]
[Tag Input] → "indoor" [Enter]
[Tag Input] → "passive" [Enter]
[Tag Input] → "relaxing" [Enter]
[Tag Input] → "japanese" [Enter]
```
**Tip**: También puedes hacer click en los tags sugeridos abajo del input

**4. Duración e Intensidad**
```
Duración Min: 180
Duración Max: 360
Costo: 0
Intensidad: [Click en Baja]
```

**5. Assets**
```
[+ Añadir Asset] → "Pantalla grande"
[+ Añadir Asset] → "Internet"
[+ Añadir Asset] → "Snacks"
[+ Añadir Asset] → "Mantas"
```

**6. Suitability**
```
Moods: ✓ Cansado, ✓ Tranquilo
Momento del Día: ✓ Tarde, ✓ Atardecer, ✓ Noche
```

**7. Pasos**
```
[+ Añadir Paso] → "Elijan 2-3 películas (ej: Totoro, Mononoke, Chihiro)"
[+ Añadir Paso] → "Preparen un espacio cómodo"
[+ Añadir Paso] → "Preparen snacks y bebidas"
[+ Añadir Paso] → "Vean sin interrupciones"
[+ Añadir Paso] → "Comenten sus favoritas"
```

**8. Guardar**
```
[Guardar Actividad]
```
**Resultado**: Toast verde "Actividad creada", nueva tarjeta aparece en el grid

## Ejemplo 3: Gestionar Múltiples Archivos

### Escenario
Tienes separadas las actividades en categorías y quieres consolidarlas.

### Archivos
- `activities_core.json` (12 actividades indoor)
- `activities_outdoor.json` (8 actividades outdoor)
- `activities_creative.json` (5 actividades creativas)

### Pasos

**1. Importar todos**
```
[Importar JSON] → Ctrl+Click en los 3 archivos → Abrir
```
**Resultado**: 
```
✓ Importadas 12 actividades de activities_core.json
✓ Importadas 8 actividades de activities_outdoor.json
✓ Importadas 5 actividades de activities_creative.json
```

**2. Verificar**
```
[Sidebar] → Estadísticas: 25 Actividades
```

**3. Filtrar por categoría**
```
[Filtro Tag] → outdoor
```
**Resultado**: Se muestran 8 tarjetas

**4. Editar una outdoor**
```
[Click en "Caminar al parque"] → Cambiar cost de 0 a 20 → Guardar
```

**5. Exportar consolidado**
```
[Exportar Todo]
```
**Resultado**: `activities_export.json` con las 25 actividades (incluyendo edición)

**6. Generar índice**
```
[Generar Index]
```
**Resultado**: `index.json` descargado

## Ejemplo 4: Crear Perfil de Usuario

### Escenario
Quieres crear un perfil para un tercer usuario "Mario"

### Datos del Perfil
```json
{
  "user_id": "mario",
  "display_name": "Mario",
  "inferred_tags": {
    "gaming": 0.9,
    "sport": 0.8,
    "outdoor": 0.7,
    "active": 0.8
  },
  "explicit_likes": [
    "Videojuegos competitivos",
    "Fútbol",
    "Correr",
    "Comida italiana"
  ],
  "explicit_dislikes": [
    "Películas de terror",
    "Actividades sedentarias prolongadas"
  ],
  "energy_profile": {
    "morning": 0.9,
    "afternoon": 1.0,
    "evening": 0.7,
    "night": 0.5
  },
  "preferences": {
    "preferred_intensity": [1, 2],
    "preferred_location": "outdoor",
    "social_preference": "social"
  }
}
```

### Pasos

**1. Cambiar a vista de Perfiles**
```
[Sidebar] → Perfiles
```

**2. Crear perfil**
```
[+ Nuevo Perfil]
```

**3. Información básica**
```
User ID: mario
Nombre: Mario
```

**4. Perfil de Energía (usar sliders)**
```
Mañana: 0.9    [=========|--]
Tarde: 1.0     [===========]
Atardecer: 0.7 [=======|----]
Noche: 0.5     [=====|------]
```

**5. Preferencias**
```
Ubicación Preferida: Exterior
Preferencia Social: Social
Intensidad: [Ctrl+Click] Media + Alta
```

**6. Guardar**
```
[Guardar Perfil]
```

**7. Exportar**
```
[Sidebar] → Exportar Todo
```
**Resultado**: Se descarga `mario.json`

**Nota**: Los `inferred_tags` y listas de likes/dislikes se deben editar manualmente en el JSON exportado (o implementar interfaz para ello en versión futura).

## Ejemplo 5: Validación de Errores

### Escenario
Intentas guardar una actividad con errores

### Actividad Problemática
```
ID: act_001 (ya existe)
Título: Test
Descripción: Test
Tags: ["solo", "uno"] (menos de 3)
Duración Min: 60
Duración Max: 30 (menor que min!)
Intensidad: 5 (fuera de rango)
Costo: -10 (negativo)
```

### Resultado
**No se guarda** y aparece panel rojo arriba del form:

```
Errores de validación:
• El ID ya existe en el dataset
• Se requieren al menos 3 tags
• La duración mínima debe ser menor que la máxima
• Intensidad debe ser 0, 1 o 2
• El costo no puede ser negativo
```

### Corrección
```
ID: act_test_001
Tags: [añadir un tercero]
Duración Max: 90
Intensidad: [Click en Media]
Costo: 0
[Guardar] → ✓ "Actividad creada"
```

## Ejemplo 6: Workflow Completo de Edición

### Objetivo
Actualizar el catálogo completo para el proyecto

### Pasos

**Día 1: Setup**
1. Clonar repo del proyecto
2. Abrir `activity-editor.html` en el navegador
3. Importar todos los archivos de `/data/`
4. Verificar que todo se cargó (check estadísticas)

**Día 2: Edición**
1. Revisar cada actividad con filtros
2. Mejorar descripciones
3. Añadir pasos faltantes
4. Corregir duraciones basadas en experiencia
5. Añadir nuevas actividades (3-5)

**Día 3: Perfiles**
1. Cambiar a vista de Perfiles
2. Actualizar energy_profile según realidad
3. Ajustar preferencias
4. Exportar perfiles actualizados

**Día 4: Finalización**
1. Limpiar filtros (ver todo)
2. Verificar no hay duplicados (buscar por ID)
3. Exportar todo
4. Generar nuevo index.json
5. Copiar archivos exportados a `/data/`
6. Commit y push a GitHub

### Comandos Git
```bash
# Después de exportar
cp ~/Downloads/activities_export.json ./data/activities_core.json
cp ~/Downloads/haziel.json ./data/profiles/haziel.json
cp ~/Downloads/lilith.json ./data/profiles/lilith.json
cp ~/Downloads/index.json ./data/index.json

git add data/
git commit -m "Update activities catalog via editor"
git push origin main
```

## Tips Avanzados

### 1. Usar Búsqueda para Auditoría
```
Búsqueda: "cost 0" → Ver todas las actividades gratuitas
Búsqueda: "outdoor" → Ver todas las actividades exteriores
Búsqueda: "duration 120" → Ver actividades largas
```

### 2. Crear Familias de Actividades
```
IDs relacionados:
- act_anime_001: Ver episodio
- act_anime_002: Maratón
- act_anime_003: Buscar nuevas series
```

### 3. Tags Consistentes
Mantén consistencia en los tags:
- `indoor` / `outdoor` (no `interior`/`exterior`)
- `gaming` (no `videogames` o `games`)
- `relaxing` (no `relax` o `relaxed`)

### 4. Duraciones Realistas
Basadas en experiencia:
- Episodio anime: 20-25 min
- Película: 90-180 min
- Cocinar: 30-90 min
- Videojuego: 30-120 min
- Podcast: 20-60 min

### 5. Backup Regular
```bash
# Crear backup antes de grandes cambios
cp data/activities_core.json data/backup/activities_core_2026-02-11.json
```

## Troubleshooting Común

### "No puedo añadir más tags"
- ¿Ya tienes 10+ tags? Considera si todos son necesarios
- ¿El tag tiene caracteres especiales? Usa solo letras y guiones

### "El modal no se cierra"
- Presiona Esc o click en la X
- Si no funciona, recarga la página (perderás cambios no exportados)

### "Perdí mis cambios"
- El editor NO guarda automáticamente
- SIEMPRE exporta después de hacer cambios importantes
- Considera usar Git para versionar

### "Los filtros no muestran nada"
- Click en "Limpiar Filtros"
- Verifica que escribiste el tag/intensidad correctamente
- Asegúrate de tener actividades importadas

## Siguientes Pasos

Una vez domines el editor, considera:

1. **Crear Templates**: Guarda actividades "plantilla" para duplicar
2. **Documentar Tags**: Mantén lista de qué significa cada tag
3. **Versionar Catálogo**: Usa Git para trackear cambios
4. **Validar en Producción**: Prueba las actividades en el app principal
5. **Iterar**: Añade actividades basadas en feedback real

---

¿Más preguntas? Consulta `EDITOR_USAGE.md` para la guía completa.
