# SDD - Issue #23: Endurecer configuración y arranque Docker del entorno

## Estado

Planificación validada. La implementación se realizará en la rama
`chore/023-docker-startup`, derivada de
`docs/022-product-documentation`, que contiene el estado de desarrollo más
reciente disponible.

## Objetivo

Hacer que el entorno local de WOD Explorer pueda configurarse y arrancarse de
forma explícita, segura y reproducible, sin versionar credenciales ni iniciar el
backend antes de que MySQL acepte conexiones.

## Alcance

- Crear `.env.example` con variables y valores de ejemplo no sensibles.
- Añadir `CORS_ALLOWED_ORIGIN` a la configuración externa del backend y a Docker.
- Añadir un healthcheck real de MySQL con reintentos, timeout e intervalo
  explícitos.
- Cambiar `depends_on` para que el backend espere el estado saludable de MySQL.
- Mantener los puertos actuales: `3307:3306` para MySQL y `8080:8080` para el
  backend.
- Documentar la generación de `.env`, la configuración CORS y la rotación de
  credenciales locales potencialmente expuestas.
- Añadir una verificación web del origen CORS configurado.

## Criterios de aceptación

- Una persona nueva puede crear `.env` a partir de `.env.example` sin adivinar
  las variables requeridas.
- `.env.example` no contiene tokens, contraseñas reales ni valores reutilizables
  en producción.
- `docker compose up` no inicia el backend hasta que MySQL esté saludable.
- El healthcheck de MySQL ejecuta una comprobación real mediante `mysqladmin` y
  tiene una política explícita de reintentos, timeout e intervalo.
- El backend recibe el origen CORS desde `CORS_ALLOWED_ORIGIN`, manteniendo
  `http://localhost:5173` como valor local por defecto.
- La prueba HTTP demuestra que el origen configurado se refleja en la respuesta
  CORS.
- La documentación explica los puertos locales, `VITE_API_URL` y la rotación de
  credenciales sin exponer secretos.
- No se modifican tablas, columnas, datos ni scripts de inicialización MySQL.

## Restricciones

- No cambiar el esquema ni los datos de MySQL.
- No borrar el volumen `mysql_data`.
- No introducir roles, health endpoint HTTP, nuevas APIs ni cambios funcionales
  de catálogo, resultados o estadísticas.
- No añadir dependencias.
- No versionar `.env` ni credenciales reales.
- Mantener la configuración CORS restringida a un origen explícito; no usar `*`.
- Mantener Java 21 y Spring Boot 3.5.x.

## Referencias técnicas

- `docker-compose.yml` define los servicios `mysql` y `backend`, sus puertos y
  variables actuales.
- `backend/src/main/resources/application.properties` externaliza datasource y
  JWT.
- `backend/src/main/java/com/wodexplorer/config/CorsConfig.java` contiene el
  origen CORS actualmente fijo.
- `backend/src/test/java/com/wodexplorer/security/SecurityHttpTest.java` ya
  verifica el preflight CORS local.
- `backend/Dockerfile` construye la aplicación con Java 21 y expone `8080`.
- `Docker/mysql/AGENTS.md` exige `.env.example`, usuario de aplicación y
  conservación del volumen de datos.

## Fuera de alcance

- Cambios en tablas, columnas, claves, índices, relaciones o datos MySQL.
- Migraciones de esquema.
- Implementación de `/api/health`; pertenece a la Issue #29.
- Pipeline CI completo.
- Gestión de secretos de producción o sustitución del proveedor de base de
  datos.
- Cambios funcionales en frontend, catálogos, resultados o estadísticas.

## Decisiones resueltas

- El healthcheck usará `mysqladmin ping` con `MYSQL_PWD` para no incluir la
  contraseña en argumentos de proceso.
- Compose usará `condition: service_healthy` para el backend.
- CORS se resolverá con una propiedad Spring respaldada por
  `CORS_ALLOWED_ORIGIN` y el fallback local `http://localhost:5173`.
- Los valores de `.env.example` serán placeholders claramente locales, no
  credenciales compartidas.
