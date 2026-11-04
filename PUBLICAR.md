# Cómo publicar una versión nueva de MiVibra PC

1. Escribe en `NOVEDADES.md` lo que cambió (una línea por cambio, empezando con `-`).
2. Sube los cambios y crea la etiqueta con el número de versión:

       git add -A
       git commit -m "Versión 2.3.0"
       git tag v2.3.0
       git push && git push --tags

3. GitHub compila `MiVibra-PC.exe`, calcula su huella SHA-256 y lo publica en **Releases**
   (en la pestaña *Actions* ves el avance; tarda unos 2 minutos).
4. Las apps instaladas lo detectan al abrirse o en menos de 6 horas, lo descargan,
   verifican la huella y se actualizan solas la próxima vez que se abren
   (o al pulsar «Reiniciar y actualizar»).

El número de versión siempre debe ser mayor que el anterior: 2.2.0 → 2.2.1 → 2.3.0 …
El repositorio debe ser **público** para que las apps puedan descargar las versiones.
