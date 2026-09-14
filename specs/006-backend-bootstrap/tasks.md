# Tareas — Spec 006 Backend Bootstrap

## T1 — Revisar contexto y estado actual

### Trabajo

- Leer `docs/constitution.md`.
- Leer `PRODUCT.md`.
- Leer `AGENTS.md`.
- Leer `backend/AGENTS.md`.
- Leer `Docker/mysql/AGENTS.md` si la tarea va a tocar o verificar MySQL.
- Leer las skills relevantes:
  - `java-21`
  - `110-java-maven-best-practices`
  - `131-java-testing-unit-testing`
  - `spring-boot-3`
  - `java-springboot`
- Inspeccionar el contenido actual de `backend/`.
- Confirmar que no existe una implementación backend previa que deba conservarse.

### Hecho cuando

- La documentación obligatoria ha sido revisada.
- El estado real de `backend/` es conocido.
- No se ha modificado código.

---

## T2 — Crear el bootstrap de Spring Boot

### Trabajo

Crear el proyecto backend dentro de `backend/` con:

- Java 21;
- Spring Boot 3.x compatible con Java 21;
- Maven;
- paquete base `com.wodexplorer`;
- clase principal de aplicación.

Añadir únicamente las dependencias previstas por la spec:

- Spring Web;
- Spring Data JPA;
- Validation;
- MySQL Connector/J;
- Spring Boot Test.

Mantener o generar Maven Wrapper cuando corresponda.

### Restricciones

- No añadir Spring Security.
- No crear entidades.
- No crear repositories.
- No crear services.
- No crear funcionalidades de dominio.

### Hecho cuando

- existe `backend/pom.xml`;
- Java 21 está configurado;
- Spring Boot 3.x está configurado;
- las dependencias permitidas están presentes;
- el proyecto compila estructuralmente.

---

## T3 — Configurar el backend mediante variables de entorno

### Trabajo

Configurar la aplicación para obtener la conexión MySQL mediante variables de entorno.

Variables propuestas:

- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`

Configurar Spring Data JPA/Hibernate sin permitir creación o actualización automática del esquema.

### Restricciones

- No almacenar credenciales reales.
- No utilizar `root`.
- No modificar scripts SQL ni el esquema MySQL.
- No introducir secretos en `application.yml`.

### Hecho cuando

- la configuración de datasource depende de variables externas;
- no existen credenciales reales hardcodeadas;
- Hibernate no está configurado con `create`, `create-drop` ni `update`;
- la configuración es compatible con MySQL 8.4.

---

## T4 — Implementar el endpoint de salud

### Trabajo

Implementar:

```http
GET /api/health
```

Respuesta mínima:

```json
{
  "status": "UP"
}
```

### Restricciones

- No crear service para este endpoint.
- No crear repository.
- No exponer información de MySQL.
- No exponer configuración interna.
- No añadir Actuator salvo que una necesidad técnica explícita lo justifique y se revise el alcance antes.

### Hecho cuando

- el endpoint existe;
- responde HTTP `200`;
- devuelve JSON;
- el JSON contiene `status = "UP"`.

---

## T5 — Añadir tests del bootstrap

### Trabajo

Crear tests que verifiquen como mínimo:

- `GET /api/health` devuelve `200`;
- la respuesta contiene `status = "UP"`.

Mantener o añadir una comprobación de contexto Spring únicamente si puede ejecutarse de forma determinista en el entorno de test.

### Restricciones

- El test web del endpoint no debe requerir una instancia MySQL real si no es necesario.
- No introducir dependencias de testing adicionales sin necesidad.
- No crear tests vacíos o puramente cosméticos.

### Hecho cuando

- existen tests útiles para el endpoint;
- los tests no dependen innecesariamente de MySQL;
- todos los tests disponibles pasan.

---

## T6 — Verificar build y compatibilidad Java 21

### Trabajo

Ejecutar las verificaciones disponibles del backend.

Preferencia si existe Maven Wrapper:

```bash
./mvnw test
./mvnw package
```

Comprobar también:

- versión/configuración Java 21;
- ausencia de errores de compilación;
- ausencia de APIs posteriores a Java 21.

### Hecho cuando

- tests: PASS;
- compilación/package: PASS;
- el proyecto utiliza Java 21;
- no existen errores de compilación.

---

## T7 — Verificar arranque del backend

### Trabajo

Arrancar el backend con una configuración válida.

Comprobar:

```http
GET /api/health
```

### Restricciones

- No dejar procesos innecesarios ejecutándose al finalizar.
- No hardcodear credenciales para conseguir que arranque.
- Si MySQL es obligatorio para el arranque, utilizar la configuración local definida para el proyecto.

### Hecho cuando

- el backend arranca correctamente;
- `/api/health` responde `200`;
- el backend se detiene de forma limpia después de la verificación.

---

## T8 — Verificar integración inicial con MySQL

### Trabajo

Si la instancia MySQL local está disponible:

- seguir `Docker/mysql/AGENTS.md`;
- utilizar el usuario de aplicación;
- proporcionar las variables de entorno;
- arrancar el backend;
- comprobar que Spring Data JPA/Hibernate puede inicializarse;
- verificar que el esquema no ha sido alterado por Hibernate.

### Restricciones

- No utilizar `root`.
- No crear ni modificar tablas para completar esta tarea.
- No cambiar el esquema.
- No insertar datos de dominio.

### Hecho cuando

- el backend puede inicializar su infraestructura de persistencia contra MySQL;
- no se han producido cambios automáticos del esquema;
- cualquier fallo externo de MySQL se reporta claramente en lugar de ocultarse.

---

## T9 — Auditoría de alcance de la Spec 006

### Trabajo

Revisar todos los cambios realizados.

Confirmar que no se ha implementado:

- ejercicios;
- WODs;
- usuarios;
- autenticación;
- autorización;
- resultados;
- entidades de dominio;
- repositories de dominio;
- services de negocio;
- migraciones;
- infraestructura adicional fuera de alcance.

Revisar también que no existan:

- credenciales reales;
- uso de `root` por el backend;
- dependencias no justificadas;
- capas innecesarias.

### Hecho cuando

- todos los requisitos de `spec.md` están cubiertos;
- no existe funcionalidad fuera de alcance;
- todas las verificaciones aplicables pasan;
- se reportan claramente los archivos creados/modificados;
- se reportan los comandos ejecutados y sus resultados.

---

## Orden de ejecución

```text
T1
 ↓
T2
 ↓
T3
 ↓
T4
 ↓
T5
 ↓
T6
 ↓
T7
 ↓
T8
 ↓
T9
```

No continuar con una tarea posterior si una verificación bloqueante de la tarea actual falla por un problema de implementación.

Los fallos producidos exclusivamente por infraestructura externa no disponible deberán documentarse claramente y no deberán ocultarse modificando el alcance o introduciendo credenciales inseguras.
