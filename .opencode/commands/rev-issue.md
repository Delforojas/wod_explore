---
description: Revisa y corrige una GitHub Issue durante la validación manual
---

Revisa la implementación de la GitHub Issue #$1 a partir del feedback adicional
proporcionado por el usuario en `$ARGUMENTS`.

Este comando se utiliza después de `/issue $1` y antes de `/finish-issue $1`
cuando la validación manual detecta errores, carencias, comportamientos
incorrectos o requisitos que necesitan aclararse.

El objetivo es corregir incrementalmente la Issue existente sin reiniciar su
workflow ni crear una Issue nueva cuando el feedback pertenece razonablemente
al objetivo original.

Este comando NO finaliza la Issue.

No ejecutes `/finish-issue`.
No hagas push.
No crees Pull Requests.
No hagas merge.
No cierres la Issue.
No crees nuevas ramas.
No reinicies el desarrollo desde cero.
No regeneres completamente el SDD salvo que exista una razón excepcional y
explícitamente justificada.

## 1. Interpretar el feedback

El feedback del usuario contenido en `$ARGUMENTS` es la razón principal de esta
revisión.

Identifica de forma concreta:

- qué comportamiento considera incorrecto;
- qué problema visual o responsive ha detectado;
- qué funcionalidad esperaba encontrar;
- qué criterio de aceptación no se está cumpliendo;
- qué comportamiento necesita corregirse o aclararse.

No amplíes el feedback con funcionalidades que el usuario no haya solicitado.

Si `$ARGUMENTS` no contiene feedback suficiente para determinar qué debe
revisarse:

DETENTE.

Solicita al usuario únicamente la información necesaria para continuar.

## 2. Recuperar el contexto de la Issue

Obtén la GitHub Issue #$1 mediante GitHub MCP.

Lee también las fuentes de verdad aplicables:

1. `docs/constitution.md`;
2. GitHub Issue #$1;
3. `PRODUCT.md`;
4. `AGENTS.md`;
5. `AGENTS.md` del área afectada;
6. `DESIGN.md` si existe impacto visual o UX;
7. `spec.md`;
8. `plan.md`;
9. `tasks.md`.

Inspecciona además:

- rama actual;
- `git status`;
- commits de la rama;
- diff respecto a la rama base;
- implementación actual relacionada con el feedback;
- tests existentes relacionados.

No repitas el análisis completo del proyecto.

Analiza únicamente el contexto necesario para revisar el feedback recibido.

## 3. Comprobar la rama

La rama actual debe corresponder a la Issue #$1.

Si la rama actual no corresponde a la Issue:

DETENTE.

No cambies automáticamente de rama.
No crees otra rama.
No modifiques archivos.
No hagas commits.

Informa al usuario del problema.

## 4. Proteger cambios locales ajenos

Inspecciona el working tree antes de modificar archivos.

Identifica:

- cambios pertenecientes a la Issue;
- cambios locales ajenos;
- archivos untracked ajenos.

Nunca:

- elimines cambios ajenos;
- los restaures;
- los añadas al staging;
- los incluyas en commits;
- los modifiques para facilitar la revisión.

Si no puedes separar con seguridad los cambios de la Issue de cambios ajenos:

DETENTE.

Explica exactamente qué archivos generan la ambigüedad.

## 5. Clasificar el feedback

Clasifica cada problema detectado en una de estas categorías:

### A. Defecto de implementación

La Issue o el SDD ya exigían el comportamiento, pero la implementación no lo
cumple correctamente.

Ejemplos:

- responsive roto;
- overflow;
- botón existente que no funciona;
- foco incorrecto;
- estado visual incorrecto;
- comportamiento diferente al especificado.

En este caso:

- no amplíes innecesariamente la GitHub Issue;
- corrige la implementación;
- actualiza tests cuando corresponda;
- actualiza `tasks.md` para reflejar la revisión.

### B. Requisito o criterio incompleto

El feedback revela una expectativa necesaria para cumplir correctamente el
objetivo original de la Issue, pero no estaba suficientemente explícita en la
Issue o el SDD.

Ejemplos:

- falta una acción necesaria para completar correctamente el flujo ya definido;
- un criterio responsive necesita concretar tamaños;
- una interacción esencial estaba implícita pero no documentada;
- falta un criterio de aceptación necesario para validar el objetivo original.

En este caso puede ser necesario actualizar:

- GitHub Issue;
- `spec.md`;
- `plan.md`;
- `tasks.md`;
- implementación;
- tests.

Las modificaciones deben ser mínimas y estar directamente relacionadas con el
feedback.

### C. Ajuste visual dentro del alcance

El comportamiento funciona, pero la validación manual demuestra que la
implementación no representa correctamente la dirección visual definida por las
fuentes de verdad.

En este caso:

- utiliza `DESIGN.md` como fuente de verdad;
- no inventes una nueva dirección visual;
- modifica únicamente los componentes afectados;
- actualiza el SDD solo si el feedback introduce una decisión durable que deba
  quedar documentada.

### D. Nueva funcionalidad fuera de alcance

El feedback solicita una capacidad independiente que no es necesaria para
cumplir el objetivo original de la Issue.

Ejemplos:

- nueva feature;
- nuevo flujo de producto;
- nuevo endpoint no relacionado con el objetivo original;
- nueva capacidad de negocio;
- cambio arquitectónico independiente.

En este caso:

DETENTE para esa parte del feedback.

No amplíes silenciosamente la Issue.
No modifiques la GitHub Issue para incluir la nueva funcionalidad.
No implementes esa parte.

Explica por qué está fuera de alcance y recomienda utilizar `/issue-create`
para crear una Issue independiente.

Si el feedback contiene simultáneamente correcciones dentro y fuera de alcance,
puedes continuar únicamente con las partes inequívocamente dentro del alcance,
pero debes informar claramente cuáles han quedado excluidas.

## 6. Presentar el diagnóstico antes de modificar

Antes de editar código o documentación, muestra un resumen breve con:

### Diagnóstico de revisión

- Issue: #$1
- Feedback recibido
- Clasificación de cada problema
- Archivos o áreas probablemente afectadas
- Si requiere modificar GitHub Issue: sí/no
- Si requiere modificar SDD: sí/no
- Si requiere modificar código: sí/no
- Elementos fuera de alcance, si existen

Si existe una ampliación significativa del alcance original:

DETENTE y solicita aprobación explícita antes de modificar la Issue.

Las correcciones inequívocas de bugs o incumplimientos de criterios existentes
no necesitan una nueva aprobación.

## 7. Actualizar la GitHub Issue cuando corresponda

Modifica la GitHub Issue #$1 mediante GitHub MCP únicamente cuando el feedback
clasificado como requisito o criterio incompleto necesite quedar formalmente
documentado.

Conserva:

- objetivo original;
- contexto relevante;
- requisitos existentes;
- criterios de aceptación existentes.

Añade o modifica únicamente lo necesario para representar el feedback aprobado.

No reescribas toda la Issue innecesariamente.

No elimines requisitos existentes salvo que el usuario haya indicado
explícitamente que deben eliminarse.

Después de modificarla, vuelve a leer la Issue mediante GitHub MCP y comprueba
que el cambio remoto corresponde exactamente a la revisión aprobada.

## 8. Sincronizar el SDD

Cuando el feedback cambie o aclare requisitos, actualiza el SDD para que vuelva
a estar sincronizado con la GitHub Issue.

Actualiza únicamente los documentos necesarios:

- `spec.md` para requisitos, alcance o criterios;
- `plan.md` para decisiones de implementación;
- `tasks.md` para trabajo adicional o reabierto.

No regeneres el SDD completo.

Si una task previamente marcada como completada necesita trabajo adicional,
puedes:

- reabrirla; o
- añadir una nueva task de revisión claramente identificada.

El historial debe permitir entender qué se corrigió durante la validación
manual.

## 9. Implementar la revisión

Implementa exclusivamente las correcciones aprobadas.

Respeta:

- la Constitución;
- la Issue actualizada;
- el SDD;
- `AGENTS.md`;
- `DESIGN.md` cuando aplique;
- arquitectura existente;
- contratos existentes;
- convenciones del proyecto.

No realices refactors no relacionados.
No cambies archivos fuera del alcance necesario.
No añadas dependencias salvo necesidad explícita y justificada.

Si durante la implementación descubres que la corrección requiere una
modificación sustancial fuera del alcance:

DETENTE.

No continúes expandiendo la Issue automáticamente.

## 10. Tests de regresión

Añade o modifica tests cuando el feedback revele un comportamiento que pueda
verificarse automáticamente.

Los tests deben cubrir el fallo detectado cuando sea razonable.

Ejemplos:

- interacción que no funcionaba;
- renderizado condicional;
- gestión dinámica de elementos;
- estado incorrecto;
- regresión de comportamiento;
- semántica o accesibilidad verificable automáticamente.

No escribas tests acoplados a detalles visuales internos como colores exactos o
posiciones CSS salvo que exista una razón técnica específica.

## 11. Ejecutar verificaciones

Después de implementar la revisión, ejecuta las verificaciones correspondientes
al área modificada definidas por el proyecto.

Como mínimo, cuando aplique:

- tests;
- lint;
- build;
- `git diff --check`.

No afirmes que una comprobación ha pasado si no se ha ejecutado realmente.

Si alguna comprobación falla:

- investiga si el fallo pertenece a la revisión;
- corrígelo cuando esté dentro del alcance;
- vuelve a ejecutar la comprobación correspondiente.

Si el fallo pertenece a trabajo ajeno o requiere ampliar significativamente el
alcance:

DETENTE e informa al usuario.

## 12. Revisar el diff

Antes de finalizar la revisión:

- inspecciona el diff completo propio;
- comprueba que solo contiene cambios relacionados con la Issue y el feedback;
- comprueba que no se modificaron cambios locales ajenos;
- comprueba que GitHub Issue y SDD siguen sincronizados cuando hayan sido
  modificados;
- comprueba que las tasks reflejan el estado real.

## 13. Commit de revisión

Si las verificaciones automáticas pasan y existen cambios correspondientes a la
revisión, crea un commit específico.

Añade al staging únicamente los archivos pertenecientes a la revisión.

Nunca uses:

`git add .`

ni equivalentes que puedan incluir cambios ajenos.

El mensaje debe:

- seguir el estilo existente del repositorio;
- describir la corrección;
- incluir `(#$1)`.

Ejemplo conceptual:

`fix: correct mobile WOD exercise management (#80)`

No uses este mensaje automáticamente si no describe el cambio real.

No hagas push.

## 14. Volver a validación manual

Después de completar la revisión, la Issue vuelve obligatoriamente al estado de
validación manual.

No consideres la Issue aprobada por el hecho de que tests, lint o build pasen.

No ejecutes `/finish-issue`.

La aprobación manual anterior deja de ser suficiente para las partes modificadas
por `/revise-issue`.

## 15. Salida final obligatoria

La respuesta final DEBE contener exactamente estas secciones:

## Estado de la revisión

Incluye:

- Issue revisada;
- rama actual;
- clasificación del feedback;
- cambios realizados;
- GitHub Issue modificada: sí/no;
- SDD modificado: sí/no;
- código modificado: sí/no;
- tests añadidos o modificados;
- resultado de tests;
- resultado de lint;
- resultado de build;
- resultado de `git diff --check`;
- hash y mensaje del commit de revisión, si existe;
- cambios locales ajenos preservados;
- elementos fuera de alcance, si existen.

## Validaciones manuales pendientes

Incluye una checklist concreta utilizando obligatoriamente:

- [ ]

Cada comprobación debe describir una acción observable que el usuario pueda
realizar para verificar específicamente las correcciones introducidas.

No utilices frases genéricas como:

- "validar responsive";
- "comprobar visualmente";
- "revisar que todo funcione".

Convierte el feedback original en casos manuales concretos.

Ejemplo:

- [ ] Abrir Crear WOD a 320 px y comprobar que no existe scroll horizontal.
- [ ] Añadir un segundo ejercicio y comprobar que aparece una nueva fila
      independiente.
- [ ] Configurar repeticiones y peso diferentes en dos ejercicios y comprobar
      que cada valor permanece asociado al ejercicio correcto.
- [ ] Eliminar el primer ejercicio y comprobar que el segundo conserva sus
      valores.
- [ ] Guardar el WOD y comprobar que todos los ejercicios configurados aparecen
      correctamente.

## Siguiente paso

Indica únicamente uno de estos estados:

- Si quedan fallos:
  `Corrige los problemas detectados y vuelve a ejecutar /revise-issue $1 con el nuevo feedback.`

- Si la validación manual es correcta:
  `Aprueba la validación manual y ejecuta /finish-issue $1.`

No declares la Issue completada.
No hagas push.
No cierres la Issue.
