# Plan - Issue #46: Crear interfaz para WODs personalizados

## Base tecnica

La pantalla se incorporara al hash router existente y se compondran sus
responsabilidades en una pagina, un selector de ejercicios y una capa API
pequena. El estado del borrador permanecera local al flujo. Se reutilizaran
`AuthContext`, `ApiError`, `StateMessage`, tokens CSS y patrones de formularios
existentes.

## Fases

1. **Contrato cliente**
   - Anadir schemas Zod y tipos derivados para prescripciones, ejercicios y
     detalle de WOD personalizado.
   - Anadir `createUserWod` al cliente y reutilizar `getExercises`.

2. **Navegacion**
   - Anadir la ruta `create-wod` al tipo `Route`, parser y `App`.
   - Anadir accesos "Crear WOD" al rail, navegacion movil y cabecera de WODs.

3. **Composicion del formulario**
   - Crear la pagina con metadatos del WOD y reglas condicionadas por tipo.
   - Mantener una lista local de filas seleccionadas con posicion derivada del
     orden visible.
   - Crear un dialogo nativo de busqueda y seleccion paginada de ejercicios.
   - Renderizar una variante de prescripcion para cada `measurementType`.

4. **Validacion y estados**
   - Validar nombre, nivel, tipo, campos condicionales, ejercicios y valores
     antes de construir el request.
   - Vincular errores con los controles y enfocar el primer error.
   - Cubrir estados anonimo, catalogo, guardado, error, exito y reintento sin
     perder el borrador.

5. **Responsive y accesibilidad**
   - Anadir estilos CSS coherentes con las superficies editoriales actuales,
     sin introducir Tailwind ni dependencias.
   - Adaptar dialogo, filas, acciones y campos a 320px, movil, tablet y
     escritorio; respetar reduced motion y foco visible.

6. **Tests y verificacion**
   - Cubrir router, cliente API, interacciones de la pagina, dialogo, orden,
     eliminacion, validacion, errores, carga y confirmacion.
   - Ejecutar `npm run test`, `npm run lint` y `npm run build` desde `frontend/`.
   - Ejecutar el detector mecanico de Impeccable sobre los targets modificados y
     revisar responsive y accesibilidad antes de marcar el trabajo completo.

## Riesgos y limites

- El backend requiere `level` aunque el enunciado destaque nombre y tipo; por
  eso el formulario lo incluye para producir requests validos.
- El selector consume paginas del catalogo y no inventa ejercicios fuera de la
  API.
- No se anadira enlace al detalle global tras guardar, porque #45 aisla los WODs
  personalizados de `/api/wods/{id}` y #47 aun no implementa ese detalle.
