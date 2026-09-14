---
description: Analiza el estado actual de WOD Explorer y genera las siguientes GitHub Issues necesarias
---

# /roadmap

<<<<<<< HEAD

## Objetivo

Analizar el estado real de **WOD Explorer**, revisar el trabajo ya completado y definir las siguientes GitHub Issues necesarias para continuar el desarrollo del proyecto de forma ordenada y sin duplicar funcionalidades.

## Instrucciones

### 1. Leer las reglas del proyecto

Antes de realizar cualquier acción, lee:

- `AGENTS.md`
- los `AGENTS.md` específicos aplicables;
- la constitución del proyecto, si existe;
- `PRODUCT.md`, si existe;
- documentación técnica relevante del repositorio.

No modifiques código.

---

### 2. Analizar GitHub

Utiliza el GitHub MCP configurado para el repositorio actual.

Revisa:

- Issues abiertas;
- Issues cerradas;
- Issues completadas recientemente;
- títulos;
- descripciones;
- criterios de aceptación;
- comentarios finales;
- relaciones entre Issues.

Identifica qué funcionalidades ya están implementadas.

No crees Issues que dupliquen trabajo existente.

---

### 3. Analizar el estado real del repositorio

Inspecciona la implementación actual del proyecto.

Revisa especialmente:

- backend Spring Boot;
- frontend React;
- entidades;
- repositories;
- services;
- controllers;
- DTOs;
- seguridad;
- autenticación;
- tests;
- configuración;
- Docker;
- base de datos;
- documentación;
- specs existentes.

No asumas que una funcionalidad está implementada únicamente porque exista una Issue cerrada.

Comprueba el código real.

---

### 4. Analizar la base de datos

Si es necesario, utiliza el MCP de base de datos configurado.

Comprueba:

- tablas existentes;
- relaciones;
- claves primarias;
- claves foráneas;
- datos relevantes;
- diferencias entre el modelo de persistencia y el backend.

No modifiques el esquema ni los datos.

---

### 5. Revisar las Specs existentes

Revisa el directorio:

```text
specs/
```

Determina:

- qué Specs están completadas;
- cuáles están pendientes;
- cuáles corresponden a Issues existentes;
- qué funcionalidades ya están cubiertas.

No generes una nueva Issue para algo que ya tenga una Spec activa o esté implementado.

---

### 6. Determinar el estado actual del producto

Resume qué partes del producto están actualmente disponibles.

Clasifica, cuando corresponda:

- ✅ completado;
- 🟡 parcialmente implementado;
- ❌ pendiente.

Identifica dependencias entre funcionalidades.

---

### 7. Detectar el siguiente trabajo necesario

Determina qué funcionalidades faltan para avanzar hacia una aplicación Full Stack completa.

Prioriza trabajo que:

1. desbloquee otras funcionalidades;
2. complete flujos existentes;
3. tenga dependencias claras;
4. sea coherente con la arquitectura actual;
5. aporte valor funcional al producto.

Evita:

- refactors sin necesidad;
- features especulativas;
- optimizaciones prematuras;
- infraestructura innecesaria;
- funcionalidades fuera del alcance actual.

---

### 8. Proponer las siguientes Issues

Antes de crearlas, presenta una propuesta ordenada.

Para cada Issue indica:

- título;
- objetivo;
- motivo por el que es necesaria;
- dependencias;
- prioridad;
- alcance aproximado.

Ordénalas según la secuencia recomendada de implementación.

---

### 9. Crear las GitHub Issues

Una vez determinado el roadmap, crea las Issues necesarias mediante GitHub MCP.

Cada Issue debe contener:

## Contexto

Por qué existe la Issue.

## Objetivo

Qué debe conseguir.

## Alcance

Qué debe implementarse.

## Criterios de aceptación

Condiciones verificables para considerar la Issue completada.

## Fuera de alcance

Qué no debe implementarse dentro de esta Issue.

## Dependencias

Issues o funcionalidades necesarias previamente.

## Notas técnicas

Información relevante descubierta durante el análisis.

---

### 10. Mantener Issues manejables

Cada Issue debe representar una unidad de trabajo razonable.

Evita Issues demasiado grandes.

Si una funcionalidad contiene varias responsabilidades independientes, divídela en varias Issues.

Cada Issue debe poder convertirse posteriormente en un SDD independiente:

```text
GitHub Issue
    ↓
spec.md
    ↓
plan.md
    ↓
tasks.md
```

---

### 11. No implementar

Este command es exclusivamente de análisis y planificación.

No:

- escribas código;
- modifiques la base de datos;
- crees Specs;
- cambies configuración;
- hagas commits;
- hagas push;
- cierres Issues.

---

## Resultado esperado

Al finalizar muestra:

```text
WOD Explorer — Roadmap

Estado actual:
- Backend: ...
- Frontend: ...
- Base de datos: ...
- Seguridad: ...
- Tests: ...

Issues revisadas:
- Abiertas: X
- Cerradas: X

Nuevas Issues creadas:
#XX — ...
#XX — ...
#XX — ...

Orden recomendado:
#XX → #XX → #XX

Siguiente paso recomendado:
/issue XX
```

=======
Analiza el estado actual de WOD Explorer y determina cuáles deben ser las siguientes GitHub Issues del proyecto.

El objetivo de este comando es decidir **qué hacer después**, no realizar una auditoría completa del repositorio.

## Objetivo

Mantener un roadmap corto, práctico y orientado al siguiente trabajo necesario.

Debes:

1. Revisar las Issues abiertas en GitHub.
2. Revisar Issues cerradas recientes cuando sea necesario para entender dependencias.
3. Consultar únicamente el código, specs o documentación necesarios para entender el estado actual.
4. Detectar los siguientes pasos funcionales, de integración o bloqueantes.
5. Crear únicamente las Issues que tenga sentido abordar próximamente.

No implementes ninguna Issue.

---

## GitHub

Usa el GitHub MCP para consultar:

- Issues abiertas.
- Issues cerradas recientes relevantes.
- Dependencias entre Issues.
- Estado general del roadmap existente.

No recorras todo el historial de GitHub salvo que sea necesario para resolver una dependencia concreta.

---

## Repositorio

No audites todo el repositorio.

Consulta únicamente los archivos necesarios para determinar el siguiente trabajo.

Prioriza, cuando sea relevante:

- `PRODUCT.md`
- `README.md`
- `AGENTS.md`
- specs recientes
- código relacionado con las Issues actuales
- configuración necesaria para entender una dependencia

No revises sistemáticamente cada archivo del backend, frontend, Docker o SQL.

---

## Base de datos

No consultes MySQL por defecto.

Usa el MCP de base de datos únicamente cuando una decisión concreta del roadmap dependa del esquema o del estado real de la base de datos.

No hagas una auditoría completa de tablas, datos o relaciones.

---

## Selección de Issues

Prioriza trabajo que:

1. Desbloquee funcionalidad.
2. Complete integraciones pendientes.
3. Resuelva inconsistencias reales entre frontend, backend y base de datos.
4. Complete funcionalidades ya iniciadas.
5. Sea necesario antes de continuar con nuevas funcionalidades.

Evita crear Issues únicamente por:

- refactors opcionales;
- mejoras cosméticas;
- optimizaciones prematuras;
- cambios especulativos;
- trabajo preventivo sin un problema actual;
- tareas que no aporten valor claro al siguiente estado del producto.

---

## Cantidad

Crea como máximo **3–5 Issues por ejecución**.

No intentes planificar todo el proyecto hasta producción en una sola ejecución.

El roadmap debe avanzar por iteraciones.

---

## Creación de Issues

Para cada Issue seleccionada, crea la Issue mediante GitHub MCP.

Cada Issue debe contener como mínimo:

### Objetivo

Qué problema resuelve o qué funcionalidad añade.

### Alcance

Qué debe incluir.

### Criterios de aceptación

Condiciones verificables para considerar la Issue terminada.

### Dependencias

Indica otras Issues de las que dependa, cuando existan.

No generes todavía:

- `spec.md`
- `plan.md`
- `tasks.md`

Eso corresponde a `/issue`.

---

## Prioridad

Clasifica las Issues cuando tenga sentido:

- **P0** — bloqueante o necesario inmediatamente.
- **P1** — siguiente trabajo importante.
- **P2** — mejora posterior.

No crees una Issue únicamente para llenar una prioridad.

---

## Restricciones

Durante `/roadmap`:

- NO modificar código.
- NO crear ramas.
- NO crear commits.
- NO hacer push.
- NO cerrar Issues.
- NO generar SDD.
- NO ejecutar suites completas de tests salvo que sean imprescindibles para decidir el roadmap.
- NO realizar una auditoría completa del proyecto.

Este comando solo analiza, decide y crea Issues.

---

## Salida final

Al terminar muestra un resumen corto:

### Estado actual

Resumen de dónde está el proyecto.

### Issues creadas

Número, título y prioridad.

### Orden recomendado

Orden sugerido de implementación.

### Siguiente paso

Indica cuál debería ejecutarse ahora:

`/issue <numero>`

No continúes automáticamente con `/issue`.

> > > > > > > feat/042-estilo-estadisticas
