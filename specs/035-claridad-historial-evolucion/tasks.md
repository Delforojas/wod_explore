# Tasks 035 - Dar mas claridad visual al historial y la evolucion

## SDD y alcance

- [x] Validar spec, plan y tareas contra Issue #35 y las restricciones del repo.
- [x] Confirmar la rama `feat/035-claridad-historial-evolucion` desde #34.

## Historial

- [x] Separar visualmente resumen, resultados WOD y marcas de ejercicios.
- [x] Mostrar contexto legible de valor, formato, nivel, tipo y fecha.
- [x] Conservar enlaces hash y nombres accesibles hacia cada detalle.
- [x] Mantener estados vacios, privacidad, carga y error existentes.

## Estadisticas y evolucion

- [x] Separar resumen de actividad, marcas personales y evolucion.
- [x] Hacer visibles etiquetas de unidades, tipos, niveles y fechas sin cambiar
  los valores de API.
- [x] Convertir puntos de evolucion en enlaces contextualizados.
- [x] Añadir bandas temporales CSS con fallback textual completo y accesible.
- [x] Mantener estados vacios orientados al siguiente paso.

## Responsive y accesibilidad

- [x] Ajustar layout y wrapping para 320 px, tablet y escritorio sin overflow.
- [x] Verificar headings, sections, lists, time, focus visible y targets tactiles.
- [x] Mantener la señal visual de evolucion independiente del color.

## Pruebas y verificacion

- [x] Añadir o ajustar pruebas de jerarquia, etiquetas, enlaces y evolucion.
- [x] Ejecutar `npm test` desde `frontend/`.
- [x] Ejecutar `npm run lint` desde `frontend/`.
- [x] Ejecutar `npm run build` desde `frontend/`.
- [x] Ejecutar `git diff --check` y el detector mecanico de Impeccable.
- [x] Confirmar que no cambian API, schemas, payloads, autenticacion ni rutas.
