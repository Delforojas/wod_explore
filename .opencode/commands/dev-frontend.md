description: Prepara únicamente el frontend local de WOD Explorer

---

# /dev-frontend

Prepara únicamente el frontend local de WOD Explorer para desarrollo y validación manual.

Este comando se utiliza cuando los cambios afectan exclusivamente al frontend y no es necesario reiniciar MySQL ni Spring Boot.

No modifiques ni reinicies:

- `wod-explorer-db`;

- `wod-explorer-backend`;

- volúmenes Docker;

- datos persistentes;

- configuración del backend.

## 1. Comprobar el frontend

Trabaja desde:

`frontend/`

Comprueba si el puerto `5173` está ocupado.

El frontend de WOD Explorer debe utilizar siempre:

`http://localhost:5173`

Vite debe estar configurado con:

- `port: 5173`;

- `strictPort: true`.

## 2. Si el frontend ya está funcionando

Si `http://localhost:5173` ya responde correctamente y pertenece al frontend de WOD Explorer:

- reutiliza el proceso existente;

- no arranques una segunda instancia;

- no mates el proceso;

- continúa con la verificación final.

## 3. Si el frontend no está funcionando

Si el puerto `5173` está libre:

inicia el frontend mediante:

`npm run dev`

El proceso debe ejecutarse en segundo plano para que `/dev-frontend` pueda finalizar.

No ejecutes `npm install` automáticamente salvo que falten dependencias y sea estrictamente necesario.

## 4. Conflictos de puerto

Si el puerto `5173` está ocupado por un proceso que no corresponde al frontend de WOD Explorer:

DETENTE.

No mates procesos automáticamente.

Muestra:

- PID;

- proceso que ocupa el puerto;

- información suficiente para que el usuario decida qué hacer.

No permitas que Vite utilice automáticamente `5174`, `5175` u otro puerto.

## 5. Verificación

Antes de finalizar, comprueba que:

- el frontend está ejecutándose;

- `http://localhost:5173` responde;

- no se ha iniciado una segunda instancia innecesaria;

- backend y MySQL no han sido reiniciados ni modificados.

No ejecutes automáticamente:

- tests;

- lint;

- build;

salvo que el usuario lo solicite o sea necesario para diagnosticar un fallo de arranque.

Este comando tiene como objetivo preparar el frontend para pruebas manuales, no validar completamente una Issue.

## 6. Salida final

Muestra un resumen similar a:

WOD Explorer — frontend local

Frontend Vite: ✅ Running

URL: http://localhost:5173

Backend: sin cambios

MySQL: sin cambios

Entorno frontend listo para pruebas manuales.
