# Spec 006 — Backend Bootstrap

## Estado

Propuesta inicial.

## Contexto

`wod-explorer` dispone actualmente de un frontend desarrollado con React + TypeScript y de persistencia MySQL 8.4 ejecutada mediante Docker Compose.

El proyecto necesita incorporar un backend independiente que actúe como futura capa de acceso a datos y lógica de negocio.

Esta spec crea únicamente la base técnica del backend. No implementa todavía funcionalidades de negocio relacionadas con ejercicios, WODs, usuarios, resultados, marcas personales o autenticación.

## Objetivo

Crear un backend mínimo y ejecutable con Java 21 y Spring Boot 3.x que:

- pueda compilarse y ejecutarse de forma independiente;
- utilice Maven como herramienta de build;
- tenga preparada la conexión con MySQL mediante variables de entorno;
- incluya Spring Data JPA e Hibernate como infraestructura de persistencia;
- exponga un endpoint HTTP mínimo de salud;
- disponga de una base inicial de tests;
- respete las reglas globales y específicas del backend.

## Alcance

Esta spec incluye:

- creación del proyecto backend dentro de `backend/`;
- Java 21;
- Spring Boot 3.x compatible con Java 21;
- Maven;
- Spring Web;
- Spring Data JPA;
- Jakarta Validation;
- MySQL Connector/J;
- configuración externa mediante variables de entorno;
- endpoint `GET /api/health`;
- test del endpoint de salud;
- test de arranque del contexto Spring cuando sea aplicable;
- configuración preparada para conectar con MySQL 8.4;
- estructura mínima necesaria para continuar desarrollando futuras specs.

## Fuera de alcance

No se implementará en esta spec:

- CRUD de ejercicios;
- CRUD de WODs;
- usuarios;
- login;
- autenticación;
- autorización;
- Spring Security;
- JWT;
- OAuth2;
- resultados;
- marcas personales;
- migración de datos JSON;
- creación o modificación del esquema relacional existente;
- entidades JPA de dominio;
- repositories de dominio;
- services de negocio;
- microservicios;
- Kafka;
- Redis;
- mensajería;
- caché distribuida;
- despliegue en producción.

## Requisitos funcionales

### RF-1 — Arranque del backend

**Cuando** se ejecute el backend con Java 21 y la configuración requerida,
**el sistema deberá** iniciar correctamente como aplicación Spring Boot.

### RF-2 — Endpoint de salud

**Cuando** un cliente realice una petición `GET /api/health`,
**el sistema deberá** responder con HTTP `200`.

La respuesta deberá ser JSON y contener, como mínimo:

```json
{
  "status": "UP"
}
```

No deberá incluir información sensible ni detalles internos de infraestructura.

### RF-3 — Configuración de MySQL

**Cuando** el backend necesite conectarse a MySQL,
**el sistema deberá** obtener la configuración de conexión desde variables de entorno o propiedades externas seguras.

No deberán almacenarse credenciales reales en archivos versionados.

### RF-4 — Usuario de base de datos

**Cuando** el backend se conecte a MySQL,
**el sistema deberá** utilizar un usuario de aplicación y no el usuario administrativo `root`.

### RF-5 — Persistencia preparada

**Cuando** el backend arranque con una instancia MySQL disponible y una configuración válida,
**el sistema deberá** ser capaz de inicializar correctamente la infraestructura de Spring Data JPA/Hibernate sin modificar automáticamente el esquema de base de datos.

### RF-6 — Build reproducible

**Cuando** se ejecute el build Maven definido por el proyecto,
**el sistema deberá** compilar correctamente usando Java 21.

### RF-7 — Tests

**Cuando** se ejecuten los tests del backend,
**el sistema deberá** verificar al menos:

- que el endpoint `GET /api/health` devuelve HTTP `200`;
- que el payload contiene `status = "UP"`;
- que la configuración principal puede cargarse sin errores en el entorno de test definido por el proyecto.

## Requisitos no funcionales

### RNF-1 — Compatibilidad

Todo el código deberá ser compatible con Java 21.

No se utilizarán APIs o características exclusivas de versiones posteriores.

### RNF-2 — Simplicidad

La implementación deberá contener únicamente las capas necesarias para cumplir esta spec.

El endpoint de salud no justifica la creación de services, repositories, interfaces, DTOs adicionales o patrones de diseño innecesarios.

### RNF-3 — Separación

El backend deberá permanecer separado del código del frontend.

La implementación backend deberá residir bajo `backend/`.

### RNF-4 — Configuración segura

Los secretos y credenciales deberán proporcionarse mediante variables de entorno.

Los archivos versionados podrán incluir nombres de variables, valores locales no sensibles o ejemplos seguros, pero nunca secretos reales.

### RNF-5 — Base de datos

Hibernate no deberá utilizarse para crear, actualizar o alterar automáticamente el esquema MySQL.

Los cambios de esquema seguirán las reglas de `Docker/mysql/AGENTS.md` y futuras specs específicas.

### RNF-6 — Calidad

La tarea no se considerará finalizada mientras fallen las verificaciones aplicables del backend.

## Dependencias permitidas

Para esta spec se permiten únicamente las dependencias necesarias para:

- Spring Boot;
- Spring Web;
- Spring Data JPA;
- Jakarta Validation;
- MySQL Connector/J;
- testing estándar de Spring Boot.

No se añadirán otras dependencias salvo que durante la planificación aparezca una necesidad técnica imprescindible y se documente antes de implementarla.

## Configuración esperada

La configuración de conexión deberá poder obtener valores equivalentes a:

- host de MySQL;
- puerto;
- nombre de base de datos;
- usuario de aplicación;
- contraseña del usuario de aplicación.

Los nombres exactos de las variables de entorno se decidirán en el plan técnico, manteniendo consistencia con la configuración MySQL existente.

## Estructura mínima esperada

La spec no impone una arquitectura completa de dominio.

Como mínimo deberá existir una estructura equivalente a:

```text
backend/
├── AGENTS.md
├── pom.xml
└── src/
    ├── main/
    │   ├── java/
    │   └── resources/
    └── test/
        └── java/
```

La estructura interna de paquetes deberá seguir las convenciones Java/Spring Boot y mantenerse lo más simple posible.

## Casos límite

- Si faltan variables de entorno obligatorias para conectarse a MySQL, no deberán sustituirse automáticamente por credenciales reales hardcodeadas.
- Si MySQL no está disponible durante una verificación que requiera conexión real, el fallo deberá reportarse claramente.
- Los tests unitarios o web que no necesiten MySQL no deberán depender innecesariamente de una instancia real de la base de datos.
- El endpoint de salud no deberá revelar URL JDBC, usuario, contraseña, stack traces ni configuración interna.

## Criterios de finalización

La spec se considera completada cuando:

1. existe un proyecto Spring Boot dentro de `backend/`;
2. utiliza Java 21;
3. utiliza Maven;
4. compila correctamente;
5. los tests aplicables pasan;
6. `GET /api/health` responde HTTP `200` con `status = "UP"`;
7. la configuración MySQL se obtiene sin credenciales reales versionadas;
8. el backend no utiliza `root` para conectarse a MySQL;
9. Spring Data JPA/Hibernate está configurado sin modificación automática del esquema;
10. el backend puede arrancar correctamente cuando dispone de la configuración necesaria;
11. no se ha implementado funcionalidad fuera del alcance de esta spec.

## Documentación aplicable

Antes de implementar esta spec se deberán leer:

1. `docs/constitution.md`
2. `PRODUCT.md`
3. `AGENTS.md`
4. `backend/AGENTS.md`
5. `Docker/mysql/AGENTS.md` para cualquier cambio o verificación relacionada con MySQL
6. las skills locales relevantes de Java 21, Spring Boot y Maven

## Dudas abiertas

Ninguna decisión funcional bloqueante.

Las decisiones técnicas menores que no modifiquen el alcance podrán resolverse en `plan.md`.
