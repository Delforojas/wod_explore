# Tareas - Spec 029 Endpoint de salud del backend

## T1 - Preparar la rama y el SDD

### Trabajo

- Trabajar en `feat/029-backend-health-endpoint`.
- Crear `spec.md`, `plan.md` y `tasks.md`.
- Confirmar el contrato y la politica publica del endpoint.

### Hecho cuando

- La rama existe y esta basada en el ultimo estado de desarrollo backend.
- El SDD describe alcance, decisiones, riesgos y verificaciones.
- No se ha modificado codigo de aplicacion.

Estado: completada.

## T2 - Implementar el controller

### Trabajo

- Crear `HealthController` bajo `com.wodexplorer.controller`.
- Exponer `GET /api/health`.
- Devolver HTTP `200` y JSON con `status=UP`.

### Restricciones

- No crear service, repository ni DTO innecesarios.
- No leer MySQL ni otras dependencias.
- No devolver configuracion, secretos o detalles internos.

### Hecho cuando

- El endpoint esta implementado con el contrato definido.
- El controller no tiene dependencias de negocio o persistencia.

Estado: completada.

## T3 - Integrar la politica de seguridad

### Trabajo

- Permitir explicitamente `GET /api/health` sin autenticacion.
- Mantener protegidas las demas rutas `/api/**`.

### Hecho cuando

- La excepcion publica aparece antes de la regla general autenticada.
- No cambia el acceso de registro, login ni endpoints existentes.

Estado: completada.

## T4 - Añadir tests HTTP

### Trabajo

- Incluir `HealthController` en el slice web de `SecurityHttpTest`.
- Probar la llamada sin JWT.
- Verificar HTTP `200`, JSON y `status=UP`.
- Mantener cobertura de las rutas protegidas existentes.

### Hecho cuando

- Los tests cubren contrato y politica de acceso.
- No requieren MySQL real para validar el endpoint.

Estado: completada.

## T5 - Actualizar documentación

### Trabajo

- Añadir `GET /api/health` a la tabla de API del README.
- Documentar ejemplos para ejecución local y Docker Compose.
- Documentar el uso como comprobación de CI.
- Explicar que no comprueba MySQL.

### Hecho cuando

- Los comandos documentados coinciden con la configuración actual.
- No se incluyen credenciales ni afirmaciones sobre funcionalidades ausentes.

Estado: completada.

## T6 - Ejecutar verificaciones

### Trabajo

Desde `backend/`, ejecutar:

```bash
./mvnw validate
./mvnw test
./mvnw package
```

Revisar tambien el diff, el estado de Git y la ausencia de secretos.

### Hecho cuando

- Las tres verificaciones pasan.
- No hay cambios fuera del alcance de la Issue #29.
- El backend sigue siendo compatible con Java 21.

Estado: completada.

## T7 - Cerrar la implementacion sin publicar

### Trabajo

- Crear un commit con los cambios de la Issue #29.
- Revisar el commit y el estado final de la rama.
- No cerrar la Issue ni hacer push.

### Hecho cuando

- El commit contiene solo cambios trazables a la Issue #29.
- El reporte final enumera archivos y verificaciones ejecutadas.

Estado: completada.

## Orden de ejecucion

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
```
