# Tasks - Issue #25: Vista de perfil frontend

## Preparación

- [x] Obtener la Issue #25 y extraer objetivo, alcance, criterios, restricciones
  y dependencias.
- [x] Revisar reglas frontend, constitución, producto, diseño, Issue #21, Issue
  #19 y contratos backend relacionados.
- [x] Crear `feat/025-frontend-profile` desde la rama válida que contiene la
  dependencia frontend de la Issue #21.
- [x] Crear y validar `spec.md`, `plan.md` y `tasks.md`.

## Ruta y navegación

- [x] Añadir `profile` al router hash y renderizar `ProfilePage`.
- [x] Añadir enlace `Perfil` visible, accesible y activo en la cabecera para
  usuarios autenticados.
- [x] Confirmar que las rutas existentes mantienen su comportamiento.

## Vista de perfil

- [x] Crear `ProfilePage` con consulta a `/api/users/me` mediante el cliente
  existente y el token de `AuthContext`.
- [x] Mostrar nombre, apellidos, email y fecha de alta sin campos sensibles o
  internos.
- [x] Implementar estados de usuario no autenticado, carga, error de red,
  respuesta inválida/no disponible, sesión expirada y respuesta válida.
- [x] Mantener HTML semántico, navegación por teclado, foco visible, textos en
  español y responsive móvil/tablet/escritorio.

## Tests y entrega

- [x] Añadir tests Vitest de la ruta de perfil y de la llamada autenticada al
  endpoint de usuario actual.
- [x] Ejecutar `npm test` sin fallos.
- [x] Ejecutar `npm run lint` sin errores.
- [x] Ejecutar `npm run build` sin errores de TypeScript.
- [x] Revisar diff, status y alcance; confirmar que no se modificó backend.
- [x] Marcar las tareas de implementación y documentar los resultados reales.
- [ ] Crear el commit específico de la Issue #25 y conservar su hash.
- [ ] Documentar la Issue #25 con rama, commit, verificaciones y estado abierto
  pendiente de validación manual.

## Resultados de verificación

- `npm test`: correcto, 7 tests en 2 archivos.
- `npm run lint`: correcto, sin errores.
- `npm run build`: correcto, TypeScript estricto y bundle Vite generados.
- `git diff --check`: correcto.
- Se ejecutó el detector de Impeccable sobre los archivos UI modificados; no
  encontró problemas nuevos. La única advertencia es `Inter` en la línea 2 de
  `frontend/src/index.css`, una decisión visual global preexistente.
- Se revisaron semántica HTML, foco visible, enlaces nativos, `aria-live`,
  mensajes en español y breakpoints existentes sin modificar el backend.
