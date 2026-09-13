# Tasks — Issue #27

- [x] Confirmar requisitos de la Issue #27, dependencias de autenticación y
  estado de la rama.
- [x] Auditar `SecurityConfig`, JWT, handlers JSON, catálogo de ejercicios,
  configuración Docker y esquema MySQL.
- [x] Decidir y documentar la allowlist server-side `ADMIN_EMAILS` como fuente
  de autorización sin migración de esquema.
- [x] Crear el SDD válido con `spec.md`, `plan.md` y este `tasks.md`.
- [x] Añadir la configuración `ADMIN_EMAILS` sin incluir secretos reales.
- [x] Implementar la resolución normalizada de authorities administrativas.
- [x] Incorporar `ROLE_ADMIN` al authentication del JWT solo desde la
  configuración del servidor.
- [x] Restringir POST, PUT y DELETE de `/api/exercises` a administradores.
- [x] Mantener lecturas, registro, login y flujos personales sin cambios.
- [x] Añadir tests HTTP de 401, 403, administrador, usuario normal y rutas
  públicas/lectura.
- [x] Ejecutar `./mvnw validate`.
- [x] Ejecutar `./mvnw test`.
- [x] Ejecutar `./mvnw package`.
- [x] Revisar diff, status, secretos y alcance antes del commit.
- [x] Crear el commit específico de la Issue #27 y conservar su hash
  (`0fe502b`).
- [x] Documentar la Issue #27 con cambios, verificaciones, rama y commit,
  manteniéndola abierta para validación manual.

## Resultados

Implementación y verificaciones completadas. `./mvnw validate`, `./mvnw test`
(129 tests, 0 fallos y 0 errores) y `./mvnw package` terminaron correctamente.
La allowlist está vacía por defecto y se configura mediante `ADMIN_EMAILS`.
El esquema MySQL y los scripts de inicialización no fueron modificados.
El commit de implementación es `0fe502b` y la Issue quedó documentada abierta,
pendiente de validación manual y de `/finish-issue 27`.
