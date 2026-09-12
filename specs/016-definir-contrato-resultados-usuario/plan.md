# Plan técnico - Spec 016

## Objetivo

Documentar un contrato cerrado para resultados de WODs y ejercicios que permita
implementar #17 y #18 sin reinterpretar el esquema MySQL ni el historial legacy
del frontend.

Esta fase solo produce documentación. No modifica código ni base de datos.

## Fase 1 - Auditoría

Revisar:

- `AGENTS.md`, `backend/AGENTS.md` y `Docker/mysql/AGENTS.md`.
- Issue #16.
- Specs 003, 005, 007, 011 y las plantillas posteriores de resultados.
- Entidades y seguridad actuales del backend.
- DDL real de `wod_results` y `exercise_results` mediante `wodsql`.
- Conteos, índices, foreign keys y reglas `ON DELETE`.

Registrar como evidencia que ambas tablas están vacías actualmente y que el
esquema ya contiene las columnas necesarias para métricas estructuradas.

## Fase 2 - Resolver la discrepancia frontend/backend

Adoptar estas reglas:

- La Spec 003 es un historial local, anónimo y textual.
- Los resultados backend pertenecen a un usuario autenticado.
- La API backend no aceptará `result` textual ni `notes` como sustituto de las
  métricas MySQL.
- Una futura migración de historial requerirá una spec propia.

## Fase 3 - Contrato de WOD results

Documentar:

- Recurso `/api/wods/{wodId}/results`.
- Campos de request y response.
- `wodId` solo en path.
- `level` obligatorio.
- Fecha opcional y no futura.
- Validación dependiente de `WodType`:
  - `FOR_TIME` usa `timeSeconds`.
  - `AMRAP` usa `rounds` y `reps`.
  - `EMOM` usa `reps` como puntuación total.
- Orden de colecciones por fecha descendente e ID descendente.

## Fase 4 - Contrato de Exercise results

Documentar:

- Recurso `/api/exercises/{exerciseId}/results`.
- Campos de request y response.
- `exerciseId` solo en path.
- `DECIMAL(8,2)` y límites de precisión.
- Compatibilidad cerrada entre `recordType` y `unit`.
- Tratamiento explícito de `METERS`, que queda reservado.
- Fecha opcional y no futura.
- Orden de colecciones por fecha descendente e ID descendente.

## Fase 5 - Identidad y seguridad

Definir para las implementaciones futuras:

1. El endpoint sigue bajo `/api/**` y requiere JWT.
2. El subject del JWT es el email normalizado.
3. El servicio resuelve el `User` mediante `UserRepository`.
4. El `userId` nunca se lee del path ni del body.
5. Un subject sin usuario resoluble no puede acceder al recurso de resultados.
6. No se modifica `SecurityConfig` en esta issue.

## Fase 6 - Persistencia futura

Las issues de implementación deberán crear, cuando corresponda:

- `WodResult` para `wod_results`.
- `ExerciseResult` para `exercise_results`.
- DTOs específicos de request y response.
- Repositories con consultas acotadas al usuario actual.
- Validación de reglas cruzadas en el service.

No deberán:

- usar entidades como contratos REST;
- confiar en `userId` del cliente;
- introducir cascadas JPA innecesarias;
- modificar `wod_results` ni `exercise_results` sin una spec nueva;
- usar resultados textuales como sustituto de las columnas existentes.

## Fase 7 - Validación futura

Las issues #17 y #18 deberán cubrir como mínimo:

- usuario autenticado correcto;
- usuario de otro resultado no visible;
- WOD o Exercise inexistente;
- métricas válidas e inválidas;
- combinaciones incompatibles;
- fechas inválidas y futuras;
- respuesta sin `userId`;
- orden estable de colecciones;
- múltiples resultados del mismo recurso;
- integridad referencial;
- DTOs sin exposición de entidades;
- errores HTTP consistentes.

## Decisión de esquema

El esquema actual es suficiente para el contrato aprobado. No se propone ningún
SQL ni migración.

La ausencia de constraints para reglas cruzadas no requiere cambios de esquema:
esas reglas pertenecen al dominio y se validarán en la aplicación.

Una futura necesidad de notas, resultados libres o unidades de distancia deberá
presentarse como cambio explícito de contrato y esquema.

## Verificación de esta issue

- Confirmar que `spec.md`, `plan.md` y `tasks.md` no contienen endpoints
  implementados.
- Confirmar que no se modificó Java, TypeScript ni SQL.
- Confirmar que las consultas MySQL fueron read-only.
- Revisar `git diff` y `git status`.
- No ejecutar tests de implementación porque no se añade código.
- No cerrar automáticamente Issues posteriores #17 o #18.
