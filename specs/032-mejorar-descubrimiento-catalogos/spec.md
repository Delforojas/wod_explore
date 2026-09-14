# Spec 032 - Mejorar descubrimiento de WODs y ejercicios

## Estado

Completada en la rama `feat/032-mejorar-descubrimiento-catalogos`.

## Contexto

WOD Explorer ya dispone de un shell responsive y de catalogos funcionales para
WODs y ejercicios. La Issue #32 solicita que esas superficies ayuden mejor a
descubrir contenido: el usuario debe entender rapidamente que puede explorar,
identificar el contexto de cada resultado y avanzar por el catalogo sin perder
la orientacion.

La solucion debe continuar el lenguaje editorial deportivo definido en
`DESIGN.md` y apoyarse en los contratos existentes del frontend. Los WODs y
ejercicios siguen siendo datos privados servidos por el cliente API actual.

## Objetivo

Hacer que Home, el catalogo de WODs y el catalogo de ejercicios sean mas
escaneables, orientados a la exploracion y claros en movil, tablet y escritorio,
sin cambiar la funcionalidad de negocio ni los endpoints existentes.

## Alcance

Esta spec incluye:

- reforzar la jerarquia editorial de Home y sus llamadas a la accion;
- mejorar la lectura de las filas de WODs y ejercicios con metadatos utiles;
- hacer mas evidente el contexto de busqueda y filtros aplicados;
- mejorar los estados vacio, error y carga sin cambiar sus contratos;
- pulir hover, focus-visible, targets tactiles y responsive de estas superficies;
- mejorar la orientacion de la paginacion manteniendo pagina, `hasNext` y
  callbacks existentes;
- añadir o ajustar pruebas de comportamiento si el cambio visual modifica texto
  o interacciones observables.

## Fuera de alcance

No se implementara:

- nuevos endpoints, cambios de API o cambios de schemas;
- cambios en backend, base de datos, Docker o autenticacion;
- favoritos, recomendaciones personalizadas, ranking o nuevas capacidades de
  usuario;
- nuevas fuentes locales de datos ni duplicacion de los catalogos JSON;
- cambios en el router o en las rutas publicas existentes;
- rediseño del detalle de WODs, ejercicios, historial, estadisticas o perfil;
- paginacion numerica, ordenacion avanzada o filtros no soportados por la API;
- dependencias nuevas sin una necesidad tecnica demostrable.

## Requisitos funcionales

### RF-1 - Home orientada a explorar

Home debe comunicar de forma inmediata que el usuario puede explorar WODs y
ejercicios. Las llamadas a la accion existentes deben seguir navegando a `#/wods`
y `#/exercises`. Los paneles de WODs, Evolucion e Historial deben conservar sus
rutas actuales y seguir siendo enlaces accesibles mediante teclado.

### RF-2 - Catalogo de WODs escaneable

El catalogo de WODs debe presentar nombre, tipo y nivel de forma distinguible en
cada resultado. Los filtros de nombre, tipo y nivel deben conservar sus valores,
labels asociados, submit explicito y reinicio de pagina a cero al aplicar una
nueva combinacion.

### RF-3 - Catalogo de ejercicios escaneable

El catalogo de ejercicios debe presentar nombre, categoria y tipo de medicion de
forma distinguible. La busqueda debe conservar el submit explicito, la consulta
aplicada y la navegacion a `#/exercises/:id`.

### RF-4 - Contexto de exploracion

Cuando exista una respuesta valida, la interfaz debe ayudar a entender el
contexto actual mediante titulos, notas de resultados o indicadores equivalentes
sin inventar informacion que el contrato API no proporciona. El numero visible
de pagina debe seguir siendo correcto y la paginacion no debe ofrecer avanzar
cuando `hasNext` es falso.

### RF-5 - Estados y privacidad

Deben conservarse los estados existentes:

- sin token: mensaje de catalogo privado y enlace a iniciar sesion;
- cargando: estado de carga visible;
- error: mensaje en espanol y accion de reintento;
- respuesta vacia: mensaje util para ampliar o cambiar la busqueda;
- respuesta con datos: resultados navegables y paginacion cuando corresponda.

Los cambios de estilo o copy no deben ocultar estos estados ni eliminar sus
roles, nombres accesibles o acciones.

## Requisitos no funcionales

### RNF-1 - Responsive

La experiencia debe funcionar sin scroll horizontal en movil desde 320 px,
mantener una composicion util en tablet y aprovechar el espacio disponible en
escritorio. Los controles deben conservar targets tactiles de al menos 44 px.

### RNF-2 - Accesibilidad

Se mantendran HTML semantico, labels asociados, enlaces reales, botones reales,
focus-visible de alto contraste y estados anunciables mediante texto o
`aria-live` cuando ya exista ese contrato. No se usaran handlers sobre `div` como
sustituto de elementos interactivos.

### RNF-3 - Consistencia visual

Se reutilizaran los tokens y patrones editoriales existentes: papel, tinta,
naranja de acento, navy, tipografia serif para titulares y lineas de catalogo.
No se introducira una segunda direccion visual ni un bloque de UI generico que
rompa la composicion de la Issue #31.

### RNF-4 - Integridad funcional

Los cambios no deben alterar llamadas a `getWods` o `getExercises`, parametros de
paginacion, rutas hash, autenticacion ni la semantica de los estados cubiertos
por la suite de Vitest.

### RNF-5 - Verificacion

Desde `frontend/` deben pasar los scripts existentes:

```bash
npm test
npm run lint
npm run build
```

## Criterios de aceptacion

1. Home prioriza visualmente la exploracion de WODs y ejercicios sin perder sus
   rutas actuales.
2. Las filas de ambos catalogos permiten identificar rapidamente el nombre y sus
   metadatos principales en desktop y movil.
3. Los filtros y la busqueda tienen jerarquia clara, labels visibles y siguen
   aplicandose solo al enviar el formulario.
4. Los estados privado, carga, error, vacio y exito siguen siendo visibles,
   comprensibles y accesibles.
5. La paginacion comunica la pagina actual, bloquea acciones durante carga y
   respeta los limites del contrato `hasNext`.
6. No hay overflow horizontal en los breakpoints movil revisados y los controles
   principales son utilizables con teclado y tacto.
7. No se modifican backend, base de datos, contratos API ni rutas existentes.
8. `npm test`, `npm run lint` y `npm run build` pasan.

## Archivos previstos

- `frontend/src/pages/HomePage.tsx`
- `frontend/src/pages/WodsPage.tsx`
- `frontend/src/pages/ExercisesPage.tsx`
- `frontend/src/components/PaginationControls.tsx` si se requiere una mejora
  estrictamente presentacional
- `frontend/src/index.css`
- tests de las superficies anteriores solo si resultan necesarios por cambios
  observables

## Decisiones resueltas

- Se mantendran las filas editoriales como patron base en vez de introducir
  tarjetas con imagenes o datos que la API no entrega.
- El contexto se expresara con copy y metadatos ya disponibles en los modelos,
  no con nuevos calculos ni consultas.
- La busqueda y los filtros continuaran siendo submit-driven para evitar cambios
  de comportamiento y peticiones por pulsacion.
- La paginacion seguira siendo anterior/siguiente; la mejora sera de orientacion
  y legibilidad, no de contrato.
