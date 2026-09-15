# Tasks - Issue #71: Mostrar nombres reales de WODs y ejercicios en Historial

- [x] Confirmar el contrato de #71 frente a las Specs 019, 021 y 028.
- [x] Crear DTO específico de historial para resultados WOD con `wodName`.
- [x] Crear DTO específico de historial para marcas de ejercicio con
  `exerciseName`.
- [x] Actualizar `UserHistoryResponse` para usar los DTOs específicos.
- [x] Mapear nombres desde las relaciones JPA en `UserHistoryService`.
- [x] Mantener `@EntityGraph` y comprobar que no se añaden consultas por fila.
- [x] Añadir tests backend de nombres reales y conservación de campos.
- [x] Añadir tests MVC del contrato JSON del historial.
- [x] Añadir schemas Zod específicos del historial con nombres nullable.
- [x] Mostrar nombres reales en `HistoryPage` sin mappings hardcodeados.
- [x] Implementar fallback por ID solo para nombres ausentes o vacíos.
- [x] Mantener enlaces de detalle y nombres accesibles con los IDs internos.
- [x] Actualizar tests frontend para nombres reales y fallback.
- [x] Verificar WODs legacy y personalizados mediante el contrato común.
- [x] Ejecutar `./mvnw validate` y corregir fallos relacionados.
- [x] Ejecutar `./mvnw test` y corregir fallos relacionados.
- [x] Ejecutar `./mvnw package` y corregir fallos relacionados.
- [x] Ejecutar `npm test` y corregir fallos relacionados.
- [x] Ejecutar `npm run lint` y corregir errores relacionados.
- [x] Ejecutar `npm run build` y corregir errores de TypeScript/build.
- [ ] Revisar responsive, teclado, foco, estados y ausencia de mappings locales.
- [x] Revisar diff y status excluyendo cambios ajenos.
- [x] Crear el commit exclusivo de la Issue #71.
- [x] Documentar la Issue con commit, verificaciones y validaciones manuales
  pendientes sin cerrarla.
