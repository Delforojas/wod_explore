# Spec 076 - Redefinir el sistema visual global y el shell/layout

## Estado

Pendiente de revision del usuario en la rama
`feat/076-global-visual-system-shell-v2`.

## Fuente de verdad

La Issue #76 define el objetivo y el alcance funcional. `DESIGN.md`, actualizado
con la nueva gobernanza visual, define la identidad que debe implementar esta
Issue: **"El rendimiento es la interfaz"**.

Esta spec no sustituye ni reinterpreta `DESIGN.md`. Lo convierte en decisiones
implementables para el sistema global y el shell. Si durante la implementacion
aparece una decision durable que no este documentada, `DESIGN.md` se actualizara
como parte de esta Issue despues de validar que la decision es necesaria y no
pertenece a una migracion de pagina posterior.

## Contexto

WOD Explorer es una herramienta de operacion para consultar WODs, registrar
resultados y revisar rendimiento. El frontend actual conserva una estetica
editorial con papel, serif y varias composiciones especificas por pagina. La
Issue #76 reemplaza ese lenguaje en sus fundamentos globales, pero no autoriza
rehacer individualmente las pantallas de Inicio, catalogos, formularios,
detalles, historial o estadisticas.

La nueva experiencia debe leerse como una estacion de entrenamiento y analisis:
oscura, precisa, densa cuando hay datos, directa en sus controles y sobria en su
decoracion. La informacion deportiva debe tener prioridad sobre el copy y la
navegacion no debe competir con la tarea.

## Objetivo

Implementar el sistema visual global y el shell/layout compartido definidos por
`DESIGN.md`, manteniendo intactos los flujos funcionales, las rutas, los datos,
los contratos y las composiciones especificas que se migraran en Issues
posteriores.

## Direccion de producto

### Modo

Operate: la persona consulta, registra o revisa informacion de entrenamiento.
La expresion visual debe desaparecer durante la tarea y hacer evidente el
estado, la accion y la siguiente decision.

### Direccion comprometida

- **Tesis:** el rendimiento es la interfaz; se rechaza una lectura de revista,
  un dashboard SaaS generico y una shell ornamental.
- **Mundo visual:** superficies oscuras por niveles (`background`, `surface`,
  `surface-raised` y `surface-hover`), bordes tecnicos, una sans-serif de
  sistema y naranja reservado a accion, seleccion, foco y orientacion.
- **Primera ventana:** topbar estable, rail lateral compacto en escritorio y
  navegacion inferior util en movil; el contenido ocupa la region principal sin
  paneles flotantes decorativos ni una hero generica añadida por esta Issue.
- **Interaccion firma:** la ruta activa se reconoce por `aria-current`, peso,
  superficie e indicador naranja; el teclado recibe el mismo feedback que el
  puntero.
- **Alcance transversal:** botones, campos, badges, filas, estados y valores
  deportivos heredan una misma gramatica en todas las rutas sin alterar sus
  datos ni convertir sus layouts particulares en una plantilla unica.
- **Riesgo honesto:** un tema oscuro aplicado como capa superficial podria dejar
  restos editoriales, bajo contraste o una shell tipo SaaS; la implementacion
  debe reemplazar el lenguaje anterior en los primitives compartidos, no
  acumular overrides contradictorios.

## Alcance

- Reconciliar los tokens CSS globales con los valores y roles de `DESIGN.md`:
  fondo, superficies, hover, bordes, texto, acento, exito, peligro, tipografia,
  radios y spacing.
- Establecer una unica familia sans-serif local con fallback del sistema para
  body, headings, labels, controles y estructura.
- Definir una categoria visual de metricas usando solo valores ya existentes:
  tiempos, pesos, repeticiones, rondas, distancias, posiciones y PRs.
- Normalizar patrones compartidos de botones, inputs, badges, filas y estados
  de loading, empty, error, red, privacidad, sesion, exito y disabled.
- Redefinir visual y responsive el topbar, rail de escritorio, area principal y
  navegacion movil del `Layout` existente.
- Mantener semantica HTML, enlaces reales, labels, foco visible, `aria-current`,
  targets de al menos 44 px, zoom, `prefers-reduced-motion` y safe areas.
- Actualizar `DESIGN.md` unicamente si la implementacion introduce una decision
  durable que el documento actual no cubre. No se reescribira por preferencia ni
  se conservaran decisiones del sistema editorial anterior.
- Mantener o ampliar tests de comportamiento de `Layout` sin acoplarlos a
  colores, posiciones o detalles internos de CSS.

## Fuera de alcance

- Redisenar individualmente Inicio, WODs, Crear WOD, Mis WODs, Ejercicios,
  Historial o Estadisticas.
- Cambiar copy de producto, contratos API, endpoints, schemas, datos, router,
  autenticacion, persistencia, backend o base de datos.
- Anadir fuentes externas, dependencias, icon libraries, graficas, metricas
  nuevas, selector de tema o un sistema paralelo de componentes.
- Migrar el proyecto completo a Tailwind en esta Issue. `package.json` no declara
  Tailwind y el frontend existente usa `frontend/src/index.css`; agregar una
  dependencia o reescribir todas las vistas excederia esta Issue.
- Ocultar contenido, metadata, controles o estados de pagina para conseguir una
  composicion visual concreta.
- Anadir decoracion al shell que no ayude a orientacion, lectura o estado.

## Requisitos funcionales

### RF-1 - Tokens y fuente visual unica

Los tokens implementados corresponden a `DESIGN.md` y se reutilizan mediante
roles semanticos. No quedan decisiones globales nuevas escondidas como colores,
tipografias, radios o spacing aislados.

### RF-2 - Tipografia y metricas

Headings y elementos estructurales utilizan la familia sans-serif definida. La
serif deja de ser dominante. Los valores deportivos existentes reciben mas peso,
contraste y alineacion que labels, unidades secundarias y metadata, sin inventar
datos ni cambiar su semantica.

### RF-3 - Shell compartido

El topbar, la navegacion de escritorio, el contenido principal y la navegacion
movil forman una shell reconocible y consistente. El estado activo utiliza
`aria-current="page"` y mas de un canal visual.

### RF-4 - Primitives y estados

Botones, inputs, badges, filas y mensajes de estado comparten forma, densidad,
contraste, foco y feedback. Los controles principales miden al menos 44 px y
los estados no dependen unicamente del color.

### RF-5 - Responsive y accesibilidad

La shell funciona desde 320 px, tablet y escritorio amplio sin overflow
horizontal evitable. En movil la navegacion fija no tapa contenido, respeta safe
areas y mantiene todos los destinos existentes utilizables.

### RF-6 - Compatibilidad

Se preservan rutas, enlaces, acciones de sesion, contenido, estados de pagina,
formularios, llamadas API y comportamiento del router.

## Criterios de aceptacion

1. `DESIGN.md` y la implementacion comparten una definicion global de color,
   tipografia, spacing, bordes, radios y superficies.
2. Los headings y elementos estructurales ya no presentan la serif editorial como
   identidad dominante.
3. El shell usa superficies oscuras contenidas y naranja controlado, sin una
   navegacion naranja ni decoracion que compita con el rendimiento.
4. Botones, inputs, badges y estados interactivos muestran patrones coherentes,
   feedback visible y foco accesible.
5. Las metricas existentes se identifican antes que su contexto descriptivo.
6. La navegacion mantiene enlaces reales, `aria-current`, targets adecuados y
   todos sus destinos en escritorio y movil.
7. No existe overflow horizontal evitable desde 320 px ni solapamiento de la
   navegacion movil.
8. No cambian rutas, contratos, API, persistencia, backend, datos ni
   dependencias.
9. `npm test`, `npm run lint` y `npm run build` pasan.
10. La revision manual confirma la direccion visual, responsive, teclado, foco y
    contraste en movil, tablet y escritorio.

## Decisiones resueltas

- La fuente normativa visual es `DESIGN.md`; la Issue #76 no debe preservar por
  inercia la estetica editorial anterior.
- La direccion es Operate: densidad funcional, consistencia y affordances
  familiares tienen prioridad sobre sorpresa visual.
- Se usa una sans-serif del sistema con fallback; no se descarga Inter ni se
  añade una dependencia de fuentes.
- Se usa la hoja CSS existente como mecanismo de implementacion porque el
  frontend actual no declara Tailwind; no se crea una migracion de framework.
- El naranja se reserva para roles semanticos de accion, foco, seleccion y
  orientacion; la navegacion activa usa superficie y linea, no una gran placa
  naranja.
- El shell conserva la lista de destinos y los enlaces hash actuales. Cualquier
  cambio de markup debe mejorar su semantica o expresion visual sin alterar su
  contrato.
- `DESIGN.md` ya documenta el mundo visual actual. Solo se modificara si el
  resultado implementado descubre una regla durable ausente.

## Referencias

- `docs/constitution.md`
- `PRODUCT.md`
- `AGENTS.md`
- `frontend/AGENTS.md`
- `DESIGN.md`
- `frontend/package.json`
- `frontend/src/index.css`
- `frontend/src/components/Layout.tsx`
- `frontend/src/components/Layout.test.tsx`
- `specs/031-redisenar-shell-navegacion-responsive/spec.md`
- `specs/037-lenguaje-visual-frontend/spec.md`
- `specs/038-sistema-diseno-oficial/spec.md`
