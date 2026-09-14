# Plan de implementación - Issue #28

## Base y decisiones

La rama parte de `feat/027-admin-catalog-authorization` porque `main` todavía
no contiene todas las dependencias de frontend y documentación necesarias.
La implementación conserva Java 21, Spring Boot, Spring Data JPA, MySQL 8.4,
React, TypeScript, Zod y el router hash existente. No se añadirán dependencias.

## Backend

1. Introducir un DTO genérico de respuesta paginada con contenido y metadatos
   explícitos (`items`, `page`, `size`, `totalElements`, `totalPages`,
   `hasNext`).
2. Añadir validación compartida para `page` y `size`, con defaults 0/20 y máximo
   100, devolviendo el error HTTP global para parámetros inválidos.
3. Cambiar `WodRepository` y `ExerciseRepository` a consultas paginadas,
   conservando filtros y orden `id ASC`; añadir búsqueda server-side de nombre
   de ejercicio.
4. Cambiar `WodService`, `ExerciseService` y sus controllers para construir el
   `Pageable`, mapear DTOs y devolver el envoltorio sin exponer `Page`.
5. Cambiar `WodResultRepository` y `ExerciseResultRepository` para recibir
   `Pageable` filtrado por `userId` y con orden temporal estable. Adaptar
   `UserHistoryService`, `UserController` y el DTO de historial para devolver
   ambos envoltorios de forma independiente dentro de una transacción read-only.
6. Añadir tests de repository/service/controller para páginas, filtros, límites,
   ordenación, páginas vacías, ownership y respuestas `400`, evitando duplicar
   cobertura no afectada.

## Frontend

7. Añadir schemas Zod y tipos derivados para las respuestas paginadas de
   catálogos e historial; actualizar el cliente para serializar `page`, `size` y
   filtros sin inventar endpoints.
8. Actualizar `WodsPage`, `ExercisesPage` y `HistoryPage` con estado de página,
   reinicio al cambiar filtros y controles anterior/siguiente accesibles,
   conservando los estados visuales existentes.
9. Añadir tests de cliente y comportamiento de navegación/contrato donde la
   infraestructura actual lo permita.

## Base de datos y evidencia

10. Inspeccionar esquema, cardinalidades e índices con `wodsql` y ejecutar
    `EXPLAIN` para catálogo filtrado y las dos consultas de historial. No
    modificar tablas ni índices salvo que la evidencia lo justifique y exista
    una forma versionada compatible con el proyecto.

## Verificación y entrega

11. Ejecutar verificaciones backend desde `backend/`: `./mvnw validate`,
    `./mvnw test` y `./mvnw package`.
12. Ejecutar verificaciones frontend desde `frontend/`: `npm test`,
    `npm run lint` y `npm run build`; revisar TypeScript, responsive y
    accesibilidad básica.
13. Revisar `git diff`, `git status` y `git diff --check`; commitear únicamente
    los archivos de la Issue #28 y documentar el hash en GitHub sin hacer push ni
    cerrar la Issue.
