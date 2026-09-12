---
description: Publica y cierra una GitHub Issue previamente implementada
---

Finaliza la GitHub Issue #$1 del repositorio actual.

Este comando se ejecuta únicamente después de que:

- `/issue $1` haya completado el desarrollo;
- exista un commit correspondiente a la Issue;
- el usuario haya realizado y aprobado la validación manual.

No vuelvas a implementar la Issue.
No vuelvas a generar el SDD.
No repitas el análisis completo del proyecto.
No repitas tests, build o lint salvo que sea necesario para comprobar un problema detectado.

## 1. Comprobar la Issue

Obtén la GitHub Issue #$1 mediante el GitHub MCP.

Comprueba que:

- la implementación está documentada;
- existe un commit asociado;
- las tasks están completadas;
- no existen bloqueos pendientes.

Si existe trabajo pendiente:

DETENTE.

## 2. Comprobar Git

Comprueba:

- la rama actual;
- `git status`;
- que existe el commit correspondiente a la Issue #$1;
- que no quedan cambios pertenecientes a la Issue sin commit.

Obtén:

- nombre de la rama;
- hash del commit;
- mensaje del commit.

Si quedan cambios de la Issue sin commit:

DETENTE.

## 3. Publicar la rama

Haz push de la rama actual al remoto.

Si la rama todavía no tiene upstream:

- configura el upstream durante el push.

Ejemplo conceptual:

`git push -u origin <rama>`

Si ya existe upstream:

realiza el push normal.

Comprueba que el push se ha completado correctamente.

Si el push falla:

- DETENTE;
- NO cierres la Issue.

## 4. Registrar validación manual

Actualiza la GitHub Issue #$1 indicando que:

- la implementación fue completada;
- las verificaciones automáticas fueron realizadas durante `/issue`;
- el usuario ha realizado y aprobado la validación manual;
- la rama ha sido publicada correctamente;
- el commit final asociado es el detectado anteriormente.

No inventes pruebas manuales que el usuario no haya indicado.

## 5. Cerrar la Issue

Cierra la GitHub Issue #$1 únicamente si:

- existe un commit válido;
- no quedan cambios de la Issue sin commit;
- la validación manual ha sido aprobada;
- el push se ha completado correctamente;
- no existen bloqueos pendientes.

El cierre de la Issue debe ser siempre el último paso.

## 6. Resumen final

Muestra:

- Issue;
- rama;
- commit;
- estado del push;
- estado final de la Issue.
