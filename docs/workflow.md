# WOD Explorer — Development Workflow

Este documento describe el flujo de desarrollo utilizado en **WOD Explorer**, desde la planificación de una funcionalidad hasta su implementación, validación y cierre.

El proceso combina **GitHub Issues, Spec-Driven Development (SDD), OpenCode, MCP, Skills, AGENTS.md, Docker, Postman y CI/CD** para mantener un desarrollo estructurado, trazable y reproducible.

---

## Componentes del workflow

Cada herramienta tiene una responsabilidad concreta dentro del proceso:

```text
GitHub Issues   → QUÉ trabajo existe

SDD             → QUÉ/CÓMO se va a construir

AGENTS.md       → REGLAS que no se pueden romper

Skills          → CONOCIMIENTO especializado

MCP             → ACCESO a sistemas reales

OpenCode        → AGENTE que coordina todo

Commands        → WORKFLOWS repetibles

Docker          → ENTORNO reproducible

Postman         → VALIDACIÓN manual de la API

GitHub Actions  → CI automático

CD              → DESPLIEGUE automático a producción
```

### Relación entre los componentes

```text
                    GitHub Issues
                          │
                          │ QUÉ hacer
                          ▼
                         SDD
                          │
                  Spec → Plan → Tasks
                          │
                          ▼
                       OpenCode
                          │
          ┌───────────────┼───────────────┐
          │               │               │
          ▼               ▼               ▼
      AGENTS.md          Skills           MCP
          │               │               │
       REGLAS       CONOCIMIENTO       ACCESO
                                         │
                              ┌──────────┴──────────┐
                              ▼                     ▼
                         GitHub MCP            Database MCP

                          │
                          ▼
                    Implementación
                          │
                          ▼
                       Docker
                          │
                          ▼
                       Postman
                          │
                          ▼
                         CI
                          │
                          ▼
                        Merge
                          │
                          ▼
                    GitHub Issue ✅

                          │
                          │ FUTURO
                          ▼
                         CD
                          │
                          ▼
                    Producción 🌐
```

---

## Principio del workflow

El objetivo es mantener trazabilidad completa entre:

```text
Necesidad
   ↓
GitHub Issue
   ↓
Especificación
   ↓
Plan técnico
   ↓
Tasks
   ↓
Implementación
   ↓
Tests
   ↓
CI
   ↓
Merge
   ↓
Issue completada
   ↓
Producción (futuro)
```

De esta forma, cada cambio realizado en WOD Explorer puede relacionarse con una necesidad concreta, una especificación, una implementación y una validación.

## Workflow completo

```text
┌──────────────────────────────────────────────────────────────┐
│                    WOD EXPLORER WORKFLOW                     │
└──────────────────────────────────────────────────────────────┘


                         ┌───────────────┐
                         │   PRODUCTO    │
                         │ WOD Explorer  │
                         └───────┬───────┘
                                 │
                                 ▼


┌──────────────────────────────────────────────────────────────┐
│ 1. REGLAS PERMANENTES DEL PROYECTO                           │
└──────────────────────────────────────────────────────────────┘

                         AGENTS.md
                             │
            ┌────────────────┼────────────────┐
            │                │                │
            ▼                ▼                ▼

      Backend AGENTS    Database AGENTS   Frontend AGENTS
       Spring Boot         MySQL            React
       Java 21             Docker           TypeScript
       Controller          PK/FK            Tailwind
       Service             seguridad        arquitectura
       Repository          convenciones     testing
       DTOs
       Tests

                             │
                             ▼

               Las reglas siempre se respetan


┌──────────────────────────────────────────────────────────────┐
│ 2. CONOCIMIENTO ESPECIALIZADO                                │
└──────────────────────────────────────────────────────────────┘

                           SKILLS
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼

   Spring Boot Skill      MySQL Skill        React Skill
   Java Skill             Docker Skill       TypeScript Skill
   Testing Skill          DB Design Skill    A11y / Design

                             │
                             ▼

               Ayudan a OpenCode a decidir
              CÓMO implementar correctamente


┌──────────────────────────────────────────────────────────────┐
│ 3. ACCESO A SISTEMAS EXTERNOS                               │
└──────────────────────────────────────────────────────────────┘

                             MCP
                              │
              ┌───────────────┴───────────────┐
              │                               │
              ▼                               ▼

         GitHub MCP                     Database MCP
              │                               │
              │                               │
      Issues / PRs / repo              MySQL real
      comentarios                      esquema
      estado                           tablas
      cierres                          relaciones
                                       datos
                                       consultas

              │                               │
              └───────────────┬───────────────┘
                              ▼

                       OpenCode puede
                    VER EL ESTADO REAL


┌──────────────────────────────────────────────────────────────┐
│ 4. PLANIFICACIÓN DEL ROADMAP                                 │
└──────────────────────────────────────────────────────────────┘

                         /roadmap
                             │
                             ▼

                       OpenCode analiza
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼

    GitHub MCP          Código actual        DB MCP
       │                    │                  │
 Issues abiertas       Backend              tablas
 Issues cerradas       Frontend             relaciones
 Issues completas      Tests                estado real
 comentarios           Docker

        └────────────────────┬────────────────────┘
                             ▼

                  Comparar lo completado
                       con lo pendiente
                             │
                             ▼

                     Crear nuevas Issues
                             │
                             ▼

                #20 → #21 → #22 → #23


┌──────────────────────────────────────────────────────────────┐
│ 5. INICIO DE UNA ISSUE                                       │
└──────────────────────────────────────────────────────────────┘

                        /issue 20
                             │
                             ▼

                       GitHub MCP
                             │
                             ▼

                  Leer GitHub Issue #20
                             │
                             ▼

                objetivo + alcance + criterios
                             │
                             ▼

                       crear rama

                    feat/020-xxxxx


┌──────────────────────────────────────────────────────────────┐
│ 6. SDD — SPEC DRIVEN DEVELOPMENT                             │
└──────────────────────────────────────────────────────────────┘

                      GitHub Issue #20
                             │
                             ▼

                   specs/020-feature/
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼

           spec.md        plan.md        tasks.md

          QUÉ hacer      CÓMO hacerlo    PASOS concretos
              │              │              │
              └──────────────┼──────────────┘
                             ▼

                       Skills aplicadas
                             │
       ┌─────────────────────┼─────────────────────┐
       │                     │                     │
       ▼                     ▼                     ▼

 Spring / Java Skill   Database Skill       React Skill

                             │
                             ▼

                    AGENTS.md limita
                 cómo debe implementarse


┌──────────────────────────────────────────────────────────────┐
│ 7. IMPLEMENTACIÓN                                            │
└──────────────────────────────────────────────────────────────┘

                          tasks.md
                             │
                             ▼

                        Task T1
                             │
                             ▼
                        código
                             │
                             ▼
                         tests
                             │
                             ▼
                        commit
                             │
                             ▼

                        Task T2
                             │
                             ▼
                           ...

                             │
                             ▼

                    Todas las Tasks ✅


┌──────────────────────────────────────────────────────────────┐
│ 8. BASE DE DATOS DURANTE LA IMPLEMENTACIÓN                   │
└──────────────────────────────────────────────────────────────┘

                   OpenCode + Database MCP
                             │
                             ▼

                comprobar esquema real MySQL
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼

           tablas          PK/FK          datos
              │              │              │
              └──────────────┼──────────────┘
                             ▼

                  comparar con entidades JPA
                             │
                             ▼

              implementar respetando AGENTS.md


┌──────────────────────────────────────────────────────────────┐
│ 9. REINICIO DEL ENTORNO LOCAL                               │
└──────────────────────────────────────────────────────────────┘

                      /dev-restart
                             │
                             ▼

                  leer docker-compose.yml
                             │
                             ▼

                detectar qué ha cambiado
                             │
              ┌──────────────┴──────────────┐
              │                             │
              ▼                             ▼

      solo backend                   configuración global
              │                             │
              ▼                             ▼

 docker compose up               docker compose up
 -d --build backend              -d --build

              │                             │
              └──────────────┬──────────────┘
                             ▼

                   docker compose ps
                             │
                             ▼

                   Backend ✅ MySQL ✅


┌──────────────────────────────────────────────────────────────┐
│ 10. PRUEBAS MANUALES                                        │
└──────────────────────────────────────────────────────────────┘

                          Postman
                             │
                             ▼

                       API REST
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼

    casos felices      autenticación       casos límite
    GET/POST/etc       JWT / 401            404 / 400
        │                    │                    │
        └────────────────────┼────────────────────┘
                             ▼

                      pruebas correctas


┌──────────────────────────────────────────────────────────────┐
│ 11. VALIDACIÓN LOCAL                                         │
└──────────────────────────────────────────────────────────────┘

                           /ci
                            │
                            ▼

                  validación automática local
                            │
             ┌──────────────┼──────────────┐
             │              │              │
             ▼              ▼              ▼

          Backend         Frontend       Docker/DB

      Maven compile        lint          config
      Maven tests          tests         checks
      package              build
             │              │              │
             └──────────────┼──────────────┘
                            ▼

                        CI LOCAL
                           ✅


┌──────────────────────────────────────────────────────────────┐
│ 12. FINALIZAR ISSUE                                          │
└──────────────────────────────────────────────────────────────┘

                    /finish-issue 20
                             │
                             ▼

                   volver a leer Issue
                             │
                             ▼

                     volver a leer SDD
                             │
           ┌─────────────────┼─────────────────┐
           │                 │                 │
           ▼                 ▼                 ▼

        spec.md           plan.md          tasks.md
           │                                   │
           ▼                                   ▼

 criterios aceptación                     todos ✅

                             │
                             ▼

                          /ci
                             │
                             ▼

                     revisión git diff
                             │
                             ▼

                          commit
                             │
                             ▼

                           push
                             │
                             ▼

                      Pull Request


┌──────────────────────────────────────────────────────────────┐
│ 13. CI REAL — GITHUB ACTIONS                                 │
└──────────────────────────────────────────────────────────────┘

                         git push
                             │
                             ▼

                      GitHub Actions
                             │
             ┌───────────────┼───────────────┐
             │               │               │
             ▼               ▼               ▼

         Backend           Frontend        Integración

       Java 21 setup       Node setup      servicios
       Maven compile       npm ci          MySQL test
       tests               lint            etc.
       package             tests
                           build

             │               │               │
             └───────────────┼───────────────┘
                             ▼

                          CI ✅
                             │
                             ▼

                       Merge permitido


┌──────────────────────────────────────────────────────────────┐
│ 14. CIERRE DE LA ISSUE                                       │
└──────────────────────────────────────────────────────────────┘

                         CI ✅
                           │
                           ▼

                    GitHub MCP
                           │
                           ▼

              documentar resultado final
                           │
                           ▼

                endpoints / cambios
                tests ejecutados
                criterios cumplidos
                           │
                           ▼

                     cerrar Issue
                           │
                           ▼

                    Issue #20 ✅


┌──────────────────────────────────────────────────────────────┐
│ 15. SIGUIENTE ISSUE                                          │
└──────────────────────────────────────────────────────────────┘

                     /issue 21
                         │
                         ▼
                        ...
                         │
                         ▼
                     /issue 22


┌──────────────────────────────────────────────────────────────┐
│ 16. CUANDO SE ACABA UN BLOQUE DE TRABAJO                     │
└──────────────────────────────────────────────────────────────┘

                       /roadmap
                           │
                           ▼

                  GitHub MCP + DB MCP
                           │
                           ▼

                 analizar lo completado
                           │
                           ▼

                  detectar lo que falta
                           │
                           ▼

                 crear nuevas Issues


┌──────────────────────────────────────────────────────────────┐
│ 17. FUTURO — PRODUCCIÓN                                      │
└──────────────────────────────────────────────────────────────┘

                         main
                           │
                           ▼

                      CI automático
                           │
                           ▼

                         CI ✅
                           │
                           ▼

                           CD
                           │
             ┌─────────────┼─────────────┐
             │             │             │
             ▼             ▼             ▼

         Frontend        Backend       Database

           React         Docker        migrations
           deploy        deploy        Flyway
             │             │             │
             └─────────────┼─────────────┘
                           ▼

                      PRODUCCIÓN 🌐

```

## Flujo resumido

```text
/roadmap
   ↓
GitHub MCP + Database MCP
   ↓
crear Issues
   ↓
/issue XX
   ↓
crear rama
   ↓
SDD
   ↓
spec.md
   ↓
plan.md
   ↓
tasks.md
   ↓
Skills + AGENTS.md
   ↓
implementación
   ↓
Database MCP
   ↓
/dev-restart
   ↓
Postman
   ↓
/ci
   ↓
/finish-issue XX
   ↓
commit
   ↓
push
   ↓
Pull Request
   ↓
GitHub Actions CI
   ↓
CI ✅
   ↓
merge
   ↓
GitHub MCP
   ↓
documentar + cerrar Issue
   ↓
siguiente Issue
```

## Producción

El despliegue continuo se incorporará cuando WOD Explorer disponga de un entorno de producción.

```text
merge main
   ↓
CI
   ↓
tests + build
   ↓
CI ✅
   ↓
CD
   ↓
Frontend deploy
Backend deploy
Database migrations
   ↓
Producción
```



