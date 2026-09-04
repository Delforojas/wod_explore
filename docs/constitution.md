# Constitución — wod-explorer

Principios innegociables. Toda spec, plan y tarea debe cumplirlos.

1. **Simplicidad primero**: el proyecto debe mantenerse como una aplicación
   frontend estática. No se añadirá backend, base de datos, autenticación,
   servicios externos ni infraestructura innecesaria salvo que una spec futura
   lo defina explícitamente.

2. **La spec manda**: ningún comportamiento se implementa si no está en la
   spec activa. Si falta una decisión funcional importante o existe una
   contradicción, se detiene la implementación y se solicita aclaración.

3. **Separación de responsabilidades**: los componentes visuales deben centrarse
   en la interfaz. La lógica reutilizable, validación de datos, tipos y utilidades
   deben mantenerse separadas de los componentes cuando tenga sentido.

4. **Type safety como norma**: TypeScript debe utilizarse de forma estricta.
   Se evitará `any` salvo justificación explícita. Los datos locales deberán
   tener tipos definidos y validarse antes de ser utilizados por la aplicación.

5. **Datos locales y transparentes**: los WODs, ejercicios y demás contenido
   estructurado se almacenarán en archivos JSON locales y legibles.
   No se utilizarán bases de datos ni peticiones de red en esta versión.

6. **UI responsive y accesible**: la interfaz debe diseñarse mobile-first,
   adaptarse correctamente a diferentes tamaños de pantalla y utilizar HTML
   semántico, navegación por teclado y prácticas básicas de accesibilidad.

7. **Componentes mantenibles**: priorizar componentes pequeños, reutilizables
   y composables. Evitar componentes excesivamente grandes, duplicación de
   lógica y APIs basadas en múltiples props booleanas cuando exista una
   alternativa más clara.

8. **Calidad como puerta de salida**: ninguna tarea se considera terminada si
   existen errores de TypeScript, lint o build. Las verificaciones disponibles
   deben ejecutarse antes de finalizar la tarea.

9. **Dependencias controladas**: no añadir nuevas dependencias sin una necesidad
   técnica clara relacionada con la spec activa. Se priorizarán las herramientas
   ya existentes en el proyecto.

10. **Idioma**: código, identificadores, nombres de archivos y tipos en inglés.
    Textos visibles para el usuario y documentación del proyecto en español.