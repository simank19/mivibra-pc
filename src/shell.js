'use strict';
/* ===================== MiVibra PC 2 · shell ===================== */
/* Une los dos módulos: Diagnóstico (DIAG) e Instalador (INST). Cada uno pinta #nav y #main cuando está activo. */
const SHELL = (() => {
  const TOKEN = (location.hash.match(/t=([a-f0-9]+)/) || [])[1] || sessionStorage.getItem('mvtok') || '';
  let mode = 'diag';
  try { mode = localStorage.getItem('mv.mode') || 'diag'; } catch (e) {}
  if (!['diag', 'inst'].includes(mode)) mode = 'diag';
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const svg = (p, s) => '<svg width="' + (s || 18) + '" height="' + (s || 18) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>';
  const ICS = {
    diag: '<path d="M3 12h4l3-8 4 16 3-8h4"/>',
    inst: '<path d="M21 8l-9-5-9 5 9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/>',
    arrow: '<path d="M5 12h14"/><path d="M13 6l6 6-6 6"/>', check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>'
  };
  const MODES = [['diag', 'Diagnóstico', 'Revisa el equipo'], ['inst', 'Instalador', 'Programas y drivers']];
  function tabs() {
    const el = document.querySelector('#modes'); if (!el) return;
    el.innerHTML = MODES.map(m => '<button class="mode' + (mode === m[0] ? ' on' : '') + '" data-mode="' + m[0] + '" title="' + m[1] + ' · ' + m[2] + '"><span class="mi">' + svg(ICS[m[0]], 18) + '</span><span class="mt"><b>' + m[1] + '</b><small>' + m[2] + '</small></span></button>').join('');
    el.querySelectorAll('[data-mode]').forEach(b => b.onclick = () => sw(b.dataset.mode));
  }
  function sw(m, after) {
    if (m === mode) { if (after) after(); return; }
    (mode === 'diag' ? DIAG : INST).unmount();
    mode = m; try { localStorage.setItem('mv.mode', m); } catch (e) {}
    document.body.dataset.mode = m;
    tabs();
    const M = m === 'diag' ? DIAG : INST;
    M.mount(); if (after) after();
    document.querySelector('#main').scrollTop = 0;
  }

  /* ---------- recomendaciones: problemas del diagnóstico → programas del instalador ---------- */
  const RULES = [
    { t: /antivirus|amenaza|virus/i, ids: ['w:Malwarebytes.Malwarebytes'], why: 'Segunda opinión: elimina adware y malware que otros antivirus no ven' },
    { a: /Almacenamiento/, t: /disco|ssd|smart/i, not: /espacio|lleno/i, ids: ['w:CrystalDewWorld.CrystalDiskInfo', 'w:CrystalDewWorld.CrystalDiskMark', 'g:rescuezilla/rescuezilla'], why: 'Para vigilar la salud del disco y clonarlo antes de que falle' },
    { t: /espacio|lleno/i, ids: ['g:Klocman/Bulk-Crap-Uninstaller'], why: 'Para quitar programas que ocupan espacio' },
    { a: /Temperatura/, ids: ['g:LibreHardwareMonitor/LibreHardwareMonitor', 'w:CPUID.HWMonitor'], why: 'Para medir temperaturas mientras lo pruebas' },
    { a: /Controladores/, ids: ['g:lostindark/DriverStoreExplorer', 'w:REALiX.HWiNFO'], why: 'Para revisar y limpiar controladores' },
    { t: /memoria RAM|errores de hardware|pantallazo/i, not: /insuficiente|poca/i, ids: ['g:memtest86plus/memtest86plus', 'w:REALiX.HWiNFO'], why: 'Para probar la RAM a fondo desde una USB' },
    { t: /arrancan con Windows/i, ids: ['g:winsiderss/systeminformer', 'g:Klocman/Bulk-Crap-Uninstaller'], why: 'Para controlar lo que se ejecuta al encender' }
  ];
  function recs() {
    const s = DIAG.summary(); if (!s) return [];
    const out = [], seen = new Set();
    s.issues.forEach(x => RULES.forEach(r => {
      if ((r.a && !r.a.test(x.area)) || (r.t && !r.t.test(x.title)) || (r.not && r.not.test(x.title))) return;
      r.ids.forEach(id => { if (!seen.has(id) && INST.has(id)) { seen.add(id); out.push({ id, why: r.why, issue: x.title, sev: x.sev }); } });
    }));
    return out;
  }
  function drawRecs(el) {
    if (!el) return;
    const r = recs();
    if (!r.length) { el.innerHTML = ''; return; }
    el.innerHTML = '<div class="xcard"><div class="xh"><span class="xi">' + svg(ICS.inst, 20) + '</span><div class="grow"><b>Programas que ayudan con lo encontrado</b><small>Desde el Instalador, con un clic</small></div><button class="b sm" id="xgo">Marcarlos en el instalador ' + svg(ICS.arrow, 15) + '</button></div>' +
      '<div class="xlist">' + r.map(x => { const it = INST.item(x.id) || {}; return '<div class="xr"><span class="dot ' + x.sev + '"></span><span class="grow"><b>' + esc(it.name || x.id) + '</b><small>' + esc(x.why) + ' · por «' + esc(x.issue) + '»</small></span>' + (it.installed ? '<span class="pill ok">Ya instalado</span>' : '') + '</div>'; }).join('') + '</div></div>';
    el.querySelector('#xgo').onclick = () => sw('inst', () => INST.recommend(r.filter(x => !(INST.item(x.id) || {}).installed).map(x => x.id), 'Recomendados por el diagnóstico'));
  }
  /* tarjeta del estado del equipo en el inicio del instalador */
  function healthCard() {
    const s = DIAG.summary();
    const col = { A: '#4ADE80', B: '#FF9A4D', C: '#F87171' };
    if (!s) return '<button class="xcard xs" data-shell="diag"><span class="xi"><span class="spin sm"></span></span><span class="grow"><b>Analizando este equipo…</b><small>El diagnóstico corre en segundo plano</small></span>' + svg(ICS.arrow, 16) + '</button>';
    const r = recs().filter(x => !(INST.item(x.id) || {}).installed);
    return '<div class="xcard xs"><span class="grade" style="color:' + col[s.grade] + ';border-color:' + col[s.grade] + '">' + s.grade + '</span><span class="grow"><b>' + esc((s.device.maker + ' ' + s.device.model).trim()) + ' · ' + ({ A: 'Excelente estado', B: 'Buen estado con detalles', C: 'Requiere atención' }[s.grade]) + '</b><small>' + s.nb + ' problema' + (s.nb === 1 ? '' : 's') + ' · ' + s.nw + ' aviso' + (s.nw === 1 ? '' : 's') + (r.length ? ' · ' + r.length + ' programa' + (r.length > 1 ? 's' : '') + ' recomendado' + (r.length > 1 ? 's' : '') : '') + '</small></span>' +
      (r.length ? '<button class="b sm" data-shell="recs">Marcar recomendados</button>' : '') + '<button class="b sec sm" data-shell="diag">Ver diagnóstico ' + svg(ICS.arrow, 14) + '</button></div>';
  }
  function bindShell(root) {
    root.querySelectorAll('[data-shell]').forEach(b => b.onclick = e => {
      e.stopPropagation();
      if (b.dataset.shell === 'diag') sw('diag');
      else INST.recommend(recs().filter(x => !(INST.item(x.id) || {}).installed).map(x => x.id), 'Recomendados por el diagnóstico');
    });
  }
  let chT = 0;
  function changed() { clearTimeout(chT); chT = setTimeout(() => { if (mode === 'inst') { const el = document.querySelector('#xhealth'); if (el) { el.innerHTML = healthCard(); bindShell(el); } } else drawRecs(document.querySelector('#recs')); }, 50); }

  /* ---------- arranque ---------- */

  /* ---------- actualizaciones automáticas ---------- */
  let U = null, updShown = false;
  const hdr = { 'X-MV-Token': TOKEN, 'Content-Type': 'application/json' };
  const uapi = (p, b) => fetch(p, b === undefined ? { headers: hdr } : { method: 'POST', headers: hdr, body: JSON.stringify(b) }).then(r => r.json());
  const UIC = { up: '<path d="M12 19V5"/><path d="M5 12l7-7 7 7"/>', spin: '<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4v7h-7"/>' };
  function notesHTML(t) {
    const lines = String(t || '').split(/\r?\n/).map(l => l.trim()).filter(Boolean).slice(0, 30);
    if (!lines.length) return '<p class="mut">Mejoras y correcciones.</p>';
    return '<ul class="unotes">' + lines.map(l => '<li>' + esc(l.replace(/^[-*•]\s*/, '').replace(/^#+\s*/, '').replace(/\*\*/g, '')) + '</li>').join('') + '</ul>';
  }
  function toastU(m) { const t = document.createElement('div'); t.className = 'toast'; t.textContent = m; document.body.appendChild(t); setTimeout(() => t.remove(), 3500); }
  function drawUpd() {
    const el = document.querySelector('#upd'), v = document.querySelector('#ver'); if (!el || !U) return;
    v.innerHTML = 'v' + esc(U.current) + (U.state === 'uptodate' ? ' · al día' : '');
    el.innerHTML = U.state === 'ready' ? '<div class="ucard"><span class="ui">' + svg(UIC.up, 15) + '</span><span class="grow"><b>Versión ' + esc(U.latest) + ' lista</b><small>Se aplica al reiniciar</small></span></div><button class="b sm full" id="urst">' + svg(UIC.up, 14) + 'Reiniciar y actualizar</button><button class="lnk sm" id="unotes">Ver novedades</button>'
      : U.state === 'downloading' ? '<div class="ucard"><span class="ui">' + svg(UIC.up, 15) + '</span><span class="grow"><b>Descargando ' + esc(U.latest) + '</b><small>' + (U.progress || 0) + ' %</small></span></div><div class="bar" style="margin-top:6px"><i style="width:' + (U.progress || 0) + '%"></i></div>'
      : '';
    const r = el.querySelector('#urst'); if (r) r.onclick = restart;
    const n = el.querySelector('#unotes'); if (n) n.onclick = updModal;
  }
  async function pollUpd() {
    try { U = await uapi('/api/update'); } catch (e) { return; }
    drawUpd();
    if (U.updated && !updShown) { updShown = true; toastU('MiVibra PC se actualizó a la versión ' + U.current); }
  }
  async function restart() {
    const r = await uapi('/api/update/restart', {}).catch(() => ({ ok: false, msg: 'Error de comunicación' }));
    if (!r.ok) { toastU(r.msg || 'No se pudo reiniciar'); return; }
    document.body.insertAdjacentHTML('beforeend', '<div class="closed"><span class="spin"></span><h1>Actualizando MiVibra PC…</h1><p class="mut">La versión ' + esc(U.latest) + ' se abrirá en una ventana nueva.</p></div>');
    setTimeout(() => { try { window.close(); } catch (e) {} }, 2500);
  }
  function updModal() {
    if (!U) return;
    const m = document.createElement('div'); m.className = 'modal';
    const ago = U.checked ? new Date(U.checked * 1000).toLocaleString('es-CO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'todavía no';
    const st = { checking: 'Buscando…', uptodate: 'Tienes la última versión', downloading: 'Descargando ' + (U.progress || 0) + ' %', ready: 'Versión ' + U.latest + ' lista para instalar', error: U.msg || 'No se pudo revisar', off: 'Actualizaciones automáticas desactivadas', idle: 'Revisando en unos segundos…', available: 'Hay una versión nueva' }[U.state] || U.state;
    m.innerHTML = '<div class="box pop" role="dialog" aria-modal="true"><div class="mh"><span class="xi">' + svg(UIC.up, 20) + '</span><span class="grow"><span class="eyebrow">Actualizaciones</span><h2>MiVibra PC ' + esc(U.current) + '</h2><span class="mut" style="font-size:12.5px">' + esc(st) + ' · última revisión: ' + esc(ago) + '</span></span><button class="ib" data-x aria-label="Cerrar">' + svg('<path d="M6 6l12 12M18 6L6 18"/>', 16) + '</button></div>' +
      (U.latest && U.latest !== U.current ? '<h3 style="margin-top:20px">Novedades de la versión ' + esc(U.latest) + '</h3>' + notesHTML(U.notes) : '') +
      '<label class="sw" style="margin-top:20px"><input type="checkbox" id="uauto"' + (U.auto ? ' checked' : '') + '><i></i>Actualizar automáticamente</label><p class="mut" style="font-size:12.5px;margin-top:6px">Descarga las versiones nuevas en segundo plano, verifica que sean originales y las instala la próxima vez que abras la app. Tus instaladores, kits y ajustes se conservan.</p>' +
      '<div class="row" style="gap:10px;margin-top:20px"><span class="grow"></span><button class="b sec" id="uchk"' + (['checking', 'downloading'].includes(U.state) ? ' disabled' : '') + '>Buscar ahora</button>' + (U.state === 'ready' ? '<button class="b" id="urst2">Reiniciar y actualizar</button>' : '<button class="b" data-x>Listo</button>') + '</div></div>';
    const close = () => m.remove();
    m.onclick = e => { if (e.target === m) close(); };
    m.querySelectorAll('[data-x]').forEach(b => b.onclick = close);
    m.querySelector('#uauto').onchange = async e => { await uapi('/api/update/auto', { on: e.target.checked }); pollUpd(); };
    m.querySelector('#uchk').onclick = async () => { await uapi('/api/update/check', {}); close(); toastU('Buscando actualizaciones…'); setTimeout(pollUpd, 4000); };
    const r2 = m.querySelector('#urst2'); if (r2) r2.onclick = () => { close(); restart(); };
    document.body.appendChild(m);
  }
  async function start() {
    const main = document.querySelector('#main');
    if (!TOKEN) { main.innerHTML = '<div class="page"><h1>Abre MiVibra desde el programa</h1><p class="mut">Esta página solo funciona dentro de la ventana de MiVibra PC.</p></div>'; return; }
    document.body.dataset.mode = mode;
    tabs();
    let fails = 0, ver = '';
    const ping = async () => {
      try {
        const r = await fetch('/api/ping', { headers: { 'X-MV-Token': TOKEN } }).then(x => x.json()); fails = 0;
        DIAG.setAdmin(r.admin); INST.setAdmin(r.admin);
        if (ver !== r.version) { ver = r.version; document.querySelector('#ver').textContent = 'v' + r.version; }
      } catch (e) { if (++fails >= 3 && !document.querySelector('.closed')) document.body.insertAdjacentHTML('beforeend', '<div class="closed"><h1>MiVibra se cerró</h1><p class="mut">Vuelve a abrir MiVibra-PC.exe para continuar.</p></div>'); }
    };
    await ping(); setInterval(ping, 5000);
    document.querySelector('#ver').onclick = updModal;
    pollUpd(); setInterval(pollUpd, 4000);
    (mode === 'diag' ? DIAG : INST).mount();
    DIAG.init(); INST.init();
  }
  window.addEventListener('keydown', e => { if (e.key === 'F5' || (e.ctrlKey && e.key.toLowerCase() === 'r')) e.preventDefault(); });
  return { get mode() { return mode; }, switch: sw, changed, drawRecs, healthCard, bindShell, start };
})();
