---
description: Reinicia y prepara todo el entorno local de WOD Explorer
---

# /dev-full

Prepara todo el entorno local de WOD Explorer para desarrollo y pruebas manuales.

## Backend y base de datos

Primero ejecuta el mismo procedimiento definido en `/dev-restart`.

Debe quedar disponible:

- MySQL.

- Spring Boot.

- volumen `mysql_data` preservado.

- backend en `http://localhost:8080`.

No elimines volúmenes ni datos persistentes.

Si backend o MySQL no pueden arrancar correctamente, detente e informa del error.

---

## Frontend

Después de verificar backend y MySQL:

1. Comprueba si el puerto `5173` está ocupado.

2. Si `http://localhost:5173` ya corresponde al frontend de WOD Explorer y responde correctamente, reutiliza el proceso existente.

3. Si el puerto `5173` está libre, inicia desde `frontend/`:

   `npm run dev`

4. El proceso frontend debe ejecutarse en segundo plano para que `/dev-full` pueda finalizar.

5. El frontend debe usar:

   `http://localhost:5173`

6. Vite debe tener configurado `strictPort: true`.

7. Si el puerto `5173` está ocupado por otro proceso, no lo mates automáticamente. Informa del conflicto y detente.

8. No ejecutes `npm install` salvo que sea imprescindible.

---

## Verificación

Antes de finalizar comprueba:

- Backend Spring Boot: Running.

- MySQL: Running y healthy.

- Frontend Vite: Running.

- `mysql_data`: preservado.

- Backend responde en `http://localhost:8080`.

- Frontend responde en `http://localhost:5173`.

## Salida final

Muestra un resumen similar a:

WOD Explorer — entorno completo

Backend Spring Boot: ✅ Running

MySQL: ✅ Running (healthy)

Frontend Vite: ✅ Running

Backend: http://localhost:8080

Frontend: http://localhost:5173

mysql_data preservado.

Entorno listo para pruebas manuales.
