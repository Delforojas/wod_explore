# Contexto y objetivo

Las personas que practican CrossFit consultan entrenamientos de distintos tipos,

pero muchas veces la información está dispersa o no está organizada de forma clara.

WOD Explorer será una aplicación web estática que permita consultar una colección

de WODs y ejercicios de CrossFit de forma sencilla, rápida y visual.

La primera versión utilizará únicamente datos locales en archivos JSON.

No tendrá backend, autenticación, base de datos ni conexión con APIs externas.

## Usuarios

Personas interesadas en CrossFit que quieran consultar ejemplos de WODs y ejercicios.

La aplicación será pública y no requerirá registro ni inicio de sesión.

## Historias de usuario

- H1: Como usuario quiero ver un listado de WODs para descubrir entrenamientos.

- H2: Como usuario quiero filtrar los WODs por tipo para encontrar entrenamientos

  que se adapten a lo que busco.

- H3: Como usuario quiero consultar los detalles de un WOD para conocer sus

  ejercicios y estructura.

- H4: Como usuario quiero consultar un catálogo de ejercicios para conocer los

  movimientos utilizados en los entrenamientos.

- H5: Como usuario quiero utilizar la aplicación desde móvil y escritorio sin

  problemas de visualización.

## Requisitos funcionales

### Mostrar WODs (H1)

- RF-1: CUANDO el usuario acceda a la sección de WODs, EL SISTEMA mostrará

  todos los WODs disponibles en los datos locales.

- RF-2: CADA WOD mostrado incluirá como mínimo:

  - nombre

  - tipo

  - nivel

  - resumen del entrenamiento

- RF-3: SI no existen WODs disponibles, ENTONCES EL SISTEMA mostrará un estado

  vacío indicando que no hay entrenamientos disponibles.

### Filtrar WODs (H2)

- RF-4: CUANDO el usuario seleccione un tipo de entrenamiento, EL SISTEMA

  mostrará únicamente los WODs pertenecientes a ese tipo.

- RF-5: EL SISTEMA permitirá como mínimo los siguientes filtros:

  - Todos

  - For Time

  - AMRAP

  - EMOM

- RF-6: CUANDO el usuario seleccione `Todos`, EL SISTEMA volverá a mostrar

  todos los WODs disponibles.

- RF-7: SI ningún WOD coincide con el filtro seleccionado, ENTONCES EL SISTEMA

  mostrará un mensaje indicando que no existen resultados.

### Consultar detalle de WOD (H3)

- RF-8: CUANDO el usuario seleccione un WOD, EL SISTEMA mostrará su información

  completa.

- RF-9: EL detalle del WOD mostrará como mínimo:

  - nombre

  - tipo

  - nivel

  - estructura o duración

  - ejercicios

  - repeticiones o formato del entrenamiento

  - descripción

- RF-10: SI el WOD solicitado no existe, ENTONCES EL SISTEMA mostrará un estado

  de error o recurso no encontrado sin romper la aplicación.

### Consultar ejercicios (H4)

- RF-11: CUANDO el usuario acceda a la sección de ejercicios, EL SISTEMA

  mostrará los ejercicios disponibles en los datos locales.

- RF-12: CADA ejercicio mostrará como mínimo:

  - nombre

  - categoría

  - descripción breve

- RF-13: LOS ejercicios podrán pertenecer, como mínimo, a las categorías:

  - Weightlifting

  - Gymnastics

  - Cardio

### Datos locales

- RF-14: LOS WODs se obtendrán de un archivo JSON local.

- RF-15: LOS ejercicios se obtendrán de un archivo JSON local.

- RF-16: EL SISTEMA validará los datos locales antes de utilizarlos en la

  interfaz.

- RF-17: SI los datos locales no cumplen la estructura esperada, ENTONCES EL

  SISTEMA gestionará el error sin provocar una pantalla en blanco.

### Navegación

- RF-18: EL SISTEMA proporcionará navegación entre, como mínimo:

  - Inicio

  - WODs

  - Ejercicios

- RF-19: CUANDO el usuario navegue entre las secciones, EL SISTEMA no realizará

  ninguna petición a un backend o base de datos.

## Requisitos no funcionales

- RNF-1: La aplicación deberá estar desarrollada con React y TypeScript.

- RNF-2: Los estilos deberán implementarse con Tailwind CSS.

- RNF-3: TypeScript deberá utilizar configuración estricta.

- RNF-4: La interfaz deberá seguir un enfoque responsive y mobile-first.

- RNF-5: La aplicación deberá utilizar HTML semántico y prácticas básicas de

  accesibilidad.

- RNF-6: Los datos JSON deberán validarse mediante Zod.

- RNF-7: La aplicación deberá poder compilarse correctamente mediante

  `npm run build`.

## Fuera de alcance

La Spec 001 NO incluye:

- registro de usuarios

- login

- perfiles

- backend

- base de datos

- API externa

- creación de WODs por parte del usuario

- edición o eliminación de WODs

- seguimiento de entrenamientos

- marcas personales

- estadísticas

- rankings

- boxes

- amigos

- inteligencia artificial

## Criterios de finalización

La Spec 001 se considerará completada cuando:

1. Se puedan consultar los WODs definidos localmente.

2. Los WODs puedan filtrarse por tipo.

3. Se pueda consultar el detalle de un WOD.

4. Se pueda consultar el catálogo de ejercicios.

5. Los datos JSON sean validados antes de utilizarse.

6. La navegación funcione correctamente.

7. La interfaz sea usable en móvil y escritorio.

8. No existan errores de TypeScript.

9. El lint pase correctamente.

10. `npm run build` finalice correctamente.