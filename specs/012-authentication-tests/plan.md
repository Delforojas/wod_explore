# Plan — Spec 012 Authentication Tests

## 1. Objetivo

Auditar y completar la cobertura automatizada del sistema de autenticación de WOD Explorer.

La implementación debe centrarse exclusivamente en tests.

No se debe añadir nueva funcionalidad salvo que los tests descubran un bug real que impida cumplir el comportamiento ya especificado.

---

## 2. Auditoría previa

Antes de modificar código:

1. Leer `AGENTS.md`.

2. Leer `backend/AGENTS.md`.

3. Leer `specs/012-authentication-tests/spec.md`.

4. Leer `specs/012-authentication-tests/tasks.md`.

5. Consultar la Issue #12.

6. Revisar los tests existentes relacionados con registro, login, JWT y Spring Security.

7. Crear un inventario de escenarios ya cubiertos.

8. Identificar únicamente los huecos reales de cobertura.

9. No crear tests duplicados.

---

## 3. Estrategia

La cobertura se dividirá entre tests unitarios y tests HTTP.

### Tests unitarios

Utilizar tests unitarios para lógica aislada como:

- Generación de JWT.

- Validación de JWT.

- Expiración.

- Manipulación de tokens.

- Comportamiento interno del filtro cuando sea necesario.

Reutilizar los tests existentes siempre que ya proporcionen esta cobertura.

### Tests HTTP

Utilizar MockMvc para verificar el comportamiento observable de la API.

Los flujos principales deben probarse a través de HTTP para comprobar la integración entre:

`Controller → Service → JWT → Spring Security → SecurityContext → endpoint protegido`

---

## 4. Registro

Auditar primero los tests existentes de registro.

Garantizar cobertura para:

### Registro correcto

Ejecutar:

`POST /api/users`

Verificar:

- `201 Created`.

- Datos públicos correctos.

- Ausencia de password.

- Ausencia de `passwordHash`.

### Registro duplicado

Registrar un usuario y posteriormente intentar registrar nuevamente el mismo email.

Verificar:

- `409 Conflict`.

- Código de error funcional existente.

- Comportamiento de normalización de email.

### Registro inválido

Verificar al menos:

- Email inválido.

- Password inválido.

- Campos obligatorios ausentes.

No modificar las reglas de validación actuales.

---

## 5. Login

Auditar primero los tests existentes de login.

### Login válido

Preparar un usuario utilizando el mismo mecanismo de codificación BCrypt utilizado por producción.

Ejecutar:

`POST /api/auth/login`

Verificar:

- `200 OK`.

- Existencia del campo `token`.

- Token no vacío.

Cuando aporte valor, validar el JWT mediante el `JwtService` existente.

### Usuario inexistente

Ejecutar login utilizando un email inexistente.

Resultado esperado:

`401 Unauthorized`

### Password incorrecto

Ejecutar login utilizando un usuario existente y una contraseña incorrecta.

Resultado esperado:

`401 Unauthorized`

Comparar las respuestas de ambos casos para confirmar que no revelan si el usuario existe.

---

## 6. Flujo completo de autenticación

Añadir o conservar al menos un test que represente el flujo completo:

1. Preparar o registrar un usuario.

2. Ejecutar login.

3. Obtener el JWT de la respuesta.

4. Utilizar el JWT como Bearer Token.

5. Ejecutar `GET /api/exercises`.

6. Verificar `200 OK`.

Este test debe demostrar que funcionan conjuntamente:

- Persistencia del usuario.

- BCrypt.

- Login.

- Generación JWT.

- Filtro JWT.

- Spring Security.

- SecurityContext.

- Endpoint protegido.

Debe evitarse mockear componentes que impidan comprobar realmente esta integración.

---

## 7. Endpoint protegido sin autenticación

Ejecutar:

`GET /api/exercises`

sin `Authorization`.

Verificar:

`401 Unauthorized`

y el contrato REST de seguridad existente.

---

## 8. JWT manipulado

Obtener o generar un JWT válido.

Modificar una parte del token sin regenerar correctamente su firma.

Utilizarlo contra:

`GET /api/exercises`

Resultado esperado:

`401 Unauthorized`

No deben aparecer detalles internos de validación criptográfica en la respuesta.

---

## 9. JWT malformado

Enviar:

`Authorization: Bearer <valor-no-jwt>`

contra un endpoint protegido.

Resultado esperado:

`401 Unauthorized`

La respuesta debe mantener el contrato REST de seguridad existente.

---

## 10. JWT expirado

Crear un token cuya expiración pueda controlarse durante el test.

El test debe ser determinista.

Evitar:

- Sleeps prolongados.

- Dependencias innecesarias del reloj real.

- Tests flaky.

Utilizar el token expirado contra:

`GET /api/exercises`

Resultado esperado:

`401 Unauthorized`

---

## 11. Header Authorization

Verificar como mínimo:

### Sin header

Debe responder `401`.

### Esquema diferente

Un esquema que no sea Bearer no debe autenticar la petición.

### Bearer inválido

Debe responder `401`.

### Bearer válido

Debe permitir el acceso.

La implementación existente no debe modificarse salvo que se descubra un incumplimiento real.

---

## 12. Endpoints públicos

Verificar explícitamente que Spring Security permite sin JWT:

- `POST /api/users`

- `POST /api/auth/login`

No añadir nuevas rutas públicas.

---

## 13. Persistencia y aislamiento

Los tests no deben depender de datos creados manualmente.

No utilizar como requisito previo usuarios creados desde:

- Postman.

- MySQL CLI.

- Docker manualmente.

- Ejecuciones anteriores.

Los tests deben preparar sus propios datos.

No modificar el esquema MySQL.

---

## 14. Seguridad de los tests

No imprimir:

- Passwords.

- Hashes BCrypt.

- JWT completos.

- JWT secret.

- Headers Authorization completos.

Utilizar credenciales ficticias únicamente dentro del entorno de testing.

---

## 15. Cambios de producción

Esta spec está orientada a testing.

Por defecto no deben modificarse clases de producción.

Si un test descubre un bug real:

1. Documentar el comportamiento esperado.

2. Confirmar que contradice una spec existente.

3. Aplicar únicamente la corrección mínima necesaria.

4. Añadir un test que reproduzca el bug.

5. Confirmar que el test falla antes de la corrección y pasa después.

No utilizar esta spec para realizar refactors no relacionados.

---

## 16. Verificación Maven

Desde `backend/` ejecutar:

`./mvnw validate`

Después:

`./mvnw test`

Debe finalizar con:

- 0 failures.

- 0 errors.

Finalmente:

`./mvnw package`

Debe finalizar correctamente.

---

## 17. Revisión de alcance

Antes de finalizar comprobar que no se han añadido:

- Roles.

- Autorización por roles.

- Refresh tokens.

- Logout.

- Blacklist.

- OAuth.

- Nuevos endpoints.

- Sesiones.

- Cookies.

- Funcionalidad frontend.

- Cambios de esquema MySQL.

---

## 18. Revisión Git

Antes de finalizar:

1. Ejecutar `git status`.

2. Ejecutar `git diff`.

3. Confirmar que los cambios pertenecen a Spec 012.

4. No incluir archivos de configuración local o secretos.

5. No incluir `.env`.

6. No incluir tokens.

7. No incluir cambios no relacionados.

---

## 19. Finalización

Cuando la suite completa pase:

1. Actualizar `tasks.md`.

2. Documentar cuántos tests existían antes.

3. Documentar cuántos tests existen después.

4. Indicar qué escenarios nuevos se añadieron.

5. Confirmar `0 failures`.

6. Preparar resumen para Issue #12.

No cerrar automáticamente la Issue #12 salvo instrucción explícita.

No realizar merge.
