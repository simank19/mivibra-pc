# Cómo publicar una versión nueva de MiVibra PC

1. Cambia el número en el archivo `VERSION` (por ejemplo de `2.2.0` a `2.3.0`).
   Siempre debe ser mayor que el anterior: 2.2.0 → 2.2.1 → 2.3.0 …
2. Escribe en `NOVEDADES.md` lo que cambió (una línea por cambio, empezando con `-`).
3. Sube los cambios a `main` (con `git push` o editando los archivos en github.com).

GitHub compila `MiVibra-PC.exe`, calcula su huella SHA-256 y lo publica en **Releases**
con la etiqueta `v2.3.0` (en la pestaña *Actions* ves el avance; tarda unos 2 minutos).
Las apps instaladas lo detectan al abrirse o en menos de 6 horas, lo descargan, verifican la
huella y se actualizan solas la próxima vez que se abren (o al pulsar «Reiniciar y actualizar»).

El repositorio debe seguir siendo **público** para que las apps puedan descargar las versiones.
