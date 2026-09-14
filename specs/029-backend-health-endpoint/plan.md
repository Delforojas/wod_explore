# Plan - Spec 029 Endpoint de salud del backend

## Objetivo tecnico

Anadir un controller REST minimo para exponer `GET /api/health`, permitirlo sin
JWT mediante una regla explicita de Spring Security y documentar su uso sin
introducir comprobaciones de dependencias ni nuevas capas.

## Decisiones tecnicas

### 1. Politica de acceso

El endpoint sera publico. Un sistema externo de comprobacion debe poder
consultar la disponibilidad HTTP del proceso sin gestionar credenciales de
usuario.

La regla se anadira antes de `.requestMatchers("/api/**").authenticated()`:

```java
.requestMatchers(HttpMethod.GET, "/api/health").permitAll()
```

No se abriran otros metodos ni otras rutas.

### 2. Contrato de respuesta

El controller devolvera una estructura fija con `status=UP` y HTTP `200`. No se
incluira timestamp, version, entorno, nombre de host, estado de MySQL ni otros
campos que amplien innecesariamente el contrato o puedan filtrar informacion.

### 3. Alcance del health check

El endpoint comprobara unicamente que Spring MVC puede atender la peticion.
No inyectara repositorios ni servicios, y no realizara consultas a MySQL. El
healthcheck de MySQL de Docker continuara siendo responsabilidad de Compose.

### 4. Ubicacion

El controller se ubicara en el paquete existente:

```text
com.wodexplorer.controller
```

Se mantiene la organizacion actual por capas y se evita crear un paquete o una
capa adicional para una sola respuesta estatica.

### 5. Tests

Se ampliara `SecurityHttpTest`, que ya carga la cadena de seguridad y verifica
contratos HTTP, para cubrir:

- respuesta `200` sin JWT;
- `Content-Type` JSON;
- `$.status` igual a `UP`;
- ausencia de interaccion con servicios, implicitamente al usar un controller
  sin dependencias.

El controller se incluira en `@WebMvcTest` junto con los controllers actuales.

### 6. Documentacion

Se actualizara la tabla de API del README y se anadiran ejemplos de consulta:

- backend local con `curl`;
- backend iniciado mediante Docker Compose con `curl`;
- uso desde CI como comprobacion HTTP despues del arranque.

La documentacion indicara que un `200` confirma la disponibilidad del proceso,
pero no la de MySQL.

## Flujo de implementacion

1. Crear `HealthController` con el contrato minimo.
2. Permitir explicitamente `GET /api/health` en `SecurityConfig`.
3. Registrar el controller en `SecurityHttpTest` y anadir sus tests HTTP.
4. Actualizar el README sin afirmar capacidades no implementadas.
5. Revisar el diff contra la rama base y auditar el alcance.
6. Ejecutar `validate`, `test` y `package` mediante Maven Wrapper.

## Riesgos y mitigaciones

### Regla general de seguridad

Riesgo: que la regla general de `/api/**` mantenga la ruta protegida.

Mitigacion: declarar el matcher GET publico antes del matcher general y probar
la llamada sin Authorization mediante MockMvc.

### Exposicion de informacion interna

Riesgo: anadir campos de diagnostico que expongan configuracion o dependencias.

Mitigacion: payload fijo con un unico campo `status`.

### Confusion entre proceso y dependencias

Riesgo: documentar el endpoint como sustituto del healthcheck de MySQL.

Mitigacion: no consultar MySQL y explicar la diferencia en README y SDD.

### Dependencia accidental de la base de datos en tests

Riesgo: que el test del endpoint requiera Docker o MySQL.

Mitigacion: usar el slice web existente y no inyectar componentes de
persistencia.

## Verificaciones

Desde `backend/`:

```bash
./mvnw validate
./mvnw test
./mvnw package
```

Ademas:

- revisar que la rama actual sea `feat/029-backend-health-endpoint`;
- comprobar que el working tree solo contiene cambios de la Issue #29;
- buscar secretos, credenciales y referencias a `root` en los cambios;
- validar manualmente con `curl` si el entorno permite arrancar el backend.
