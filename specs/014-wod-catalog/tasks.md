# Tasks — Spec 014 WOD Catalog and Detail

## T1 — Auditar estado actual

- [x] Leer `AGENTS.md`.
- [x] Leer `backend/AGENTS.md`.
- [x] Leer Spec 014.
- [x] Leer Plan 014.
- [x] Consultar Issue #14 mediante delfohub.
- [x] Revisar arquitectura de Exercise.
- [x] Revisar manejo global de errores.
- [x] Revisar configuración Spring Security.
- [x] Revisar tests existentes.

---

## T2 — Verificar esquema MySQL

Usando wodsql en modo lectura:

- [x] Consultar estructura de `wods`.
- [x] Verificar primary key.
- [x] Verificar AUTO_INCREMENT.
- [x] Verificar columnas.
- [x] Verificar nulabilidad.
- [x] Verificar enum `type`.
- [x] Verificar enum `level`.
- [x] Verificar default de `created_at`.
- [x] Consultar registros de ejemplo.
- [x] Confirmar que no existen discrepancias bloqueantes con Spec 014.

No modificar MySQL.

---

## T3 — Crear enums WOD

- [x] Crear enum para tipo de WOD.
- [x] Incluir `FOR_TIME`.
- [x] Incluir `AMRAP`.
- [x] Incluir `EMOM`.
- [x] Crear enum para nivel.
- [x] Incluir `BEGINNER`.
- [x] Incluir `INTERMEDIATE`.
- [x] Incluir `RX`.
- [x] Mantener convenciones del proyecto.

---

## T4 — Crear entidad Wod

- [x] Crear `Wod`.
- [x] Mapear tabla `wods`.
- [x] Mapear `id`.
- [x] Mapear `name`.
- [x] Mapear `type`.
- [x] Mapear `time_limit`.
- [x] Mapear `rounds`.
- [x] Mapear `level`.
- [x] Mapear `created_at`.
- [x] Utilizar `EnumType.STRING`.
- [x] Respetar nulabilidad.
- [x] No mapear todavía `wod_exercises`.

---

## T5 — Crear WodRepository

- [x] Crear `WodRepository`.
- [x] Permitir catálogo completo.
- [x] Permitir búsqueda por id.
- [x] Implementar soporte necesario para filtros.
- [x] Evitar métodos redundantes.
- [x] Evitar explosión de combinaciones de queries.

---

## T6 — Implementar filtros

- [x] Implementar filtro opcional por `name`.
- [x] Implementar filtro opcional por `type`.
- [x] Implementar filtro opcional por `level`.
- [x] Permitir filtros individuales.
- [x] Permitir filtros combinados.
- [x] Permitir consulta sin filtros.
- [x] Mantener implementación simple y mantenible.

---

## T7 — Crear DTO de catálogo

- [x] Crear DTO para catálogo.
- [x] Incluir `id`.
- [x] Incluir `name`.
- [x] Incluir `type`.
- [x] Incluir `level`.
- [x] Evaluar inclusión de `timeLimit`.
- [x] Evaluar inclusión de `rounds`.
- [x] No exponer entidad JPA.

---

## T8 — Crear DTO de detalle

- [x] Crear DTO de detalle.
- [x] Incluir `id`.
- [x] Incluir `name`.
- [x] Incluir `type`.
- [x] Incluir `timeLimit`.
- [x] Incluir `rounds`.
- [x] Incluir `level`.
- [x] Incluir `createdAt`.
- [x] No incluir ejercicios todavía.

---

## T9 — Crear WodService

- [x] Crear `WodService`.
- [x] Implementar consulta de catálogo.
- [x] Implementar aplicación de filtros.
- [x] Implementar consulta por id.
- [x] Convertir entidades a DTO.
- [x] Mantener lógica HTTP fuera del service.
- [x] Mantener acceso repository fuera del controller.

---

## T10 — Gestionar WOD inexistente

- [x] Revisar excepciones existentes.
- [x] Reutilizar patrón actual cuando sea apropiado.
- [x] Implementar comportamiento para WOD inexistente.
- [x] Devolver `404 Not Found`.
- [x] Mantener formato global de errores.
- [x] No exponer detalles internos.

---

## T11 — Crear WodController

- [x] Crear `WodController`.
- [x] Configurar `/api/wods`.
- [x] Implementar `GET /api/wods`.
- [x] Implementar `GET /api/wods/{id}`.
- [x] Recibir filtros opcionales.
- [x] Delegar lógica al service.
- [x] Devolver DTOs.
- [x] No acceder directamente al repository.

---

## T12 — Verificar seguridad

- [x] Confirmar que `/api/wods` queda protegido por configuración existente.
- [x] Confirmar que `/api/wods/{id}` queda protegido.
- [x] Verificar sin JWT → `401`.
- [x] Verificar JWT válido → acceso permitido.
- [x] No modificar reglas de autenticación.
- [x] No hacer público el catálogo en esta spec.

---

## T13 — Tests de WodService

- [x] Test de catálogo completo.
- [x] Test de filtro por nombre.
- [x] Test de filtro por tipo.
- [x] Test de filtro por nivel.
- [x] Test de filtros combinados.
- [x] Test de detalle existente.
- [x] Test de WOD inexistente.
- [x] Evitar tests duplicados.

---

## T14 — Tests HTTP

- [x] Test `GET /api/wods`.
- [x] Test `GET /api/wods/{id}`.
- [x] Test filtro `name`.
- [x] Test filtro `type`.
- [x] Test filtro `level`.
- [x] Test combinación de filtros.
- [x] Test WOD inexistente → `404`.
- [x] Test parámetro inválido cuando corresponda.
- [x] Test sin JWT → `401`.
- [x] Test con JWT válido → acceso permitido.
- [x] Verificar serialización de DTOs.

---

## T15 — Tests de persistencia

- [x] Evaluar si las queries personalizadas necesitan test de persistencia.
- [x] Añadir test únicamente cuando aporte cobertura real: no se añadió un test de repository aislado porque el proyecto no dispone de una base de test independiente; la consulta se verificó contra MySQL mediante HTTP.
- [x] Verificar mapping de enums cuando sea necesario.
- [x] No depender del volumen MySQL local para tests automatizados.

---

## T16 — Verificación con MySQL real

Usando el entorno local:

- [x] Levantar MySQL si es necesario.
- [x] Levantar backend.
- [ ] Obtener JWT mediante login.
- [x] Consultar `GET /api/wods`.
- [x] Consultar un WOD existente.
- [x] Probar filtro por nombre.
- [x] Probar filtro por tipo.
- [x] Probar filtro por nivel.
- [x] Confirmar respuestas correctas.

---

## T17 — Verificación Maven

Desde `backend/`:

- [x] Ejecutar `./mvnw validate`.
- [x] Confirmar BUILD SUCCESS.
- [x] Ejecutar `./mvnw test`.
- [x] Confirmar 0 failures.
- [x] Confirmar 0 errors.
- [x] Ejecutar `./mvnw package`.
- [x] Confirmar BUILD SUCCESS.

---

## T18 — Verificar MySQL intacto

Con wodsql:

- [x] Confirmar tabla `wods`.
- [x] Confirmar columnas originales.
- [x] Confirmar esquema intacto.
- [x] Confirmar que no se realizaron migraciones.
- [x] Confirmar que no se realizaron ALTER.
- [x] Confirmar que no se eliminaron datos.

---

## T19 — Revisar alcance

Confirmar que NO se implementó:

- [x] POST `/api/wods`.
- [x] PUT `/api/wods/{id}`.
- [x] DELETE `/api/wods/{id}`.
- [x] Relación WOD ↔ Exercises.
- [x] Resultados de WOD.
- [x] Resultados de ejercicios.
- [x] Historial.
- [x] Estadísticas.
- [x] Cambios frontend.
- [x] Roles.
- [x] Cambios JWT.
- [x] Cambios de esquema MySQL.

---

## T20 — Revisión Git

- [x] Ejecutar `git status`.
- [x] Ejecutar `git diff`.
- [x] Confirmar que los cambios pertenecen a Spec 014.
- [x] Confirmar que `.env` no está incluido.
- [x] Confirmar que no hay secretos.
- [x] Confirmar que no hay tokens.
- [ ] Confirmar que no existen cambios ajenos: el worktree ya contenía los directorios no modificados `specs/015/` a `specs/021/`.

---

## T21 — Finalización

- [x] Actualizar `tasks.md`.
- [x] Marcar únicamente tareas verificadas.
- [x] Documentar clases creadas.
- [x] Documentar endpoints implementados.
- [x] Documentar tests añadidos.
- [x] Documentar número total de tests.
- [x] Confirmar Maven validate/test/package.
- [x] Confirmar MySQL sin cambios.
- [x] Preparar resumen para Issue #14.
- [x] Mantener Issue #14 abierta hasta revisión final.
- [x] No hacer commit.
- [x] No hacer push.
- [x] No hacer merge.
