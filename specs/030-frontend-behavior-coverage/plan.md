# Plan - Spec 030 Cobertura de comportamiento del frontend

## Objetivo tecnico

Convertir la suite de Vitest en una suite de comportamiento React capaz de
renderizar componentes, simular interacciones y comprobar estados visibles sin
servicios externos.

## Decisiones tecnicas

### 1. Entorno de test

Se añadiran `@testing-library/react`, `@testing-library/user-event` y `jsdom` como
dependencias de desarrollo. Se creara `vitest.config.ts` con:

- plugin React existente;
- `environment: "jsdom"`;
- el mismo transform de Vite que usa la aplicacion.

No se añadira un navegador E2E ni MSW: los componentes consumen un cliente API
modular que puede mockearse de forma determinista y la Issue no exige probar la
red real.

### 2. Utilidades de test

Se creara un helper pequeno en `src/test/test-utils.tsx` para montar componentes
con un `AuthContextValue` controlado y evitar duplicar providers en cada prueba.
El helper no contendra logica de produccion ni aserciones globales.

Cada test limpiara mocks, `sessionStorage`, `localStorage` y `window.location`
cuando corresponda. Las peticiones pendientes usaran Promises controladas para
verificar carga antes de resolver.

### 3. Cobertura por superficie

#### Sesion y autenticacion

- `AuthContext.test.tsx`: recuperar usuario desde un token existente, login,
  registro, logout y evento de sesion expirada.
- `AuthPage.test.tsx`: envio de login y registro, navegacion de exito y mensaje
  de error de API o red.
- `client.test.ts`: conservar cobertura de headers, añadir red, `401` y payload
  invalido.

#### Router y layout

- `router.test.ts`: rutas validas, IDs, fallback, trailing slash y `navigate`.
- `Layout.test.tsx`: enlaces principales, estado autenticado/no autenticado,
  perfil, logout y navegacion mediante teclado/activacion de enlaces.

#### Catalogos y detalles

- `WodsPage.test.tsx` y `ExercisesPage.test.tsx`: carga, error, vacio, exito,
  filtros/busqueda y paginacion observable.
- `WodDetailPage.test.tsx`: carga, error, vacio de resultados, contenido y los
  payloads de `FOR_TIME`, `AMRAP` y `EMOM`.
- `ExerciseDetailPage.test.tsx`: carga, error, vacio, contenido y formularios
  de `WEIGHT`, `REPS`, `TIME` y medicion no registrable.

#### Historial y rendimiento

- `HistoryPage.test.tsx`: estado privado, carga, error, vacio, datos y enlaces a
  detalles.
- `StatisticsPage.test.tsx`: estado privado, carga, error, estadisticas vacias,
  estadisticas con marcas y evolucion visible.

Los tests de detalle probaran el cliente API mediante mocks, no el backend ni
los schemas de persistencia.

### 4. Correcciones permitidas

Si una prueba de comportamiento demuestra una regresion real del flujo existente
o un defecto que impide cumplir el contrato ya documentado, se corregira solo el
archivo de produccion afectado y se añadira una prueba de regresion. No se
rediseñara la funcionalidad para facilitar los tests.

## Flujo de implementacion

1. Añadir dependencias y configuracion DOM de Vitest.
2. Crear el helper de contexto y aislamiento.
3. Ampliar router, cliente y autenticacion.
4. Añadir cobertura de layout y paginas de autenticacion.
5. Añadir cobertura de catalogos, detalles y formularios.
6. Añadir cobertura de historial, estadisticas y evolucion.
7. Actualizar la documentacion de testing del frontend.
8. Ejecutar tests, lint y build; corregir solo fallos relacionados.
9. Revisar alcance, staging y commit.

## Riesgos y mitigaciones

### React StrictMode y efectos

Riesgo: efectos de carga ejecutados mas de una vez en desarrollo o tests.

Mitigacion: esperar estados observables, limpiar mocks entre tests y no afirmar
una sola llamada salvo cuando sea parte del contrato.

### Asincronia

Riesgo: asserts antes de que React procese una respuesta.

Mitigacion: usar las utilidades async de Testing Library y Promises controladas.

### Acoplamiento al DOM

Riesgo: tests fragiles por clases CSS o estructura incidental.

Mitigacion: consultar roles, labels, texto visible, valores y hrefs publicos.

### Dependencias innecesarias

Riesgo: incorporar un stack de testing mayor que el necesario.

Mitigacion: no añadir jest-dom, MSW, Playwright ni Testing Library adicional
salvo que una limitacion concreta de la implementación lo justifique.

## Verificaciones

Desde `frontend/` y usando solo scripts existentes:

```bash
npm test
npm run lint
npm run build
```

El build debe validar TypeScript estricto. Se comprobara que la instalacion
limpia puede resolver las dependencias mediante `package-lock.json` y que no
aparecen referencias a backend, Docker, MySQL o secretos en los tests.
