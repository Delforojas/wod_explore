# SDD - Issue #60: Registrar resultados desde WODs personalizados

## Estado

Spec de implementacion frontend para completar el flujo de resultados en el
detalle autenticado de un WOD personalizado. La rama de trabajo es
`feat/060-custom-wod-results`, derivada de `main` despues de integrar la Issue
#59.

## Objetivo

Permitir que el propietario autenticado de un WOD personalizado registre y
consulte sus propios intentos desde `MyWodDetailPage`, reutilizando el contrato
de resultados existente y sin crear una segunda fuente de verdad.

## Contexto y referencias

El detalle global `WodDetailPage` ya utiliza el cliente de resultados, mientras
que `MyWodDetailPage` solo carga la configuracion del WOD. El backend expone el
mismo contrato para ambos tipos de WOD y la Issue #59 verifica el ownership en
el service.

Referencias funcionales:

- Issue #17 y `specs/017-wod-results/spec.md`: contrato, payload y reglas por
  tipo de WOD.
- Issue #47 y `specs/047-mis-wods/spec.md`: rutas y privacidad de WODs propios.
- Issue #59: autorizacion de resultados para WODs personalizados.
- `DESIGN.md`: sistema visual, responsive y accesibilidad.

## Alcance

### Incluido

- Panel de resultados en el detalle de un WOD personalizado autenticado.
- Consulta de resultados propios mediante `getWodResults`.
- Formulario con campos condicionados por `FOR_TIME`, `AMRAP` y `EMOM`.
- Seleccion de nivel y fecha/hora opcional.
- Envio mediante `createWodResult` usando el usuario de la sesion a traves del
  cliente existente.
- Actualizacion inmediata de la lista despues de un registro correcto.
- Estados de carga, lista vacia, guardado, exito, validacion, red, `401` y
  `404`, usando `ApiError` y `StateMessage` existentes.
- Composicion compartida con `WodDetailPage` para mantener un solo formulario y
  una sola representacion de resultados.
- Tests de comportamiento para tipos de WOD, payload, carga, vacio, exito,
  errores, aislamiento anonimo y prevencion de envios duplicados.

### Fuera de alcance

- Nuevos endpoints, DTOs, schemas backend, migraciones o cambios MySQL.
- Editar o eliminar resultados.
- Resultados de ejercicios, rankings, estadisticas o snapshots historicos.
- Cambios en autenticacion, ownership o politica de eliminacion de WODs.
- Cambios de navegacion fuera del detalle personal existente.

## Contrato reutilizado

Las rutas no cambian:

```text
POST /api/wods/{wodId}/results
GET  /api/wods/{wodId}/results
```

El body sigue `WodResultRequest`:

```json
{
  "timeSeconds": 342,
  "rounds": null,
  "reps": null,
  "level": "RX",
  "completedAt": "2026-09-14T18:30:00"
}
```

El campo metrico visible depende del tipo:

- `FOR_TIME`: `timeSeconds` obligatorio.
- `AMRAP`: `rounds` y `reps` obligatorios.
- `EMOM`: `reps` obligatorio.

El cliente conserva la validacion de respuesta con `wodResultSchema` y envia el
JWT existente en `sessionStorage` mediante `useAuth`.

## Comportamiento y estados

- Sin token: se mantiene la superficie privada actual y no se ejecuta ninguna
  peticion de WOD ni de resultados.
- Carga del detalle: se muestra el loading existente del WOD.
- Carga de resultados: el panel comunica que esta consultando los intentos.
- Vacio: se explica que aun no hay intentos y se mantiene disponible el
  formulario.
- Guardado: el boton queda deshabilitado y muestra `Guardando...`; no se aceptan
  envios duplicados.
- Exito: se limpian los campos y aparece un mensaje accesible; el nuevo intento
  se incorpora a la lista sin recargar la pagina completa.
- Error de validacion, red, `401` o `404`: se muestra un mensaje en espanol sin
  romper el detalle; el formulario vuelve a estar utilizable.
- La lista inicial respeta el orden recibido por backend y no mezcla resultados
  de otras cuentas.

## Accesibilidad y responsive

- Labels asociados a todos los campos y controles nativos.
- `aria-labelledby`, `aria-busy`, `aria-live` y `role` mediante los patrones
  existentes.
- Foco visible global y controles de al menos 44px.
- Paneles apilados desde 320px, sin tablas rigidas ni overflow horizontal.
- El formulario conserva navegacion completa por teclado y respeta
  `prefers-reduced-motion` a traves de los estilos existentes.

## Criterios de aceptacion

- [ ] El propietario autenticado puede registrar un resultado desde el detalle
  de su WOD personalizado.
- [ ] Los campos visibles corresponden al tipo del WOD y el payload respeta
  `WodResultRequest`.
- [ ] Los resultados propios se consultan y muestran en el orden del backend.
- [ ] Un registro correcto actualiza la vista sin recarga completa.
- [ ] Los errores se muestran en espanol y el formulario sigue utilizable.
- [ ] No se permiten envios duplicados durante el guardado.
- [ ] Un usuario anonimo mantiene el estado privado y no genera peticiones
  protegidas.
- [ ] Existen tests para tipos, exito, vacio, errores y estados de carga.
- [ ] `npm test`, `npm run lint` y `npm run build` pasan.

## Restricciones

- Mantener TypeScript estricto y evitar `any`.
- No anadir dependencias.
- Mantener codigo y nombres tecnicos en ingles, con textos visibles en espanol.
- No modificar el backend porque el contrato de #17/#59 ya es suficiente.
