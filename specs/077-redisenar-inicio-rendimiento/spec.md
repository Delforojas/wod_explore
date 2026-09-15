# Spec 077 - Redisenar la pagina Inicio con enfoque en entrenamiento y rendimiento

## Estado

Planificada para la rama `feat/077-redisenar-inicio-rendimiento`.

## Fuente de verdad

La Issue #77 define el alcance funcional. `DESIGN.md` define la identidad visual
vigente: **El rendimiento es la interfaz**. La Issue #76 ya implementa esa base
global en la rama de la que parte esta Issue.

## Contexto

La portada actual conserva una composicion editorial con un bloque visual
decorativo, copy de presentacion y tarjetas de acceso. Inicio no consulta datos
propios ni dispone de metricas de usuario en sus contratos. La Issue #77 permite
reemplazar esa composicion por una entrada operativa orientada a elegir una
accion de entrenamiento y continuar hacia el seguimiento real del usuario.

## Objetivo

Redisenar completamente `HomePage` para que la primera ventana comunique el uso
de WOD Explorer como herramienta de entrenamiento, haga evidente la accion de
explorar un WOD y presente de forma escaneable los accesos existentes a
ejercicios, historial y estadisticas.

## Alcance

- Reemplazar la estructura JSX y las clases de composicion de `HomePage`.
- Reescribir unicamente el CSS especifico de Inicio en
  `frontend/src/index.css`, reutilizando los tokens globales de #76.
- Mantener los cuatro destinos actuales de Inicio: WODs, ejercicios, historial
  y estadisticas.
- Mantener los enlaces hash reales y los landmarks HTML accesibles.
- Adaptar la composicion desde 320 px, tablet y escritorio.
- Actualizar la prueba de navegacion de Inicio si cambia el heading o el texto
  accesible observable.

## Fuera de alcance

- Otras paginas, shell compartida o navegacion global salvo una necesidad
  estricta de integracion con Inicio.
- Nuevas metricas, calculos, objetivos, rankings, actividad ficticia o datos de
  muestra. Inicio no tiene una fuente de datos propia que justifique esos
  elementos.
- Cambios en API, schemas, router, autenticacion, backend, base de datos,
  persistencia o dependencias.
- Copiar textos, branding, imagenes o assets de referencias externas.
- Crear un sistema visual paralelo o recuperar la composicion editorial
  anterior.

## Requisitos funcionales

### RF-1 - Entrada de entrenamiento

La primera ventana debe comunicar que WOD Explorer sirve para encontrar,
consultar y seguir trabajo de entrenamiento. La accion primaria para explorar
WODs debe identificarse sin depender de una ilustracion decorativa.

### RF-2 - Rutas existentes

Inicio debe conservar enlaces reales a `#/wods`, `#/exercises`, `#/history` y
`#/statistics`. Sus nombres accesibles deben explicar el destino y no deben
presentar acciones inexistentes.

### RF-3 - Jerarquia sin datos inventados

La composicion puede priorizar acciones y contexto deportivo, pero no puede
presentar metricas o estados que no existan en la informacion disponible para
Inicio.

### RF-4 - Responsive y accesibilidad

La portada debe funcionar desde 320 px hasta escritorio, sin overflow
horizontal, con orden de lectura logico, enlaces de al menos 44 px, headings
coherentes y foco visible mediante los estilos globales.

## Criterios de aceptacion

1. Inicio utiliza coherentemente los tokens y primitives de `DESIGN.md` y #76.
2. La composicion anterior deja de ser editorial y decorativa.
3. El entrenamiento y la accion de explorar WODs tienen prioridad visual.
4. Los accesos a ejercicios, historial y estadisticas son inmediatamente
   identificables y mantienen sus rutas actuales.
5. No se muestran metricas, datos o funcionalidades inventadas.
6. La portada se adapta desde 320 px hasta escritorio sin overflow evitable ni
   recortes de texto.
7. Los enlaces siguen siendo navegables mediante teclado y conservan foco,
   nombres accesibles y contraste suficiente.
8. No se introducen cambios fuera de Inicio, dependencias ni API.
9. `npm test`, `npm run lint` y `npm run build` pasan.

## Direction contract

**THESIS:** Inicio es una mesa de entrada al trabajo, no una portada editorial;
rechaza el hero ornamental y pone la siguiente accion a la vista.

**OWN-WORLD:** superficies `background`, `surface` y `surface-raised`, reglas de
1 px, sans-serif Inter con fallback, naranja solo para accion/foco/seleccion y
filas densas con valores contextuales, sin ilustracion necesaria.

**STORY:** una persona entiende que puede empezar por un WOD y que sus otros
destinos sirven para consultar movimientos o revisar el trabajo ya registrado.

**FIRST VIEWPORT:** encabezado compacto con el proposito y la accion primaria;
debajo, un panel amplio de exploracion WOD y una columna de rutas de seguimiento
que colapsa en una lista vertical en movil.

**FORM:** tablero operativo asimetrico, elegido como una extension directa del
modo Operate de #76, no como una coleccion de tarjetas homogeneas.

**FINISH:** unreviewed and undocumented is unfinished; this build ends with the
finish review, the verdict, DESIGN.md, and every shipping raster carrying its
provenance.

## Referencias

- `docs/constitution.md`
- `PRODUCT.md`
- `AGENTS.md`
- `frontend/AGENTS.md`
- `DESIGN.md`
- `frontend/src/pages/HomePage.tsx`
- `frontend/src/components/Layout.tsx`
- `frontend/src/app/router.ts`
- `frontend/src/App.test.tsx`
- `specs/036-redisenar-dashboard-principal/spec.md`
- `specs/076-redefinir-sistema-visual-global-shell-layout/spec.md`
