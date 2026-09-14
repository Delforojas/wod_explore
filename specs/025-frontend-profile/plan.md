# Plan - Issue #25: Vista de perfil frontend

## Enfoque

Extender el router hash, la cabecera y las páginas existentes con el cambio
mínimo necesario. La nueva página será responsable de su lectura y estados
locales, mientras que autenticación, token, validación y expiración seguirán
siendo responsabilidad de `AuthContext` y `api/client.ts`.

```text
Layout/header -> ProfilePage -> getCurrentUser -> userSchema
                         \-> AuthContext token/session-expired event
```

No se modificará el backend ni se introducirá una dependencia nueva.

## Fases

1. Crear la carpeta SDD y validar `spec.md`, `plan.md` y `tasks.md`.
2. Añadir `profile` al tipo `Route`, al parser y al switch principal de `App`.
3. Añadir el enlace accesible `Perfil` a la cabecera para usuarios autenticados,
   conservando logout y el resto de navegación.
4. Crear `ProfilePage` con una consulta a `getCurrentUser(token)`, cancelación
   lógica al desmontar, retry local y estados de no autenticado, carga, error y
   respuesta válida.
5. Añadir estilos editoriales responsive para la ficha de perfil usando las
   clases y variables visuales existentes.
6. Añadir tests Vitest para `parseRoute("#/profile")` y para la petición
   `getCurrentUser`, sin montar una nueva infraestructura de componentes.
7. Revisar accesibilidad, responsive y regresiones de las rutas existentes.
8. Ejecutar tests, lint y build; registrar los resultados en `tasks.md`.

## Comportamiento de errores

- El error de red se mostrará con el mensaje seguro que entrega `ApiError` y una
  acción `Reintentar`.
- Un `401` será procesado por `api/client.ts`, que emite
  `wod-explorer:session-expired`; `AuthContext` eliminará el token y navegará a
  login. La página no implementará un segundo mecanismo de sesión.
- Una respuesta con formato no válido reutilizará el mensaje seguro de parseo
  del cliente API.
- La ausencia de token mostrará un enlace real a `#/login`.

## Verificación

- `npm test` desde `frontend/`.
- `npm run lint` desde `frontend/`.
- `npm run build` desde `frontend/`, incluyendo comprobación TypeScript estricta.
- Revisión manual del enlace de cabecera y la ruta en móvil, tablet y escritorio,
  incluyendo teclado, foco visible y ausencia de overflow.
