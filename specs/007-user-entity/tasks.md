# Tasks — Spec 007 User Entity

## T1 — Revisar documentación

- [x] Leer `AGENTS.md`.

- [x] Leer `backend/AGENTS.md`.

- [x] Leer `specs/007-user-entity/spec.md`.

- [x] Leer `specs/007-user-entity/plan.md`.

- [x] Confirmar el alcance antes de modificar código.

---

## T2 — Consultar Issue #2

- [x] Utilizar `delfohub`.

- [x] Consultar la Issue #2 de `Delforojas/wod_explore`.

- [x] Confirmar que la spec cubre todos sus requisitos.

- [x] Detener la implementación si existe una contradicción relevante.

---

## T3 — Inspeccionar tabla users

- [x] Utilizar `wodsql`.

- [x] Describir la tabla `users`.

- [x] Confirmar tipos de columnas.

- [x] Confirmar PK.

- [x] Confirmar autoincremento.

- [x] Confirmar nullability.

- [x] Confirmar UNIQUE de `email`.

- [x] Confirmar comportamiento de `created_at`.

- [x] Confirmar foreign keys relacionadas.

- [x] No modificar datos ni esquema.

---

## T4 — Revisar entidades existentes

- [x] Revisar las entidades JPA actuales.

- [x] Identificar convenciones de packages.

- [x] Identificar convenciones de constructores.

- [x] Identificar convenciones de getters/setters.

- [x] Identificar estrategia de IDs.

- [x] Identificar tipos utilizados para fechas.

- [x] No introducir patrones incompatibles con el proyecto.

---

## T5 — Crear entidad User

- [x] Crear `User`.

- [x] Añadir `@Entity`.

- [x] Mapear la tabla `users`.

- [x] Mantener el package correcto según la arquitectura existente.

---

## T6 — Mapear id

- [x] Crear el campo `id`.

- [x] Añadir `@Id`.

- [x] Configurar generación compatible con MySQL AUTO_INCREMENT.

- [x] Verificar que el tipo coincide con la columna real.

---

## T7 — Mapear name

- [x] Crear el campo `name`.

- [x] Mapearlo contra `users.name`.

- [x] Reflejar longitud/nullability cuando corresponda.

---

## T8 — Mapear lastName

- [x] Crear el campo `lastName`.

- [x] Mapearlo contra `last_name`.

- [x] Reflejar longitud/nullability cuando corresponda.

---

## T9 — Mapear email

- [x] Crear el campo `email`.

- [x] Mapearlo contra `users.email`.

- [x] Reflejar longitud/nullability cuando corresponda.

- [x] No implementar todavía búsqueda por email.

- [x] No implementar todavía validación de duplicados.

---

## T10 — Mapear passwordHash

- [x] Crear el campo `passwordHash`.

- [x] Mapearlo contra `password_hash`.

- [x] No implementar BCrypt.

- [x] No añadir lógica de hashing.

- [x] Evitar exponerlo mediante `toString()` u otros mecanismos innecesarios.

---

## T11 — Mapear createdAt

- [x] Crear el campo `createdAt`.

- [x] Seleccionar el tipo Java según el esquema real.

- [x] Mapearlo contra `created_at`.

- [x] Respetar la generación automática realizada por MySQL.

- [x] Evitar insertar o actualizar manualmente el valor si no corresponde.

---

## T12 — Completar estructura de User

- [x] Añadir constructores necesarios según convenciones del proyecto.

- [x] Añadir getters/setters necesarios.

- [x] Mantener la entidad compatible con JPA.

- [x] No añadir relaciones inversas con resultados.

- [x] No añadir lógica de negocio.

---

## T13 — Crear UserRepository

- [x] Crear `UserRepository`.

- [x] Extender el repository Spring Data apropiado.

- [x] Utilizar `User` como entidad.

- [x] Utilizar el tipo correcto de `id`.

- [x] No añadir consultas fuera de alcance.

---

## T14 — Compilar

Desde `backend/`:

```bash

./mvnw validate

```

- [x] Confirmar que finaliza correctamente.

- [x] Corregir únicamente errores relacionados con la implementación actual.

---

## T15 — Ejecutar tests

Desde `backend/`:

```bash

./mvnw test

```

- [x] Confirmar que los tests existentes siguen pasando.

- [x] Analizar cualquier fallo introducido por la nueva entidad.

---

## T16 — Añadir tests relevantes

- [x] Evaluar si existe infraestructura adecuada para tests JPA.

- [x] Añadir tests de `User` / `UserRepository` únicamente si aportan valor real.

- [x] No introducir dependencias o infraestructura compleja sin necesidad.

- [x] Ejecutar nuevamente `./mvnw test` si se añaden tests.

---

## T17 — Ejecutar package

Desde `backend/`:

```bash

./mvnw package

```

- [x] Confirmar `BUILD SUCCESS`.

---

## T18 — Verificar MySQL

- [x] Utilizar nuevamente `wodsql`.

- [x] Confirmar que `users` mantiene su estructura original.

- [x] Confirmar que no se han añadido/eliminado columnas.

- [x] Confirmar que UNIQUE de email permanece.

- [x] Confirmar que las foreign keys permanecen intactas.

- [x] Confirmar que Hibernate no ha alterado el esquema.

---

## T19 — Revisar alcance

- [x] Confirmar que no se creó `UserService`.

- [x] Confirmar que no se creó `UserController`.

- [x] Confirmar que no se crearon DTOs de usuario.

- [x] Confirmar que no se añadió hashing.

- [x] Confirmar que no se implementó registro.

- [x] Confirmar que no se implementó JWT.

- [x] Confirmar que no se modificó frontend.

---

## T20 — Verificar Issue #2

- [x] Utilizar `delfohub`.

- [x] Consultar nuevamente la Issue #2.

- [x] Comparar sus requisitos con la implementación final.

- [x] Confirmar que la Issue está técnicamente resuelta.

- [x] No cerrar la Issue automáticamente.

- [x] No realizar merge automáticamente.

---

## Criterio de finalización

La Spec 007 estará completada únicamente cuando:

- [x] `User` exista y esté correctamente mapeada.

- [x] `UserRepository` exista.

- [x] El esquema MySQL permanezca intacto.

- [x] `./mvnw validate` pase.

- [x] `./mvnw test` pase.

- [x] `./mvnw package` pase.

- [x] No exista funcionalidad fuera de alcance.

- [x] `wodsql` confirme compatibilidad con MySQL.

- [x] `delfohub` confirme cumplimiento de la Issue #2.
