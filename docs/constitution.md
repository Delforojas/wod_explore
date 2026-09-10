# Constitución — wod-explorer

Principios innegociables. Toda spec, plan y tarea debe cumplirlos.

1. **Simplicidad primero**: añadir únicamente la infraestructura y complejidad
   necesarias para cumplir la spec activa. El proyecto puede incluir frontend,
   backend y base de datos cuando estén justificados por el alcance funcional,
   evitando servicios, capas o dependencias innecesarias.

2. **La spec manda**: ningún comportamiento se implementa si no está en la
   spec activa. Si falta una decisión funcional importante o existe una
   contradicción, se detiene la implementación y se solicita aclaración.

3. **Separación de responsabilidades**: mantener claramente separadas las capas
   de frontend, backend y persistencia. Los componentes visuales deben centrarse
   en la interfaz. La lógica de negocio, acceso a datos, validación, tipos y
   utilidades deben ubicarse en la capa correspondiente.

4. **Type safety y tipado estricto**: TypeScript debe utilizarse en modo estricto
   en el frontend. Se evitará `any` salvo justificación explícita. En Java se
   utilizarán tipos explícitos y modelos de dominio claros.

5. **Persistencia coherente y fuente de verdad única**: MySQL será la persistencia
   principal para WODs, ejercicios, usuarios y resultados cuando la funcionalidad
   haya sido migrada al backend. Los archivos JSON pueden mantenerse de forma
   temporal durante la transición, pero no deben existir dos fuentes de verdad
   activas para los mismos datos.

6. **Integridad de datos**: el esquema relacional debe mantener claves primarias,
   claves foráneas, restricciones y relaciones coherentes con el dominio.
   Los cambios de esquema deben ser reproducibles mediante SQL versionado o
   migraciones y no depender únicamente de modificaciones manuales.

7. **UI responsive y accesible**: la interfaz debe diseñarse mobile-first,
   adaptarse correctamente a diferentes tamaños de pantalla y utilizar HTML
   semántico, navegación por teclado y prácticas básicas de accesibilidad.

8. **Componentes y capas mantenibles**: priorizar componentes, servicios,
   repositorios y módulos pequeños y con responsabilidades claras. Evitar
   duplicación de lógica, acoplamiento innecesario y abstracciones sin necesidad.

9. **Calidad como puerta de salida**: ninguna tarea se considera terminada si
   existen errores en las verificaciones aplicables a la parte modificada.
   Frontend, backend y base de datos deben validar sus cambios con sus respectivas
   herramientas antes de finalizar una tarea.

10. **Dependencias controladas**: no añadir nuevas dependencias sin una necesidad
    técnica clara relacionada con la spec activa. Se priorizarán las herramientas
    ya existentes en el proyecto.

11. **Seguridad por defecto**: no almacenar secretos ni credenciales reales en
    archivos versionados. Usar variables de entorno y evitar conexiones del
    backend mediante usuarios administrativos como `root`.

12. **Idioma**: código, identificadores, nombres de archivos y tipos en inglés.
    Textos visibles para el usuario y documentación del proyecto en español.