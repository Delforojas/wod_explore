# AGENTS.md — wod-explorer

## Proyecto

Aplicación web Full Stack para explorar WODs y ejercicios de CrossFit, registrar resultados de usuarios y consultar evolución y marcas personales.

El frontend está desarrollado con React + TypeScript.

La persistencia principal se realiza en MySQL 8.4 ejecutado mediante Docker Compose.

El backend se implementará con Java + Spring Boot cuando la spec correspondiente lo solicite.

Los archivos JSON existentes pertenecen a la versión inicial del proyecto y no deben considerarse la fuente de verdad una vez que la funcionalidad sea migrada a la base de datos.

## Stack

### Frontend

- React

- TypeScript

- Tailwind CSS

- Zod

### Backend

Para cualquier trabajo relacionado con:

- Java

- Spring Boot

- Spring Data JPA

- Hibernate

- Maven o Gradle

- APIs REST

- lógica de negocio del backend

- tests del backend

lee también:

`backend/AGENTS.md`

Sus reglas son obligatorias para cualquier cambio relacionado con backend.

### Base de datos

- MySQL 8.4

- Docker Compose

## Comandos

### Frontend

- Desarrollo: `npm run dev`

- Build: `npm run build`

- Tests: `npm test`

- Lint: `npm run lint`

Usa únicamente comandos disponibles realmente en `package.json`.

No inventes scripts que no existan.

### Backend

Cuando exista el backend, usa únicamente comandos definidos realmente por el proyecto.

No asumas Maven o Gradle sin inspeccionar previamente la estructura existente.

Si el proyecto utiliza Maven, aplica las reglas y buenas prácticas definidas por las skills Maven instaladas.

## Estructura

Mantén una separación clara entre:

- componentes de interfaz

- páginas

- datos

- tipos

- esquemas de validación

- utilidades

- backend

- persistencia

Evita colocar lógica compleja directamente dentro de los componentes visuales.

Mantén las responsabilidades del frontend, backend y base de datos separadas.

En el backend, mantén responsabilidades claras entre controladores, servicios, dominio y persistencia cuando la arquitectura definida por la spec lo requiera.

No introduzcas capas adicionales únicamente por seguir un patrón arquitectónico si no aportan una responsabilidad real al proyecto.

## Estilo

### Frontend

- TypeScript en modo estricto.

- Evita `any` salvo que esté estrictamente justificado.

- Componentes y tipos con nombres descriptivos en inglés.

- Textos visibles para el usuario en español.

- Componentes pequeños y reutilizables cuando tenga sentido.

- Prioriza HTML semántico.

- Diseño responsive y mobile-first.

- Usa Tailwind CSS para los estilos.

### Backend

- El backend debe ser compatible con Java 21.

- No utilices características, APIs ni sintaxis exclusivas de versiones posteriores de Java.

- Utiliza nombres descriptivos en inglés para clases, interfaces, métodos, variables, paquetes y tipos.

- Prioriza tipos de dominio claros frente al uso indiscriminado de tipos primitivos.

- Mantén clases y métodos con responsabilidades claras.

- Prioriza composición frente a herencia cuando sea apropiado.

- No introduzcas patrones de diseño sin una necesidad concreta.

- Evita abstracciones prematuras.

- Mantén el código sencillo y explícito cuando no exista una razón técnica para mayor complejidad.

## Datos y persistencia

- MySQL es la persistencia principal del proyecto para WODs, ejercicios, usuarios y resultados.

- No modificar el esquema de base de datos sin una spec que lo autorice.

- Los archivos JSON existentes pueden mantenerse temporalmente mientras se realiza la migración al backend.

- No crear dos fuentes de verdad para los mismos datos.

- Cuando una funcionalidad haya sido migrada a MySQL, el frontend deberá consumirla desde el backend y no desde JSON local.

- Validar los datos recibidos en las fronteras correspondientes de la aplicación.

### Reglas específicas de base de datos

Para cualquier trabajo relacionado con:

- MySQL

- Docker Compose

- scripts SQL

- esquema relacional

- migraciones

- claves primarias o foráneas

- índices

- datos iniciales

- consultas SQL

lee también:

`Docker/mysql/AGENTS.md`

Sus reglas son obligatorias para cualquier cambio relacionado con base de datos.

## Skills

Las skills proporcionan conocimiento y buenas prácticas, pero no sustituyen las decisiones definidas por la constitución, la spec activa o las reglas del proyecto.

No es obligatorio utilizar todas las skills disponibles en cada tarea.

Utiliza únicamente las skills relevantes para el área modificada.

### React

Cuando trabajes con React:

- sigue `vercel-react-best-practices`

- sigue `vercel-composition-patterns`

### TypeScript

Cuando trabajes con TypeScript:

- sigue `typescript-advanced-types`

### Tailwind CSS

Cuando trabajes con Tailwind:

- sigue `tailwind-css-patterns`

### Diseño y accesibilidad

Cuando revises diseño, responsive, UX o accesibilidad:

- sigue `impeccable`

- sigue `web-design-guidelines`

### Datos JSON

Cuando trabajes con datos JSON:

- sigue `zod-schema-validation`

### MySQL

Cuando trabajes con MySQL:

- sigue la skill MySQL instalada en `.agents/skills/`

- sigue también `Docker/mysql/AGENTS.md`

### Java

Cuando trabajes con Java, utiliza las skills locales relevantes según la tarea:

- `java-21` para características, APIs y buenas prácticas de Java 21.

- `121-java-object-oriented-design` para diseño orientado a objetos, SOLID, interfaces y composición.

- `122-java-type-design` para modelado de tipos, value objects y diseño de APIs.

- `128-java-generics` cuando la tarea requiera genéricos o type safety avanzado.

- `123-java-design-patterns` únicamente cuando un patrón aporte una solución clara al problema.

- `131-java-testing-unit-testing` para tests unitarios Java.

- `110-java-maven-best-practices` cuando el proyecto utilice Maven o la tarea afecte a su configuración.

No es necesario aplicar todas las skills Java en cada tarea.

Selecciona únicamente las relevantes para el trabajo realizado.

El código Java debe mantenerse compatible con Java 21.

No utilices características ni APIs exclusivas de versiones posteriores de Java aunque alguna skill las recomiende.

No introduzcas patrones, interfaces, abstracciones o genéricos únicamente porque una skill los sugiera. Deben aportar una mejora concreta al diseño.

### Spring Boot

Cuando trabajes con Spring Boot:

- sigue `java-springboot`

- aplica también las skills Java relevantes para la tarea

- respeta Java 21 como versión máxima del lenguaje

- no añadas starters o dependencias que no estén justificadas por la spec activa

### Descubrimiento de skills

Usa `find-skills` únicamente cuando una tarea requiera conocimientos que no estén cubiertos por las skills actuales.

No instales nuevas skills automáticamente salvo petición explícita.

## Reglas

- Lee `docs/constitution.md` antes de modificar código.

- Lee la spec activa dentro de `specs/` antes de implementar una funcionalidad.

- La spec activa es la fuente de verdad funcional.

- No implementes funcionalidades fuera del alcance de la spec.

- No modifiques archivos dentro de `specs/` salvo petición explícita.

- No añadas dependencias sin una necesidad clara.

- No añadas nuevas capas de backend, autenticación o integraciones externas fuera del alcance de la spec activa.

- No modifiques el esquema de base de datos fuera del alcance de la spec activa.

- No realices refactors grandes que no sean necesarios para la tarea actual.

- No introduzcas patrones arquitectónicos o de diseño sin una necesidad concreta.

- No cambies versiones principales del stack sin autorización explícita de la spec.

- No hagas commits ni push automáticamente.

## Al terminar cualquier tarea

Ejecuta únicamente las verificaciones aplicables a la parte del proyecto modificada.

### Si se modifica frontend

- Ejecuta los tests disponibles.

- Ejecuta el lint.

- Ejecuta `npm run build`.

- Comprueba que no existen errores de TypeScript.

### Si se modifica backend

- Ejecuta los tests disponibles.

- Ejecuta la compilación correspondiente.

- Comprueba que el backend arranca correctamente cuando la tarea lo requiera.

- Comprueba que el código sigue siendo compatible con Java 21.

- Utiliza únicamente comandos realmente disponibles en el proyecto.

### Si se modifica base de datos

- Sigue las verificaciones definidas en `Docker/mysql/AGENTS.md`.

### Siempre

- Indica claramente qué archivos has creado, modificado o eliminado.

- Indica qué verificaciones has ejecutado y su resultado.

- Si algún requisito de la spec no se ha podido cumplir, indícalo explícitamente.

- No marques una tarea como terminada si las verificaciones aplicables fallan.

## Documentación obligatoria

Antes de modificar código:

1. Lee `docs/constitution.md` para respetar los principios no negociables.

2. Lee la spec activa dentro de `specs/`.

3. Lee `PRODUCT.md` para entender el propósito y las restricciones del producto.

4. Lee este `AGENTS.md`.

5. Lee los `AGENTS.md` específicos del área afectada.

6. Lee `DESIGN.md` cuando la tarea afecte a interfaz, UX o diseño visual.

7. Lee las skills locales relevantes dentro de `.agents/skills/`.

No es necesario leer skills que no tengan relación con la tarea actual.

## Prioridad de instrucciones

La prioridad es:

1. `docs/constitution.md`

2. spec activa

3. `PRODUCT.md`

4. `AGENTS.md`

5. `AGENTS.md` específico del área afectada

6. `DESIGN.md` cuando aplique

7. skills

La constitución define los principios no negociables del proyecto.

La spec activa define el comportamiento y alcance funcional que debe implementarse.

Las skills aportan conocimiento técnico y buenas prácticas, pero nunca pueden ampliar o modificar por sí mismas el alcance de una tarea.

Si existe una contradicción entre estos documentos, no improvises: detén la implementación e indica claramente el conflicto.