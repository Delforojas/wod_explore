# Tasks - Issue #23: Endurecer configuración y arranque Docker

## SDD y preparación

- [x] Obtener y revisar la Issue #23 mediante GitHub MCP.
- [x] Leer constitución, documentación actualizada, AGENTS aplicables, Specs
  relacionadas, configuración Docker, backend y skills relevantes.
- [x] Comprobar estado Git y crear `chore/023-docker-startup` desde la rama que
  contiene el trabajo más reciente de la Issue #22.
- [x] Crear `spec.md`, `plan.md` y `tasks.md` con contenido válido.

## Configuración y Docker

- [x] Crear `.env.example` sin secretos y con todas las variables requeridas.
- [x] Añadir `CORS_ALLOWED_ORIGIN` al entorno del backend en Compose.
- [x] Añadir el healthcheck real de MySQL con política de reintentos explícita.
- [x] Hacer que el backend dependa de MySQL saludable mediante Compose.
- [x] Mantener puertos, volumen y scripts de inicialización sin cambios
  destructivos.

## Backend y seguridad

- [x] Externalizar el origen CORS con fallback local seguro.
- [x] Verificar mediante test HTTP que se usa el origen configurado.
- [x] Confirmar que no se añaden secretos a código, imágenes, logs o archivos
  versionados.

## Documentación y verificación

- [x] Documentar `.env.example`, CORS, puertos, `VITE_API_URL` y rotación de
  credenciales locales.
- [x] Ejecutar las verificaciones aplicables y documentar sus resultados.
- [x] Revisar `git diff` y `git status`, excluyendo cambios ajenos.
- [x] Crear el commit específico de la Issue #23 y conservar su hash:
  `d07b97b`.
- [x] Documentar la Issue #23 con rama, commit, verificaciones y estado abierto;
  la validación manual quedó completada.

## Resultados de verificación

- `./mvnw validate`: correcto.
- `./mvnw test`: correcto, 125 tests pasados.
- `./mvnw package`: correcto.
- `docker compose --env-file .env.example config --quiet`: correcto.
- Validación estructural de Compose: healthcheck con `mysqladmin ping`, 12
  reintentos y dependencia `service_healthy`: correcta.
- `docker compose up -d mysql`: MySQL `healthy`; el volumen `mysql_data` se
  conservó.
- `docker compose up -d --build backend`: backend en ejecución después de que
  MySQL alcanzó estado saludable.
- `GET http://localhost:8080/api/users/me` sin JWT: `401`, esperado para una
  ruta protegida.
- Validación manual mediante `/dev-restart`: backend `Running`, MySQL
  `Running (healthy)`, persistencia `mysql_data` conservada, backend accesible
  y `JWT_SECRET` configurado en `.env`.
- MCP MySQL: `pong` y tablas existentes accesibles; no se modificó el esquema.
- `git diff --check`: correcto; `.env` ignorado y no trackeado.
- Comentario publicado en GitHub: https://github.com/Delforojas/wod_explore/issues/23#issuecomment-5652490836.
