---
description: Ejecuta el workflow de desarrollo de una GitHub Issue
---

Trabaja sobre la GitHub Issue #$1 del repositorio actual.

## 1. Obtener la Issue

Obtén la GitHub Issue #$1 mediante el GitHub MCP configurado para este proyecto.

Extrae y comprende:

- título;
- descripción;
- criterios de aceptación;
- alcance;
- restricciones;
- referencias técnicas relevantes.

No modifiques todavía ningún archivo.

## 2. Analizar el proyecto

Antes de realizar cambios, analiza:

- AGENTS.md aplicables;
- Constitución y documentación del proyecto;
- arquitectura existente;
- código relacionado con la Issue;
- specs anteriores relacionadas;
- skills relevantes;
- MCPs disponibles que aporten contexto útil.

No asumas comportamientos que contradigan la Issue, AGENTS.md o la arquitectura existente.

## 3. Preparar obligatoriamente la rama de trabajo

Este paso es obligatorio.

Antes de modificar cualquier archivo, comprueba:

- la rama actual;

- `git status`;

- los cambios locales existentes;

- si ya existe una rama local correspondiente a la Issue #$1.

La Issue no debe implementarse directamente sobre `main`.

Cada Issue debe desarrollarse en su propia rama.
a nueva rama debe partir del estado de desarrollo válido más reciente del proyecto.

Si la Issue depende de trabajo implementado en una Issue anterior que todavía no está integrado en `main`, crea la nueva rama desde la rama que contiene ese trabajo.

Si `main` ya contiene todas las dependencias necesarias para la Issue actual, crea la nueva rama desde `main`.

No cambies de base, hagas rebase ni descartes commits existentes automáticamente.

Genera el nombre de la rama utilizando:

- tipo de cambio;

- número de Issue con 3 dígitos;

- slug corto derivado del título real de la Issue.

Prefijos permitidos:

- `feat/` → nueva funcionalidad;

- `fix/` → corrección;

- `docs/` → documentación o diseño;

- `refactor/` → refactorización;

- `test/` → testing;

- `chore/` → mantenimiento.

Ejemplos:

Issue #16: "Definir contratos de resultados"

→ `docs/016-result-contracts`

Issue #17: "Implementar registro de resultados WOD"

→ `feat/017-wod-results`

Si ya existe una rama correspondiente a la Issue #$1:

- reutilízala;

- cámbiate físicamente a ella con Git si no es la rama actual;

- no crees una segunda rama.

Si NO existe una rama correspondiente a la Issue #$1:

- créala físicamente con Git;

- cámbiate a ella antes de modificar cualquier archivo.

Ejemplo conceptual:

`git switch -c feat/018-exercise-results`

No basta con calcular, proponer o mostrar el nombre de la rama.

La rama debe existir realmente en el repositorio local.

Después de crear o seleccionar la rama, ejecuta:

`git branch --show-current`

Comprueba explícitamente que el resultado corresponde a la Issue #$1.

Si `git branch --show-current` no devuelve la rama específica de la Issue:

DETENTE.

No crees el SDD.

No implementes.

No continúes el workflow.

Si existen cambios locales ajenos a la Issue que impiden cambiar de rama de forma segura:

DETENTE y solicita intervención.

No descartes, sobrescribas, hagas stash ni incluyas cambios ajenos sin autorización.

## 4. Crear o completar el SDD

Este paso es obligatorio.

Crea o completa el SDD correspondiente a la Issue.

La carpeta debe seguir exactamente:

`specs/<numero>-<slug>/`

Reglas obligatorias:

- usa el número de Issue con 3 dígitos;

- genera el slug a partir del título real de la Issue;

- usa minúsculas;

- usa kebab-case;

- el slug no puede estar vacío;

- no crees carpetas como `specs/<numero>-/`.

Si ya existe una carpeta `specs/<numero>-*`:

- reutilízala;

- si el slug está vacío o es incorrecto, renómbrala antes de continuar;

- no crees una segunda carpeta para la misma Issue.

Dentro deben existir obligatoriamente:

- `spec.md`

- `plan.md`

- `tasks.md`

Cada archivo debe contener contenido válido.

No basta con que el archivo exista.

Antes de continuar verifica:

- `spec.md` no está vacío;

- `plan.md` no está vacío;

- `tasks.md` no está vacío;

- `spec.md` describe objetivo, alcance y criterios de aceptación;

- `plan.md` describe cómo se implementará;

- `tasks.md` contiene tareas concretas y ejecutables.

Comprueba explícitamente el tamaño o contenido de los archivos.

Si cualquiera de los tres archivos está vacío:

DETENTE.

No implementes.

No hagas commit.

No documentes la Issue como completada.

No cierres la Issue.

El workflow no puede continuar hasta que el SDD sea válido.

## 5. Validar la planificación

Antes de implementar código, comprueba:

- que spec.md cubre los criterios de aceptación;
- que plan.md es compatible con la arquitectura;
- que tasks.md representa el trabajo necesario;
- que todas las tasks son implementables;
- que no existen decisiones funcionales importantes sin resolver;
- que no existen contradicciones con AGENTS.md;
- que no existe trabajo fuera del alcance de la Issue.

Si existe una decisión funcional o arquitectónica importante sin resolver:

DETENTE y solicita aclaración.

No comiences la implementación hasta que el plan sea viable.

## 6. Implementar

Si el plan es viable:

- implementa las tasks en orden;
- respeta AGENTS.md y las skills aplicables;
- mantén el alcance limitado a la Issue #$1;
- no realices refactorizaciones o cambios no necesarios;
- no modifiques archivos ajenos al trabajo salvo que sea técnicamente necesario.

Marca una task como completada únicamente cuando realmente esté terminada.

## 7. Ejecutar verificaciones

Después de implementar, ejecuta todas las verificaciones aplicables:

- tests;
- build;
- lint;
- comprobaciones de integración;
- verificaciones definidas en AGENTS.md;
- cualquier otra comprobación necesaria para demostrar los criterios de aceptación.

No ejecutes verificaciones que claramente no sean aplicables al tipo de cambio.

Documenta qué verificaciones se han ejecutado y su resultado.

## 8. Resolver fallos

Si alguna comprobación aplicable falla:

- NO continúes hacia el commit;
- NO marques el trabajo como completado;
- NO documentes la Issue como terminada;
- NO cierres la Issue.

Investiga la causa.

Corrige únicamente aquello relacionado con la Issue.

Después vuelve a ejecutar las verificaciones necesarias.

Continúa únicamente cuando todas las verificaciones aplicables pasen correctamente.

## 9. Revisar los cambios

Antes del commit:

- ejecuta git diff;
- ejecuta git status;
- identifica exactamente qué archivos pertenecen a la Issue #$1;
- comprueba que no existen cambios accidentales;
- comprueba que no se van a incluir cambios ajenos.

Si detectas cambios ajenos:

- no los modifiques;
- no los añadas al staging;
- no los incluyas en el commit.

## 10. Crear obligatoriamente el commit

Este paso es obligatorio.

No continúes al punto 11 hasta que exista un commit creado durante este workflow para la Issue #$1.

Añade al staging únicamente los archivos pertenecientes a la Issue #$1.

No utilices un `git add` indiscriminado si existen cambios ajenos en el working tree.

Crea el commit siguiendo las convenciones Git del proyecto.

Después:

- ejecuta `git log -1 --oneline`;

- comprueba que el commit se creó correctamente;

- obtén el hash del commit;

- conserva el hash para documentarlo en GitHub.

Si no se puede crear correctamente el commit:

DETENTE.

No continúes al punto 11.

No documentes la Issue como completada.

No cierres la Issue.

## 11. Verificar el estado posterior al commit

Ejecuta:

git status

Comprueba que:

- no quedan cambios pertenecientes a la Issue #$1 sin commit;
- el commit existe;
- estás en la rama correspondiente a la Issue.

Pueden existir cambios ajenos anteriores.

No los modifiques ni los incluyas.

## 12. Documentar la GitHub Issue

Actualiza la GitHub Issue #$1 indicando:

- qué se ha implementado;
- decisiones técnicas relevantes;
- archivos o componentes principales modificados;
- tests ejecutados;
- build/lint ejecutados cuando correspondan;
- comprobaciones de integración realizadas;
- resultado de todas las verificaciones;
- hash del commit;
- mensaje del commit;
- nombre de la rama de trabajo.

Indica claramente que la implementación está completada y commiteada en la rama de trabajo, pero que la Issue permanece abierta pendiente de validación manual y de ejecutar `/finish-issue $1`.

NO cierres la Issue.

NO hagas push.

## 13. Verificación final obligatoria

Antes de considerar `/issue $1` completado, verifica que:

- la rama corresponde a la Issue;

- la carpeta SDD tiene slug válido;

- `spec.md` contiene contenido;

- `plan.md` contiene contenido;

- `tasks.md` contiene contenido;

- todas las tasks están completadas;

- las verificaciones aplicables pasan;

- existe un commit de la Issue;

- no quedan cambios de la Issue sin commit.

Si falla cualquiera de estas condiciones:

EL WORKFLOW HA FALLADO.

No informes que la Issue está completada.

No cierres la Issue.

## 14. Indicar validaciones manuales pendientes

Después de completar la implementación, las verificaciones automáticas y el commit,

indica qué validaciones manuales debe realizar el usuario antes de ejecutar

`/finish-issue $1`.

Esta sección es obligatoria.

Las validaciones manuales deben derivarse específicamente de:

- criterios de aceptación de la Issue;

- comportamiento implementado;

- capas modificadas;

- endpoints modificados;

- cambios visuales o de navegación;

- autenticación o autorización;

- persistencia;

- infraestructura;

- cualquier riesgo funcional relevante.

No generes una checklist genérica idéntica para todas las Issues.

No repitas tests automáticos que ya hayan sido ejecutados correctamente salvo que

sea necesario comprobar manualmente un comportamiento concreto.

Si la Issue afecta frontend, indica las comprobaciones visuales o de interacción

que debe realizar el usuario.

Si afecta backend/API, indica los endpoints o comportamientos que debe probar

manualmente.

Si afecta autenticación o autorización, diferencia los casos relevantes:

sin autenticación, usuario normal, administrador u otros permisos.

Si afecta Docker o infraestructura, indica las comprobaciones manuales de

arranque, healthcheck, persistencia o configuración necesarias.

Si la Issue es únicamente documental o de diseño técnico, indica qué decisiones

o documentación debe revisar el usuario.

Si no existe ninguna validación manual razonable, indícalo explícitamente.

### Formato obligatorio

Muestra al final una sección:

## Validaciones manuales pendientes

Incluye una lista concreta y breve.

Ejemplo:

- [ ] `GET /api/health` sin autenticación devuelve `200`.

- [ ] `GET /api/users/me` sin JWT devuelve `401`.

- [ ] La navegación móvil funciona correctamente a 390px.

- [ ] Los botones Anterior/Siguiente cambian correctamente de página.

- [ ] No existe scroll horizontal inesperado.

Las casillas representan validaciones pendientes del usuario.

NO las marques como completadas automáticamente.

NO registres todavía la validación manual como aprobada.

NO ejecutes `/finish-issue`.

## 15. Finalizar el workflow de desarrollo

NO cierres automáticamente la GitHub Issue #$1.

NO hagas push desde este comando.

La Issue debe permanecer abierta después de completar este workflow.

Antes de finalizar, debe cumplirse obligatoriamente que:

- existe una rama específica para la Issue;

- todas las tasks están completadas;

- todas las verificaciones aplicables pasan;

- existe al menos un commit correspondiente a la Issue;

- los cambios de la Issue no permanecen sin commit;

- la Issue está documentada con el hash y mensaje del commit.

Si NO existe el commit:

DETENTE.

No consideres `/issue` completado.

No documentes la Issue como terminada.

No cierres la Issue.

El siguiente paso será la validación manual realizada por el usuario.

Después de la aprobación manual, el usuario ejecutará:

`/finish-issue $1`

Ese comando será responsable de:

- verificar el commit existente;

- realizar el push de la rama;

- registrar la aprobación manual;

- cerrar la GitHub Issue.

Finaliza mostrando:

- Issue;

- rama;

- SDD;

- tasks completadas;

- verificaciones automáticas realizadas;

- hash y mensaje del commit;

- estado de `git status`;

- estado de la Issue;

- validación manual pendiente;

- checklist de pruebas manuales que debe realizar el usuario;

- comando recomendado para preparar el entorno cuando corresponda:

  `/dev-frontend`, `/dev-restart` o `/dev-full`;

- siguiente paso después de aprobar manualmente todas las pruebas:

  `/finish-issue $1`.
