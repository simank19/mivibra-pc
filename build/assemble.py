# Une fuentes, estilos y scripts en ui/index.html (se incrusta en el .exe)
import os
here = os.path.dirname(os.path.abspath(__file__)); root = os.path.dirname(here)
fonts = open(os.path.join(here, 'fonts.css')).read()
css = '\n'.join(open(os.path.join(root, 'src', f)).read() for f in ['base.css', 'inst.css', 'shell.css'])
js = '\n'.join(open(os.path.join(root, 'src', f)).read() for f in ['shell.js', 'diag_mod.js', 'inst_mod.js']) + '\nSHELL.start();\n'
logo = '''<svg viewBox="0 0 48 48" width="30" height="30" aria-hidden="true"><polygon points="24,3 42,13.5 42,34.5 24,45 6,34.5 6,13.5" fill="none" stroke="#FF6900" stroke-width="3" stroke-linejoin="round"/><g stroke="#FF6900" stroke-width="1.8"><line x1="24" y1="24" x2="24" y2="13"/><line x1="24" y1="24" x2="33.5" y2="18.5"/><line x1="24" y1="24" x2="33.5" y2="29.5"/><line x1="24" y1="24" x2="24" y2="35"/><line x1="24" y1="24" x2="14.5" y2="29.5"/><line x1="24" y1="24" x2="14.5" y2="18.5"/></g><g fill="#FF6900"><circle cx="24" cy="24" r="3.4"/><circle cx="24" cy="13" r="2.3"/><circle cx="33.5" cy="18.5" r="2.3"/><circle cx="33.5" cy="29.5" r="2.3"/><circle cx="24" cy="35" r="2.3"/><circle cx="14.5" cy="29.5" r="2.3"/><circle cx="14.5" cy="18.5" r="2.3"/></g></svg>'''
fav = 'data:image/svg+xml,' + logo.replace('#', '%23').replace('"', "'")
import base64
png256 = base64.b64encode(open(os.path.join(here, 'icon256.png'), 'rb').read()).decode()
png32 = base64.b64encode(open(os.path.join(here, 'icon32.png'), 'rb').read()).decode()
html = f'''<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>MiVibra PC</title>
<link rel="icon" type="image/png" sizes="256x256" href="data:image/png;base64,{png256}">
<link rel="icon" type="image/png" sizes="32x32" href="data:image/png;base64,{png32}">
<link rel="apple-touch-icon" href="data:image/png;base64,{png256}">
<style>
{fonts}
</style>
<style>
{css}
</style>
</head>
<body>
<div class="app">
  <aside class="side">
    <div class="brand">{logo}<div class="t"><div class="wm">Mi<i>Vibra</i></div><small>PC</small></div></div>
    <div id="modes"></div>
    <nav id="nav"></nav>
    <div class="foot"><div id="adm" style="display:flex;flex-direction:column;gap:8px"></div><div id="upd"></div><button class="verb t" id="ver" title="Versión y actualizaciones"></button></div>
  </aside>
  <main id="main"></main>
</div>
<script>
{js}
</script>
</body>
</html>
'''
open(os.path.join(root, 'ui', 'index.html'), 'w').write(html)
print('ui/index.html listo')
