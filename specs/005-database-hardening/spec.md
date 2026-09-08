# Spec 005 — Database Hardening

## Objetivo

Revisar y mejorar el esquema MySQL de WOD Explorer para que sea consistente,

normalizado y preparado para el futuro backend.

## Alcance

- users

- wods

- exercises

- wod_exercises

- wod_results

- exercise_results

## Requisitos

- Todas las tablas deben tener PK explícita.

- Todas las relaciones deben usar FK.

- Las relaciones N:M deben usar tablas puente.

- No debe existir duplicación evitable de datos.

- Los tipos de datos deben representar correctamente el dominio.

- Las reglas ON DELETE deben estar justificadas.

- Los campos opcionales deben permitir NULL únicamente cuando tenga sentido.

- Los datos existentes deben conservarse durante las migraciones.

- No se deben almacenar credenciales en SQL ni en archivos versionados.

- El esquema debe funcionar en MySQL 8.4.

- La base debe poder ejecutarse mediante Docker Compose.

## Fuera de alcance

- Backend.

- API REST.

- Autenticación.

- Frontend.