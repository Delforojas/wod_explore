# Plan - Issue #60: Registrar resultados desde WODs personalizados

## Estrategia

Extraer la experiencia de resultados que ya vive en `WodDetailPage` a un
componente compartido orientado al flujo `wodId + wodType + token`. El componente
sera responsable de cargar la lista, construir el request, guardar el intento y
representar sus estados. Los detalles global y personal solo resolveran su WOD y
ubicaran el panel dentro de su composicion visual.

## Cambios

1. Crear `WodResultsPanel` con consulta inicial, formulario condicionado por
   `WodType`, lista de resultados y estados accesibles.
2. Reutilizar `createWodResult`, `getWodResults`, `WodResultRequest`, `ApiError` y
   `StateMessage` sin crear contratos paralelos.
3. Sustituir el formulario y lista inline de `WodDetailPage` por el componente
   compartido, conservando su comportamiento actual.
4. Integrar el mismo componente en `MyWodDetailPage` junto al resumen del WOD
   personal.
5. Ajustar estilos unicamente cuando la nueva composicion lo requiera para
   conservar el sistema visual y el layout mobile-first.
6. Ampliar tests de `WodDetailPage` y `MyWodDetailPage` para cubrir payloads,
   estados, errores y aislamiento anonimo.
7. Ejecutar `npm test`, `npm run lint` y `npm run build` desde `frontend/`.

## Decisiones

- La lista se carga en el componente compartido para que los dos detalles usen
  el mismo flujo y no haya divergencia entre resultados globales y personales.
- Tras guardar, el resultado devuelto por la API se incorpora al estado local;
  no se hace una recarga completa del detalle.
- La fecha `datetime-local` se convierte al formato de segundos esperado por el
  backend, igual que en el flujo global existente.
- El token se recibe desde la pagina autenticada y se pasa al cliente API; no se
  lee identidad del formulario ni de la URL.
- Los errores de API se muestran mediante el mensaje existente de `ApiError` y
  el tipo de estado derivado, sin exponer datos del WOD ajeno.

## Riesgos y mitigaciones

- **Regresion del detalle global:** conservar sus tests de los tres tipos y
  payloads tras extraer el componente.
- **Envios duplicados:** bloquear el submit mientras `isSaving` sea verdadero y
  verificarlo en tests.
- **Peticion anonima:** montar el panel solo despues de resolver un token y
  comprobarlo en los tests de ambas paginas.
- **Responsive:** reutilizar clases existentes y comprobar 320px, movil, tablet
  y escritorio manualmente.
