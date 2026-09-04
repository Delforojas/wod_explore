# Spec 003 — Historial de entrenamientos

## Contexto y objetivo

WOD Explorer permite actualmente consultar WODs, buscarlos, filtrarlos y

guardarlos como favoritos.

La siguiente evolución permitirá registrar cuándo se ha realizado un WOD y

consultar un historial personal de entrenamientos.

La información continuará almacenándose únicamente en el navegador mediante

`localStorage`.

No se añadirá backend, base de datos, autenticación ni APIs externas.

---

## Usuarios

Personas que practican CrossFit y quieren llevar un registro sencillo de los

WODs que han realizado.

La aplicación continuará siendo pública y sin cuentas de usuario.

---

## Historias de usuario

- H1: Como usuario quiero marcar un WOD como realizado para registrar mi

  entrenamiento.

- H2: Como usuario quiero indicar la fecha en la que realicé un WOD para

  mantener un historial cronológico.

- H3: Como usuario quiero añadir un resultado y notas opcionales para recordar

  cómo fue el entrenamiento.

- H4: Como usuario quiero consultar mi historial de entrenamientos para ver

  qué WODs he realizado.

- H5: Como usuario quiero eliminar un registro del historial si lo añadí por

  error.

- H6: Como usuario quiero que mi historial permanezca disponible después de

  cerrar o recargar el navegador.

---

## Requisitos funcionales

### Registrar entrenamiento (H1)

- RF-1: CUANDO el usuario consulte un WOD existente, EL SISTEMA ofrecerá una

  acción para registrarlo como realizado.

- RF-2: CUANDO el usuario registre un WOD realizado, EL SISTEMA creará una

  entrada independiente en el historial.

- RF-3: UN mismo WOD podrá registrarse varias veces en fechas diferentes.

- RF-4: CADA registro tendrá un identificador único independiente del ID del WOD.

---

### Fecha del entrenamiento (H2)

- RF-5: CADA registro deberá incluir una fecha de realización.

- RF-6: POR DEFECTO, la fecha propuesta será la fecha local actual.

- RF-7: EL USUARIO podrá seleccionar una fecha anterior.

- RF-8: SI la fecha no es válida, EL SISTEMA no guardará el registro y mostrará

  un mensaje de error.

- RF-9: NO se permitirán fechas posteriores al día actual.

---

### Resultado y notas (H3)

- RF-10: EL USUARIO podrá introducir opcionalmente un resultado del

  entrenamiento.

- RF-11: EL resultado se almacenará como texto para permitir distintos formatos,

  por ejemplo:

  - `12:34`

  - `7 rondas + 12 reps`

  - `100 kg`

  - `Completed`

- RF-12: EL USUARIO podrá añadir notas opcionales al registro.

- RF-13: LAS notas vacías o compuestas únicamente por espacios se almacenarán

  como ausencia de notas.

---

### Historial (H4)

- RF-14: EL SISTEMA proporcionará una sección de historial de entrenamientos.

- RF-15: CADA entrada del historial mostrará como mínimo:

  - nombre del WOD;

  - fecha;

  - tipo de WOD;

  - resultado si existe;

  - notas si existen.

- RF-16: EL historial se mostrará ordenado por fecha, desde el entrenamiento

  más reciente al más antiguo.

- RF-17: SI no existen entrenamientos registrados, EL SISTEMA mostrará un

  estado vacío específico.

- RF-18: DESDE una entrada del historial, EL USUARIO podrá acceder al detalle

  del WOD correspondiente mientras ese WOD siga existiendo.

---

### Eliminar registro (H5)

- RF-19: EL USUARIO podrá eliminar una entrada concreta del historial.

- RF-20: ELIMINAR una entrada no eliminará el WOD original de los datos locales.

- RF-21: ELIMINAR una entrada no afectará a otros registros del mismo WOD.

- RF-22: DESPUÉS de eliminar un registro, EL historial se actualizará

  inmediatamente.

---

### Persistencia local (H6)

- RF-23: EL historial se almacenará en `localStorage`.

- RF-24: SE utilizará una única clave estable para almacenar el historial.

- RF-25: CUANDO la aplicación se cargue, EL SISTEMA recuperará los registros

  almacenados previamente.

- RF-26: LOS datos recuperados de `localStorage` deberán validarse antes de

  utilizarse.

- RF-27: SI los datos almacenados están corruptos o tienen una estructura

  inválida, EL SISTEMA deberá recuperarse sin romper la aplicación.

- RF-28: LOS registros que hagan referencia a un WOD que ya no existe deberán

  gestionarse sin provocar errores en la aplicación.

---

## Requisitos no funcionales

- RNF-1: La aplicación continuará siendo completamente frontend.

- RNF-2: No se añadirá backend, base de datos, autenticación ni API externa.

- RNF-3: TypeScript continuará funcionando en modo estricto.

- RNF-4: No se utilizará `any` salvo justificación explícita.

- RNF-5: Los datos recuperados de `localStorage` deberán validarse con Zod.

- RNF-6: La lógica de historial deberá permanecer separada de los componentes

  visuales cuando sea razonable.

- RNF-7: Los formularios deberán utilizar etiquetas accesibles y controles

  utilizables mediante teclado.

- RNF-8: Los mensajes de error deberán ser comprensibles para el usuario.

- RNF-9: La interfaz continuará siendo responsive y mobile-first.

- RNF-10: Las funcionalidades existentes de búsqueda, filtros y favoritos no

  deberán romperse.

- RNF-11: `npm test`, `npm run lint` y `npm run build` deberán finalizar sin

  errores.

---

## Modelo conceptual de registro

Cada entrada del historial representará una realización concreta de un WOD.

Ejemplo conceptual:

```json

{

  "id": "workout-123",

  "wodId": "fran",

  "date": "2026-09-04",

  "result": "05:42",

  "notes": "Thrusters sin cortar."

}

```

El historial almacenará referencias mediante `wodId`.

No se duplicará dentro del historial toda la información del WOD.

---

## Casos límite

- Historial vacío.

- Registrar el mismo WOD varias veces.

- Registrar el mismo WOD dos veces el mismo día.

- Fecha de hoy.

- Fecha anterior.

- Fecha futura.

- Fecha inválida.

- Resultado vacío.

- Resultado compuesto únicamente por espacios.

- Notas vacías.

- `localStorage` inexistente.

- JSON corrupto.

- Estructura inválida.

- IDs de registros duplicados.

- Registro que referencia a un WOD que ya no existe.

- Eliminar uno de varios registros correspondientes al mismo WOD.

---

## Fuera de alcance

La Spec 003 NO incluye:

- backend;

- base de datos;

- cuentas de usuario;

- sincronización entre dispositivos;

- edición de registros existentes;

- fotografías;

- vídeos;

- rankings;

- comparación entre usuarios;

- marcas personales automáticas;

- cálculo de 1RM;

- estadísticas avanzadas;

- calendario de entrenamiento;

- programación de WODs futuros;

- recomendaciones;

- inteligencia artificial.

---

## Criterios de finalización

La Spec 003 se considerará completada cuando:

1. Un WOD pueda registrarse como realizado.

2. Se pueda seleccionar una fecha válida.

3. No puedan registrarse fechas futuras.

4. Se pueda añadir resultado opcional.

5. Se puedan añadir notas opcionales.

6. Un mismo WOD pueda registrarse múltiples veces.

7. Exista una sección de historial.

8. El historial esté ordenado del más reciente al más antiguo.

9. Se pueda eliminar un registro individual.

10. El historial persista tras recargar la aplicación.

11. Los datos de `localStorage` sean validados antes de utilizarse.

12. Datos corruptos no rompan la aplicación.

13. Los registros asociados a WODs inexistentes se gestionen correctamente.

14. Las funcionalidades de las Specs 001 y 002 sigan funcionando.

15. Existan tests para registro, validación, historial, eliminación y persistencia.

16. `npm test` pase.

17. `npm run lint` pase.

18. `npm run build` pase.

19. TypeScript no presente errores.

20. La funcionalidad sea usable mediante teclado y en móvil y escritorio.