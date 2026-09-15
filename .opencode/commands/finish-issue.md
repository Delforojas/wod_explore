---
description: Finaliza, publica y cierra una GitHub Issue previamente implementada
---

Finaliza la GitHub Issue #$1 del repositorio actual.

Este comando se ejecuta únicamente después de que:

- `/issue $1` haya completado correctamente el desarrollo;
- exista una rama específica correspondiente a la Issue;
- las tasks de la Issue estén completadas;
- el usuario haya realizado y aprobado la validación manual.

Este comando NO implementa trabajo.

No vuelvas a implementar la Issue.
No vuelvas a generar ni modificar el SDD.
No repitas el análisis completo del proyecto.
No repitas tests, build o lint salvo que sea necesario para comprobar un problema detectado.
No crees nuevas ramas.

Este comando SÍ está autorizado para:

- crear el commit final correspondiente a la Issue si todavía no existe;
- añadir al staging únicamente archivos pertenecientes a la Issue;
- publicar la rama;
- documentar la finalización mediante GitHub MCP;
- cerrar la Issue.

La ejecución explícita de `/finish-issue $1` constituye autorización del usuario
para realizar el commit y push necesarios para finalizar exclusivamente esa Issue.

Nunca incluyas en el commit cambios locales ajenos a la Issue.

## 1. Comprobar la Issue

Obtén la GitHub Issue #$1 mediante el GitHub MCP.

Comprueba que:

- la implementación está documentada;
- las tasks están completadas;
- no existen bloqueos pendientes;
- la validación manual ha sido indicada por el usuario como aprobada.

El estado remoto de la Issue no sustituye las comprobaciones Git.

Aunque la Issue #$1 aparezca ya como cerrada:

- comprueba igualmente la rama;
- comprueba los cambios;
- comprueba el commit;
- comprueba el working tree;
- comprueba si la rama está publicada.

Si existe trabajo de implementación pendiente:

DETENTE.

No implementes trabajo desde este comando.

## 2. Comprobar la rama y el working tree

Comprueba:

- la rama actual;
- `git status`;
- que la rama actual corresponde a la Issue #$1;
- los commits existentes de la rama;
- los cambios locales pendientes.

La rama debe haber sido creada previamente por `/issue $1`.

Si la rama actual no corresponde a la Issue #$1:

DETENTE.

No crees una nueva rama.
No cambies automáticamente a otra rama.
No hagas commit.
No hagas push.
No cierres la Issue.

## 3. Determinar la rama base

Identifica la rama base real desde la que se creó la rama actual.

No uses `main` automáticamente si la rama fue creada desde otra rama válida
de dependencia.

Utiliza historial Git, merge-base, reflog o referencias locales/remotas
cuando sea necesario para determinarla de forma segura.

Si no puede determinarse con seguridad la rama base:

DETENTE.

No inventes una rama base.

Conserva el nombre de la rama base para el resumen final.

## 4. Identificar los archivos pertenecientes a la Issue

Esta sección es OBLIGATORIA.

Inspecciona:

- cambios ya committeados respecto a la rama base;
- cambios staged;
- cambios unstaged;
- archivos nuevos sin seguimiento.

Determina qué archivos pertenecen realmente a la Issue #$1 usando:

- la Issue;
- la spec activa;
- el plan;
- las tasks;
- la implementación realizada durante `/issue $1`;
- la rama actual.

No asumas que todos los cambios del working tree pertenecen a la Issue.

Clasifica los archivos como:

- `A` — añadido;
- `M` — modificado;
- `D` — eliminado;
- `R` — renombrado.

Si existen cambios locales ajenos a la Issue:

- no los añadas al staging;
- no los modifiques;
- no los elimines;
- no los incluyas en el commit.

Si no es posible separar con seguridad los cambios de la Issue de otros cambios locales:

DETENTE.

Informa exactamente qué archivos generan la ambigüedad.

## 5. Crear o localizar el commit final

Busca primero si ya existe un commit válido correspondiente a la Issue #$1.

Un commit se considera asociado a la Issue cuando:

- pertenece a la rama actual;
- contiene los cambios correspondientes a la Issue;
- su mensaje referencia claramente la Issue #$1 o su propósito.

### Si ya existe un commit válido

No crees otro commit innecesariamente.

Comprueba que no queden cambios de la Issue pendientes de commit.

### Si NO existe un commit válido

Y existen cambios correspondientes a la Issue pendientes:

1. añade al staging únicamente los archivos pertenecientes a la Issue;

2. revisa el staging antes de hacer commit;

3. comprueba que no se hayan incluido cambios ajenos;

4. crea un commit final para la Issue.

El mensaje debe:

- describir brevemente el cambio realizado;
- seguir el estilo de commits existente en el repositorio cuando pueda determinarse;
- incluir obligatoriamente `(#$1)`.

Ejemplos conceptuales:

`docs: update official design system (#38)`

`feat: apply visual language across frontend (#37)`

No uses estos ejemplos automáticamente si no describen la Issue real.

No uses `git add .` ni equivalentes que puedan incluir cambios ajenos.

Añade explícitamente únicamente los archivos correspondientes a la Issue.

Después del commit obtén:

- hash;
- mensaje;
- archivos contenidos.

### Si ya existía un commit pero quedan cambios de la Issue pendientes

Puedes crear un commit final adicional únicamente para esos cambios pendientes,
si forman parte inequívoca de la Issue.

No reescribas commits existentes.
No hagas amend salvo petición explícita del usuario.
No hagas rebase automáticamente.

## 6. Verificar el estado previo al push

Después de localizar o crear el commit final, comprueba:

- que el commit pertenece a la rama actual;
- que incluye únicamente cambios de la Issue;
- que no quedan cambios de la Issue pendientes;
- que cualquier cambio local restante es ajeno a la Issue.

Los cambios locales ajenos no impiden finalizar la Issue siempre que:

- hayan sido identificados claramente;
- no estén incluidos en el commit;
- no hayan sido modificados por este comando.

Obtén la lista final de archivos de la Issue mediante una comparación equivalente a:

`git diff --name-status <rama-base>...HEAD`

No incluyas archivos que pertenezcan exclusivamente a trabajo ajeno a la Issue.

Conserva esta lista para:

1. documentarla posteriormente en la GitHub Issue;
2. mostrarla en el resumen final.

## 7. Publicar la rama

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

No documentes la finalización.
No cierres la Issue.

## 8. Integrar la rama en main mediante Pull Request

Después de publicar correctamente la rama, integra la Issue en `main`.

Esta sección es OBLIGATORIA antes de cerrar la Issue.

### 8.1 Comprobar la rama destino

La rama destino normal es `main`.

Antes de crear el Pull Request:

- comprueba que `origin/main` existe;
- comprueba que la rama actual está publicada;
- comprueba que el commit final de la Issue existe en remoto.

No hagas merge directamente mediante `git merge` local.

La integración debe realizarse mediante Pull Request usando GitHub MCP.

### 8.2 Crear o localizar el Pull Request

Busca primero si ya existe un Pull Request abierto correspondiente a:

- la rama actual;
- la Issue #$1;
- destino `main`.

Si ya existe:

- reutilízalo;
- no crees un PR duplicado.

Si no existe:

- crea un Pull Request mediante GitHub MCP;
- usa como base `main`;
- usa como head la rama actual;
- referencia la Issue #$1.

El título debe describir brevemente el cambio e incluir `#$1` cuando resulte apropiado.

No cierres todavía la Issue.

### 8.3 Comprobar que el Pull Request puede integrarse

Comprueba mediante GitHub MCP que:

- el PR apunta a `main`;
- no existen conflictos de merge;
- las comprobaciones obligatorias de GitHub, si existen, permiten la integración;
- el commit final de la Issue forma parte del PR.

Si existen conflictos:

DETENTE.

No intentes resolver conflictos automáticamente desde `/finish-issue`.
No cierres la Issue.

Informa al usuario de que la rama necesita actualizarse o resolver conflictos.

### 8.4 Hacer merge del Pull Request

Si el PR es integrable y no existen bloqueos:

- realiza el merge mediante GitHub MCP;
- respeta la estrategia de merge configurada en el repositorio;
- no uses force push;
- no reescribas historial.

Después del merge comprueba que:

- el Pull Request aparece como merged;
- `main` contiene los cambios de la Issue;
- el commit o merge commit está disponible en remoto.

Si el merge falla:

DETENTE.

No cierres la Issue.

### 8.5 Sincronizar main local

Después de confirmar el merge remoto:

- cambia a `main`;
- actualiza `main` desde `origin/main` mediante fast-forward cuando sea posible.

Ejemplo conceptual:

`git switch main`

`git pull --ff-only origin main`

No realices merges adicionales durante este paso.

Después comprueba que:

- `main` local contiene los cambios de la Issue;
- `main` está sincronizado con `origin/main`.

Conserva para el resumen final:

- URL o número del Pull Request;
- estado del PR;
- estrategia de merge utilizada;
- hash resultante en `main`.

## 9. Registrar la validación y finalización

Actualiza la GitHub Issue #$1 mediante GitHub MCP indicando que:

- la implementación fue completada durante `/issue $1`;
- las verificaciones automáticas fueron realizadas durante `/issue $1`;
- el usuario ha realizado y aprobado la validación manual;
- la rama ha sido publicada correctamente;
- el commit final asociado es el detectado o creado anteriormente.

Incluye:

- nombre de la rama;
- rama base;
- hash del commit;
- mensaje del commit;
- archivos cambiados por la Issue.

Incluye obligatoriamente:

### Archivos cambiados

Muestra todos los archivos detectados anteriormente, conservando su estado:

- `A` — añadido;
- `M` — modificado;
- `D` — eliminado;
- `R` — renombrado.

Ejemplo:

### Archivos cambiados

- `M frontend/src/pages/ExercisesPage.tsx`
- `A frontend/src/components/Pagination.tsx`
- `A frontend/src/components/Pagination.test.tsx`
- `M frontend/src/api/exercises.ts`
- `A specs/031-frontend-redesign/spec.md`
- `A specs/031-frontend-redesign/plan.md`
- `A specs/031-frontend-redesign/tasks.md`

No inventes pruebas manuales que el usuario no haya indicado.

No vuelvas a documentar detalles técnicos innecesariamente si ya fueron registrados durante `/issue $1`.

## 10. Cerrar la Issue

El cierre de la Issue debe ser siempre el último paso remoto.

Cierra la GitHub Issue #$1 únicamente si se cumplen TODAS estas condiciones:

- la rama corresponde a la Issue;
- existe un commit válido correspondiente a la Issue;
- no quedan cambios de la Issue sin commit;
- el usuario ha aprobado la validación manual;
- el push se ha completado correctamente;
- la rama y el commit existen en remoto;
- no existen bloqueos pendientes.

Los cambios locales ajenos a la Issue no deben impedir el cierre siempre que
hayan sido identificados y excluidos correctamente del commit.

Si cualquiera de estas condiciones no se cumple:

DETENTE.

NO cierres la Issue.

Si la Issue ya estaba cerrada antes de ejecutar este comando:

- no asumas que el workflow estaba correctamente finalizado;
- completa igualmente todas las comprobaciones Git y de publicación;
- no vuelvas a cerrarla innecesariamente.

# 11. Verificación final

Comprueba:

- rama base identificada;

- ningún cambio perteneciente a la Issue pendiente de commit;

- commit correcto;

- rama publicada en remoto;

- commit disponible en remoto;

- Pull Request integrado correctamente en `main`;

- los cambios de la Issue existen en `origin/main`;

- validación manual registrada;

- Issue cerrada.

Después de confirmar todo lo anterior:

1. cambia a `main`;

2. ejecuta una actualización equivalente a:

`git pull --ff-only origin main`

3. comprueba que `main` local contiene los cambios de la Issue;

4. comprueba que `main` está sincronizado con `origin/main`;

5. comprueba que el working tree no contiene cambios inesperados;

6. termina obligatoriamente el comando estando en `main`.

El comando NO debe finalizar dejando al usuario en la rama de la Issue.

Si no es posible volver a `main` de forma segura:

DETENTE.

No finalices el workflow hasta resolver el problema.

Si quedan cambios locales ajenos a la Issue, indícalos claramente sin modificarlos.

## 12. Resumen final

La salida final DEBE incluir obligatoriamente:

- Issue;
- rama;
- rama base;
- hash y mensaje del commit final;
- archivos cambiados por la Issue;
- estado del working tree;
- cambios locales ajenos, si existen;
- estado del push;
- validación manual;
- estado final de la Issue.

No finalices el comando sin mostrar la lista de archivos cambiados.
