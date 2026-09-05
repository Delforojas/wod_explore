# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Practicantes individuales de CrossFit y coaches o boxes que necesitan consultar
WODs y ejercicios, encontrar entrenamientos adecuados y registrar o revisar
sesiones realizadas.

## Product Purpose

WOD Explorer permite explorar WODs y ejercicios de CrossFit mediante un catálogo
local, buscar y filtrar entrenamientos, guardar favoritos y mantener un historial
personal de entrenamientos realizados. El producto tiene éxito cuando el usuario
puede encontrar un WOD, consultar su detalle, registrarlo y volver a revisar esa
información de forma sencilla.

## Positioning

Es un catálogo local sencillo que combina el descubrimiento de WODs con un
historial personal persistido en el navegador, sin cuentas ni servicios externos.

## Operating Context

La aplicación se utiliza directamente en el navegador y no requiere autenticación
ni conexión a un backend. Los WODs y ejercicios se leen desde JSON local; los
favoritos y el historial se conservan en `localStorage`. Los flujos principales
son explorar el catálogo, buscar o filtrar WODs, consultar un detalle, gestionar
favoritos y registrar, consultar o eliminar entrenamientos del historial.

## Capabilities and Constraints

- El idioma principal de la interfaz es español.
- La aplicación debe mantener una interfaz responsive y mobile-first.
- La implementación debe mantener compatibilidad con React, TypeScript y Tailwind
  CSS.
- No se añadirá backend, base de datos ni API externa.
- Los datos actuales deben mantenerse en JSON local y `localStorage`.
- Deben conservarse las funcionalidades de catálogo de WODs, filtros, búsqueda,
  favoritos e historial de entrenamientos.
- Cualquier rediseño debe centrarse en UI/UX, composición visual, jerarquía,
  responsive y consistencia.
- La lógica de negocio no debe modificarse salvo que sea estrictamente necesario
  para adaptar la interfaz.
- No se añadirán dependencias sin una necesidad clara.
- TypeScript debe mantenerse en modo estricto y se debe evitar `any`.
- La aplicación debe seguir pasando `npm test`, `npm run lint` y `npm run build`.
- No existen por ahora requisitos legales, de marca o de despliegue adicionales.

## Brand Commitments

El nombre del producto es WOD Explorer. Los textos visibles de la interfaz y la
documentación del proyecto deben mantenerse en español. No hay otros compromisos
de marca definidos por ahora.

## Evidence on Hand

- Catálogo de WODs en `src/data/wods.json`.
- Catálogo de ejercicios en `src/data/exercises.json`.
- Implementación existente de catálogo, filtros, búsqueda, favoritos e historial.
- Tests de lógica, validación, persistencia, componentes, navegación y regresión
  en `tests/`.
- No hay testimonios, clientes, métricas, requisitos legales ni activos de marca
  adicionales que deban representarse.

## Product Principles

- Priorizar una exploración y un registro de entrenamientos simples y claros.
- Preservar los flujos existentes al mejorar la interfaz.
- Mantener la experiencia usable en móvil, escritorio y teclado.
- Preferir datos locales y una arquitectura frontend sencilla.
- Evitar infraestructura, dependencias o cambios de negocio innecesarios.

## Accessibility & Inclusion

La aplicación debe cumplir un nivel básico de accesibilidad WCAG mediante HTML
semántico, navegación completa por teclado, foco visible y labels accesibles.
Los mensajes de error deben ser comprensibles y los controles principales deben
seguir siendo utilizables en distintos tamaños de pantalla.

Tienes libertad para redefinir el lenguaje visual, layout, tipografía, spacing, cards, navegación y presentación del contenido, siempre que se respeten las restricciones anteriores.