# Plan — Spec 014 WOD Catalog and Detail

## 1. Objetivo

Implementar la capa de dominio y consulta de WODs sobre la tabla MySQL existente.

La implementación debe proporcionar:

- Entidad Wod.
- Enums.
- Repository.
- Service.
- DTOs.
- Controller.
- Catálogo.
- Detalle.
- Filtros.
- Tests.

No implementar todavía la relación WOD ↔ Exercises.

---

## 2. Auditoría previa

Antes de modificar código:

1. Leer `AGENTS.md`.
2. Leer `backend/AGENTS.md`.
3. Leer `specs/014-wod-catalog/spec.md`.
4. Leer `specs/014-wod-catalog/tasks.md`.
5. Consultar Issue #14 mediante delfohub.
6. Revisar arquitectura existente de Exercise.
7. Revisar manejo global de errores.
8. Revisar configuración Spring Security.
9. Revisar tests existentes.
10. Consultar mediante wodsql el esquema real de `wods`.

No implementar hasta confirmar el esquema.

---

## 3. Verificación MySQL

Usar wodsql en modo lectura para verificar:

- columnas.
- tipos.
- nulabilidad.
- primary key.
- AUTO_INCREMENT.
- enums.
- default de `created_at`.

También consultar algunos registros reales.

No realizar:

- INSERT.
- UPDATE.
- DELETE.
- ALTER.
- DROP.
- CREATE.

Documentar cualquier diferencia entre la Spec 014 y el esquema real antes de continuar.

---

## 4. Revisar patrón Exercise

Antes de crear nuevas clases, revisar:

- `Exercise`.
- `ExerciseRepository`.
- `ExerciseService`.
- `ExerciseController`.
- DTOs existentes.
- tests correspondientes.

Utilizar estos componentes como referencia arquitectónica cuando sean adecuados.

No copiar decisiones incorrectas únicamente por consistencia.

---

## 5. Entidad Wod

Crear `Wod` dentro del paquete de entidades existente.

Mapear:

- `id`.
- `name`.
- `type`.
- `timeLimit`.
- `rounds`.
- `level`.
- `createdAt`.

Utilizar las anotaciones JPA mínimas necesarias.

No mapear todavía `wod_exercises`.

---

## 6. Enums

Crear los enums necesarios para:

### WodType

- FOR_TIME.
- AMRAP.
- EMOM.

### WodLevel

- BEGINNER.
- INTERMEDIATE.
- RX.

Persistir mediante `EnumType.STRING`.

Los nombres definitivos deben seguir las convenciones actuales del proyecto.

---

## 7. Repository

Crear:

`WodRepository`

extendiendo la abstracción Spring Data JPA apropiada.

Debe permitir:

- `findAll`.
- `findById`.
- consultas necesarias para filtros.

Antes de implementar múltiples métodos derivados, evaluar una estrategia sencilla que permita combinar filtros sin explosión combinatoria.

No introducir complejidad innecesaria.

---

## 8. Estrategia de filtros

Los filtros soportados serán:

- name.
- type.
- level.

Deben poder utilizarse:

- individualmente.
- combinados.
- sin filtros.

Elegir una implementación sencilla y mantenible compatible con Spring Data JPA.

Evitar crear un método repository para cada posible combinación si existe una solución más limpia.

No añadir librerías externas innecesarias.

---

## 9. DTOs

Crear DTOs específicos para el contrato REST.

Como mínimo evaluar:

- `WodSummaryResponse`.
- `WodDetailResponse`.

El catálogo debe devolver únicamente los datos necesarios.

El detalle puede devolver todos los campos propios del WOD.

No incluir ejercicios todavía.

No devolver entidades JPA directamente.

---

## 10. Service

Crear:

`WodService`

Responsabilidades:

- Obtener catálogo.
- Aplicar filtros.
- Obtener WOD por id.
- Gestionar WOD inexistente.
- Convertir entidades a DTOs.

No incluir lógica HTTP.

No acceder directamente a HttpServletRequest/Response.

---

## 11. WOD inexistente

Reutilizar el patrón de excepciones existente cuando sea adecuado.

Si el proyecto dispone de una excepción genérica apropiada, reutilizarla.

Si necesita una excepción específica de WOD, crear únicamente la mínima necesaria.

El resultado HTTP debe ser:

`404 Not Found`

y mantener el formato global de errores del backend.

---

## 12. Controller

Crear:

`WodController`

Base path:

`/api/wods`

Implementar:

### Catálogo

`GET /api/wods`

Query parameters opcionales:

- `name`.
- `type`.
- `level`.

### Detalle

`GET /api/wods/{id}`

El controller debe:

- recibir parámetros.
- delegar al service.
- devolver DTOs.

No debe contener lógica JPA.

---

## 13. Spring Security

No modificar `SecurityConfig` salvo que exista una necesidad técnica real.

Los endpoints nuevos deben quedar cubiertos por:

`/api/**`

y, por tanto, requerir JWT según la configuración actual.

Verificar mediante tests que:

- sin JWT → 401.
- con JWT válido → acceso permitido.

No cambiar el catálogo a público en esta spec.

---

## 14. Tests de entidad/repository

Añadir tests de persistencia únicamente cuando aporten valor real para verificar:

- mapping.
- enums.
- filtros/query.

No duplicar comportamiento que Spring Data garantiza directamente sin lógica adicional.

---

## 15. Tests de Service

Cubrir como mínimo:

- catálogo completo.
- filtro por nombre.
- filtro por tipo.
- filtro por nivel.
- combinación de filtros.
- detalle existente.
- WOD inexistente.

Utilizar Mockito cuando el objetivo sea aislar el service.

---

## 16. Tests HTTP

Utilizar MockMvc para verificar:

- GET `/api/wods`.
- GET `/api/wods/{id}`.
- query parameters.
- serialización DTO.
- 404.
- errores de parámetros.
- autenticación.

Reutilizar infraestructura JWT de testing existente.

---

## 17. Datos reales

Después de pasar tests automatizados, verificar contra el MySQL local existente.

Utilizar únicamente consultas de lectura.

Comprobar que los WODs reales almacenados pueden ser recuperados correctamente por la API.

---

## 18. Verificación manual

Con backend y MySQL activos verificar:

`GET /api/wods`

con JWT válido.

Después:

`GET /api/wods/{id}`

utilizando un id existente.

Verificar también filtros como:

`GET /api/wods?type=FOR_TIME`

y:

`GET /api/wods?level=RX`

No utilizar datos sensibles en logs.

---

## 19. Verificación Maven

Desde `backend/` ejecutar:

`./mvnw validate`

Después:

`./mvnw test`

Debe terminar con:

- 0 failures.
- 0 errors.

Finalmente:

`./mvnw package`

Debe finalizar correctamente.

---

## 20. Revisión MySQL

Después de la implementación utilizar wodsql para confirmar:

- tabla `wods` intacta.
- columnas intactas.
- número de registros coherente.
- ninguna modificación de esquema.

---

## 21. Revisión de alcance

Confirmar que no se ha implementado:

- POST WOD.
- PUT WOD.
- DELETE WOD.
- WOD ↔ Exercises.
- wod_results.
- exercise_results.
- historial.
- estadísticas.
- frontend.
- cambios JWT.
- roles.
- cambios de esquema.

---

## 22. Revisión Git

Ejecutar:

`git status`

y:

`git diff`

Confirmar que todos los cambios pertenecen a Spec 014.

No incluir:

- `.env`.
- tokens.
- secretos.
- archivos locales.
- cambios no relacionados.

---

## 23. Finalización

Cuando todo esté verificado:

1. Actualizar `tasks.md`.
2. Marcar únicamente tareas realmente completadas.
3. Documentar clases creadas.
4. Documentar endpoints implementados.
5. Documentar tests añadidos.
6. Indicar número total de tests.
7. Confirmar Maven validate/test/package.
8. Confirmar que MySQL no cambió.
9. Preparar resumen para Issue #14.

No cerrar automáticamente Issue #14.

No hacer commit.

No hacer push.

No hacer merge.