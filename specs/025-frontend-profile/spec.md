# SDD - Issue #25: Vista de perfil frontend

## Estado

Planificación para la rama `feat/025-frontend-profile`, derivada de la rama
publicada de la Issue #24 porque contiene el estado de desarrollo que incluye la
integración frontend de la Issue #21.

## Objetivo

Permitir que una persona autenticada consulte sus datos básicos en una ruta de
perfil visible, accesible y coherente con la interfaz editorial actual de WOD
Explorer.

## Alcance

- Añadir la ruta hash `#/profile` al router existente.
- Añadir un enlace visible `Perfil` en la cabecera para usuarios autenticados.
- Consultar `GET /api/users/me` mediante la función existente del cliente API.
- Mostrar únicamente nombre, apellidos, email y fecha de alta.
- Reutilizar `userSchema`, el tipo `User`, el token de `AuthContext` y el manejo
  global de sesión expirada.
- Representar estados de carga, error de red, respuesta inválida/no disponible,
  sesión expirada y usuario no autenticado con mensajes en español.
- Mantener HTML semántico, foco visible, navegación por teclado y composición
  responsive en móvil, tablet y escritorio.
- Añadir tests unitarios para la ruta y el acceso al endpoint, dentro de las
  capacidades actuales de Vitest sin introducir Testing Library ni un router.

## Criterios de aceptación

- Un usuario autenticado puede abrir el perfil desde el enlace visible de la
  cabecera usando ratón o teclado.
- La vista solicita y muestra los datos recibidos de `/api/users/me`; no usa
  datos hardcodeados ni una segunda fuente de verdad.
- Un usuario sin sesión recibe una invitación clara para iniciar sesión.
- Una respuesta `401` utiliza el evento existente, limpia la sesión y conduce a
  `#/login`.
- La vista no muestra contraseña, hash, token, ID ni campos internos.
- Los estados de carga, error de red, respuesta inválida y respuesta válida son
  comprensibles en español.
- Las rutas existentes de inicio, WODs, ejercicios, historial y estadísticas no
  cambian de comportamiento.

## Restricciones

- No modificar backend, endpoint, esquema MySQL ni contratos REST.
- No añadir React Router, Testing Library, gestor global de estado ni APIs
  externas.
- No editar nombre, email o contraseña.
- No añadir avatar, preferencias, roles ni recuperación de contraseña.
- Mantener la estética, tokens, responsive y accesibilidad definidos por
  `DESIGN.md`.
- Mantener TypeScript estricto, identificadores en inglés y textos visibles en
  español.

## Contrato utilizado

```http
GET /api/users/me
Authorization: Bearer <token>
```

La respuesta se valida con `userSchema` y tiene las propiedades públicas
`id`, `name`, `lastName`, `email` y `createdAt`. La pantalla solo renderizará
`name`, `lastName`, `email` y `createdAt`.

## Decisiones resueltas

- Se usará `/profile` para mantener el vocabulario de rutas existente en
  inglés, mientras que toda la copia de usuario seguirá en español.
- El enlace se colocará en la cabecera y solo se mostrará para una sesión activa;
  la ruta seguirá mostrando la invitación de login si se abre directamente sin
  sesión.
- La pantalla hará una lectura explícita al entrar para poder mostrar sus
  propios estados de carga y error, usando el token compartido y el cliente API
  existente. No se duplicará el contrato ni el almacenamiento de sesión.
