# Tareas - Spec 030 Cobertura de comportamiento del frontend

## T1 - Preparar rama y SDD

### Trabajo

- Trabajar en `feat/030-frontend-behavior-coverage`.
- Crear `spec.md`, `plan.md` y `tasks.md`.
- Confirmar que la rama parte de `feat/029-backend-health-endpoint`.

### Hecho cuando

- La rama especifica existe y es la rama actual.
- El SDD contiene alcance, decisiones y tareas ejecutables.
- No se ha modificado código ni configuración de aplicación.

Estado: completada.

## T2 - Configurar el entorno DOM

### Trabajo

- Añadir las dependencias de desarrollo justificadas por la spec.
- Crear `frontend/vitest.config.ts` con React y `jsdom`.
- Incluir la configuración en el chequeo TypeScript del proyecto.
- Crear el helper mínimo de contexto y aislamiento de tests.

### Hecho cuando

- Un test React simple puede renderizarse con `npm test`.
- `package.json` y `package-lock.json` son coherentes.
- No se añaden herramientas E2E ni dependencias no justificadas.

Estado: completada.

## T3 - Cubrir autenticación, sesión y navegación

### Trabajo

- Cubrir login, registro, logout y recuperación de sesión.
- Cubrir `401`, evento de expiración, limpieza de sesión y `#/login`.
- Ampliar pruebas del router hash y del layout autenticado/no autenticado.
- Cubrir errores de red y payload inválido del cliente API.

### Hecho cuando

- Los tests verifican comportamiento visible y headers públicos.
- No dependen de API real ni de almacenamiento persistente externo.

Estado: completada.

## T4 - Cubrir catálogos y detalles

### Trabajo

- Cubrir WODs y ejercicios en carga, error, vacío y respuesta válida.
- Cubrir detalle de WOD y detalle de ejercicio en los mismos estados.
- Verificar enlaces visibles y reintentos cuando formen parte del flujo.

### Hecho cuando

- Los estados requeridos tienen cobertura para ambas familias de catálogo.
- Las aserciones no dependen de clases CSS o estado privado innecesario.

Estado: completada.

## T5 - Cubrir formularios de resultados

### Trabajo

- Probar payload `FOR_TIME`.
- Probar payload `AMRAP`.
- Probar payload `EMOM`.
- Probar mediciones de ejercicio `WEIGHT`, `REPS` y `TIME`.
- Probar opciones de `recordType`, unidad y mensaje de medición no registrable.

### Hecho cuando

- Cada formulario envía el contrato correcto al cliente API mockeado.
- Se cubren éxito, error visible y estado de guardado cuando corresponda.

Estado: completada.

## T6 - Cubrir historial, estadísticas y evolución

### Trabajo

- Probar historial vacío y con resultados.
- Probar estadísticas vacías y con marcas personales.
- Probar evolución vacía y con puntos visibles.
- Probar estados privados, carga y error de estas pantallas.

### Hecho cuando

- Los datos y mensajes relevantes son visibles en los tests.
- Los tests siguen siendo aislados y deterministas.

Estado: completada.

## T7 - Documentar la estrategia

### Trabajo

- Actualizar `frontend/README.md` con las dependencias y estrategia real.
- Documentar que los tests no requieren backend, Docker ni MySQL.
- Mantener los comandos alineados con `package.json`.

### Hecho cuando

- La documentación coincide con la configuración y suite real.
- No se documentan herramientas no instaladas.

Estado: completada.

## T8 - Verificar, revisar y commitear

### Trabajo

Desde `frontend/`, ejecutar:

```bash
npm test
npm run lint
npm run build
```

Después revisar `git diff`, `git status`, el alcance y crear el commit de la
Issue #30 con staging explícito.

### Hecho cuando

- Todas las verificaciones aplicables pasan.
- Todas las tareas anteriores están completadas.
- El commit contiene únicamente archivos de la Issue #30.
- La Issue queda documentada, abierta y sin push.

Estado: completada.

## Orden de ejecución

```text
T1
 ↓
T2
 ↓
T3
 ↓
T4
 ↓
T5
 ↓
T6
 ↓
T7
 ↓
T8
```
