# Plan - Spec 032 Mejorar descubrimiento de catalogos

## Objetivo tecnico

Refinar la composicion y los estilos de las superficies de descubrimiento con
los componentes y datos existentes, priorizando jerarquia, escaneabilidad,
responsive y accesibilidad sin añadir dependencias.

## Decisiones tecnicas

### 1. Home

- Mantener los enlaces actuales y reforzar el bloque de exploracion principal.
- Usar una senal editorial breve para diferenciar catalogo y progreso personal.
- Mejorar la relacion visual entre el CTA primario, el enlace secundario y los
  tres paneles de navegacion.

### 2. Catalogos

- Mantener el acceso a datos y el estado local actual en cada pagina.
- Añadir solo informacion derivada de propiedades ya presentes, como conteo
  total cuando el contrato lo expone y filtros activos cuando sea util.
- Conservar `catalog-row` como enlace completo, con foco visible y metadatos que
  colapsen de forma ordenada en movil.
- Usar agrupaciones semanticas y copy corto para que el formulario no compita
  con los resultados.

### 3. Estados y paginacion

- No cambiar `StateMessage`, el cliente API ni las condiciones funcionales.
- Mejorar la separacion visual entre feedback de consulta, lista y navegacion.
- Mantener `aria-live` en la pagina y disabled durante carga.

### 4. CSS y responsive

- Extender `frontend/src/index.css` reutilizando variables existentes.
- Revisar primero movil, despues tablet y finalmente escritorio.
- Asegurar nombres largos con `overflow-wrap`, truncado solo donde no oculte el
  dato principal y ausencia de columnas comprimidas ilegibles.
- Mantener `prefers-reduced-motion` y no añadir animaciones necesarias para
  comprender el contenido.

## Flujo de implementacion

1. Actualizar Home con copy y jerarquia de exploracion conservando hrefs.
2. Ajustar encabezados, formularios y filas de WODs y ejercicios.
3. Mejorar estilos de resultados, filtros, estados y paginacion.
4. Revisar breakpoints de 320 px, movil amplio, tablet y escritorio.
5. Ejecutar tests, lint y build del frontend.
6. Revisar diff para confirmar que solo se modifico el alcance de la spec.

## Riesgos y mitigaciones

### Contrato visual vs. funcional

Riesgo: un cambio de copy o estructura rompa aserciones de comportamiento.

Mitigacion: conservar roles, labels, hrefs, botones y textos esenciales; ejecutar
la suite completa.

### Metadatos excesivos en movil

Riesgo: las filas pierdan legibilidad en pantallas estrechas.

Mitigacion: definir una jerarquia explicita y reordenar u ocultar solo metadatos
secundarios, manteniendo nombre y contexto principal.

### Estilos aislados

Riesgo: crear una variante que no encaje con la Issue #31.

Mitigacion: extender tokens y patrones de `index.css`, evitando dependencias o
componentes visuales paralelos.

## Verificaciones

Desde `frontend/` y usando solo scripts presentes en `package.json`:

```bash
npm test
npm run lint
npm run build
```

Tambien se revisara manualmente el diff, la ausencia de cambios de contrato y
los breakpoints responsive relevantes.
