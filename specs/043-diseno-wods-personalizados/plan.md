# Plan - Issue #43: Diseno de WODs personalizados por usuario

## Proposito

Este plan produce un contrato verificable para dividir la feature de WODs
personalizados en implementaciones independientes. No incluye cambios de codigo
ni de base de datos porque la Issue #43 es de diseno.

## Secuencia de trabajo

1. Auditar el dominio actual, las entidades, repositories, servicios, API,
   seguridad, frontend, specs de resultados y sistema visual.
2. Auditar MySQL en modo read-only y registrar tablas, FKs, datos existentes y
   limitaciones de `wod_exercises.reps`.
3. Fijar la identidad del recurso: `owner_id` nullable en `wods`, WOD global
   cuando sea nulo y WOD personalizado cuando tenga usuario.
4. Definir categoria separada de `WodType`, reglas de nombre, nivel, rondas,
   time limit y compatibilidad entre estructuras y mediciones.
5. Definir la relacion ordenada `wod_exercises` y la tabla normalizada de
   prescripciones con valores, unidades, `unitLabel`, cardinalidad, FKs e
   indices.
6. Definir los endpoints autenticados bajo `/api/user-wods`, DTOs, paginacion,
   respuestas, errores y aislamiento de ownership.
7. Definir como los endpoints actuales de resultados aplicaran ownership a WODs
   personalizados sin cambiar en esta Issue el contrato de resultados.
8. Definir la migracion versionada futura, la compatibilidad legacy y la
   prohibicion de doble escritura o de inventar datos.
9. Definir el contrato frontend para listado, formulario, detalle, estados,
   navegacion, accesibilidad, responsive y validacion Zod.
10. Dividir la implementacion en #44-#49, asignando persistencia, API y
    superficies frontend sin solapar fuentes de verdad.
11. Revisar trazabilidad entre Issue #43, este SDD, la constitucion, AGENTS.md y
    las specs 016-021 y 038.

## Arquitectura de implementacion futura

### Persistencia

- Crear una migracion SQL versionada para `owner_id`, categoria y
  `wod_exercise_prescriptions`.
- Mantener `ddl-auto=none` y verificar `SHOW TABLES`, `DESCRIBE`, FKs y una
  consulta funcional despues de migrar.
- Usar `ON DELETE CASCADE` solo para hijos cuyo ciclo de vida dependa del WOD;
  mantener `exercise_id ON DELETE RESTRICT`.
- Mantener `wod_exercises.reps` como compatibilidad read-only hasta que todos
  los consumidores migren, sin doble escritura.

### Backend

- Mantener `Controller -> Service -> Repository -> MySQL`.
- Usar DTOs record con Jakarta Validation en los limites HTTP.
- Resolver el usuario por el email normalizado del `Authentication`.
- Filtrar cada consulta propia por `owner_id` en el repository o por una
  consulta que combine ID y propietario.
- Aplicar reglas por tipo y medicion en el service.
- Usar `@Transactional` para escrituras y `readOnly = true` para lecturas.
- Cargar ejercicios con consultas intencionales y orden explicito.
- Centralizar errores en `GlobalExceptionHandler`.

### Frontend

- Extender el cliente API y schemas Zod sin URLs alternativas ni datos locales.
- Mantener el router hash actual y los estados de autenticacion existentes.
- Reutilizar componentes y logica solo cuando reduzca duplicacion real.
- Mantener estado local para formularios y seguir `DESIGN.md`, semantica,
  teclado, foco visible, wrapping y targets tactiles.
- Cubrir comportamiento observable con la infraestructura Vitest existente.

## Dependencias y orden posterior

```text
#43 contrato
  -> #44 persistencia
  -> #45 API
  -> #46 crear WOD
  -> #47 Mis WODs
  -> #48 editar WOD
  -> #49 eliminar WOD
```

La implementacion de #45 debe usar el namespace resuelto en este SDD:
`/api/user-wods`. Las Issues #46-#49 no deben inventar endpoints ni campos que
no esten definidos en este contrato.

## Riesgos controlados

- **Datos legacy incompletos:** no se fabrican magnitudes; se mantiene una fase
  de compatibilidad y se prohibe promocionar datos incompletos a personalizados.
- **Enumeracion de ownership:** los recursos ajenos se tratan como no
  disponibles y las consultas siempre incluyen el usuario autenticado.
- **N+1 en detalle:** los ejercicios se cargan con una consulta ordenada o una
  proyeccion intencional dentro de la transaccion.
- **Dos fuentes de verdad:** la API nueva escribe prescripciones normalizadas;
  `reps` solo permanece read-only durante la transicion.
- **Resultados existentes:** los resultados se conservan vinculados por FK y la
  politica destructiva de eliminacion se decide en #49 con evidencia del modelo.
- **Deriva de contratos:** cambios de rutas o cardinalidades requieren actualizar
  primero este contrato y revisar las Issues dependientes.

## Verificacion del SDD

Antes de considerar la Issue completa se comprobara:

- los tres archivos SDD existen y no estan vacios;
- `spec.md` cubre objetivo, alcance, decisiones y criterios de aceptacion;
- `plan.md` es compatible con la arquitectura existente;
- `tasks.md` contiene tareas documentales ejecutables;
- no quedan contradicciones funcionales sin resolver;
- el diff solo contiene los tres artefactos de `specs/043-diseno-wods-personalizados/`;
- `git diff --check` pasa;
- no se modifica codigo, esquema, dependencias ni datos.
