# Plan — Issue #27

## Enfoque

Implementar la autorización en la cadena de seguridad existente, sin mover
lógica de negocio al controller ni modificar el contrato de ejercicios.

## Secuencia

1. Añadir `ADMIN_EMAILS` a la configuración externa del backend y al entorno de
   Docker, manteniendo el valor vacío como comportamiento seguro por defecto.
2. Crear un componente pequeño que normalice la allowlist y resuelva las
   authorities del subject autenticado.
3. Adaptar `JwtAuthenticationFilter` para conservar el subject actual y añadir
   `ROLE_ADMIN` únicamente cuando la resolución server-side lo indique.
4. Añadir a `SecurityConfig` reglas explícitas para POST, PUT y DELETE de
   `/api/exercises`; dejar GET y las rutas públicas actuales en sus reglas
   existentes.
5. Reutilizar `RestAuthenticationEntryPoint` y `RestAccessDeniedHandler` sin
   crear contratos paralelos.
6. Ampliar los tests HTTP existentes para cubrir usuario normal, administrador,
   usuario no autenticado, lecturas y endpoints públicos. Los servicios se
   simularán para verificar que la autorización ocurre antes del controller.
7. Revisar que `User`, DTOs, `ExerciseService` y el esquema MySQL no cambian
   innecesariamente.

## Archivos previstos

- `backend/src/main/java/com/wodexplorer/security/AdminAuthorizationService.java`;
- `backend/src/main/java/com/wodexplorer/security/JwtAuthenticationFilter.java`;
- `backend/src/main/java/com/wodexplorer/config/SecurityConfig.java`;
- `backend/src/main/resources/application.properties`;
- `.env.example`;
- `docker-compose.yml`;
- `backend/src/test/java/com/wodexplorer/security/SecurityHttpTest.java`;
- `specs/027-admin-catalog-authorization/`.

## Verificación

Desde `backend/` se ejecutarán `./mvnw validate`, `./mvnw test` y
`./mvnw package`. También se revisarán `git diff --check`, secretos, el estado
Git y que los scripts/esquema MySQL no hayan sido modificados.

## Límites

No se añadirán dependencias, migraciones, entidades de rol, endpoints nuevos,
panel frontend ni operaciones de escritura para WODs.
