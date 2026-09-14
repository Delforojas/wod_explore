# Plan - Spec 033 Rediseñar detalles y registro de resultados

## Objetivo tecnico

Recomponer las dos paginas de detalle en JSX semantico y aplicar una capa visual
compartida desde `index.css`, manteniendo local el estado de cada formulario y
los contratos actuales del cliente API.

## Decisiones tecnicas

### 1. Estructura de lectura

- Convertir la ficha de metadatos en listas descriptivas (`dl`/`dt`/`dd`).
- Separar encabezado, ficha, ejercicios, mejor marca, resultados y formulario.
- Usar `article` para el documento principal y `aside` para la accion de registro.
- Mantener enlaces hash reales para retorno y resultados.

### 2. Formularios

- Conservar el estado y las condiciones de campos actuales por tipo de WOD o
  medicion.
- Asociar ids y labels explicitamente sin cambiar los nombres consultados por los
  tests ni el payload producido.
- Añadir un estado local de exito junto al estado de error existente.
- Marcar el formulario como ocupado durante el submit y mantener el boton
  deshabilitado para impedir duplicados.

### 3. Presentacion de datos

- Traducir enums visibles con mapas exhaustivos derivados de los tipos existentes.
- Mostrar unidades y record types como texto, no solo como color o abreviatura.
- Conservar los resultados en orden de mas reciente a mas antiguo tras un alta.
- No cambiar el criterio ni la consulta de mejor marca.

### 4. Responsive y CSS

- Extender los patrones editoriales ya existentes sin introducir dependencias.
- Hacer que la columna de accion tenga un ancho legible y que el detalle apile
  primero el contenido en movil.
- Evitar truncado de nombres y metadatos largos mediante wrapping controlado.
- Mantener focus-visible, reduced motion, safe areas y targets tactiles actuales.

## Flujo de implementacion

1. Crear la estructura semantica del detalle de WOD.
2. Crear la estructura semantica del detalle de ejercicio.
3. Añadir feedback accesible de guardado, exito y error sin cambiar payloads.
4. Ajustar estilos de detalles, formularios, mejor marca, resultados y breakpoints.
5. Añadir pruebas de comportamiento para exito y estados relevantes.
6. Ejecutar tests, lint y build; corregir solo fallos relacionados.
7. Revisar diff y alcance de contratos antes del commit.

## Riesgos y mitigaciones

### Regresion de payload

Riesgo: cambiar labels o estructura altera consultas de test o valores enviados.

Mitigacion: mantener estados, conversiones, nombres de campos y funciones API;
verificar payloads existentes y añadir assertions de feedback solamente.

### Densidad en movil

Riesgo: ficha, resultados y formulario compiten por el primer viewport.

Mitigacion: usar una jerarquia vertical explicita y ajustar spacing por breakpoint,
sin ocultar contenido funcional.

### Feedback ambiguo

Riesgo: un mensaje de exito no se anuncia o el boton parece no responder.

Mitigacion: `role="status"`, `aria-live`, copy en español, `aria-busy` y texto
visible temporal de guardado.

## Verificaciones

Desde `frontend/` y usando los scripts existentes:

```bash
npm test
npm run lint
npm run build
```

Tambien se revisaran manualmente las variantes FOR_TIME, AMRAP, EMOM, WEIGHT,
REPS, TIME, la medicion no registrable y la ausencia de overflow desde 320 px.
