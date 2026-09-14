# Spec 030 - Cobertura de comportamiento del frontend

## Estado

Completada en la rama `feat/030-frontend-behavior-coverage`.

## Contexto

El frontend integrado de WOD Explorer utiliza React 19, TypeScript estricto,
Vite, Vitest, Zod y un router hash propio. La suite actual cubre principalmente
el cliente HTTP, los schemas y una parte minima del router, pero no valida de
forma ejecutable los flujos visibles que sostienen la experiencia del usuario.

La Issue #30 solicita ampliar esa cobertura sin convertirla en una suite E2E ni
acoplarla al backend, Docker, MySQL o datos personales.

## Objetivo

Cubrir con pruebas de comportamiento los flujos frontend criticos ya
implementados, usando mocks deterministas de la API y verificando resultados
visibles, navegacion, interacciones, estados y errores.

## Alcance

Esta spec incluye pruebas para:

- login, registro, logout y recuperacion de sesion;
- expiracion de sesion ante `401` y navegacion a `#/login`;
- parseo de rutas hash y navegacion principal;
- catalogos y detalles de WODs y ejercicios en carga, error, vacio y exito;
- formularios WOD para `FOR_TIME`, `AMRAP` y `EMOM`;
- formulario de marcas segun medicion y `recordType` compatible;
- historial, estadisticas y evolucion con datos vacios y datos validos;
- errores de red, payloads invalidos y mensajes visibles;
- configuracion de Vitest para renderizado React en un DOM de prueba;
- documentacion de la estrategia y dependencias de testing.

## Fuera de alcance

No se implementara:

- cambios funcionales de producto no demostrados por una prueba;
- tests de contrato del backend o persistencia MySQL;
- tests E2E contra servicios desplegados;
- navegadores automatizados o proveedores externos;
- perfil, favoritos, roles o nuevas funcionalidades;
- cambios de API, schemas de produccion o contratos REST;
- correcciones cosméticas no necesarias para hacer testeable un flujo existente.

## Requisitos funcionales

### RF-1 - Autenticacion y sesion

La suite debera verificar el comportamiento visible de login, registro, logout
y recuperacion de una sesion existente. Los tests deberan comprobar que el token
se usa mediante el contexto existente y que no se almacena en `localStorage`.

### RF-2 - Sesion expirada

La suite debera verificar que un `401` en una peticion protegida emite el evento
de sesion expirada, limpia la sesion y conduce la aplicacion a `#/login` cuando
el `AuthProvider` esta montado.

### RF-3 - Rutas y navegacion

La suite debera comprobar el parseo de rutas validas, el fallback de rutas
desconocidas y la navegacion mediante enlaces hash visibles.

### RF-4 - Catalogos y detalles

Las paginas de WODs y ejercicios, y sus paginas de detalle, deberan tener
pruebas para:

- estado de carga;
- error de red;
- respuesta vacia;
- respuesta valida con contenido visible.

Las pruebas no dependeran de un servidor real.

### RF-5 - Registro de resultados

Las pruebas deberan verificar que los formularios generan el payload visible y
compatible con la API para:

- WOD `FOR_TIME` con tiempo;
- WOD `AMRAP` con rondas y repeticiones;
- WOD `EMOM` con repeticiones;
- ejercicios de medicion `WEIGHT`, `REPS` y `TIME`, respetando sus opciones de
  `recordType` y unidad.

### RF-6 - Historial y rendimiento

Las paginas de historial y estadisticas deberan comprobar los estados vacios y
las respuestas con datos para historial, estadisticas y evolucion.

### RF-7 - Errores y contratos

La suite debera verificar errores de red, respuestas HTTP `401` y respuestas
JSON invalidas, incluyendo que el usuario recibe mensajes comprensibles en
español cuando el flujo visual los muestra.

## Requisitos no funcionales

### RNF-1 - Determinismo

Los tests deberan usar mocks locales y datos declarados en cada escenario. No
deberan requerir `.env`, Docker, MySQL, el backend ni datos personales.

### RNF-2 - Comportamiento observable

Se priorizaran roles, texto visible, valores de formularios, enlaces, cambios de
hash, estados de carga y llamadas publicas al cliente API. No se probaran hooks
privados, estado interno ni estructura DOM sin valor de comportamiento.

### RNF-3 - Dependencias controladas

Se mantendra Vitest y se añadiran unicamente:

- `@testing-library/react` para renderizar componentes React y consultar el DOM;
- `@testing-library/user-event` para simular interacciones de usuario;
- `jsdom` para proporcionar el entorno DOM.

Estas dependencias se justifican porque Vitest por si solo no puede ejecutar de
forma fiable los flujos de formularios, enlaces, eventos y estados visibles de
componentes React en el entorno Node actual.

### RNF-4 - Compatibilidad

La estrategia sera compatible con React 19, TypeScript estricto, Vitest 5 y
Node.js soportado por el proyecto. No se añadira Testing Library de aserciones
ni un navegador automatizado si no aportan cobertura necesaria.

## Criterios de aceptacion

1. Los flujos criticos enumerados tienen pruebas de comportamiento ejecutables
   mediante `npm test`.
2. Las pruebas verifican resultados visibles, navegacion, headers y estados sin
   acoplarse innecesariamente a implementacion privada.
3. Se cubren respuestas vacias, `401`, errores de red y payloads invalidos.
4. Ninguna prueba depende de `.env`, Docker, MySQL, backend levantado o datos
   personales.
5. La suite permanece determinista y rapida.
6. `npm test` pasa en una instalacion limpia.
7. La estrategia y las dependencias quedan documentadas y coinciden con
   `frontend/package.json`.
8. `npm run lint` y `npm run build` pasan sin errores de TypeScript.

## Archivos previstos

- `frontend/package.json`
- `frontend/package-lock.json`
- `frontend/vitest.config.ts`
- `frontend/tsconfig.node.json`
- `frontend/src/test/test-utils.tsx`
- tests de `frontend/src/auth/`, `frontend/src/app/`, `frontend/src/components/`
  y `frontend/src/pages/`.
- `frontend/README.md`

## Decisiones resueltas

- Se usara `@testing-library/react` y `jsdom` porque la Issue exige probar
  comportamiento visible de React y el proyecto no tiene entorno DOM.
- Se usara `user-event` para formularios y navegacion, evitando simular solo
  llamadas directas a handlers.
- Los mocks se realizaran en cada modulo de test con Vitest; no se levantara un
  servidor HTTP falso ni se incorporara MSW por no ser necesario para estos
  contratos.
- Se mantendra el cliente API real en los tests de cliente y se mockearan las
  funciones publicas en tests de paginas para aislar la UI.

## Verificaciones

Desde `frontend/`:

```bash
npm test
npm run lint
npm run build
```

Se revisara tambien que no se hayan modificado backend, schemas de produccion,
API REST ni funcionalidades fuera del alcance.
