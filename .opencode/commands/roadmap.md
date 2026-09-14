---
description: Analiza el estado actual de WOD Explorer y genera las siguientes GitHub Issues necesarias
---

# /roadmap

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
