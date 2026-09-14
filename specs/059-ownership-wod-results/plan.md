# Plan - Issue #59: Asegurar ownership de resultados en WODs personalizados

## Estrategia

Aplicar el cambio minimo sobre `WodResultService`: reutilizar la resolucion de
usuario existente y validar el propietario del WOD antes de crear o consultar
resultados. No se modificaran rutas, DTOs ni el esquema.

## Decisiones

- La autorizacion se concentra en el service, no en el controller ni en el
  frontend.
- Se reutiliza `WodNotFoundException` para WODs inexistentes y personalizados
  ajenos.
- La comparacion se hace por IDs de `User`, no por email ni por instancia JPA.
- Los WODs globales se identifican por `wod.getOwner() == null` y siguen
  disponibles para cualquier usuario autenticado.
- Las validaciones metricas se ejecutan despues de la comprobacion de ownership.
- No se anaden queries derivadas nuevas: `findById` ya carga el WOD necesario y
  la relacion `owner` forma parte del modelo existente.

## Cambios previstos

1. Cambiar la resolucion privada del WOD para recibir el usuario autenticado.
2. Aplicar esa resolucion en `create` y `findOwnResults`.
3. Anadir tests unitarios para WOD global, WOD propio, WOD ajeno y WOD ausente.
4. Anadir tests HTTP para `404` en create y consulta cuando el service rechaza el
   recurso, manteniendo el contrato actual.
5. Anadir una prueba de integracion MySQL que confirme que un usuario ajeno no
   puede insertar ni consultar resultados de un WOD personalizado y que el WOD
   permanece sin cambios.
6. Ejecutar las verificaciones backend completas y revisar el diff.

## Riesgos y mitigaciones

- **Lazy loading de owner:** la operacion del service es transaccional; la
  comprobacion se ejecuta dentro de la transaccion activa.
- **Regresion de WOD global:** conservar tests existentes de creacion y consulta
  con WOD sin propietario.
- **Filtracion de ownership:** reutilizar la excepcion y respuesta de WOD no
  encontrado, sin crear un error especifico para acceso denegado.
- **Escritura antes de autorizar:** verificar ownership antes de validaciones que
  puedan guardar y antes de cualquier acceso al repository de resultados.

## Verificacion

Desde `backend/`:

```text
./mvnw validate
./mvnw test
./mvnw package
```

La prueba de integracion usara MySQL 8.4 mediante el soporte Testcontainers
existente y no modificara la base de desarrollo.
