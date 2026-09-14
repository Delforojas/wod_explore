# Plan 034 - Unificar estados de carga, vacio y error

## Base tecnica

La rama parte de `feat/033-redisenar-detalles-resultados`, que contiene el ultimo
trabajo de desarrollo no integrado en `main`. La implementacion se limita al
frontend React/TypeScript y al CSS existente.

## Estrategia

1. Revisar la primitive `StateMessage`, sus consumidores y la semantica actual de
   los estados para no perder rutas ni acciones.
2. Definir un union type de variantes explicitas y un contrato de accion
   conservando enlaces y botones nativos.
3. Hacer que `StateMessage` renderice una jerarquia comun con una señal visual,
   copy, rol accesible y anuncio correcto por variante. Mantener
   `LoadingMessage` como wrapper de carga.
4. Añadir estilos por variante y reglas responsive en `index.css`, incluyendo
   altura minima estable, targets tactiles y reduced motion sin animacion
   invasiva.
5. Aplicar las variantes en WODs, ejercicios, detalles, historial, estadisticas
   y perfil, usando la variante de error de red cuando `ApiError.status === 0`.
6. Migrar feedback visible de error/exito de formularios a la primitive sin
   cambiar submits, conversiones, payloads ni endpoints.
7. Extender el contexto de auth con una señal local de sesion caducada para que
   `AuthPage` explique el retorno a login sin exponer tokens ni cambiar el flujo.
8. Ajustar tests de comportamiento para carga, vacio, error, privacidad, sesion
   caducada y feedback de formularios donde el DOM observable cambie.
9. Ejecutar tests, lint, build, `git diff --check` y el detector mecanico de
   Impeccable sobre los targets modificados.

## Riesgos y mitigaciones

- Cambiar roles puede romper tests o anunciar dos veces el mismo texto; cubrir
  la primitive y usar un unico rol por estado.
- Una sesion caducada puede competir con el render de una pagina privada; hacer
  que el contexto marque la causa antes de navegar y mostrarla en login.
- La carga repetida durante paginacion puede producir saltos; conservar el
  flujo de estados existente y estabilizar solo la superficie visual.
- Los mensajes de error deben mantener el texto seguro ya filtrado por
  `ApiError`; no mostrar respuestas crudas ni stack traces.

## Verificacion

Desde `frontend/`:

```bash
npm test
npm run lint
npm run build
```

Tambien se comprobara que no cambien `frontend/src/api/client.ts`,
`frontend/src/api/schemas.ts`, endpoints, payloads ni rutas, salvo que una prueba
requiera confirmar que permanecen intactos.
