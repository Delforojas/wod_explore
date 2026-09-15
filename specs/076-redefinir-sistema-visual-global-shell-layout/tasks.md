# Tasks 076 - Redefinir el sistema visual global y el shell/layout

## SDD y preflight

- [x] Limpiar unicamente los artefactos de la ejecucion anterior de #76.
- [x] Confirmar que los cambios de gobernanza y workflow ajenos permanecen
      intactos.
- [x] Releer Constitucion, Issue #76, PRODUCT.md, AGENTS.md,
      frontend/AGENTS.md y DESIGN.md.
- [x] Revisar las skills de Operate, UI, React, composicion y responsive.
- [x] Revisar y aprobar esta nueva direccion antes de implementar codigo.

## Sistema visual global

- [x] Reconciliar tokens CSS con `DESIGN.md` sin crear una fuente paralela.
- [x] Sustituir la serif estructural por la sans-serif definida.
- [x] Definir la jerarquia visual de metricas existentes y cifras tabulares.
- [x] Normalizar botones, inputs, badges, filas y estados interactivos.
- [x] Eliminar o reducir decoracion global sin funcion.
- [x] No fue necesario actualizar `DESIGN.md`: las decisiones durables ya
      estaban definidas por la fuente visual vigente.

## Shell y responsive

- [x] Redefinir topbar, marca, rail lateral y area principal.
- [x] Redefinir bottom nav manteniendo los siete destinos, enlaces y
      `aria-current`.
- [x] Mantener skip link, landmarks, foco visible y targets de 44 px.
- [x] Resolver safe areas, wrapping y reserva de espacio desde 320 px.
- [ ] Actualizar tests solo si cambia semantica o comportamiento observable.

## Verificacion posterior a la aprobacion

- [x] Ejecutar `npm test`.
- [x] Ejecutar `npm run lint`.
- [x] Ejecutar `npm run build`.
- [x] Ejecutar `git diff --check` y revisar el diff propio.

- [x] Realizar revision manual responsive, teclado, foco y contraste, o
      documentar honestamente la imposibilidad de hacerla.
- [x] Confirmar que no se tocaron API, router, datos, persistencia, backend,
      dependencias ni cambios locales ajenos.

> Nota de verificacion: se realizo una revision estatica del CSS y de los
> landmarks/componentes JSX. Este entorno no proporciona navegador ni viewport
> interactivo, por lo que no se pudo ejecutar una inspeccion visual manual.
