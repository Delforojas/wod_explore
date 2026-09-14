# Spec 004 — Rediseño frontend

## Contexto y objetivo

WOD Explorer ya dispone de catálogo de WODs, ejercicios, búsqueda, favoritos e historial.

El objetivo de esta spec es redefinir la interfaz visual y la experiencia de usuario

sin modificar el comportamiento funcional existente.

El rediseño utilizará `DESIGN.md` como fuente de verdad visual y `impeccable`

como skill principal de diseño.

## Historias de usuario

- H1: Como usuario quiero una navegación clara y moderna.

- H2: Como usuario quiero que el catálogo de WODs sea fácil de explorar.

- H3: Como usuario quiero que las páginas de detalle tengan una jerarquía visual clara.

- H4: Como usuario quiero que favoritos, búsqueda e historial sean fáciles de usar.

- H5: Como usuario quiero una experiencia consistente en móvil y escritorio.

## Requisitos

- RF-1: Rediseñar la navegación principal.

- RF-2: Rediseñar la página de inicio.

- RF-3: Rediseñar el catálogo de WODs.

- RF-4: Rediseñar WodCard.

- RF-5: Rediseñar filtros y búsqueda.

- RF-6: Rediseñar la página de detalle.

- RF-7: Rediseñar el catálogo de ejercicios.

- RF-8: Rediseñar el historial.

- RF-9: Rediseñar estados vacíos y de error.

- RF-10: Mantener todas las funcionalidades existentes.

## Restricciones

- No modificar lógica de negocio salvo necesidad estricta.

- No cambiar JSON.

- No modificar persistencia.

- No añadir backend.

- No añadir base de datos.

- No añadir nuevas funcionalidades.

- Seguir `DESIGN.md`.

- Usar `impeccable` como skill principal de diseño.

- Mantener accesibilidad y responsive.

- `npm test`, `npm run lint` y `npm run build` deben seguir pasando.

## Nota de transición arquitectónica

Esta Spec describe el rediseño visual de la etapa frontend local. Sus requisitos
de diseño y restricciones funcionales se conservan sin reescritura como historial
del producto.

La interfaz visual definida aquí continúa siendo referencia para el frontend
actual, pero las fuentes de datos y los flujos operativos posteriores usan la API,
JWT y MySQL. La dirección visual vigente se mantiene en `DESIGN.md` y la
arquitectura actual se documenta en `PRODUCT.md` y `README.md`.
