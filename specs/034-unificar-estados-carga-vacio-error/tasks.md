# Tasks 034 - Unificar estados de carga, vacio y error

## SDD y alcance

- [x] Validar spec, plan y tareas contra Issue #34 y restricciones del repo.

## Primitive compartida

- [x] Definir variantes tipadas para carga, vacio, error, red, privacidad, sesion caducada y exito.
- [x] Implementar roles, anuncios, atomicidad, busy state, acciones y señal visual sin duplicar ruido.

## Aplicacion en frontend

- [x] Aplicar estados consistentes en catalogos, detalles, historial, estadisticas y perfil.
- [x] Aplicar privacidad, sesion caducada y feedback de auth conservando el flujo existente.
- [x] Migrar feedback de guardado, exito y error de formularios a la primitive compartida.
- [x] Añadir estilos responsive y estables para todas las variantes.

## Tests y verificacion

- [x] Añadir o ajustar pruebas de comportamiento para estados dinamicos y recuperacion.
- [x] Ejecutar `npm test` desde `frontend/`.
- [x] Ejecutar `npm run lint` desde `frontend/`.
- [x] Ejecutar `npm run build` desde `frontend/`.
- [x] Revisar diff, detector visual y confirmar que no cambian API, schemas, payloads ni rutas.
