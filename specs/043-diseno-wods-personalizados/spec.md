# SDD - Issue #43: Diseno de WODs personalizados por usuario

## Estado

Contrato funcional y tecnico definido. Esta Issue es documental y no implementa
entidades, migraciones, endpoints, componentes frontend ni operaciones de
escritura.

La rama de trabajo es `docs/043-diseno-wods-personalizados`, derivada de
`main`. La funcionalidad se dividira en las Issues #44 a #49.

## Objetivo

Definir un contrato unico para que cada usuario autenticado pueda crear,
consultar, editar y eliminar sus WODs personalizados desde una seccion "Mis
WODs", sin mezclar esos entrenamientos con el catalogo global ni permitir el
acceso a recursos de otras cuentas.

## Alcance

Esta Issue define:

- la diferencia entre WOD global y WOD personalizado;
- ownership y resolucion del usuario desde JWT/SecurityContext;
- el modelo relacional futuro para propietario y prescripciones;
- las reglas de WOD, ejercicios, posiciones y unidades;
- los endpoints autenticados y sus contratos HTTP;
- el comportamiento de resultados asociados a WODs personalizados;
- el contrato de las superficies frontend;
- la migracion compatible de los datos actuales;
- la estrategia de tests y la division de trabajo posterior.

No implementa la funcionalidad completa. Las Issues posteriores ejecutaran este
contrato por capas.

## Evidencia auditada

Se revisaron `Wod`, `WodExercise`, `Exercise`, `User`, `WodResult`, los
repositories y servicios actuales, los contratos de resultados de las Specs
016-019, la integracion frontend de la Spec 021 y el sistema visual de la Spec
038.

La inspeccion read-only de la base `wod_explorer` mediante el contenedor local
MySQL 8.4 encontro:

| Tabla o dato | Estado observado |
| --- | --- |
| `users` | 9 registros |
| `wods` | 22 registros |
| `exercises` | 183 registros |
| `wod_exercises` | 88 registros |
| `wod_results` | 11 registros |
| `exercise_results` | 13 registros |
| `wods.owner_id` | No existe |
| `wod_exercise_prescriptions` | No existe |
| WODs con resultados | WODs 1, 3 y 18 |

El esquema actual mantiene `wods` sin propietario, `wod_exercises.reps` como
unica prescripcion heredada y `position` como orden. Las FKs actuales usan
`wod_exercises.wod_id ON DELETE CASCADE`,
`wod_exercises.exercise_id ON DELETE RESTRICT` y
`wod_results.wod_id ON DELETE CASCADE`.

Los datos heredados no son homogeneos: existen filas con `reps` no nulo para
ejercicios `WEIGHT` y `REPS`, mientras que los ejercicios `DISTANCE` y
`WEIGHT_DISTANCE` observados no tienen una magnitud equivalente almacenada.
No se fabricaran valores de peso, distancia o tiempo durante la migracion.

El MCP `delfohub` estuvo disponible para consultar la Issue y ramas. No se
expuso una herramienta `wodsql` en los MCP disponibles; por eso la evidencia de
MySQL se obtuvo con consultas read-only al contenedor local, sin modificar datos
ni esquema.

## Decisiones de dominio

### Origen y propietario

La tabla `wods` se reutilizara para ambos origenes:

- `owner_id IS NULL`: WOD global del catalogo;
- `owner_id IS NOT NULL`: WOD personalizado de una cuenta.

El origen se deriva exclusivamente de `owner_id`; no se creara una tabla
paralela de WODs personalizados ni un segundo indicador de origen.

`owner_id` sera una FK nullable a `users.id`. La relacion usara
`ON DELETE CASCADE` para que un WOD personalizado nunca pueda convertirse en
WOD global por la eliminacion de su propietario. Sus hijos seguiran la politica
de integridad existente. La eliminacion de usuarios no se expone actualmente y
su politica destructiva debera seguir las reglas de la Issue que la implemente.

El usuario se resolvera desde el subject del JWT:

1. Spring Security valida el Bearer token.
2. El controller transmite el subject autenticado, no un ID del cliente.
3. El service normaliza el email con `trim()` y `Locale.ROOT`.
4. `UserRepository.findByEmail` obtiene el usuario persistido.
5. Todas las lecturas y escrituras propias filtran por el `id` resuelto.

El body y la URL no aceptaran `userId` ni `ownerId`. Un JWT valido cuyo usuario
ya no exista producira `401 Unauthorized`, siguiendo las Specs 016-019.

### Tipo, categoria y nivel

`WodType` seguira admitiendo unicamente `FOR_TIME`, `AMRAP` y `EMOM`.
`METCON` no se incorporara a ese enum porque es una categoria, no una estructura
temporal.

Se anadira un campo de categoria opcional separado. Su valor definido en este
contrato es `METCON`; la ampliacion a otras categorias requerira una decision
posterior. Un WOD puede tener categoria nula.

`level` seguira utilizando `BEGINNER`, `INTERMEDIATE` y `RX`, y sera obligatorio
porque ya es obligatorio en el modelo actual.

### Campos del WOD

- `name`: obligatorio, trim de espacios exteriores, entre 1 y 100 caracteres,
  sin unicidad exigida dentro de una cuenta.
- `type`: obligatorio; `FOR_TIME`, `AMRAP` o `EMOM`.
- `level`: obligatorio; `BEGINNER`, `INTERMEDIATE` o `RX`.
- `rounds`: entero positivo cuando corresponda a una estructura con rondas
  explicitas; nulo en caso contrario.
- `timeLimit`: entero positivo expresado en segundos.

Reglas por estructura:

- `FOR_TIME`: `timeLimit` opcional; `rounds` opcional cuando el entrenamiento
  expresa rondas fijas.
- `AMRAP`: `timeLimit` obligatorio y `rounds` nulo; la duracion define la
  estructura y no se aceptan rondas fijas como requisito estructural.
- `EMOM`: `timeLimit` obligatorio; `rounds` puede expresarse cuando el
  entrenamiento necesita intervalos.

### Ejercicios y posiciones

Cada WOD personalizado tendra al menos un ejercicio. Cada fila de
`wod_exercises` tendra una posicion entera positiva, unica y consecutiva desde
`1`. El orden recibido en requests se conservara en la respuesta.

Solo se seleccionaran ejercicios existentes en `exercises`. La misma entrada de
catalogo puede aparecer varias veces en una secuencia, como ya ocurre en los
WODs globales; por tanto, no se impone unicidad de `exercise_id` dentro de un
WOD. La unicidad se aplicara a `(wod_id, position)`.

### Prescripciones normalizadas

Se sustituira la dependencia funcional de `wod_exercises.reps` por una relacion
normalizada `wod_exercise_prescriptions`:

| Campo | Definicion |
| --- | --- |
| `id` | `INT AUTO_INCREMENT PRIMARY KEY` |
| `wod_exercise_id` | `INT NOT NULL`, FK a `wod_exercises` con `ON DELETE CASCADE` |
| `value` | `DECIMAL(8,2) NOT NULL`, positivo |
| `unit` | `VARCHAR(20) NOT NULL` con valores controlados `REPS`, `METERS`, `KG`, `SECONDS`, `OTHER` |
| `unit_label` | `VARCHAR(100) NULL`; obligatorio y no vacio cuando `unit=OTHER` |

La tabla tendra un indice por `wod_exercise_id` y una restriccion unica por
`(wod_exercise_id, unit)`. Se preferira `VARCHAR` con `CHECK` para el conjunto
controlado, manteniendo la validacion de dominio en el service y evitando
acoplar la evolucion del contrato a un enum MySQL.

Para nuevos WODs personalizados, la matriz de prescripciones es:

| `measurement_type` | Prescripciones exactas |
| --- | --- |
| `REPS` | Una `REPS` con valor entero positivo |
| `DISTANCE` | Una `METERS` con valor positivo |
| `WEIGHT` | Una `KG` con valor positivo |
| `TIME` | Una `SECONDS` con valor entero positivo |
| `WEIGHT_DISTANCE` | Una `KG` y una `METERS`, ambas positivas |
| `OTHER` | Una `OTHER` con valor positivo y `unitLabel` no vacio |

Los valores de `REPS` y `SECONDS` seran enteros positivos. Las demas unidades
podran usar hasta dos decimales dentro de `DECIMAL(8,2)`. La base de datos
mantendra restricciones estructurales y el service validara la compatibilidad
con `measurement_type`.

## Contrato REST

### Namespace canonico

Tras reconciliar la definicion original de esta Issue con las Issues posteriores
#45-#49, el namespace canonico es `/api/user-wods`. No se implementaran dos
familias de rutas para el mismo recurso.

### Endpoints autenticados

```text
POST   /api/user-wods
GET    /api/user-wods?page=0&size=20
GET    /api/user-wods/{id}
PUT    /api/user-wods/{id}
DELETE /api/user-wods/{id}
```

Todas las rutas requieren un JWT valido. El listado sera paginado con el
`PageResponse` existente y orden determinista `createdAt DESC, id DESC`.

Los DTOs de request y response seran especificos de la API y no expondran
entidades JPA, `passwordHash`, credenciales, tokens ni `userId`.

El request de creacion y actualizacion incluira nombre, tipo, categoria
opcional, nivel, rondas/time limit segun corresponda y una lista de ejercicios
con posiciones y prescripciones. No incluira `id`, `userId` ni `ownerId`.

Respuestas:

- `201 Created` para una creacion correcta;
- `200 OK` para listado, detalle y actualizacion correctos;
- `204 No Content` para eliminacion correcta;
- `400 Bad Request` para JSON, enum, campos o reglas de dominio invalidos;
- `401 Unauthorized` para autenticacion ausente, invalida o usuario no
  resoluble;
- `404 Not Found` para WOD o ejercicio inexistente y para un WOD no disponible
  para el usuario, evitando enumerar recursos ajenos.

Los errores reutilizaran el formato global `{ error, message, status, details }`
y `GlobalExceptionHandler`. No se expondran SQL, stack traces ni informacion de
otra cuenta.

### Ownership de resultados

Los resultados de WOD continuaran usando `/api/wods/{wodId}/results`, definido
en las Specs 016-017, pero el service debera aplicar el origen del WOD:

- un WOD global puede recibir y devolver los resultados propios del usuario
  autenticado;
- un WOD personalizado solo puede recibir y devolver resultados del propietario
  del WOD;
- otro usuario recibira el mismo tratamiento de recurso no disponible que un
  WOD inexistente;
- `wod_results.user_id` continuara siendo el usuario que registra el resultado;
- `exercise_results` no se asocia directamente a un WOD y no cambia por este
  contrato.

No se anadira un snapshot historico del WOD en esta Issue. Los resultados
conservan la FK al WOD y la definicion vigente; una representacion historica de
la configuracion requeriria una Issue posterior especifica.

## Migracion y compatibilidad

La implementacion futura usara SQL versionado y mantendra `ddl-auto=none`.
Ninguna migracion se ejecuta en esta Issue.

Secuencia prevista:

1. Anadir `wods.owner_id` nullable con FK a `users` y la categoria opcional.
2. Crear `wod_exercise_prescriptions` con PK, FK, indice, `CHECK` y unicidad de
   unidad por ejercicio del WOD.
3. Mantener todos los WODs existentes como globales (`owner_id NULL`), porque no
   existe evidencia que permita asignarlos a una cuenta.
4. Convertir cada valor no nulo de `wod_exercises.reps` en una prescripcion
   `REPS` de compatibilidad, conservando su significado de repeticiones y sin
   interpretarlo como `KG`, `METERS` o `SECONDS`.
5. No fabricar prescripciones para valores nulos ni para magnitudes que el
   esquema legacy no almacena. Esos WODs globales no se promocionaran a WOD
   personalizado hasta contar con una configuracion valida.
6. Durante la transicion, `reps` sera de solo lectura para compatibilidad de
   catalogo y la nueva API escribira unicamente la tabla normalizada.
7. Retirar `wod_exercises.reps` solo en una migracion posterior, cuando los
   consumidores del catalogo ya lean la tabla normalizada y se haya verificado
   que no quedan datos legacy sin representacion. No habra doble escritura.

La FK existente `wod_results.wod_id ON DELETE CASCADE` se conserva. La politica
de eliminacion de WODs con resultados, incluida la posible conservacion
historica o soft delete, se resolvera en la Issue de eliminacion despues de
inspeccionar el modelo vigente; no se borraran resultados de forma implicita en
la implementacion de este contrato.

## Contrato frontend

Las Issues frontend futuras implementaran:

- seccion autenticada "Mis WODs" con listado paginado y detalle;
- formulario de creacion y edicion reutilizable;
- seleccion de ejercicios existentes, multiples filas y posiciones ordenadas;
- campos dinamicos segun `WodType` y `measurement_type`;
- unidades visibles, validacion, carga, error y confirmacion;
- edicion y eliminacion solo de recursos propios;
- estado vacio con CTA para crear el primer WOD;
- rutas hash coherentes con el router local actual;
- API como unica fuente de verdad, sin `localStorage` para WODs;
- HTML semantico, labels, foco visible, teclado, targets tactiles de al menos
  44px y responsive desde 320px;
- uso de tokens y superficies de `DESIGN.md`, sin introducir una dependencia de
  routing o estado global sin necesidad.

Las respuestas del backend se validaran con Zod en `frontend/src/api`, y los
tipos TypeScript se derivaran de los schemas cuando sea razonable.

## Arquitectura prevista

```text
Controller -> Service -> Repository -> MySQL
     |            |
    DTO       reglas de dominio,
              ownership y transacciones
```

El controller recibe DTOs y `Authentication`, valida la forma del request y
delegara. El service resolvera usuario, reglas por tipo y medicion,
prescripciones, orden y transacciones. Los repositories filtraran por
`owner_id` y cargaran ejercicios ordenados evitando N+1. Las entidades no seran
contratos publicos.

La persistencia usara relaciones lazy, consultas intencionales y cascadas de
escritura solo donde la FK y el ciclo de vida de hijos lo justifiquen.

## Estrategia de tests

Las futuras Issues deberan cubrir de forma proporcional:

- `@DataJpaTest` o integracion MySQL para migracion, FKs, `CHECK`, unicidad,
  orden y cascadas;
- tests unitarios Mockito del service para ownership, identidad, reglas de
  `WodType`, matriz de prescripciones, posiciones y transacciones;
- `@WebMvcTest` para DTOs, codigos HTTP, errores y propiedades desconocidas;
- tests de seguridad para ausencia, invalidez y expiracion del JWT, usuario no
  resoluble y aislamiento entre dos usuarios;
- tests frontend de API/Zod, formulario, estados, navegacion y orden visible;
- pruebas de regresion de catalogo, resultados, historial y estadisticas.

## Division posterior

- #44: migracion MySQL, entidades, relaciones, repositories y converters del
  modelo personalizado.
- #45: API autenticada de creacion, listado y detalle bajo `/api/user-wods`.
- #46: pantalla y formulario de creacion.
- #47: seccion "Mis WODs", listado y detalle.
- #48: actualizacion backend/frontend y reutilizacion del formulario.
- #49: eliminacion, relaciones dependientes y politica de resultados.

Las Issues posteriores deben conservar las decisiones de este documento. Si
necesitan cambiar rutas, cardinalidades, ownership o la politica de resultados,
deberan actualizar primero el contrato o crear una nueva Issue de diseno.

## Fuera de alcance

- Implementar entidades JPA, controllers, services, repositories o DTOs.
- Crear migraciones, cambiar tablas o ejecutar escrituras en MySQL.
- Implementar POST, PUT, DELETE o cualquier endpoint nuevo.
- Crear componentes, paginas, rutas frontend o tests de implementacion.
- Migrar `localStorage` legacy.
- Añadir rankings, recomendaciones, favoritos, roles o autenticacion nueva.
- Anadir snapshots historicos, notas de resultados o nuevas metricas.
- Cerrar Issues, hacer merge o publicar ramas.

## Criterios de aceptacion

- [x] El contrato distingue WOD global (`owner_id NULL`) y personalizado
  (`owner_id NOT NULL`) y justifica reutilizar `wods`.
- [x] Ownership, JWT/SecurityContext y prohibicion de `userId` del cliente estan
  definidos.
- [x] `METCON` esta separado de `WodType` y las estructuras validas son
  `FOR_TIME`, `AMRAP` y `EMOM`.
- [x] Nombre, nivel, rondas, time limit, ejercicios, posiciones y reglas por
  tipo estan definidos.
- [x] La matriz de `measurement_type` y las unidades `REPS`, `METERS`, `KG`,
  `SECONDS` y `OTHER` esta definida sin JSON.
- [x] El modelo normalizado de prescripciones, FKs, unicidad e integridad esta
  definido.
- [x] La migracion de `reps` legacy y sus limitaciones de datos reales estan
  documentadas sin inventar magnitudes.
- [x] Los endpoints canonicos, DTOs, paginacion, codigos HTTP y errores estan
  definidos bajo `/api/user-wods`.
- [x] El ownership de resultados de WOD y la ausencia de snapshot historico estan
  documentados.
- [x] El contrato frontend cubre Mis WODs, formulario, detalle, estados,
  accesibilidad, responsive y fuente de verdad API.
- [x] La estrategia de tests y la division en Issues #44-#49 son ejecutables.
- [x] La Issue no implementa funcionalidad ni cambia esquema, API o frontend.
