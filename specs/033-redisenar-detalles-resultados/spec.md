# Spec 033 - Rediseñar detalles y registro de resultados

## Estado

Completada en la rama `feat/033-redisenar-detalles-resultados`.

## Contexto

Las paginas de detalle de WOD y ejercicio ya consultan el detalle, los resultados
del usuario y, en ejercicios compatibles, la mejor marca. Tambien permiten
registrar resultados mediante los contratos existentes del cliente API. Sin
embargo, la composicion actual concentra demasiada informacion en filas y
formularios compactos, haciendo menos evidente la lectura y la accion principal,
especialmente en movil.

La Issue #33 solicita elevar estas superficies sin cambiar reglas de negocio,
payloads, endpoints, autenticacion ni rutas. La implementacion debe continuar el
lenguaje editorial deportivo definido por `DESIGN.md` y mantener la cobertura de
comportamiento creada en la Issue #30.

## Objetivo

Convertir los detalles de WOD y ejercicio en documentos claros y accionables:
primero identificar el contenido y sus metadatos, despues mostrar la mejor marca
o resultados existentes y finalmente ofrecer un formulario de registro evidente,
comprensible y accesible.

## Alcance

Esta spec incluye:

- jerarquia visual y semantica de encabezados, tipo, nivel, limites y fecha;
- lectura de ejercicios asociados a un WOD con reps y medicion distinguibles;
- reorganizacion visual de mejor marca, resultados y formulario de registro;
- labels, agrupacion, unidades, record type, fecha, nivel y botones mas claros;
- estados perceptibles de guardado, exito y error mediante feedback accesible;
- enlaces de retorno y resultados conservados como enlaces reales;
- orden responsive de lectura y registro sin overflow horizontal;
- pruebas de comportamiento para los nuevos estados visibles cuando corresponda.

## Fuera de alcance

No se implementara:

- nuevos endpoints, cambios de API, schemas, payloads o reglas de negocio;
- cambios en backend, base de datos, Docker, persistencia o autenticacion;
- nuevos tipos de resultado, unidades, record types o variantes de WOD;
- cambios en el router hash o en las rutas de catalogo y detalle;
- rediseño de Home, catalogos, historial, estadisticas o perfil;
- dependencias nuevas, navegadores E2E o fuentes externas;
- calculos nuevos de marcas personales o cambios en el criterio de mejor marca.

## Requisitos funcionales

### RF-1 - Identidad del detalle

El primer viewport debe identificar el nombre del WOD o ejercicio y mostrar su
tipo, categoria, nivel, medicion o limites disponibles con texto comprensible.
El enlace de retorno debe conservar `#/wods` o `#/exercises` segun corresponda.

### RF-2 - Lectura del WOD

La pagina de WOD debe presentar la ficha de la sesion y sus ejercicios en un
orden de lectura claro. Cada ejercicio debe conservar posicion, nombre y reps o
medicion cuando existan. Un WOD sin ejercicios debe mantener su estado vacio.

### RF-3 - Lectura del ejercicio

La pagina de ejercicio debe presentar categoria y medicion, la mejor marca cuando
el tipo de medicion es compatible y la lista de marcas existentes. Las mediciones
no registrables deben conservar un mensaje explicativo sin mostrar un formulario
inaplicable.

### RF-4 - Registro de resultados WOD

El formulario debe conservar las variantes actuales:

- `FOR_TIME`: tiempo en segundos;
- `AMRAP`: rondas y repeticiones extra;
- `EMOM`: repeticiones;
- todos: nivel y fecha/hora opcional.

El submit debe seguir generando exactamente los campos que ya espera
`createWodResult`, sin cambiar nombres ni conversiones del payload.

### RF-5 - Registro de marcas de ejercicio

El formulario debe conservar valor, tipo de marca y fecha/hora opcional. Las
opciones deben seguir dependiendo de la medicion (`WEIGHT`, `REPS`, `TIME`) y la
unidad enviada debe continuar siendo `KG`, `REPS` o `SECONDS` como hoy.

### RF-6 - Feedback de estados

Al guardar, el usuario debe percibir el estado de guardado mediante texto y el
boton debe impedir submits duplicados. Tras exito debe mostrarse feedback
comprensible y limpiarse el formulario como en el flujo actual. Tras error debe
conservarse un mensaje accesible y el formulario debe quedar disponible para
reintentar. Los estados de carga, error, vacio y privacidad de la pagina deben
seguir siendo visibles.

## Requisitos no funcionales

### RNF-1 - Accesibilidad

Cada control debe tener label asociado, foco visible y nombre accionable. Los
mensajes de error usaran `role="alert"` y el feedback de exito o guardado se
anunciara con `aria-live="polite"` o un mecanismo semantico equivalente. Se
mantendran enlaces y botones nativos.

### RNF-2 - Responsive

La interfaz debe funcionar desde 320 px sin scroll horizontal. En movil la
lectura del detalle precedera al registro, que debe seguir siendo visible y
alcanzable sin una composicion confusa. En tablet y escritorio se conservara la
composicion editorial de documento y columna de accion.

### RNF-3 - Consistencia visual

Se reutilizaran papel, tinta, naranja, navy, reglas finas, tipografia editorial y
los tokens de `frontend/src/index.css`. No se introduciran tarjetas uniformes,
dependencias UI ni una segunda direccion visual.

### RNF-4 - Integridad funcional

No se modificaran endpoints, schemas, payloads, rutas, autenticacion ni llamadas
a `getWod`, `getWodResults`, `createWodResult`, `getExercise`,
`getExerciseResults`, `getBestExerciseResult` o `createExerciseResult`.

## Criterios de aceptacion

1. El primer viewport distingue identidad del detalle, mejor marca o resultados y
   la accion de registro.
2. Los formularios tienen labels, foco visible, opciones comprensibles, errores y
   estados de guardado perceptibles y accesibles.
3. Las unidades y opciones de medicion se entienden sin depender solo del color.
4. No existe overflow horizontal en movil y la lectura es comoda en escritorio.
5. Retornos y resultados usan elementos semanticos y conservan sus rutas.
6. No cambian endpoints, payloads, reglas de negocio ni autenticacion.
7. `npm test`, `npm run lint` y `npm run build` pasan.

## Archivos previstos

- `frontend/src/pages/WodDetailPage.tsx`
- `frontend/src/pages/ExerciseDetailPage.tsx`
- `frontend/src/pages/WodDetailPage.test.tsx` si se cubren estados nuevos
- `frontend/src/pages/ExerciseDetailPage.test.tsx` si se cubren estados nuevos
- `frontend/src/index.css`

## Decisiones resueltas

- Se conservara la estructura de dos columnas en escritorio y se usara un orden
  lectura-accion en movil mediante el layout existente.
- Se usaran `dl`, `article`, `section`, `aside`, labels y headings para hacer
  explicita la estructura sin introducir un sistema de componentes nuevo.
- El feedback de exito se mantendra local a cada formulario y no se añadira un
  sistema global de notificaciones.
- Las etiquetas visibles podran traducir enums ya existentes, pero no se
  modificaran los valores enviados a la API.
cd ,,