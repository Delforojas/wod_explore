# Plan 037 - Extender el lenguaje visual al resto del frontend

## Base tecnica

La rama parte de `feat/036-redisenar-dashboard-principal`, que contiene la
composicion de Home y los estilos de historial y estadisticas de las Issues
#31-#36. El trabajo se limita al frontend existente y no requiere cambios de API,
backend, persistencia o dependencias.

## Estrategia

1. Mantener la estructura y el estado actual de todas las paginas; cambiar solo
   clases, orden visual y semantica minima necesaria para la coherencia.
2. Usar `index.css` como fuente de tokens y patrones compartidos para papel, tinta,
   navy, naranja, superficies, reglas, tipografia, foco y responsive.
3. Atenuar la diferencia entre Home y las demas superficies sin convertir el
   producto en un dashboard oscuro ni en un conjunto de cards uniformes.
4. Mantener catalogos como filas tecnicas y replegar su metadata de forma legible
   en movil.
5. Mantener detalles como documento y columna de accion; mantener historial y
   estadisticas como resumen, registros y evolucion textual.
6. Tratar perfil y autenticacion como hojas editoriales con formularios claros,
   corrigiendo el ancho minimo que puede desbordar a 320 px.
7. Mantener enlaces, `aria-current`, landmarks, labels, estados y targets nativos.

## Archivos previstos

- `frontend/src/index.css`
- `frontend/src/components/Layout.tsx`
- Tests existentes solo si un ajuste de markup cambia una interaccion observable.
- `specs/037-lenguaje-visual-frontend/spec.md`
- `specs/037-lenguaje-visual-frontend/plan.md`
- `specs/037-lenguaje-visual-frontend/tasks.md`

No se modificaran cliente API, schemas, router, backend ni datos.

## Flujo de implementacion

1. Confirmar rama, SDD valido y cambios ajenos fuera del alcance.
2. Ajustar `Layout` para la señalizacion activa de catalogo en sus rutas de
   detalle, conservando los destinos y acciones de sesion.
3. Consolidar en `index.css` superficies compartidas, contraste, jerarquia,
   estados interactivos, formularios, filas y responsive.
4. Resolver el reflow movil de metadata de ejercicios, el ancho de autenticacion,
   wrapping de valores largos y el espacio de la navegacion inferior.
5. Ejecutar la suite completa de frontend, lint, build, `git diff --check` y el
   detector mecanico de Impeccable sobre los targets modificados.
6. Revisar manualmente 320 px, tablet, escritorio, zoom, teclado, estados y
   ausencia de overflow.
7. Revisar diff y staging, marcar tasks con evidencia, crear el commit y
   documentar la Issue sin cerrarla ni hacer push.

## Riesgos y mitigaciones

### Regresion funcional

Riesgo: cambiar markup o estilos puede alterar nombres accesibles, rutas o tests.
Mitigacion: conservar `href`, labels, roles, textos funcionales, callbacks y
condiciones; ejecutar todos los tests existentes.

### Densidad en movil

Riesgo: metadatos, formularios y valores compiten en 320 px.
Mitigacion: usar `min-width: 0`, `overflow-wrap: anywhere`, grids que colapsen y
reflow de metadata en vez de ocultar informacion necesaria.

### Contraste y foco

Riesgo: el naranja se usa en fondos y texto con contraste insuficiente.
Mitigacion: separar colores de acento para superficie y texto, mantener foco
visible de alto contraste y comprobar estados sobre papel, navy y naranja.

### Diferencia entre Home y el resto

Riesgo: homogeneizar demasiado elimina la jerarquia propia de cada superficie.
Mitigacion: compartir tokens y reglas, pero conservar composiciones especificas:
filas en catalogos, documentos en detalles, columnas en seguimiento y hoja en
perfil/auth.

## Verificaciones

Desde `frontend/` y usando unicamente scripts existentes:

```bash
npm test
npm run lint
npm run build
```

Ademas:

```bash
git diff --check
/Users/delfinrojas/.agents/skills/impeccable/scripts/impeccable detect --json frontend/src/components/Layout.tsx frontend/src/index.css
```

La revision manual cubrira todas las superficies de la Issue en movil, tablet y
escritorio, navegacion por teclado, focus visible, textos largos, estados y
preservacion de rutas y contratos.
