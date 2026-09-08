# AGENTS.md — Backend

## Ámbito

Este archivo define las reglas específicas para cualquier trabajo realizado
dentro del backend de `wod-explorer`.

Se aplica a tareas relacionadas con:

- Java
- Spring Boot
- Spring Data JPA
- Hibernate
- APIs REST
- lógica de negocio
- acceso a persistencia desde el backend
- validación
- manejo de errores
- configuración del backend
- testing del backend
- Maven o Gradle cuando corresponda

Estas reglas complementan el `AGENTS.md` raíz y
`docs/constitution.md`.

No sustituyen la spec activa.

## Stack

El backend utilizará:

- Java 21
- Spring Boot 3.x
- Spring Data JPA
- Hibernate
- MySQL 8.4

No introducir tecnologías adicionales salvo que exista una necesidad técnica
justificada por la spec activa.

## Java

Todo el código Java debe ser compatible con Java 21.

No utilices:

- características exclusivas de versiones posteriores
- APIs introducidas después de Java 21
- configuraciones que requieran una versión posterior del JDK

Utiliza nombres descriptivos en inglés para:

- clases
- interfaces
- records
- enums
- métodos
- variables
- paquetes

Prioriza:

- tipos explícitos y claros
- modelos de dominio comprensibles
- composición frente a herencia cuando sea apropiado
- clases y métodos con responsabilidades concretas
- inmutabilidad cuando aporte claridad
- APIs internas simples y predecibles

Evita:

- abstracciones prematuras
- jerarquías de herencia innecesarias
- interfaces sin una necesidad concreta
- genéricos innecesariamente complejos
- patrones de diseño aplicados de forma mecánica
- clases genéricas que acumulen responsabilidades

## Spring Boot

Utiliza Spring Boot 3.x.

Prioriza las convenciones y mecanismos proporcionados por Spring Boot frente
a configuraciones personalizadas innecesarias.

Utiliza inyección de dependencias mediante constructor.

Evita field injection.

No añadas starters o dependencias sin una necesidad técnica relacionada con
la spec activa.

No introduzcas automáticamente:

- Spring Security
- JWT
- OAuth2
- microservicios
- Kafka
- Redis
- mensajería
- cachés distribuidas
- arquitectura distribuida
- infraestructura adicional

Estas tecnologías solo podrán añadirse cuando la spec activa las requiera.

## Arquitectura

Mantén responsabilidades claras entre las diferentes partes del backend.

Cuando sean necesarias, las responsabilidades habituales serán:

- controller: entrada y salida HTTP
- service: casos de uso y lógica de negocio
- repository: acceso a persistencia
- domain/model: representación del dominio
- dto: contratos de entrada y salida cuando aporten separación real
- configuration: configuración técnica de Spring

Esta lista no obliga a crear todas estas capas para cada funcionalidad.

No crees:

- services sin lógica o responsabilidad real
- repositories adicionales sin necesidad de persistencia
- interfaces únicamente para envolver una implementación
- DTOs duplicados sin aportar separación
- factories, strategies, builders u otros patrones sin una necesidad concreta

La arquitectura debe crecer según las necesidades de la spec.

## API REST

Cuando la spec requiera endpoints HTTP:

- utiliza rutas consistentes y orientadas a recursos
- utiliza los métodos HTTP apropiados
- devuelve códigos de estado HTTP coherentes
- valida los datos de entrada
- evita exponer detalles internos innecesarios
- mantén controllers pequeños
- delega la lógica de negocio fuera del controller cuando exista lógica real
- utiliza contratos de entrada y salida claros

No diseñes endpoints que no estén requeridos por la spec activa.

## Validación

Valida los datos en las fronteras apropiadas de la aplicación.

Cuando corresponda, utiliza Jakarta Validation y las capacidades estándar
de Spring Boot.

No dependas únicamente de validaciones realizadas por el frontend.

Las restricciones críticas de integridad también deben estar protegidas
por la capa de persistencia cuando corresponda.

Los mensajes visibles para el usuario deben mantenerse en español cuando
formen parte de la interfaz o respuesta funcional definida por el proyecto.

## Manejo de errores

Los errores HTTP deben ser consistentes y predecibles.

Cuando exista una necesidad real de manejo global de errores, utiliza los
mecanismos estándar proporcionados por Spring.

No expongas al cliente:

- stack traces
- credenciales
- secretos
- detalles internos de infraestructura
- información sensible de la base de datos

No ocultes excepciones inesperadas sin registrarlas o tratarlas de forma
adecuada.

## Persistencia

Spring Data JPA y Hibernate serán utilizados para la integración entre el
backend y MySQL cuando la spec correspondiente lo requiera.

No modifiques el esquema de MySQL únicamente mediante cambios accidentales
producidos por Hibernate.

Los cambios estructurales de base de datos deben seguir las reglas definidas
en:

`Docker/mysql/AGENTS.md`

MySQL debe mantenerse como fuente de verdad para cualquier funcionalidad
que ya haya sido migrada desde los archivos JSON.

Evita:

- consultas innecesarias
- cargas completas de datos cuando no sean necesarias
- relaciones bidireccionales sin una necesidad clara
- cascadas JPA demasiado amplias
- acceso accidental a datos fuera de los límites de una transacción

Las decisiones de modelado JPA deben reflejar el modelo relacional y las
necesidades reales del dominio.

## Transacciones

Define límites transaccionales donde exista una operación de negocio que
requiera atomicidad.

No utilices transacciones de forma indiscriminada.

Mantén las transacciones tan pequeñas como sea razonablemente posible.

No coloques lógica HTTP dentro de las operaciones de persistencia.

## Configuración

No almacenes en el repositorio:

- contraseñas reales
- credenciales de MySQL
- tokens
- secretos
- claves privadas

Utiliza variables de entorno para información sensible y configuración
dependiente del entorno.

No conectes el backend a MySQL utilizando `root`.

Utiliza un usuario de aplicación con los permisos necesarios y nada más.

Los archivos de configuración versionados deben contener únicamente valores
seguros o referencias a variables de entorno.

## Build

Antes de ejecutar comandos, inspecciona la estructura real del backend.

No asumas Maven o Gradle si todavía no se ha definido uno.

Si el proyecto utiliza Maven:

- utiliza únicamente comandos disponibles para el proyecto
- sigue `110-java-maven-best-practices`
- no añadas plugins sin una necesidad técnica clara

Si el proyecto utiliza Gradle:

- no apliques reglas específicas de Maven
- utiliza únicamente la configuración y comandos realmente existentes

No cambies de build tool sin autorización explícita.

## Testing

Utiliza las herramientas de testing realmente configuradas en el backend.

Para tests unitarios Java, aplica las prácticas definidas por
`131-java-testing-unit-testing`.

Prioriza tests sobre:

- lógica de negocio
- validaciones relevantes
- casos límite
- manejo de errores
- comportamiento especificado por la spec

No crees tests únicamente para aumentar cobertura.

Los tests deben comprobar comportamiento observable y requisitos reales.

Utiliza integración con Spring únicamente cuando el comportamiento probado
requiera realmente el contexto de Spring.

No conviertas automáticamente todos los tests en tests de integración.

## Skills

Antes de trabajar en el backend, utiliza únicamente las skills relevantes
para la tarea.

### Java

Skills disponibles:

- `java-21`
- `121-java-object-oriented-design`
- `122-java-type-design`
- `128-java-generics`
- `123-java-design-patterns`
- `131-java-testing-unit-testing`
- `110-java-maven-best-practices`

Utiliza:

- `java-21` como referencia para Java 21
- `121-java-object-oriented-design` cuando la tarea implique diseño OO
- `122-java-type-design` cuando implique modelado de tipos o dominio
- `128-java-generics` únicamente cuando exista una necesidad real de genéricos
- `123-java-design-patterns` cuando un patrón resuelva un problema concreto
- `131-java-testing-unit-testing` para testing unitario
- `110-java-maven-best-practices` únicamente cuando el proyecto utilice Maven

No es obligatorio utilizar todas las skills Java en cada tarea.

### Spring Boot

Skills disponibles:

- `spring-boot-3`
- `java-springboot`

Utiliza:

- `spring-boot-3` como referencia principal para Spring Boot 3.x
- `java-springboot` para arquitectura REST, configuración, DTOs, validación,
  manejo de errores, persistencia y testing con Spring Boot

Aplica además las skills Java que sean relevantes para la tarea.

Las recomendaciones de las skills no pueden:

- modificar el alcance de la spec
- introducir dependencias no justificadas
- cambiar la versión de Java
- introducir nuevas capas sin necesidad
- introducir infraestructura adicional no solicitada

Si una recomendación de una skill contradice una regla superior del proyecto,
prevalece la regla superior.

## Verificaciones

Después de modificar el backend, ejecuta únicamente las verificaciones
aplicables y disponibles realmente en el proyecto.

Como mínimo, cuando corresponda:

- ejecuta los tests del backend
- ejecuta la compilación
- comprueba que no existen errores de compilación
- comprueba compatibilidad con Java 21
- comprueba que el backend arranca cuando la tarea lo requiera

Si la tarea afecta también a MySQL:

- aplica además `Docker/mysql/AGENTS.md`
- ejecuta las verificaciones de base de datos definidas allí

No marques una tarea como terminada mientras fallen verificaciones aplicables.

## Reglas de implementación

Antes de modificar el backend:

1. Lee `docs/constitution.md`.
2. Lee la spec activa.
3. Lee `PRODUCT.md`.
4. Lee el `AGENTS.md` raíz.
5. Lee este `backend/AGENTS.md`.
6. Lee `Docker/mysql/AGENTS.md` si la tarea afecta a persistencia o MySQL.
7. Lee únicamente las skills relevantes para la tarea.

Durante la implementación:

- no amplíes el alcance de la spec
- no añadas funcionalidades por anticipado
- no añadas dependencias por conveniencia
- no realices refactors grandes no relacionados
- no modifiques el frontend salvo que la tarea lo requiera
- no modifiques el esquema MySQL sin autorización de la spec
- no hagas commits ni push automáticamente

## Al finalizar

Indica:

- archivos creados
- archivos modificados
- archivos eliminados, si los hubiera
- skills utilizadas
- verificaciones ejecutadas
- resultado de cada verificación
- cualquier requisito que no haya podido cumplirse

Si existe una contradicción entre la spec, la constitución, el `AGENTS.md`
raíz, este archivo o una skill, no improvises: detén la implementación e
indica claramente el conflicto.