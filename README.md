# WOD Explorer

WOD Explorer es una aplicación web full stack para explorar WODs y ejercicios de
CrossFit, registrar resultados y consultar el historial, las marcas personales y
la evolución del rendimiento. El frontend consume el backend REST y MySQL es la
fuente de verdad de los datos migrados.

## Stack

- Frontend: React 19.2.8, TypeScript estricto, Vite 8.2.2, Zod 4.6.4,
  Vitest 5.0.0 y ESLint.
- Estilos: CSS del proyecto en `frontend/src/index.css`.
- Backend: Java 21, Spring Boot 3.5.5, Spring Web, Spring Security, Spring Data
  JPA, Jakarta Validation y JWT.
- Persistencia: MySQL 8.4 mediante Docker Compose.
- Build backend: Maven Wrapper incluido en `backend/mvnw`.

El frontend actual no declara React Router, Tailwind CSS ni Testing Library como
dependencias. Usa un router hash local, CSS propio y Vitest para sus tests.

## Dirección visual

La interfaz sigue la dirección **Pizarra de Intervalos** definida en `DESIGN.md`:
superficies de papel, acentos naranja, jerarquía tipográfica marcada y contenido
organizado para escanear rápidamente. La experiencia es responsive, mobile-first,
usable mediante teclado y basada en HTML semántico.

## Requisitos

- Node.js y npm para el frontend.
- Java 21 para ejecutar el backend localmente.
- Docker y Docker Compose para MySQL y el backend contenerizado.

## Configuración

Docker Compose lee un archivo `.env` local, que está excluido de Git. Define las
variables siguientes con valores propios y seguros; no copies credenciales reales
en documentación ni en archivos versionados:

```bash
cp .env.example .env
```

Después sustituye los placeholders `change-me` por valores locales aleatorios.

| Variable | Uso |
| --- | --- |
| `MYSQL_DATABASE` | Base creada por el contenedor MySQL. |
| `MYSQL_USER` | Usuario de aplicación creado por MySQL. |
| `MYSQL_PASSWORD` | Contraseña del usuario de aplicación. |
| `MYSQL_ROOT_PASSWORD` | Contraseña administrativa requerida por la imagen MySQL. |
| `DB_URL` | JDBC para ejecutar el backend fuera de Docker. |
| `DB_USER` | Usuario JDBC del backend local. |
| `DB_PASSWORD` | Contraseña JDBC del backend local. |
| `JWT_SECRET` | Secreto JWT de al menos 32 bytes. |
| `JWT_EXPIRATION` | Duración del JWT en milisegundos. |
| `CORS_ALLOWED_ORIGIN` | Origen del navegador permitido por el backend. |
| `VITE_API_URL` | URL base opcional del frontend; por defecto `http://localhost:8080/api`. |

Para un backend dentro de Docker, Compose configura `DB_URL` como
`jdbc:mysql://mysql:3306/wod_explorer`. Para un backend local, MySQL se alcanza
por `jdbc:mysql://localhost:3307/wod_explorer`.

### Rotación de credenciales locales

Si una contraseña, secreto JWT o cualquier otro valor del `.env` se comparte
fuera del entorno local, considéralo expuesto: genera valores nuevos, actualiza
`.env` y reinicia los servicios. No reutilices esos valores en producción ni los
añadas al historial de Git. El archivo `.env.example` solo contiene placeholders
que deben sustituirse.

## Arranque con Docker

Desde la raíz del repositorio, con `.env` configurado:

```bash
docker compose up --build
```

Esto inicia:

- MySQL en `localhost:3307`.
- Backend en `http://localhost:8080`.

El backend espera a que el healthcheck de MySQL confirme que el servidor acepta
conexiones antes de iniciar.

El volumen `mysql_data` conserva los datos. Los scripts de
`Docker/mysql/init/` se ejecutan automáticamente solo al inicializar un volumen
vacío. No uses `docker compose down -v` salvo que quieras borrar explícitamente
los datos locales.

## Arranque del frontend

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

Vite mostrará la URL local, normalmente `http://localhost:5173`. El cliente usa
`http://localhost:8080/api` por defecto. Para otro origen, define `VITE_API_URL`
antes de iniciar Vite.

## Ejecución local del backend

Con MySQL disponible y las variables `DB_URL`, `DB_USER`, `DB_PASSWORD`,
`JWT_SECRET` y `JWT_EXPIRATION` exportadas en el entorno:

```bash
cd backend
./mvnw spring-boot:run
```

Hibernate está configurado con `spring.jpa.hibernate.ddl-auto=none`; el backend
no crea ni modifica automáticamente el esquema.

### Comprobar la salud del backend

El endpoint público no requiere JWT y confirma únicamente que el proceso Spring
Boot está atendiendo peticiones. No comprueba la disponibilidad de MySQL; esa
comprobación pertenece al healthcheck de Docker Compose.

Con el backend local o Docker ejecutándose:

```bash
curl --fail --silent http://localhost:8080/api/health
```

La respuesta esperada es:

```json
{"status":"UP"}
```

En CI puede utilizarse el mismo comando después de iniciar el backend, junto con
`--fail`, para hacer fallar el job si el servicio no responde con éxito.

## Tests backend aislados

La suite backend usa Testcontainers para levantar una instancia MySQL 8.4
efímera con credenciales y base propias de test. No necesita el `.env`, el
contenedor `wod-explorer-db` ni el volumen `mysql_data` del entorno local; Docker
debe estar disponible.

Desde `backend/`:

```bash
./mvnw test
```

Los tests JPA usan rollback transaccional y el contenedor se destruye al terminar
cada clase. El esquema de `backend/src/test/resources/db/test-schema.sql` solo
contiene definiciones compatibles con MySQL y no carga los fixtures de desarrollo
de `Docker/mysql/init/`.

Los fixtures de test son efímeros y sirven únicamente para validar entidades y
repositorios. Los datos de desarrollo viven en el volumen local y los datos de
producción deben gestionarse fuera de este flujo; ningún test debe conectarse a
ellos.

## Comandos de verificación

Frontend, desde `frontend/`:

```bash
npm test
npm run lint
npm run build
```

Backend, desde `backend/`:

```bash
./mvnw validate
./mvnw test
./mvnw package
```

## Funcionalidades disponibles

- Registro y login con JWT.
- Catálogo de WODs con filtros por nombre, tipo y nivel.
- Detalle de WOD con ejercicios asociados.
- Catálogo y detalle de ejercicios.
- Registro y consulta de resultados propios de WODs.
- Registro, consulta y mejor marca de ejercicios.
- Historial autenticado de resultados.
- Estadísticas, marcas personales y evolución.
- Estados de carga, error, vacío y sesión expirada.

Favoritos no están disponibles en la arquitectura actual. La Spec 002 describe
la etapa histórica de favoritos locales y no representa un flujo operativo del
frontend actual.

## Rutas del frontend

El frontend usa `window.location.hash` y un router local; no usa React Router.

| Ruta hash | Vista |
| --- | --- |
| `#/` | Inicio |
| `#/login` | Inicio de sesión |
| `#/register` | Registro |
| `#/wods` | Catálogo de WODs |
| `#/wods/:id` | Detalle de WOD |
| `#/exercises` | Catálogo de ejercicios |
| `#/exercises/:id` | Detalle de ejercicio |
| `#/history` | Historial autenticado |
| `#/statistics` | Estadísticas y evolución |

## API REST actual

Todas las rutas bajo `/api/**` requieren JWT salvo el registro, el login y el
endpoint público de salud.

| Método y ruta | Uso |
| --- | --- |
| `POST /api/users` | Registrar usuario, público. |
| `POST /api/auth/login` | Iniciar sesión, público. |
| `GET /api/health` | Comprobar que el proceso del backend está disponible, público. |
| `GET /api/users/me` | Obtener usuario autenticado. |
| `GET /api/users/me/history` | Obtener historial propio. |
| `GET /api/users/me/statistics` | Obtener estadísticas y marcas personales. |
| `GET /api/users/me/evolution` | Obtener evolución. |
| `GET /api/wods` | Listar WODs con filtros opcionales `name`, `type` y `level`. |
| `GET /api/wods/{id}` | Obtener detalle de WOD. |
| `POST /api/wods/{wodId}/results` | Registrar resultado WOD propio. |
| `GET /api/wods/{wodId}/results` | Listar resultados WOD propios. |
| `GET /api/exercises` | Listar ejercicios. |
| `GET /api/exercises/{id}` | Obtener detalle de ejercicio. |
| `POST /api/exercises/{exerciseId}/results` | Registrar marca propia. |
| `GET /api/exercises/{exerciseId}/results` | Listar marcas propias. |
| `GET /api/exercises/{exerciseId}/results/best` | Obtener mejor marca propia, con `recordType` opcional. |
| `POST /api/exercises` | Crear ejercicio; existe en backend, pero no tiene flujo frontend. |
| `PUT /api/exercises/{id}` | Actualizar ejercicio; existe en backend, pero no tiene flujo frontend. |
| `DELETE /api/exercises/{id}` | Eliminar ejercicio; existe en backend, pero no tiene flujo frontend. |

No existe actualmente `GET /api/health`. Su implementación pertenece a una
Issue posterior.

## Fuente de verdad

- WODs, ejercicios, usuarios y resultados: MySQL mediante el backend.
- Contratos de respuestas frontend: schemas Zod en `frontend/src/api/schemas.ts`.
- Acceso HTTP: `frontend/src/api/client.ts`.
- JWT de sesión: `sessionStorage`, clave `wod-explorer.jwt`.
- JSON históricos descritos por las Specs 001–004: datos de la versión inicial,
  no fuente activa para las funcionalidades migradas.
- `localStorage`: no almacena catálogo, historial, resultados ni estadísticas.

## Estructura

```text
backend/
  src/main/java/com/wodexplorer/
    controller/   Endpoints REST
    service/      Lógica de aplicación
    repository/   Acceso JPA
    entity/       Modelo de persistencia
    dto/          Contratos HTTP
    security/     Filtro JWT y errores de seguridad
frontend/
  src/api/        Cliente HTTP y schemas Zod
  src/auth/       Sesión y contexto de autenticación
  src/app/        Router hash local
  src/pages/      Vistas de la aplicación
  src/components/ Componentes de interfaz
  src/index.css   Estilos responsive y dirección visual
Docker/mysql/init/ Scripts de inicialización MySQL
specs/            Specs funcionales e históricas
```

Las Specs 001–004 documentan etapas previas basadas en JSON y `localStorage`.
Sus requisitos se conservan como historial; la arquitectura operativa actual se
describe en este README y en `PRODUCT.md`.
