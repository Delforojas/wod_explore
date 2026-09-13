# Spec 037 - Extender el lenguaje visual al resto del frontend

## Estado

En implementacion.

## Objetivo

Extender la jerarquia visual, el contraste y la composicion editorial introducidos
en Home por la Issue #36 al resto de las superficies del frontend, manteniendo una
experiencia coherente entre dashboard, catalogos, detalles, seguimiento y
autenticacion.

## Contexto

Home ya utiliza un bloque dominante, superficies de apoyo, navy, naranja de senal,
tipografia jerarquica y reglas finas. Las demas pantallas conservan los flujos de
las Issues #31-#35, pero combinan esos patrones con superficies de distinta
intensidad. Esta Issue armoniza la presentacion sin reemplazar los redisenos
funcionales existentes.

## Alcance

- Revisar `WodsPage` y `ExercisesPage` como filas tecnicas escaneables.
- Revisar `WodDetailPage` y `ExerciseDetailPage` como documentos de lectura con
  accion de registro claramente identificable.
- Conservar la separacion entre resumen, resultados, marcas personales e
  evolucion de `HistoryPage` y `StatisticsPage`.
- Adaptar `ProfilePage` y `AuthPage` al lenguaje visual comun.
- Armonizar `Layout` y los estilos compartidos cuando sea necesario.
- Consolidar tokens, superficies, tipografia, reglas, foco, contraste y responsive
  en el CSS existente.
- Mantener la composicion mobile-first desde 320 px, tablet y escritorio.

## Fuera de alcance y restricciones

- No cambiar rutas hash, enlaces, llamadas API, schemas, payloads, autenticacion,
  persistencia ni logica de negocio.
- No modificar backend, base de datos, Docker ni contratos.
- No anadir dependencias, fuentes externas, librerias de iconos, graficas ni
  migrar estilos a Tailwind.
- No anadir funcionalidades ni datos derivados nuevos.
- No ocultar estados de carga, vacio, error, error de red, privacidad, sesion
  expirada, guardado o exito.
- No introducir overflow horizontal, recortes de contenido ni targets tactiles
  menores de 44 px.
- Mantener HTML semantico, labels asociados, enlaces y botones nativos, foco
  visible, `aria-current` y contenido comprensible sin depender solo del color.

## Criterios de aceptacion

1. Home, catalogos, detalles, historial, estadisticas, perfil, login y registro
   presentan una direccion visual coherente.
2. La shell compartida conserva destinos, acciones de sesion y señalizacion de la
   ruta activa en escritorio y movil.
3. Los catalogos mantienen busqueda, filtros, filas tecnicas, paginacion y estados
   existentes, incluida la metadata relevante en movil.
4. Los detalles mantienen sus datos, formularios de registro, resultados, estados
   y enlaces de retorno.
5. Historial y estadisticas conservan la jerarquia de resumen, registros, marcas
   personales y evolucion definida en la Issue #35.
6. Perfil, login y registro adoptan la jerarquia visual comun sin cambiar sus
   contratos ni comportamiento.
7. Los estados dinamicos siguen siendo visibles y accesibles.
8. Las rutas y llamadas API existentes no cambian.
9. No hay overflow horizontal ni texto cortado desde 320 px hasta escritorio.
10. La navegacion por teclado, el foco visible, los labels, los landmarks y los
    nombres accesibles se conservan.
11. No se anaden dependencias ni funcionalidades nuevas.
12. `npm test`, `npm run lint` y `npm run build` finalizan correctamente.
13. La revision manual confirma la composicion en movil, tablet y escritorio.

## Referencias

- `docs/figma/fitness-dashboard-reference.md`
- `DESIGN.md`
- `PRODUCT.md`
- `frontend/src/pages/HomePage.tsx`
- `frontend/src/components/Layout.tsx`
- `frontend/src/index.css`
- `specs/036-redisenar-dashboard-principal/spec.md`
- `specs/031-redisenar-shell-navegacion-responsive/spec.md`
- `specs/032-mejorar-descubrimiento-catalogos/spec.md`
- `specs/033-redisenar-detalles-resultados/spec.md`
- `specs/035-claridad-historial-evolucion/spec.md`

## Decisiones resueltas

- Se conserva el CSS existente y sus tokens como sistema visual; no se instala ni
  se introduce Tailwind como dependencia.
- Se mantienen las filas tecnicas y los documentos editoriales, sin convertir todo
  el frontend en un grid uniforme de tarjetas.
- La metadata de catalogos que es necesaria para identificar un resultado se
  refluye en movil en lugar de ocultarse.
- La ruta activa de un detalle se representa en su catalogo padre, sin cambiar la
  ruta ni el router.
- La coherencia se logra con estilos y ajustes semanticos pequenos, sin extraer un
  sistema de componentes nuevo ni cambiar los datos mostrados.
