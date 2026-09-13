# Plan - Issue #21: Integración frontend con API

## Enfoque

Reemplazar el scaffold actual por una SPA pequeña y explícita, manteniendo las
responsabilidades separadas:

```text
pages/components -> hooks/state -> api client + schemas -> REST backend
```

No se añadirá un gestor global de estado ni una librería de routing. El estado de
sesión vivirá en un `AuthProvider` pequeño porque login, logout y las pantallas
protegidas necesitan compartirlo; el resto de datos permanecerá local a cada
pantalla.

## Fases

1. Añadir la infraestructura mínima de validación y tests, junto con tipos y
   schemas de los DTOs existentes.
2. Crear el cliente HTTP configurable con errores estructurados y funciones por
   recurso para auth, usuarios, WODs, ejercicios, resultados y estadísticas.
3. Implementar sesión, registro, login, logout y el router hash.
4. Implementar catálogo/detalle de ejercicios y WODs con filtros, carga, error y
   vacío.
5. Implementar formularios de resultados usando las reglas de tipo WOD y de
   medición ya expuestas por el backend.
6. Implementar perfil, historial, estadísticas y evolución como vistas
   protegidas.
7. Integrar la navegación y reemplazar la pantalla Vite inicial sin activar
   fuentes JSON ni `localStorage` para datos de negocio.
8. Revisar accesibilidad y responsive en móvil, tablet y escritorio; ejecutar
   tests, lint, TypeScript y build.

## Decisiones técnicas

- `VITE_API_URL` permite cambiar el origen sin hardcodear URLs de producción.
- `sessionStorage` limita la duración del JWT a la pestaña/sesión del navegador;
  el backend actual no ofrece cookies HttpOnly, por lo que no se inventará otro
  mecanismo de autenticación.
- Zod valida todas las respuestas de API en el borde y convierte errores de
  parseo en estados de error visibles.
- Un `ApiError` conserva el status y el mensaje seguro del backend para que la
  UI pueda distinguir `401`, validación y fallos de red.
- Los formularios usan HTML nativo y validación declarativa, sin añadir una
  librería de formularios.
- Se añadirá Vitest como dependencia de desarrollo porque el package actual no
  tiene runner de tests y la Issue exige `npm test`; los tests se concentrarán
  en cliente API, schemas, sesión y transformaciones de pantalla.

## Verificación

- `npm test` ejecuta la suite Vitest.
- `npm run lint` comprueba el código TypeScript/React.
- `npm run build` comprueba TypeScript estricto y el bundle Vite.
- Se comprobarán manualmente rutas públicas/protegidas, formularios, errores de
  API y estados vacíos con el backend local disponible.
- No se ejecutarán verificaciones backend adicionales salvo que una prueba
  frontend revele una incompatibilidad contractual.
