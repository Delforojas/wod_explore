# Plan - Issue #47: Crear seccion Mis WODs

## Base tecnica

Se reutilizaran el hash router, `Layout`, `StateMessage`, `PaginationControls`,
los tokens CSS y el cliente HTTP existente. El estado de datos permanecera local
a cada pagina y se validara en la frontera mediante Zod.

## Fases

1. **Contrato cliente**
   - Crear schemas derivados para resumen paginado y detalle de WOD personal.
   - Anadir `getUserWods` y `getUserWod` con JWT y paginacion.

2. **Navegacion**
   - Anadir rutas `my-wods` y `my-wod-detail` al router y `App`.
   - Anadir "Mis WODs" al rail desktop y navegacion movil.

3. **Listado**
   - Crear `MyWodsPage` con privacidad, carga, error, vacio, reintento y
     paginacion.
   - Cargar en paralelo los detalles de la pagina para derivar el numero de
     ejercicios, porque el resumen API actual no contiene ese campo.
   - Enlazar cada fila al detalle sin usar handlers de navegacion.

4. **Detalle**
   - Crear `MyWodDetailPage` con metadatos y lista ordenada.
   - Renderizar cada prescripcion con valor, unidad y `unitLabel` cuando exista.
   - Mantener el estado privado para anonimos y el error 404 sin distinguir
     WOD inexistente de WOD perteneciente a otra cuenta.

5. **Estilos y accesibilidad**
   - Aplicar el lenguaje editorial existente con superficies contiguas, reglas,
     contraste, wrapping y responsive desde 320px.
   - Mantener landmarks, headings, enlaces, `time`, `data`, foco visible y
     estados anunciados.

6. **Tests y verificacion**
   - Cubrir schemas/client, router, navegacion, listado con datos y vacio,
     conteos, paginacion, detalle ordenado, prescripciones, loading, errores y
     sesion anonima.
   - Ejecutar `npm test`, `npm run lint` y `npm run build` desde `frontend/`.
   - Ejecutar el detector mecanico de Impeccable y revisar responsive y
     accesibilidad antes de marcar la tarea completa.

## Riesgos y limites

- Derivar el conteo desde detalles introduce peticiones adicionales, pero evita
  cambiar el contrato backend de #45 y se ejecuta con `Promise.all`, no en serie.
- La API garantiza ownership; el frontend no acepta ni envia `userId` u
  `ownerId` y trata 404 como recurso no disponible.
- No se reutiliza `WodDetailPage` porque ese flujo consulta el catalogo global,
  expone resultados y no representa prescripciones personales.
