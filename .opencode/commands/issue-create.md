---
description: Propone y crea una GitHub Issue mediante GitHub CLI
---

# /issue-create

Crea una nueva GitHub Issue en el repositorio actual a partir de la descripción
del usuario. El texto recibido después del command está disponible como
`$ARGUMENTS`.

## Responsabilidad

Este command únicamente recopila la información, clasifica la Issue mediante
labels del proyecto, presenta una propuesta y crea la GitHub Issue después de
una confirmación explícita del usuario.

No ejecutes `/issue` al terminar. La responsabilidad de este command termina
cuando la Issue se ha creado correctamente.

## Restricciones obligatorias

Durante este command:

- no implementes código;
- no crees ni modifiques `spec.md`, `plan.md` o `tasks.md`;
- no crees ni cambies de rama;
- no hagas commits ni push;
- no ejecutes `/issue` ni `/finish-issue`;
- no cierres ni modifiques una Issue existente;
- no uses el GitHub MCP para crear la Issue: la creación debe hacerse con `gh`.

Puedes consultar de forma puntual el repositorio actual o el estado de `gh` si
es necesario para validar el contexto, pero no amplíes el alcance ni realices un
análisis de implementación.

Antes de la confirmación explícita no ejecutes ninguna operación remota que cree,
edite, cierre o elimine Issues.

## 1. Recopilar la propuesta

Usa `$ARGUMENTS` como descripción inicial. Extrae o determina estos campos:

- título;
- objetivo;
- contexto;
- requisitos;
- criterios de aceptación;
- referencias externas, si el usuario las proporcionó o si son necesarias para
  entender la propuesta.

Infiere los campos que estén claros en la descripción. No inventes decisiones
funcionales, referencias ni criterios que no se desprendan del texto. Si falta
información necesaria o existe una ambigüedad importante, pregunta únicamente
por esa información antes de preparar la propuesta.

Si no se proporciona una descripción, solicita al usuario que describa el
trabajo que quiere registrar. No intentes crear una Issue vacía.

Si la descripción permite proponer un título pero este puede interpretarse de
varias formas, ofrece el título inferido y pide confirmación o corrección antes
de continuar.

## 2. Preparar el contenido

Construye la Issue con este formato Markdown, manteniendo el contenido concreto
y verificable:

```markdown
## Objetivo

<qué problema resuelve o qué resultado se busca>

## Contexto

<información necesaria para entender la necesidad>

## Requisitos

- <requisito verificable>

## Criterios de aceptación

- [ ] <condición observable y verificable>

## Referencias

- <URL o referencia proporcionada>
```

Incluye `## Referencias` únicamente cuando existan referencias. Si algún campo
no está disponible y no impide entender la Issue, indícalo como pendiente de
definir en lugar de rellenarlo con suposiciones. Los criterios de aceptación
deben describir resultados comprobables, no tareas de implementación.

## 3. Clasificar la Issue

Antes de mostrar la propuesta, determina las labels aplicables según el alcance
real de la Issue.
Consulta las labels disponibles en el repositorio mediante:
`gh label list`

Utiliza únicamente labels que ya existan en el repositorio.
No crees nuevas labels automáticamente.
Una Issue puede tener varias labels cuando afecte realmente a varias áreas.

Clasificaciones habituales del proyecto:

- `frontend` → React, TypeScript, UI, navegación, componentes o cliente API;
- `backend` → Java, Spring Boot, controllers, services, DTOs o repositories;
- `database` → MySQL, esquema, migraciones, relaciones o persistencia;
- `security` → autorización, ownership, protección de recursos o controles de acceso;
- `auth` → login, registro, JWT, sesión o identidad del usuario;
- `docker` → Docker, Docker Compose, contenedores o infraestructura local;
- `testing` → trabajo cuyo objetivo principal sean tests;
- `documentation` → documentación sin implementación funcional;
- `design` → UI/UX o decisiones de diseño visual;
- `workflow` → agentes, commands, GitHub, CI/CD o tooling del workflow.

Reglas de clasificación:

- selecciona únicamente labels justificadas por el alcance real de la Issue;
- no añadas una label simplemente porque esa tecnología exista en el proyecto;
- no inventes labels;
- no crees labels nuevas;
- no sustituyas una label inexistente por otra diferente sin informar al usuario;
- una Issue puede tener más de una label;
- evita añadir labels redundantes o innecesarias;
- las labels propuestas forman parte de la confirmación explícita del usuario.

Ejemplos:
Una Issue que modifica únicamente React para mostrar favoritos:
`frontend`
Una Issue que implementa endpoints y persistencia:
`backend`, `database`
Una Issue que implementa autorización JWT sobre recursos:
`backend`, `security`, `auth`
Una Issue que modifica una migración MySQL:
`database`
Una Issue que modifica Docker Compose:
`docker`

Si ninguna label existente representa correctamente la Issue, indícalo en la
propuesta y continúa sin inventar ni crear una label.

## 4. Mostrar y confirmar

Antes de ejecutar cualquier creación, muestra la propuesta completa al usuario:

- título exacto;
- cuerpo Markdown exacto;
- labels que se aplicarán;
- repositorio destino, si ha podido determinarse sin ambigüedad.

Indica claramente que todavía no se ha creado la Issue.

Después solicita una confirmación explícita mediante una pregunta interactiva con
opciones equivalentes a:

- `Crear Issue`;
- `Revisar propuesta`;
- `Cancelar`.

No interpretes un comentario, una respuesta ambigua o la ausencia de respuesta
como confirmación. No ejecutes `gh issue create` hasta que el usuario elija
explícitamente `Crear Issue`.

Si el usuario elige revisar, solicita los cambios necesarios, actualiza la
propuesta y vuelve a mostrar:

- título;
- cuerpo;
- labels.

  Cada propuesta modificada requiere una nueva confirmación explícita.

Si el usuario cancela o no confirma, termina sin ejecutar `gh issue create` y
deja claro que no se creó ninguna Issue.

## 5. Crear la Issue

Solo después de la confirmación explícita:

1. Comprueba que `gh` está disponible y que la sesión está autenticada. Si
   alguno de esos requisitos falla, informa del error y detente sin afirmar que
   la Issue fue creada.

2. Determina el repositorio actual con `gh repo view` si no se había podido
   determinar antes. Si no puede determinarse de forma segura, detente y pide
   intervención.

3. Ejecuta `gh issue create` usando exactamente:
   - el título confirmado;
   - el cuerpo confirmado;
   - las labels confirmadas.
     Usa:

   - `--title` para el título;
   - `--body` para el cuerpo;
   - `--label` para cada label confirmada.

   Ejemplo conceptual:

   `gh issue create --title "..." --body "..." --label "frontend" --label "backend"`

   No añadas labels distintas de las confirmadas.
   No añadas assignees, proyectos ni otros metadatos que no hayan sido
   solicitados.

4. Conserva la URL devuelta por `gh issue create`.

5. Usa `gh issue view` sobre la Issue recién creada para comprobar, cuando sea
   necesario:
   - número;
   - título;
   - URL;
   - labels finales.

Si `gh issue create` devuelve un error:

- muestra el error recibido;
- no inventes datos;
- no afirmes que la Issue fue creada;
- no ejecutes ningún workflow posterior.

## 6. Salida final

Cuando la creación haya terminado correctamente, muestra únicamente un resumen
de la operación con:

- número de Issue;
- título;
- labels aplicadas;
- URL.

Indica que la Issue fue creada. No continúes automáticamente con `/issue`; ese
command será ejecutado por el usuario cuando quiera comenzar el workflow SDD.

La separación de responsabilidades queda así:

- `/issue-create` → propone, clasifica y crea la GitHub Issue;
- `/issue` → analiza una Issue existente y comienza el workflow SDD;
- `/finish-issue` → verifica, documenta, publica y finaliza una Issue
  implementada.
