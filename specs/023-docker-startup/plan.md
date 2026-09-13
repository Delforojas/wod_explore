# Plan - Issue #23: Endurecer configuración y arranque Docker

## Enfoque

Aplicar cambios pequeños y explícitos en Docker Compose, configuración Spring y
documentación. Se conservará el esquema de servicios existente y no se añadirá
una capa de configuración nueva ni una dependencia externa.

## Fases

1. Crear `.env.example` en la raíz con todas las variables usadas por Compose,
   backend y frontend, usando placeholders no sensibles.
2. Añadir `CORS_ALLOWED_ORIGIN` al entorno del servicio backend y configurar
   `cors.allowed-origin` con fallback local en `application.properties`.
3. Cambiar `CorsConfig` para inyectar el origen configurado y validarlo mediante
   el bean CORS que ya usa Spring Security.
4. Añadir el healthcheck de MySQL con `mysqladmin`, `start_period`, `interval`,
   `timeout` y `retries`; cambiar `depends_on` del backend a
   `service_healthy`.
5. Actualizar el README raíz con el flujo `cp .env.example .env`, CORS,
   configuración Docker y rotación de credenciales locales.
6. Añadir o ajustar el test `SecurityHttpTest` para enviar un preflight desde un
   origen configurado y verificar la cabecera permitida.
7. Revisar diff, secretos, YAML renderizado, tests backend, build backend y
   estado de Docker sin destruir el volumen existente.

## Configuración esperada

`.env.example` contendrá nombres, no secretos:

- `MYSQL_DATABASE`, `MYSQL_USER`, `MYSQL_PASSWORD` y `MYSQL_ROOT_PASSWORD`.
- `DB_URL`, `DB_USER` y `DB_PASSWORD` para backend local.
- `JWT_SECRET` y `JWT_EXPIRATION`.
- `CORS_ALLOWED_ORIGIN`.
- `VITE_API_URL`.

El backend contenerizado seguirá usando la red interna y
`jdbc:mysql://mysql:3306/wod_explorer`; el backend ejecutado localmente seguirá
usando el puerto publicado `3307`.

## Healthcheck y dependencia

El servicio MySQL ejecutará un comando `CMD-SHELL` equivalente a:

```text
MYSQL_PWD="$MYSQL_PASSWORD" mysqladmin ping --host=127.0.0.1 --user="$MYSQL_USER" --silent
```

La contraseña se proporcionará mediante una variable de entorno del proceso del
healthcheck, no como un argumento `-p...`. El backend dependerá de MySQL con
`condition: service_healthy`, manteniendo `restart: unless-stopped`.

## CORS

La configuración mantendrá un único origen permitido y no aceptará wildcard.
Spring usará `CORS_ALLOWED_ORIGIN` cuando esté definido y
`http://localhost:5173` en desarrollo local. El test web usará un origen
alternativo explícito para demostrar que la configuración no está acoplada al
literal anterior.

## Rotación documentada

La documentación indicará que cualquier credencial local compartida fuera del
repositorio debe rotarse antes de continuar, actualizando `.env` y reiniciando
los servicios. No se registrarán valores concretos ni se incluirá material
secreto en el repositorio.

## Verificación

- `./mvnw validate`, `./mvnw test` y `./mvnw package` desde `backend/`.
- `docker compose config` con un `.env` local disponible, sin imprimir ni
  versionar sus valores.
- `docker compose ps` y logs del arranque cuando Docker esté disponible.
- Comprobación estática de `.env.example` y de que `.env` permanece ignorado.
- Revisión de `git diff --check` y `git status` antes del commit.
