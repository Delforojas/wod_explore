---
description: Publica y cierra una GitHub Issue previamente implementada
---

Finaliza la GitHub Issue #$1 del repositorio actual.

Este comando se ejecuta únicamente después de que:

- `/issue $1` haya completado correctamente el desarrollo;
- exista una rama específica correspondiente a la Issue;
- exista un commit correspondiente a la Issue;
- el usuario haya realizado y aprobado la validación manual.

Este comando NO implementa trabajo.

No vuelvas a implementar la Issue.
No vuelvas a generar ni modificar el SDD.
No repitas el análisis completo del proyecto.
No repitas tests, build o lint salvo que sea necesario para comprobar un problema detectado.
No crees nuevas ramas.
No crees nuevos commits salvo autorización explícita del usuario.

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

Informa de que `/issue $1` no completó correctamente el workflow

## 3. Archivos cambiados por la Issue

Esta sección es OBLIGATORIA.

Identifica la rama base real desde la que se creó la rama actual.

Obtén la lista completa de archivos pertenecientes a la Issue respecto a esa rama base mediante una comparación equivalente a:

`git diff --name-status <rama-base>...HEAD`

No uses `main` automáticamente si la rama fue creada desde otra rama válida de dependencia.

Clasifica los resultados como:

- `A` — archivo añadido;

- `M` — archivo modificado;

- `D` — archivo eliminado;

- `R` — archivo renombrado.

Conserva esta lista para:

1. documentarla posteriormente en la GitHub Issue;

2. mostrarla en el resumen final.

No incluyas cambios locales ajenos a la Issue.

Si no puede determinarse con seguridad la rama base:

DETENTE.

No inventes una rama base.

## 4. Publicar la rama

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

## 5. Registrar la validación manual

Actualiza la GitHub Issue #$1 indicando que:

- la implementación fue completada durante `/issue $1`;

- las verificaciones automáticas fueron realizadas durante `/issue $1`;

- el usuario ha realizado y aprobado la validación manual;

- la rama ha sido publicada correctamente;

- el commit final asociado es el detectado anteriormente.

Incluye:

- nombre de la rama;

- rama base;

- hash del commit;

- mensaje del commit;

- archivos cambiados por la Issue.

Incluye obligatoriamente un apartado:

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

## 6. Cerrar la Issue

El cierre de la Issue debe ser siempre el último paso.

Cierra la GitHub Issue #$1 únicamente si se cumplen TODAS estas condiciones:

- la rama corresponde a la Issue;
- existe un commit válido correspondiente a la Issue;
- no quedan cambios de la Issue sin commit;
- el usuario ha aprobado la validación manual;
- el push se ha completado correctamente;
- la rama y el commit existen en remoto;
- no existen bloqueos pendientes.

Si cualquiera de estas condiciones no se cumple:

DETENTE.

NO cierres la Issue.

Si la Issue ya estaba cerrada antes de ejecutar este comando:

- no asumas que el workflow estaba correctamente finalizado;
- completa igualmente todas las comprobaciones Git y de publicación;
- no vuelvas a cerrarla innecesariamente.

## 7. Verificación final

Comprueba:

- rama local correcta;
- working tree sin cambios pendientes de la Issue;
- commit correcto;
- rama publicada en remoto;
- commit disponible en remoto;
- validación manual registrada;
- Issue cerrada.

## 8. Resumen final

La salida final DEBE incluir obligatoriamente:

- Issue;

- rama;

- rama base;

- hash y mensaje del commit final;

- archivos cambiados por la Issue;

- estado del working tree;

- estado del push;

- validación manual;

- estado final de la Issue.

No finalices el comando sin mostrar la lista de archivos cambiados.
