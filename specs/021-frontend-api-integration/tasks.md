# Tasks - Issue #21: Integración frontend con API

## Contrato y cliente API

- [x] Añadir Zod y schemas para auth, usuario, WOD, ejercicio, resultados,
  historial, estadísticas y evolución.
- [x] Crear tipos derivados de los schemas sin duplicar contratos manuales.
- [x] Crear un cliente HTTP configurable con headers JWT y `ApiError`.
- [x] Implementar funciones API para todos los endpoints existentes sin
  hardcodear URLs de recurso en los componentes.

## Sesión y navegación

- [x] Implementar sesión JWT en `sessionStorage` con logout y recuperación al
  cargar la aplicación.
- [x] Implementar registro, login, validación de formularios y errores visibles.
- [x] Implementar router hash y navegación pública/protegida accesible.

## Catálogos

- [x] Sustituir la pantalla Vite por el catálogo real de ejercicios y su detalle.
- [x] Implementar catálogo de WODs con nombre, tipo y nivel como filtros.
- [x] Implementar detalle de WOD con sus ejercicios asociados.
- [x] Cubrir carga, error, vacío y reintento en ambos catálogos.

## Resultados y perfil

- [x] Implementar formulario de resultado WOD según `FOR_TIME`, `AMRAP` y
  `EMOM`.
- [x] Implementar formulario de marca de ejercicio según unidad y `recordType`.
- [x] Mostrar resultados propios y mejor marca desde los endpoints protegidos.
- [x] Implementar perfil e historial del usuario autenticado.

## Estadísticas y calidad de interfaz

- [x] Implementar estadísticas, marcas personales y evolución desde la API #20.
- [x] Mostrar estados de sesión expirada, error de red, respuesta vacía y carga.
- [x] Eliminar cualquier fuente activa de datos de negocio en JSON o
  `localStorage`.
- [x] Mantener HTML semántico, labels, foco visible, navegación de teclado y
  responsive móvil/tablet/escritorio.

## Testing y cierre

- [x] Añadir tests Vitest para schemas, cliente API, sesión y estados relevantes.
- [x] Ejecutar `npm test` sin fallos.
- [x] Ejecutar `npm run lint` sin errores.
- [x] Ejecutar `npm run build` sin errores de TypeScript.
- [x] Revisar diff y confirmar que no hay cambios backend ni archivos ajenos.
- [x] Marcar todas las tareas completadas y documentar Issue #21 con el commit.
