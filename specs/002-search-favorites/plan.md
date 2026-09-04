# Plan técnico — Spec 002

## Objetivo técnico

Ampliar WOD Explorer con búsqueda por nombre y gestión de favoritos persistidos
en `localStorage`, manteniendo la aplicación completamente frontend y reutilizando
la arquitectura creada en la Spec 001.

No se añadirá backend, base de datos, autenticación ni servicios externos.

---

## Estructura de módulos

- `src/lib/filterWods.ts`
  → lógica pura para combinar búsqueda, tipo y favoritos.

- `src/lib/favoritesStorage.ts`
  → lectura, validación y escritura de favoritos en `localStorage`.

- `src/hooks/useFavorites.ts`
  → estado React y operaciones para añadir/eliminar favoritos.

- `src/components/WodSearch.tsx`
  → campo de búsqueda.

- `src/components/FavoriteButton.tsx`
  → control accesible para marcar/desmarcar un WOD.

- `src/components/WodFilters.tsx`
  → ampliar los filtros existentes si es necesario para incluir favoritos.

- `src/pages/WodsPage.tsx`
  → integrar búsqueda, filtros y favoritos.

- `src/pages/WodDetailPage.tsx`
  → permitir marcar/desmarcar favorito desde el detalle si encaja con la UI existente.

- `tests/`
  → tests unitarios y de componentes para búsqueda, favoritos y persistencia.

---

## Modelo de favoritos

Los favoritos se identificarán exclusivamente mediante el `id` de cada WOD.

Ejemplo:

```json
[
  "fran",
  "murph",
  "cindy"
]
```

No se almacenará el WOD completo en `localStorage`.

Ventajas:

- evita duplicar datos;
- el JSON local sigue siendo la fuente de verdad;
- reduce inconsistencias;
- facilita eliminar referencias a WODs que ya no existen.

---

## Clave de localStorage

Se utilizará una única clave estable:

```text
wod-explorer:favorites
```

El valor almacenado será JSON serializado.

Ejemplo:

```json
["fran", "murph"]
```

---

## Validación de favoritos almacenados

Los datos recuperados de `localStorage` se consideran datos no confiables.

Flujo:

1. Leer `wod-explorer:favorites`.
2. Si no existe, devolver lista vacía.
3. Parsear el JSON.
4. Validar que sea un array de strings.
5. Eliminar duplicados.
6. Eliminar IDs que no correspondan a WODs existentes.
7. Si el JSON está corrupto o tiene estructura inválida, devolver lista vacía.
8. La aplicación no debe romperse por errores de almacenamiento.

La validación podrá realizarse con Zod reutilizando la dependencia ya existente.

---

## Búsqueda de WODs

La búsqueda será lógica pura e independiente de React.

Normalización:

```ts
value.trim().toLocaleLowerCase()
```

Comportamiento:

1. Si la búsqueda queda vacía tras `trim()`, no limita resultados.
2. La comparación ignora mayúsculas y minúsculas.
3. Se comprobará si el nombre del WOD contiene parcialmente el término.
4. La búsqueda podrá combinarse con el filtro de tipo existente.

Ejemplo:

```text
Búsqueda: "fr"

Fran    → coincide
Murph   → no coincide
```

---

## Composición de filtros

La lógica deberá poder aplicar simultáneamente:

```text
WODs
 ↓
búsqueda por nombre
 ↓
filtro por tipo
 ↓
solo favoritos (opcional)
 ↓
resultado
```

Se evitará repartir esta lógica entre varios componentes.

Una posible interfaz:

```ts
filterWods(wods, {
  search,
  type,
  favoritesOnly,
  favoriteIds,
})
```

El resultado será siempre un nuevo array y no deberá modificar los datos originales.

---

## Estado React

### Búsqueda

El texto de búsqueda podrá vivir en `WodsPage`.

Ejemplo conceptual:

```ts
const [search, setSearch] = useState("")
```

No será necesario persistirlo al recargar.

### Favoritos

La lógica de favoritos se encapsulará en un hook reutilizable:

```text
useFavorites()
```

Responsabilidades:

- cargar favoritos iniciales;
- comprobar si un WOD es favorito;
- añadir favorito;
- eliminar favorito;
- persistir cambios en `localStorage`.

Interfaz conceptual:

```ts
{
  favoriteIds,
  isFavorite,
  toggleFavorite
}
```

---

## Persistencia

Cada cambio de favoritos debe reflejarse en `localStorage`.

Flujo:

```text
usuario pulsa favorito
        ↓
actualiza estado React
        ↓
actualiza localStorage
        ↓
UI se vuelve a renderizar
```

Se evitarán escrituras redundantes cuando no haya cambios.

---

## Botón de favorito

`FavoriteButton` será un componente reutilizable.

Debe recibir al menos:

```text
isFavorite
onToggle
wodName
```

Requisitos:

- debe utilizar `<button>`;
- debe ser accesible mediante teclado;
- debe tener `aria-label` descriptivo;
- debe reflejar visualmente el estado actual;
- no depender directamente de `localStorage`.

Ejemplo de etiqueta:

```text
Añadir Fran a favoritos
```

o:

```text
Quitar Fran de favoritos
```

---

## Vista de favoritos

La vista podrá implementarse como filtro dentro del catálogo existente.

Ejemplo:

```text
[Todos] [For Time] [AMRAP] [EMOM] [Favoritos]
```

Si se activa `Favoritos`:

```text
favoritesOnly = true
```

La búsqueda seguirá funcionando sobre los favoritos.

Si no hay favoritos:

```text
Todavía no tienes WODs favoritos.
```

Debe diferenciarse del estado:

```text
No hay WODs que coincidan con los filtros.
```

---

## Integración con detalle de WOD

Un WOD favorito seguirá accediendo a la misma ruta:

```text
/wods/:id
```

Si se añade el botón de favorito al detalle, deberá reutilizar exactamente la
misma lógica que el catálogo.

No se duplicará estado independiente de favoritos por página.

---

## Decisiones técnicas

- No crear Context global salvo que sea realmente necesario.
- Priorizar estado local y composición sencilla.
- Encapsular `localStorage` fuera de los componentes.
- No almacenar objetos WOD completos como favoritos.
- Reutilizar los tipos y schemas existentes.
- Mantener funciones de filtrado puras y testeables.
- No utilizar `any`.
- No introducir librerías de estado global.
- No añadir nuevas dependencias salvo necesidad técnica justificada.
- Mantener compatibilidad con el diseño responsive de la Spec 001.

---

## Uso de Skills

### React

Usar:

- `vercel-react-best-practices`
- `vercel-composition-patterns`

Especialmente para:

- colocación del estado;
- evitar efectos innecesarios;
- composición del botón de favoritos;
- diseño del hook `useFavorites`.

### TypeScript

Usar:

- `typescript-advanced-types`

Especialmente para:

- contratos de filtros;
- tipos derivados existentes;
- funciones puras;
- evitar estados inválidos.

### Diseño

Usar:

- `web-design-guidelines`
- `tailwind-css-patterns`

Especialmente para:

- campo de búsqueda;
- estado activo de favoritos;
- accesibilidad;
- responsive;
- estados vacíos.

### Validación

Usar:

- `zod-schema-validation`

Para validar los datos recuperados de `localStorage`.

---

## Estrategia de tests

### Búsqueda

Tests para:

- búsqueda vacía;
- búsqueda con espacios;
- coincidencia exacta;
- coincidencia parcial;
- diferencia de mayúsculas/minúsculas;
- búsqueda sin resultados.

### Composición de filtros

Tests para:

- `All` + búsqueda;
- `For Time` + búsqueda;
- `AMRAP` + búsqueda;
- `EMOM` + búsqueda;
- búsqueda y filtro sin coincidencias;
- búsqueda dentro de favoritos.

### Favoritos

Tests para:

- añadir favorito;
- quitar favorito;
- evitar duplicados;
- comprobar `isFavorite`;
- varios favoritos.

### localStorage

Tests para:

- almacenamiento inexistente;
- JSON válido;
- JSON corrupto;
- estructura incorrecta;
- IDs inexistentes;
- IDs duplicados;
- persistencia después de añadir/eliminar.

### Componentes

Tests para:

- `WodSearch` actualiza el valor;
- `FavoriteButton` refleja ambos estados;
- botón accesible mediante nombre;
- vista de favoritos;
- estado vacío sin favoritos;
- combinación de búsqueda + favoritos.

---

## Verificación final

Antes de considerar completada la Spec 002:

1. Ejecutar `npm test`.
2. Ejecutar `npm run lint`.
3. Ejecutar `npm run build`.
4. Confirmar que TypeScript no presenta errores.
5. Probar búsqueda con varios términos.
6. Probar combinación de búsqueda y filtros.
7. Marcar y desmarcar favoritos.
8. Recargar la página y confirmar persistencia.
9. Probar manualmente `localStorage` vacío o corrupto.
10. Comprobar estado sin favoritos.
11. Comprobar navegación por teclado.
12. Confirmar que no se han añadido peticiones de red, backend ni base de datos.