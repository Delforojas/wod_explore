# AGENTS.md — Base de datos MySQL

## Alcance

Estas reglas aplican a cualquier trabajo relacionado con:

- MySQL

- Docker Compose

- scripts SQL

- esquema relacional

- claves primarias y foráneas

- datos iniciales

- consultas de verificación

## Entorno

- Motor: MySQL 8.4

- Base de datos: `wod_explorer`

- MySQL se ejecuta mediante Docker Compose.

- Servicio Docker: `mysql`

- Contenedor: `wod-explorer-db`

- Puerto interno MySQL: `3306`

- Puerto expuesto en local: `3307`

## Seguridad

- Nunca escribir credenciales reales en archivos versionados.

- Usar variables de entorno.

- `.env` no debe subirse a Git.

- Mantener un `.env.example` sin secretos.

- El backend no debe conectarse como `root`.

## Reglas de esquema

- Todas las tablas deben tener PK explícita.

- Las relaciones deben usar FK.

- No duplicar datos que puedan obtenerse mediante relaciones.

- Usar tablas puente para relaciones N:M.

- Definir comportamiento `ON DELETE` conscientemente.

- Evitar columnas redundantes.

- Mantener nombres de tablas y columnas en inglés.

- Usar `snake_case`.

## Tablas principales

### users

Representa usuarios de la aplicación.

### wods

Representa la definición de un WOD.

### exercises

Catálogo de ejercicios.

### wod_exercises

Tabla puente entre WODs y ejercicios.

### wod_results

Histórico de resultados de WODs por usuario.

### exercise_results

Histórico de marcas y resultados de ejercicios por usuario.

## Integridad de datos

- No eliminar tablas ni columnas sin autorización explícita.

- No ejecutar `DROP DATABASE`.

- No ejecutar `TRUNCATE` sobre datos existentes sin autorización explícita.

- Antes de modificar el esquema, explicar el impacto.

- Si existe una FK, conservar la integridad referencial.

## Cambios

Antes de modificar la base de datos:

1. Inspeccionar el esquema actual.

2. Explicar qué se va a cambiar.

3. Proponer el SQL.

4. Ejecutar solo si la tarea lo requiere.

5. Verificar el resultado.

## Verificación

Después de cualquier cambio:

- ejecutar `SHOW TABLES`;

- revisar `DESCRIBE <tabla>`;

- comprobar las FK necesarias;

- realizar al menos una consulta funcional;

- reportar cualquier error.

## Docker

- No borrar el volumen `mysql_data` salvo autorización explícita.

- No ejecutar `docker compose down -v` salvo que la tarea requiera reiniciar completamente los datos.

- No modificar los scripts de inicialización si puede romper una base ya creada sin advertirlo.

## Datos

- Los scripts de `Docker/mysql/init/` deben poder reconstruir una base limpia.

- Evitar registros duplicados.

- Mantener los datos iniciales coherentes con el esquema.