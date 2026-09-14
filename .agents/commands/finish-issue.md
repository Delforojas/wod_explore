---
description: Publica y cierra una GitHub Issue previamente implementada
---

Finaliza la GitHub Issue #$1 del repositorio actual.

Este comando se ejecuta únicamente después de que:

- `/issue $1` haya completado correctamente el desarrollo;

- exista una rama específica correspondiente a la Issue;

- exista un commit correspondiente a la Issue;

- el usuario haya realizado la validación manual.

La ejecución de `/finish-issue $1` implica explícitamente que el usuario aprueba la validación manual.

No solicites una confirmación adicional de la validación manual.

No detengas el workflow por falta de una segunda confirmación.

## 1. Comprobar la Issue

Obtén la GitHub Issue #$1 mediante el GitHub MCP.

Comprueba que:

- la implementación está documentada;
- existe un commit asociado;
- las tasks están completadas;
- no existen bloqueos pendientes.

El estado remoto de la Issue no sustituye las comprobaciones Git.

Aunque la Issue #$1 aparezca ya como cerrada:

- comprueba igualmente la rama;
- comprueba el commit;
- comprueba el working tree;
- comprueba si la rama está publicada.

Si existe trabajo pendiente:

DETENTE.

## 2. Comprobar Git

Comprueba:

- la rama actual;
- `git status`;
- que la rama actual corresponde a la Issue #$1;
- que existe el commit correspondiente a la Issue #$1;
- que dicho commit pertenece a la rama actual;
- que no quedan cambios pertenecientes a la Issue sin commit.

Obtén:

- nombre de la rama;
- hash del commit;
- mensaje del commit.

La rama debe haber sido creada previamente por `/issue $1`.

Si la rama actual no corresponde a la Issue #$1:

DETENTE.

No crees una nueva rama.
No cambies automáticamente a otra rama.
No hagas push.
No cierres la Issue.

Si no existe un commit correspondiente a la Issue #$1:

DETENTE.

No crees el commit desde este comando.
No hagas push.
No cierres la Issue.

Si quedan cambios pertenecientes a la Issue sin commit:

DETENTE.

Informa de que `/issue $1` no completó correctamente el workflow.

## 3. Publicar la rama

Únicamente después de superar todas las comprobaciones anteriores, publica la rama actual.

Si la rama todavía no tiene upstream:

- configura el upstream durante el push.

Ejemplo conceptual:

`git push -u origin <rama>`

Si ya existe upstream:

- realiza el push normal.

Después del push comprueba que:

- el comando terminó correctamente;
- la rama remota existe;
- el commit correspondiente a la Issue está publicado en remoto.

Si el push falla:

DETENTE.

No documentes la validación como finalizada.
No cierres la Issue.

## 4. Registrar la validación manual

Considera la validación manual como aprobada por el hecho de que el usuario ha ejecutado `/finish-issue $1`.

Actualiza la GitHub Issue #$1 indicando que:

- la implementación fue completada durante `/issue $1`;

- las verificaciones automáticas fueron realizadas durante `/issue $1`;

- la validación manual fue realizada y aprobada por el usuario antes de ejecutar `/finish-issue $1`;

- la rama ha sido publicada correctamente;

- el commit final asociado es el detectado anteriormente.

No solicites confirmación adicional al usuario.

## 5. Cerrar la Issue

El cierre de la Issue debe ser siempre el último paso.

Cierra la GitHub Issue #$1 únicamente si se cumplen TODAS estas condiciones:

- la rama corresponde a la Issue;

- existe un commit válido correspondiente a la Issue;

- no quedan cambios de la Issue sin commit;

- la ejecución de `/finish-issue $1` confirma que la validación manual ya fue realizada y aprobada;

- el push se ha completado correctamente;

- la rama y el commit existen en remoto;

- no existen bloqueos pendientes.

Si cualquiera de estas condiciones no se cumple:

DETENTE.

NO cierres la Issue.

## 6. Verificación final

Comprueba:

- rama local correcta;
- working tree sin cambios pendientes de la Issue;
- commit correcto;
- rama publicada en remoto;
- commit disponible en remoto;
- validación manual registrada;
- Issue cerrada.

## 7. Resumen final

Muestra:

- Issue;
- rama;
- hash y mensaje del commit;
- estado del working tree;
- estado del push;
- validación manual;
- estado final de la Issue.

El workflow `/finish-issue $1` solo se considera COMPLETADO si:

1. la rama correcta ya existía;

2. el commit de la Issue ya existía;

3. no quedaban cambios de la Issue sin commit;

4. la ejecución de `/finish-issue $1` confirma la aprobación de la validación manual;

5. el push se realizó correctamente;

6. la Issue quedó correctamente documentada;

7. la Issue está cerrada.
