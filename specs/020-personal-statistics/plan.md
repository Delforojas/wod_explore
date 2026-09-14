# Plan ejecutado - Issue #20: Estadísticas y evolución personal

## Enfoque

Implementar la funcionalidad backend manteniendo el flujo existente:

```text
Controller -> Service -> Repository -> MySQL
```

No se añadirá persistencia para datos derivados. Se mantendrá la resolución del
usuario desde el subject JWT y se reutilizarán los resultados de las Issues #17
y #18.

## Contratos HTTP

1. Crear DTOs inmutables para el resumen, marcas personales y puntos de
   evolución.
2. Implementar `GET /api/users/me/statistics`.
3. Implementar `GET /api/users/me/evolution`.
4. Mantener las respuestas `200 OK` con listas vacías cuando no haya datos.
5. Mantener la protección global de `/api/**` sin modificar `SecurityConfig`.

## Acceso a datos

1. Añadir consultas de resultados WOD del usuario ordenadas por
   `completedAt ASC, id ASC`.
2. Añadir consultas de resultados de ejercicios del usuario ordenadas por
   `performedAt ASC, id ASC`.
3. Cargar las relaciones `wod` y `exercise` de manera explícita en estas
   consultas para transformar nombres, tipos y unidades sin N+1 evitable.
4. No modificar SQL, tablas, columnas, índices ni relaciones.

## Servicio de estadísticas

1. Resolver y validar el usuario autenticado antes de consultar resultados.
2. Obtener ambos conjuntos de resultados en una transacción de solo lectura.
3. Contar resultados y agrupar WOD por `wodId` y `level`.
4. Seleccionar la marca WOD mediante comparadores deterministas por `WodType`.
5. Agrupar ejercicios por `exerciseId` y `recordType`.
6. Seleccionar la mejor marca de ejercicio según `unit`, reutilizando la
   semántica ya establecida por `ExerciseResultService`.
7. Transformar entidades a DTOs públicos sin exponer entidades ni datos
   sensibles.

## Servicio de evolución

1. Reutilizar la resolución autenticada y las consultas filtradas por usuario.
2. Transformar cada resultado WOD y de ejercicio en su punto descriptivo.
3. Conservar el orden ascendente de fecha e ID definido por el repositorio.
4. Devolver dos listas independientes para no mezclar escalas temporales ni
   métricas incompatibles.

## Verificación

1. Tests unitarios del servicio para cada regla de marca, empates, aislamiento,
   conteos, listas vacías y transformación.
2. Tests `@WebMvcTest` para los dos endpoints, contratos JSON y query/body sin
   posibilidad de seleccionar otro usuario.
3. Tests de seguridad para JWT ausente y JWT válido usando su subject.
4. Tests `@DataJpaTest` para filtrado, orden ascendente y carga de relaciones.
5. Ejecutar desde `backend/` `./mvnw validate`, `./mvnw test` y `./mvnw package`.
6. Revisar que el esquema y los scripts SQL no hayan cambiado.

## Resultado

- Se implementaron los endpoints `GET /api/users/me/statistics` y
  `GET /api/users/me/evolution`.
- Se reutilizaron `wod_results` y `exercise_results`, sin persistir datos
  derivados ni modificar el esquema.
- Se ejecutaron `./mvnw validate`, `./mvnw test` y `./mvnw package` desde
  `backend/`.
- Resultado: 125 tests correctos; `validate` y `package` correctos.
- Los tests de repositorio confirmaron el orden temporal y la carga explícita
  de las relaciones contra MySQL 8.4.11.
- Commit de implementación: `eb21909063cb09238f3f24e0ad0025e5a248fea9` —
  `feat(statistics): implement personal statistics for issue #20`.
