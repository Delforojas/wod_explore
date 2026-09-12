---
description: Ejecuta el workflow completo de desarrollo de una GitHub Issue
---

Trabaja sobre la GitHub Issue #$1 del repositorio actual.

El workflow `/issue $1` se considera FALLIDO si termina sin:

1. una rama específica para la Issue;
2. un SDD válido y no vacío;
3. verificaciones correctas;
4. un commit creado para la Issue.

Nunca informes que la Issue está completada si falta cualquiera de estos elementos.

NO hagas push.
NO cierres la GitHub Issue.

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

Comprueba:

- la rama actual;
- `git status`;
- cambios locales existentes.

NO continúes mientras estés en `main` o en una rama perteneciente a otra Issue.

La rama de trabajo debe partir del estado de desarrollo válido del proyecto.

Genera el nombre utilizando:

- tipo de cambio;
- número de Issue con 3 dígitos;
- slug corto derivado del título.

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
- no crees una segunda rama.

Después de crear o seleccionar la rama:

- ejecuta `git branch --show-current`;
- comprueba explícitamente que la rama corresponde a la Issue #$1.

Si la rama no corresponde a la Issue #$1:

DETENTE.

Si existen cambios locales ajenos a la Issue que impiden cambiar de rama de forma segura:

DETENTE y solicita intervención.

No descartes, sobrescribas, hagas stash ni incluyas cambios ajenos sin autorización.

## 4. Crear o completar obligatoriamente el SDD

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

Si ya existe una carpeta:

`specs/<numero>-*`

correspondiente a la misma Issue:

- reutilízala;
- si el slug está vacío o es incorrecto, renómbrala antes de continuar;
- no crees una segunda carpeta.

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

Comprueba explícitamente el contenido de los archivos.

Si cualquiera está vacío:

DETENTE.

No implementes.
No hagas commit.
No documentes la Issue como completada.
No cierres la Issue.

## 5. Validar la planificación

Antes de implementar código, comprueba:

- que `spec.md` cubre los criterios de aceptación;
- que `plan.md` es compatible con la arquitectura;
- que `tasks.md` representa el trabajo necesario;
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
- no modifiques archivos ajenos salvo que sea técnicamente necesario.

Marca una task como completada únicamente cuando realmente esté terminada.

## 7. Ejecutar verificaciones

Después de implementar, ejecuta todas las verificaciones aplicables:

- tests;
- build;
- lint;
- comprobaciones de integración;
- verificaciones definidas en AGENTS.md;
- cualquier otra comprobación necesaria para demostrar los criterios de aceptación.

No ejecutes verificaciones que claramente no sean aplicables.

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

- ejecuta `git diff`;
- ejecuta `git status`;
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

El mensaje debe describir claramente el trabajo realizado.

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

`git status`

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

Indica claramente que la implementación está completada en la rama de trabajo y pendiente de validación manual.

NO cierres la Issue.

## 13. Verificación final

Comprueba que:

- todos los criterios de aceptación están satisfechos;
- todas las tasks correspondientes están completadas;
- todas las verificaciones aplicables pasan;
- el commit existe;
- no quedan cambios de la Issue sin commit;
- la Issue está correctamente documentada.

Si alguna condición no se cumple:

DETENTE y deja constancia de lo pendiente.

## 14. Finalizar el workflow de desarrollo

NO cierres automáticamente la GitHub Issue #$1.

NO hagas push desde este comando.

La Issue debe permanecer abierta después de completar este workflow.

Antes de finalizar debe cumplirse obligatoriamente que:

- existe una rama específica para la Issue;
- el SDD contiene `spec.md`, `plan.md` y `tasks.md` válidos;
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
- verificaciones realizadas;
- hash y mensaje del commit;
- estado de `git status`;
- estado de la Issue;
- siguiente paso: `/finish-issue $1`.
