# Plan — Spec 015 WOD ↔ Exercises

## 1. Objetivo

Modelar la tabla existente:

`wod_exercises`

y utilizarla para enriquecer el detalle de un WOD con sus ejercicios asociados.

La implementación debe conservar el modelo MySQL existente y evitar complejidad JPA innecesaria.

---

## 2. Auditoría previa

Antes de implementar:

1. Leer `AGENTS.md`.

2. Leer `backend/AGENTS.md`.

3. Leer Spec 015.

4. Leer Plan 015.

5. Leer Tasks 015.

6. Consultar Issue #15 mediante delfohub.

7. Revisar implementación final de Spec 014.

8. Revisar `Wod`.

9. Revisar `Exercise`.

10. Revisar repositories.

11. Revisar services.

12. Revisar DTOs.

13. Revisar tests actuales.

No modificar código durante la fase de auditoría.

---

## 3. Verificación MySQL

Usar wodsql únicamente en modo lectura.

Verificar:

- estructura de `wod_exercises`.

- primary key.

- AUTO_INCREMENT.

- `wod_id`.

- `exercise_id`.

- `reps`.

- `position`.

- nulabilidad.

- foreign keys.

- ON DELETE de ambas relaciones.

- índices existentes.

Consultar además asociaciones reales.

Verificar al menos un WOD con varios ejercicios y comprobar el orden real mediante `position`.

No realizar operaciones de escritura.

---

## 4. Analizar modelo JPA

Evaluar la estrategia mínima necesaria para representar la tabla.

La opción preferente es una entidad de asociación:

`WodExercise`

con relaciones:

- ManyToOne → Wod.

- ManyToOne → Exercise.

No utilizar `@ManyToMany`, dado que existen atributos propios en la relación.

---

## 5. Evitar relaciones bidireccionales innecesarias

No añadir automáticamente:

`Wod → List<WodExercise>`

ni:

`Exercise → List<WodExercise>`

si no son necesarias.

Evaluar si el detalle puede resolverse de forma más explícita mediante:

`WodExerciseRepository`

consultado desde:

`WodService`

Esta estrategia debe preferirse si reduce:

- complejidad.

- riesgo de N+1.

- ciclos.

- serialización accidental.

- cascadas no deseadas.

---

## 6. Crear WodExercise

Mapear:

- id.

- wod.

- exercise.

- reps.

- position.

Respetar:

- nombres SQL.

- nulabilidad.

- generación del id.

- foreign keys existentes.

No añadir cascadas de escritura sin justificación.

---

## 7. Repository

Crear:

`WodExerciseRepository`

Debe permitir recuperar asociaciones por WOD ordenadas por:

`position ASC`

Evaluar si conviene utilizar:

- método derivado de Spring Data;

- JPQL explícito;

- fetch join.

La solución elegida debe minimizar queries innecesarias y evitar N+1.

---

## 8. Estrategia de carga de Exercise

Analizar cómo recuperar la información de Exercise necesaria para el DTO.

Si acceder a `WodExercise.exercise` genera N+1, utilizar una query apropiada que cargue las asociaciones necesarias de forma controlada.

No convertir relaciones globales a `EAGER` como solución rápida.

---

## 9. DTO de ejercicio dentro de WOD

Crear un DTO específico para representar un ejercicio dentro del detalle del WOD.

Nombre recomendado:

`WodExerciseResponse`

Debe incluir como mínimo:

- id.

- name.

- category.

- measurementType.

- reps.

- position.

No reutilizar automáticamente un DTO existente si su semántica no corresponde al contrato.

---

## 10. Ampliar WodDetailResponse

Modificar el DTO existente de Spec 014 para incorporar:

`exercises`

Debe ser una colección de `WodExerciseResponse`.

Para WOD sin ejercicios:

`exercises = []`

Nunca:

`null`

---

## 11. Modificar WodService

Mantener la obtención del WOD mediante el mecanismo actual.

Después recuperar las asociaciones mediante `WodExerciseRepository`.

Transformar cada asociación a DTO.

Preservar el orden por `position`.

Construir `WodDetailResponse` completo.

No introducir lógica de persistencia en Controller.

---

## 12. WodController

Idealmente no debe necesitar cambios estructurales.

`GET /api/wods/{id}`

debe mantener la misma ruta y delegación.

El cambio debe producirse en el DTO retornado por Service.

Modificar Controller únicamente si el contrato actual lo exige técnicamente.

---

## 13. WOD inexistente

Mantener:

`404 Not Found`

sin consultar asociaciones innecesariamente cuando el WOD no existe.

Reutilizar:

`WodNotFoundException`

y el manejo global existente.

---

## 14. WOD sin asociaciones

Si el WOD existe pero repository devuelve cero asociaciones:

- devolver `200`.

- devolver `exercises: []`.

No tratarlo como error.

---

## 15. Compatibilidad con catálogo

Verificar que:

`GET /api/wods`

continúa devolviendo el mismo contrato definido en Spec 014.

No añadir todos los ejercicios al catálogo.

Los ejercicios asociados pertenecen únicamente al detalle.

---

## 16. Compatibilidad con Exercise

Ejecutar los tests existentes de Exercise.

No modificar su contrato REST.

Si fuera necesario modificar `Exercise`, justificarlo expresamente antes de hacerlo.

---

## 17. Seguridad

No modificar `SecurityConfig`.

Reutilizar la cobertura existente cuando sea suficiente.

Añadir tests nuevos de seguridad únicamente si el nuevo comportamiento introduce una ruta o comportamiento no cubierto.

---

## 18. Tests de Service

Cubrir:

- detalle con ejercicios.

- múltiples ejercicios.

- orden por position.

- reps con valor.

- reps null.

- WOD sin ejercicios.

- WOD inexistente.

- transformación correcta a DTO.

- ausencia de duplicados.

Evitar duplicar tests de Spec 014 que no cambian.

---

## 19. Tests HTTP

Con MockMvc verificar:

- detalle contiene `exercises`.

- estructura JSON correcta.

- orden.

- reps.

- position.

- WOD sin ejercicios → array vacío.

- WOD inexistente → 404.

Reutilizar tests de autenticación existentes.

---

## 20. Tests de persistencia

Evaluar si la query de `WodExerciseRepository` necesita cobertura de persistencia.

Si se utiliza JPQL/fetch join/orden explícito, un test de persistencia puede aportar valor.

No añadir infraestructura pesada únicamente para cumplir formalmente esta sección.

---

## 21. Verificación Maven

Desde `backend/` ejecutar:

`./mvnw validate`

`./mvnw test`

`./mvnw package`

Todos deben terminar correctamente.

---

## 22. Verificación real

Reconstruir/reiniciar el backend cuando sea necesario.

Con JWT válido verificar:

`GET /api/wods/{id}`

para un WOD que tenga varios ejercicios.

Confirmar:

- 200.

- ejercicios presentes.

- nombres correctos.

- reps correctas.

- position correcta.

- orden correcto.

Comprobar también un WOD sin asociaciones si existe.

---

## 23. Verificación MySQL final

Usar wodsql en modo lectura para confirmar:

- esquema intacto.

- foreign keys intactas.

- número de asociaciones intacto.

- datos intactos.

- ninguna operación de escritura.

---

## 24. Revisión Git

Ejecutar:

`git status`

y:

`git diff`

No utilizar:

`git add .`

No incluir specs futuras ni cambios ajenos.

---

## 25. Finalización

Actualizar `tasks.md`.

Documentar:

- clases creadas.

- clases modificadas.

- estrategia JPA.

- estrategia de carga.

- queries.

- DTO final.

- tests.

- total de tests.

- resultado Maven.

- pruebas HTTP.

- verificación MySQL.

No cerrar automáticamente Issue #15.

No hacer commit.

No hacer push.

No hacer merge.
