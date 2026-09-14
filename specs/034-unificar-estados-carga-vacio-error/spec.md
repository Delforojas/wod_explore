# Spec 034 - Unificar estados de carga, vacio y error

## Estado

Completada en la rama `feat/034-unificar-estados-ui`.

## Contexto

WOD Explorer ya utiliza `StateMessage` y `LoadingMessage` en varias paginas,
pero ambas primitives solo ofrecen una diferencia basica entre estado neutral y
error. Los mensajes de carga, privacidad, vacio, error de red, sesion caducada y
exito no comparten una jerarquia visual suficientemente explicita y algunos
formularios mantienen feedback paralelo fuera de la primitive compartida.

## Objetivo

Crear un lenguaje visual y de interaccion consistente para los estados dinamicos
del frontend, con mensajes en espanol que expliquen la situacion y una accion
operable cuando exista una recuperacion util.

## Alcance

- Ampliar `StateMessage` y `LoadingMessage` con variantes semanticas para carga,
  vacio, error, error de red, privacidad, sesion caducada y exito.
- Mantener roles, `aria-live`, atomicidad, `aria-busy`, foco visible y controles
  nativos sin duplicar anuncios innecesariamente.
- Aplicar las primitives en auth, WODs, ejercicios, detalles, historial,
  estadisticas y perfil.
- Unificar los mensajes de error y exito de formularios con el mismo lenguaje
  visual sin cambiar sus payloads ni operaciones.
- Diferenciar el caso de sesion caducada al redirigir a login, conservando el
  comportamiento existente de eliminar el token y navegar.
- Mejorar la estabilidad visual de los estados de carga y la adaptacion desde
  320 px usando los tokens CSS existentes.
- Añadir tests de comportamiento para variantes y superficies relevantes.

## Fuera de alcance

- Nuevos endpoints, cambios de API, schemas, payloads o reglas de negocio.
- Cambios en backend, MySQL, Docker, persistencia de catalogo o autenticacion
  mas alla del mensaje de sesion caducada.
- Dependencias nuevas, icon libraries, fuentes externas o navegadores E2E.
- Cambios en el router hash, rutas, paginacion o llamadas de red existentes.
- Rediseños de contenido fuera de los estados afectados.

## Requisitos funcionales

### RF-1 - Primitive compartida

`StateMessage` debe representar los estados de vacio, error, error de red,
privacidad, sesion caducada y exito mediante variantes explicitas. `LoadingMessage`
debe conservar el texto `Cargando` y comunicar que la interfaz esta esperando
datos.

### RF-2 - Cobertura de superficies

Auth, Home cuando corresponda, catalogos, detalles, historial, estadisticas y
perfil deben usar mensajes consistentes para sus estados de carga, vacio, error,
privacidad y exito aplicables. Los estados vacios deben orientar al siguiente paso
cuando exista una accion util.

### RF-3 - Recuperacion

Los errores deben mostrar una explicacion comprensible y conservar una accion
operable por teclado y touch cuando la superficie ya disponga de recuperacion o
retorno seguro. La sesion caducada debe indicar que hay que volver a iniciar
sesion.

### RF-4 - Formularios

Los estados de guardado, exito y error de login, registro y resultados deben ser
perceptibles y no permitir submits duplicados. Los formularios deben quedar
disponibles para reintentar tras un error.

### RF-5 - Integridad

Se deben conservar endpoints, parametros, payloads, rutas hash, control de
errores de API y almacenamiento temporal del JWT.

## Requisitos no funcionales

### RNF-1 - Accesibilidad

Los estados dinamicos deben usar una semantica de anuncio coherente: errores
urgentes con `role="alert"` y estados informativos con `role="status"`,
`aria-live="polite"` y `aria-atomic="true"` cuando corresponda. La carga debe
comunicar `aria-busy="true"`. No se deben emitir anuncios duplicados por añadir
atributos redundantes a un `alert`.

### RNF-2 - Responsive

Los mensajes deben conservar legibilidad y acciones utilizables desde 320 px,
sin overflow horizontal ni cambios bruscos de altura al pasar a contenido.

### RNF-3 - Consistencia visual

Se reutilizaran papel, tinta, navy, naranja, verde de exito, reglas y tipografia
editorial de `frontend/src/index.css`. Cada variante debe tener una señal visual
ademas del texto y del color.

### RNF-4 - Calidad

No se añadiran dependencias. Deben pasar `npm test`, `npm run lint` y
`npm run build`.

## Criterios de aceptacion

1. Cada pantalla aplicable tiene estados de carga, vacio y error reconocibles y
   visualmente consistentes.
2. Los estados vacios orientan al siguiente paso cuando existe una accion util.
3. Los errores explican lo ocurrido y ofrecen recuperacion operable cuando
   corresponde.
4. Los cambios dinamicos son anunciables sin duplicar mensajes ni generar ruido
   excesivo.
5. La carga y el contenido mantienen una composicion estable y responsive.
6. Auth distingue una sesion caducada de una visita no autenticada.
7. No se añaden dependencias ni se cambia la logica de negocio, API o persistencia.
8. `npm test`, `npm run lint` y `npm run build` pasan.

## Archivos previstos

- `frontend/src/components/StateMessage.tsx`
- `frontend/src/index.css`
- `frontend/src/auth/context.ts`
- `frontend/src/auth/AuthContext.tsx`
- `frontend/src/test/test-utils.tsx`
- paginas y tests de auth, catalogos, detalles, historial, estadisticas y perfil
  cuando el estado observable lo requiera.

## Decisiones resueltas

- Se usaran variantes explicitas en una primitive compartida en vez de varios
  booleanos o componentes visuales duplicados.
- `role="alert"` se reservara para errores; carga, vacio, privacidad, sesion
  caducada y exito usaran `role="status"` con anuncio polite.
- El evento existente `wod-explorer:session-expired` seguira eliminando el JWT y
  navegando a login; solo añadira una señal de contexto para explicar el motivo.
- La deteccion de error de red usara el status `0` ya existente en `ApiError`,
  sin cambiar el contrato del cliente.
- Las acciones existentes de reintento, login o retorno se conservaran; no se
  añadira una capa global de notificaciones.
