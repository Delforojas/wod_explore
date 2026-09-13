---
description: Reinicia el entorno local de WOD Explorer con Docker
---

# /dev-restart

## Objetivo

Reiniciar el entorno local de **WOD Explorer** de forma segura, reconstruyendo únicamente los servicios necesarios y preservando los datos persistentes.

## Instrucciones

1. Lee `docker-compose.yml`.

2. Comprueba qué servicios existen y su estado actual.

3. Determina qué partes del proyecto han cambiado.

4. Si solo ha cambiado el backend, ejecuta:

```bash

docker compose up -d --build backend

```

5. Si ha cambiado Docker, `docker-compose.yml` o alguna configuración compartida, ejecuta:

```bash

docker compose up -d --build

```

6. Verifica el estado de todos los servicios:

```bash

docker compose ps

```

7. Si algún servicio no está `Up` o `healthy`, comprueba sus logs recientes para identificar el problema.

8. No borres volúmenes ni datos persistentes.

9. No ejecutes:

```bash

docker compose down -v

```

10. Al finalizar, informa del estado de:

- Backend Spring Boot

- MySQL

11. Si algún servicio no ha arrancado correctamente:

- indica qué servicio ha fallado;

- muestra la causa detectada;

- no indiques que el entorno está listo hasta que el problema esté resuelto.

## Resultado esperado

```text

WOD Explorer — entorno local

Backend Spring Boot: ✅ Running

MySQL:               ✅ Running

Entorno listo para pruebas manuales.

```
