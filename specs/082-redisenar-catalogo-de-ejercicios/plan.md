# Plan - Issue #82: Redisenar catalogo de Ejercicios

## Estrategia

Refinar solo `ExercisesPage` y sus estilos locales para convertir la superficie
en un indice operativo. Se conservaran los componentes globales, el cliente API,
los schemas, las rutas hash y el comportamiento submit-driven de la busqueda.
La lista usara filas continuas con divisores y metadatos alineados, no una
cuadricula de cards ni una tabla con scroll obligatorio.

## Secuencia

1. Crear y validar este SDD con el contrato actual de ejercicios y el alcance de
   la Issue #82.
2. Reorganizar el markup de `ExercisesPage` manteniendo `getExercises`, estados,
   labels, enlaces y `PaginationControls`.
3. Ajustar los textos visibles solo para mejorar orientacion y conservar en
   español la consulta aplicada, contador y tipo de medicion.
4. Sustituir los overrides especificos antiguos del catalogo de ejercicios en
   `frontend/src/index.css` por una estructura densa basada en superficies,
   bordes, tipografia sans y responsive mobile-first.
5. Mantener o ampliar los tests de comportamiento para carga, vacio, error,
   resultados, busqueda, paginacion, privacidad, enlaces y metadatos.
6. Ejecutar tests, lint, build, `git diff --check` y el detector mecanico de
   Impeccable sobre los targets finales.
7. Revisar el diff, completar las tasks, crear un commit selectivo de #82 y
   documentar la Issue sin hacer push ni cerrarla.

## Decisiones

- El catalogo es un indice de trabajo: las filas y columnas de datos comunican
  mejor la comparacion que cards ornamentales.
- Solo se conserva la busqueda por nombre que existe en `getExercises`; no se
  inventan filtros de categoria o medicion porque no hay contrato para ellos y
  la Issue los excluye como funcionalidad nueva.
- Categoria y medicion se muestran con etiquetas textuales, no solo mediante
  color, y el nombre conserva la mayor jerarquia de cada fila.
- Se usara `frontend/src/index.css` porque es el mecanismo real del frontend;
  no se anadira Tailwind ni dependencias nuevas.
- Los estados globales y la paginacion permanecen en sus componentes actuales
  para evitar duplicacion y regresiones.

## Riesgos y controles

- **Regresion de contrato:** tests sobre argumentos de `getExercises`, query
  aplicada, pagina y enlaces.
- **Perdida de estados:** conservar ramas explicitas de privado, carga, error,
  red, vacio y datos.
- **Overflow movil:** `min-width: 0`, wrapping, columnas colapsables y busqueda
  de una columna desde el breakpoint movil existente.
- **Baja escaneabilidad:** priorizar nombre y metadatos tecnicos con encabezados,
  labels y alineacion estable.
- **Direccion visual inconsistente:** reutilizar tokens de `DESIGN.md` y evitar
  decoracion sin funcion.

## Verificacion de alcance

Los cambios esperados quedan limitados a:

- `frontend/src/pages/ExercisesPage.tsx`.
- `frontend/src/pages/ExercisesPage.test.tsx`.
- `frontend/src/index.css`.
- `specs/082-redisenar-catalogo-de-ejercicios/spec.md`.
- `specs/082-redisenar-catalogo-de-ejercicios/plan.md`.
- `specs/082-redisenar-catalogo-de-ejercicios/tasks.md`.

No se esperan cambios en backend, base de datos, API, schemas, router,
dependencias ni archivos untracked existentes.
