/* ===================== Módulo: Diagnóstico ===================== */
const DIAG = (() => {
const ACTIVE = () => SHELL.mode === 'diag';
/* ===================== MiVibra PC ===================== */
const $q = s => document.querySelector(s);
const NOOP = new Proxy(function () {}, { get: (t, k) => k === 'classList' ? { add() {}, remove() {}, toggle() {} } : k === 'style' ? {} : k === 'remove' ? () => {} : undefined, set: () => true });
const $ = s => document.querySelector(s) || NOOP;
const main = $q('#main');
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const arr = x => x == null || x === '' ? [] : Array.isArray(x) ? x : [x];
const sleep = ms => new Promise(r => setTimeout(r, ms));
const TOKEN = (location.hash.match(/t=([a-f0-9]+)/) || [])[1] || sessionStorage.getItem('mvtok') || '';
try { sessionStorage.setItem('mvtok', TOKEN); } catch (e) {}

async function api(path, body) {
  const o = { headers: { 'X-MV-Token': TOKEN } };
  if (body !== undefined) { o.method = 'POST'; o.body = JSON.stringify(body); o.headers['Content-Type'] = 'application/json'; }
  const r = await fetch(path, o);
  if (!r.ok) throw new Error('HTTP ' + r.status);
  return r.json();
}
function toast(m) { const t = document.createElement('div'); t.className = 'toast'; t.textContent = m; document.body.appendChild(t); setTimeout(() => t.remove(), 2800); }
async function action(name, quiet) {
  try { const r = await api('/api/action', { name }); if (!quiet && r.msg) toast(r.msg); return r; }
  catch (e) { toast('No se pudo ejecutar la acción'); return { ok: false }; }
}

/* ---------- formato ---------- */
const GBs = b => b / 1073741824;
const fmtB = b => { b = Math.max(0, +b || 0); return b >= 1e12 ? (b / 1e12).toFixed(2) + ' TB' : b >= 1073741824 ? (b / 1073741824).toFixed(1) + ' GB' : b >= 1048576 ? Math.round(b / 1048576) + ' MB' : Math.round(b / 1024) + ' KB'; };
const fmtDisk = b => { const g = b / 1e9; return g >= 1000 ? (g / 1000).toFixed(g >= 1990 ? 0 : 1) + ' TB' : Math.round(g) + ' GB'; };
const ramGB = b => { const g = b / 1073741824; for (const x of [2, 3, 4, 6, 8, 12, 16, 20, 24, 32, 48, 64, 96, 128]) if (g <= x * 1.02) return x + ' GB'; return Math.round(g) + ' GB'; };
const dt = s => s ? new Date(s) : null;
const fmtDate = s => { const d = dt(s); return d && !isNaN(d) ? d.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'; };
const daysAgo = s => { const d = dt(s); return d && !isNaN(d) ? Math.floor((Date.now() - d) / 864e5) : null; };
const clean = s => String(s || '').replace(/\((R|TM|tm|r)\)/g, '').replace(/\s+CPU\b/, '').replace(/\s*@\s*[\d.]+\s*GHz/i, '').replace(/\s{2,}/g, ' ').trim();
const MAKER = [[/lenovo/i, 'Lenovo'], [/hewlett|^hp/i, 'HP'], [/dell/i, 'Dell'], [/asus/i, 'ASUS'], [/acer/i, 'Acer'], [/micro-star|msi/i, 'MSI'], [/gigabyte/i, 'Gigabyte'], [/samsung/i, 'Samsung'], [/microsoft/i, 'Microsoft'], [/huawei/i, 'Huawei'], [/apple/i, 'Apple'], [/toshiba|dynabook/i, 'Toshiba'], [/lg electronics/i, 'LG'], [/alienware/i, 'Alienware'], [/razer/i, 'Razer']];
const makerName = m => { for (const [r, n] of MAKER) if (r.test(m || '')) return n; return (m || '').replace(/,?\s*(Inc|Ltd|Co|Corporation|Corp)\.?/gi, '').trim(); };
const junkStr = s => !s || /to be filled|default string|system product name|not applicable|none|^\s*$|^0+$/i.test(s);
const MEDIA = { 3: 'HDD', 4: 'SSD', 5: 'SCM', 0: '' }, BUS = { 1: 'SCSI', 3: 'ATA', 7: 'USB', 8: 'RAID', 10: 'SAS', 11: 'SATA', 12: 'SD', 17: 'NVMe', 18: 'SCM' };
const DHEALTH = { 0: 'Healthy', 1: 'Warning', 2: 'Unhealthy', 5: 'Unknown' };
const mediaOf = d => MEDIA[d.media] !== undefined ? MEDIA[d.media] : (d.media === 'Unspecified' ? '' : d.media);
const busOf = d => BUS[d.bus] || d.bus || '';
const healthOf = d => DHEALTH[d.health] || d.health || 'Unknown';
const RAMT = { 20: 'DDR', 21: 'DDR2', 24: 'DDR3', 26: 'DDR4', 27: 'LPDDR', 28: 'LPDDR2', 29: 'LPDDR3', 30: 'LPDDR4', 34: 'DDR5', 35: 'LPDDR5' };
const LAPTOP_CH = [8, 9, 10, 11, 12, 14, 18, 21, 30, 31, 32];

/* ---------- íconos ---------- */
const IC = {
  home: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/>',
  chip: '<rect x="6" y="6" width="12" height="12" rx="2"/><rect x="9.5" y="9.5" width="5" height="5" rx="1"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>',
  shield: '<path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
  test: '<path d="M9 3h6"/><path d="M10 3v6l-5 9a2 2 0 0 0 1.7 3h10.6a2 2 0 0 0 1.7-3l-5-9V3"/>',
  gauge: '<path d="M4 18a8 8 0 1 1 16 0"/><path d="M12 18l4-6"/>',
  bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
  doc: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h4"/>',
  laptop: '<rect x="4" y="5" width="16" height="11" rx="1.5"/><path d="M2 19h20"/>',
  ram: '<rect x="2" y="7" width="20" height="10" rx="1.5"/><path d="M6 17v3M10 17v3M14 17v3M18 17v3M6 10v4M10 10v4M14 10v4M18 10v4"/>',
  gpu: '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="9" cy="12" r="3"/><path d="M15 10h4M15 14h4"/>',
  monitor: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
  disk: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 15h.01M11 15h6"/>',
  battery: '<rect x="2" y="7" width="17" height="10" rx="2"/><path d="M22 11v2"/><path d="M6 10v4M10 10v4"/>',
  wifi: '<path d="M2 9a15 15 0 0 1 20 0"/><path d="M5.5 12.5a10 10 0 0 1 13 0"/><path d="M9 16a5 5 0 0 1 6 0"/><path d="M12 19.5h.01"/>',
  audio: '<path d="M11 5L6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/>',
  mic: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v4"/>',
  cam: '<path d="M4 7h3l2-3h6l2 3h3a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="4"/>',
  kb: '<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10"/>',
  mouse: '<rect x="6" y="3" width="12" height="18" rx="6"/><path d="M12 7v4"/>',
  usb: '<path d="M12 2v14"/><path d="M8 6l4-4 4 4"/><circle cx="12" cy="19" r="2.5"/><path d="M12 12l-5-2v-3M12 10l5-2V6"/>',
  bt: '<path d="M7 7l10 10-5 5V2l5 5L7 17"/>',
  screen: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M3 13h18"/>',
  trash: '<path d="M4 7h16"/><path d="M10 11v6M14 11v6"/><path d="M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13"/><path d="M9 7V4h6v3"/>',
  wrench: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.5-.5-.5-2.5z"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>', close: '<path d="M6 6l12 12M18 6L6 18"/>',
  warn: '<path d="M12 3l10 18H2z"/><path d="M12 10v5"/><path d="M12 18h.01"/>',
  arrow: '<path d="M5 12h14"/><path d="M13 6l6 6-6 6"/>', back: '<path d="M15 6l-6 6 6 6"/>',
  refresh: '<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4v7h-7"/>',
  admin: '<path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z"/><path d="M12 8v5"/><path d="M12 16h.01"/>',
  dl: '<path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M5 21h14"/>',
  print: '<path d="M7 9V3h10v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M7 14h10v7H7z"/>',
  copy: '<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
  thermo: '<path d="M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0z"/><path d="M12 9v7"/>',
  bug: '<path d="M8 6a4 4 0 0 1 8 0"/><rect x="6" y="8" width="12" height="12" rx="6"/><path d="M12 12v8M3 13h3M18 13h3M4 8l3 2M20 8l-3 2M4 19l3-2M20 19l-3-2"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>'
};
const icon = (k, c, s, w) => '<svg width="' + (s || 20) + '" height="' + (s || 20) + '" viewBox="0 0 24 24" fill="none" stroke="' + (c || 'currentColor') + '" stroke-width="' + (w || 2) + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (IC[k] || '') + '</svg>';
function ring(pct, size, stroke, color, inner, label) {
  const r = (size - stroke) / 2 - 2, c = 2 * Math.PI * r, v = Math.max(0, Math.min(100, pct || 0)) / 100 * c;
  return '<div class="ring" style="width:' + size + 'px;height:' + size + 'px"><svg width="' + size + '" height="' + size + '" role="img" aria-label="' + esc(label || '') + '"><circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke="#1E1A17" stroke-width="' + stroke + '"/>' +
    (v > 0 ? '<circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke="' + color + '" stroke-width="' + stroke + '" stroke-linecap="round" stroke-dasharray="' + v.toFixed(1) + ' ' + c.toFixed(1) + '" transform="rotate(-90 ' + size / 2 + ' ' + size / 2 + ')"/>' : '') +
    '</svg><div class="in">' + inner + '</div></div>';
}
const SEVCOL = { ok: '#4ADE80', warn: '#FBBF24', bad: '#F87171', info: '#FF9A4D' };
const GCOL = { A: '#4ADE80', B: '#FF9A4D', C: '#F87171' };

/* ---------- estado ---------- */
const D = { info: null, soft: null, live: null, bench: {}, tests: {}, clean: null, admin: false, version: '', page: 'resumen', loading: true, cleanup: [] };

/* ---------- datos derivados ---------- */
function device() {
  const i = D.info || {}, cs = i.cs || {}, pr = i.product || {};
  const maker = makerName(cs.maker);
  let model = !junkStr(cs.family) && cs.family !== cs.model ? cs.family : (!junkStr(pr.version) && !/^\d/.test(pr.version) && pr.version.length > 3 ? pr.version : cs.model);
  if (junkStr(model)) model = 'PC de escritorio';
  const ch = arr(i.chassis);
  const laptop = cs.pctype === 2 || ch.some(x => LAPTOP_CH.includes(x)) || (i.battery && i.battery.present);
  return { maker, model: model.replace(new RegExp('^' + maker + '\\s+', 'i'), ''), code: cs.model, laptop, serial: !junkStr(pr.serial) ? pr.serial : (i.bios && !junkStr(i.bios.serial) ? i.bios.serial : '') };
}
function battery() {
  const b = (D.info || {}).battery;
  if (!b || !b.present) return null;
  const h = b.design > 0 && b.full > 0 ? Math.min(100, Math.round(b.full / b.design * 100)) : null;
  return Object.assign({}, b, { health: h });
}
function sysDisk() {
  const vol = arr((D.info || {}).volumes).find(v => v.id === 'C:') || arr((D.info || {}).volumes)[0];
  return vol;
}
function osInfo() {
  const o = (D.info || {}).os || (D.soft || {}).os || {};
  const caption = (o.caption || '').replace('Microsoft ', '');
  return { caption, display: o.display, build: +o.build || 0, ubr: o.ubr, boot: o.boot, installed: o.installed, win10: /Windows 10/.test(caption) && (+o.build || 0) < 22000 };
}

/* ---------- análisis y puntaje ---------- */
function analyze() {
  const I = [], add = (sev, area, title, detail, act) => I.push({ sev, area, title, detail, act });
  const i = D.info || {}, s = D.soft || {}, os = osInfo();
  if (D.info) {
    const b = battery();
    if (b && b.health != null) {
      const cyc = b.cycles ? ' · ' + b.cycles + ' ciclos' : '';
      if (b.health < 60) add('bad', 'Batería', 'Batería muy desgastada (' + b.health + ' %)', 'Retiene ' + Math.round(b.full / 1000) + ' de ' + Math.round(b.design / 1000) + ' Wh de fábrica' + cyc + '. Se recomienda cambiarla.', { label: 'Informe de batería', run: 'batteryreport' });
      else if (b.health < 80) add('bad', 'Batería', 'Batería desgastada (' + b.health + ' %)', 'Está por debajo del 80 % recomendado' + cyc + '.', { label: 'Informe de batería', run: 'batteryreport' });
      else if (b.health < 85) add('warn', 'Batería', 'Batería con desgaste avanzado (' + b.health + ' %)', 'Aún funciona, pero se acerca al límite de reemplazo' + cyc + '.');
      else add('ok', 'Batería', 'Batería en buen estado (' + b.health + ' %)', 'Capacidad ' + Math.round(b.full / 1000) + ' / ' + Math.round(b.design / 1000) + ' Wh' + cyc);
      if (b.cycles >= 1000) add('warn', 'Batería', b.cycles + ' ciclos de carga', 'La mayoría de baterías de portátil están diseñadas para 500 a 1000 ciclos.');
    } else if (b) add('warn', 'Batería', 'No se pudo medir la salud de la batería', 'El equipo no entrega capacidad de diseño y real.');
    arr(i.disks).forEach(d => {
      const h = healthOf(d), nm = clean(d.name), m = mediaOf(d);
      if (h === 'Unhealthy') add('bad', 'Almacenamiento', 'Disco con fallas: ' + nm, 'Windows lo reporta como dañado. Haz copia de seguridad de inmediato.', { label: 'Revisar disco', run: 'chkdsk' });
      else if (h === 'Warning') add('bad', 'Almacenamiento', 'Disco con advertencias: ' + nm, 'Windows detectó problemas de salud. Haz copia de seguridad.', { label: 'Revisar disco', run: 'chkdsk' });
      else add('ok', 'Almacenamiento', 'Disco saludable: ' + nm, [m, busOf(d), fmtDisk(d.size)].filter(Boolean).join(' · '));
      if (d.wear != null && d.wear >= 80) add('bad', 'Almacenamiento', 'SSD al ' + d.wear + ' % de desgaste', nm + ': su vida útil está casi agotada.');
      else if (d.wear != null && d.wear >= 50) add('warn', 'Almacenamiento', 'SSD con ' + d.wear + ' % de desgaste', nm);
      if (d.temp != null && d.temp >= 65) add('warn', 'Almacenamiento', 'Disco caliente (' + d.temp + ' °C)', nm);
      if ((d.rerr || 0) + (d.werr || 0) > 0) add('bad', 'Almacenamiento', 'Errores de lectura/escritura en ' + nm, (d.rerr || 0) + ' de lectura y ' + (d.werr || 0) + ' de escritura sin corregir.');
      if (m === 'HDD' && arr(i.disks).length === 1) add('warn', 'Rendimiento', 'El sistema está en un disco mecánico (HDD)', 'Cambiar a un SSD es la mejora de velocidad más notable para este equipo.');
    });
    if (i.predictFail > 0) add('bad', 'Almacenamiento', 'SMART predice una falla de disco', 'Respalda tu información y reemplaza el disco.');
    const v = sysDisk();
    if (v && v.size) {
      const pct = v.free / v.size * 100;
      if (pct < 10) add('bad', 'Almacenamiento', 'Disco ' + v.id + ' casi lleno (' + fmtB(v.free) + ' libres)', 'Con menos de 10 % libre Windows se vuelve lento y las actualizaciones fallan.', { label: 'Liberar espacio', page: 'optimizar' });
      else if (pct < 15) add('warn', 'Almacenamiento', 'Poco espacio en ' + v.id + ' (' + fmtB(v.free) + ' libres)', 'Conviene mantener al menos 15 % libre.', { label: 'Liberar espacio', page: 'optimizar' });
    }
    const ram = (i.cs || {}).ram || 0;
    if (ram && ram < 3.6 * 2 ** 30) add('bad', 'Rendimiento', 'Memoria RAM insuficiente (' + ramGB(ram) + ')', 'Windows 10/11 necesita al menos 8 GB para funcionar con fluidez.');
    else if (ram && ram < 7.5 * 2 ** 30) add('warn', 'Rendimiento', 'Poca memoria RAM (' + ramGB(ram) + ')', 'Con 8 GB o más el equipo trabaja mucho más fluido.');
    arr(i.gpu).forEach(g => { if (g.code && g.code !== 0) add('bad', 'Controladores', 'Problema con la tarjeta gráfica', clean(g.name) + ' (código ' + g.code + ')', { label: 'Administrador de dispositivos', run: 'devmgr' }); });
    const gd = arr(i.gpu).map(g => daysAgo(g.driverDate)).filter(x => x != null);
    if (gd.length && Math.min(...gd) > 3 * 365) add('warn', 'Controladores', 'Controlador de video con más de 3 años', 'Actualizarlo desde la página del fabricante mejora estabilidad y rendimiento.');
    const th = arr(i.thermal).filter(t => t > 0 && t < 120);
    if (th.length) { const t = Math.max(...th); if (t >= 90) add('bad', 'Temperatura', 'Temperatura muy alta (' + t + ' °C)', 'Revisa ventiladores y pasta térmica.'); else if (t >= 80) add('warn', 'Temperatura', 'Temperatura elevada (' + t + ' °C)', 'Limpia las salidas de aire.'); }
    ['audio', 'cams', 'bt'].forEach(k => arr(i[k]).forEach(x => { if (x.status && x.status !== 'OK') add('bad', 'Hardware', 'Problema con ' + x.name, 'Estado: ' + x.status, { label: 'Administrador de dispositivos', run: 'devmgr' }); }));
  }
  if (D.soft) {
    if (os.win10) add('bad', 'Windows', 'Windows 10 ya no recibe actualizaciones de seguridad', 'El soporte terminó el 14 de octubre de 2025. ' + (win11Ready() ? 'Este equipo cumple requisitos de Windows 11.' : 'Revisa si cumple los requisitos de Windows 11.'), { label: 'Windows Update', run: 'update' });
    else if (os.build && os.build < 26100) add('warn', 'Windows', 'Versión de Windows 11 antigua (' + (os.display || os.build) + ')', 'Las versiones antiguas dejan de recibir parches. Actualiza a la última versión.', { label: 'Windows Update', run: 'update' });
    const a = s.activation;
    if (a && a.status !== 1) add('bad', 'Windows', 'Windows no está activado', 'Sin activación hay funciones bloqueadas y avisos permanentes.', { label: 'Activación', run: 'activation' });
    else if (a) add('ok', 'Windows', 'Windows activado', a.name || '');
    const avs = arr(s.av), anyOn = avs.some(x => x.on) || (s.defender && s.defender.rt);
    if (!anyOn) add('bad', 'Seguridad', 'No hay antivirus activo', 'El equipo está expuesto a malware.', { label: 'Seguridad de Windows', run: 'defender' });
    else add('ok', 'Seguridad', 'Antivirus activo', avs.filter(x => x.on).map(x => x.name).join(', ') || 'Microsoft Defender');
    if (avs.some(x => x.on && !x.current)) add('warn', 'Seguridad', 'Antivirus desactualizado', avs.filter(x => x.on && !x.current).map(x => x.name).join(', '), { label: 'Seguridad de Windows', run: 'defender' });
    if (s.defender && s.defender.rt && daysAgo(s.defender.sig) > 7) add('warn', 'Seguridad', 'Firmas de Defender con ' + daysAgo(s.defender.sig) + ' días', 'Actualiza Windows para recibir protección reciente.', { label: 'Windows Update', run: 'update' });
    const fwOff = arr(s.firewall).filter(f => !f.on);
    if (fwOff.length) add('warn', 'Seguridad', 'Firewall desactivado en ' + fwOff.map(f => ({ Domain: 'dominio', Private: 'red privada', Public: 'red pública' }[f.name] || f.name)).join(', '), 'Actívalo en Seguridad de Windows.', { label: 'Seguridad de Windows', run: 'defender' });
    const lu = daysAgo(s.lastUpdate);
    if (lu != null && lu > 90) add('bad', 'Windows', 'Sin actualizar hace ' + lu + ' días', 'Faltan parches de seguridad y correcciones.', { label: 'Windows Update', run: 'update' });
    else if (lu != null && lu > 45) add('warn', 'Windows', 'Última actualización hace ' + lu + ' días', 'Revisa Windows Update.', { label: 'Windows Update', run: 'update' });
    else if (lu != null) add('ok', 'Windows', 'Actualizado hace ' + lu + ' días', s.lastUpdateTitle || '');
    if (s.reboot) add('warn', 'Windows', 'Reinicio pendiente', 'Hay actualizaciones esperando un reinicio para terminar.');
    const bad = arr(s.badDevices).filter(d => d.code !== 22);
    if (bad.length) add('warn', 'Controladores', bad.length + ' dispositivo' + (bad.length > 1 ? 's' : '') + ' con problemas', bad.slice(0, 3).map(d => d.name + (d.code === 28 ? ' (sin controlador)' : '')).join(' · '), { label: 'Administrador de dispositivos', run: 'devmgr' });
    if (s.bsod > 0) add('bad', 'Estabilidad', s.bsod + ' pantallazo' + (s.bsod > 1 ? 's' : '') + ' azul' + (s.bsod > 1 ? 'es' : '') + ' en 30 días', 'Suelen deberse a controladores, RAM o disco. Ejecuta las pruebas de RAM y disco.', { label: 'Monitor de confiabilidad', run: 'reliability' });
    if (s.whea > 0) add('bad', 'Estabilidad', s.whea + ' errores de hardware (WHEA) en 30 días', 'Windows registró fallas del procesador, memoria o buses.', { label: 'Monitor de confiabilidad', run: 'reliability' });
    if (s.unexpected > 2) add('warn', 'Estabilidad', s.unexpected + ' apagados inesperados en 30 días', 'Pueden ser cortes de luz, batería, sobrecalentamiento o fallas de fuente.');
    if (s.diskErrors > 5) add('bad', 'Almacenamiento', s.diskErrors + ' errores de disco en 30 días', 'El registro del sistema muestra errores de lectura del disco.', { label: 'Revisar disco', run: 'chkdsk' });
    else if (s.diskErrors > 0) add('warn', 'Almacenamiento', s.diskErrors + ' avisos de disco en 30 días', 'Revisa el disco con chkdsk.', { label: 'Revisar disco', run: 'chkdsk' });
    if (s.appCrashes > 10) add('warn', 'Estabilidad', s.appCrashes + ' cierres inesperados de apps en 7 días', arr(s.topCrashes).map(c => c.app + ' (' + c.n + ')').join(', '));
    if (s.sysErrors > 60) add('warn', 'Estabilidad', s.sysErrors + ' errores del sistema en 7 días', arr(s.topErrors).slice(0, 3).map(e => e.src.replace('Microsoft-Windows-', '') + ' (' + e.n + ')').join(', '));
    const st = arr(s.startup).length;
    if (st > 10) add('warn', 'Rendimiento', st + ' programas arrancan con Windows', 'Desactivar los que no uses acelera el encendido.', { label: 'Programas de inicio', run: 'startup' });
    const up = daysAgo(s.os && s.os.boot);
    if (up != null && up >= 7) add('warn', 'Rendimiento', 'Encendido hace ' + up + ' días sin reiniciar', 'Reiniciar libera memoria y aplica actualizaciones.');
    if (s.restorePoints === 0) add('warn', 'Windows', 'No hay puntos de restauración', 'Crear uno permite deshacer cambios si algo sale mal.', { label: 'Crear punto', run: 'restorepoint' });
  }
  const B = D.bench;
  if (B.cpu && !B.cpu.err) { if (B.cpu.drop > 25) add('warn', 'Temperatura', 'El procesador pierde ' + Math.round(B.cpu.drop) + ' % de velocidad bajo carga', 'Señal de sobrecalentamiento: limpieza interna y cambio de pasta térmica.'); else add('ok', 'Rendimiento', 'Procesador estable bajo carga', 'Variación de ' + Math.max(0, Math.round(B.cpu.drop)) + ' %'); }
  if (B.ram && !B.ram.err) { if (B.ram.errors > 0) add('bad', 'Hardware', 'Errores en la memoria RAM', B.ram.errors + ' errores al verificar ' + B.ram.mb + ' MB. Puede causar bloqueos y pantallazos azules.'); else add('ok', 'Hardware', 'Memoria RAM sin errores', B.ram.mb + ' MB verificados'); }
  if (B.disk && !B.disk.err) { const r = B.disk.read; if (r < 60) add('bad', 'Almacenamiento', 'Disco muy lento (' + Math.round(r) + ' MB/s)', 'Puede ser un disco mecánico con desgaste o con fallas.'); else if (r < 150) add('warn', 'Almacenamiento', 'Disco lento (' + Math.round(r) + ' MB/s)', 'Un SSD lee entre 500 y 7000 MB/s.'); }
  if (B.net) { if (!B.net.internet) add('bad', 'Red', 'Sin conexión a internet', 'Revisa el WiFi o el cable.', { label: 'Estado de la red', run: 'network' }); else if (B.net.pingMs > 150) add('warn', 'Red', 'Latencia alta (' + B.net.pingMs + ' ms)', 'La conexión responde lento.'); }
  Object.keys(D.tests).forEach(k => { const r = D.tests[k], t = TESTS.find(x => x.id === k); if (!t) return; if (r.st === 'bad') add('bad', 'Pruebas', t.name + ': falla', r.note || ''); else if (r.st === 'ok') add('ok', 'Pruebas', t.name + ': funciona', r.note || ''); });
  if (AV.st && !AV.st.err) {
    const act = arr(AV.st.threats).filter(avActive);
    if (act.length) add('bad', 'Seguridad', act.length + ' amenaza' + (act.length > 1 ? 's' : '') + ' de virus activa' + (act.length > 1 ? 's' : ''), act.slice(0, 2).map(t => t.name).join(' · '), { label: 'Eliminar', page: 'antivirus' });
    const fd = daysAgo((AV.st.defender || {}).full), qd = daysAgo((AV.st.defender || {}).quick);
    if (!act.length && (qd == null || qd > 30) && (fd == null || fd > 30)) add('warn', 'Seguridad', 'Sin escanear virus hace más de un mes', 'Haz un escaneo rápido o completo.', { label: 'Escanear', page: 'antivirus' });
  }
  const nb = I.filter(x => x.sev === 'bad').length, nw = I.filter(x => x.sev === 'warn').length;
  const score = Math.max(0, Math.min(100, 100 - nb * 12 - nw * 4));
  const grade = nb === 0 && score >= 85 ? 'A' : score >= 65 && nb <= 1 ? 'B' : 'C';
  const order = { bad: 0, warn: 1, info: 2, ok: 3 };
  I.sort((a, b) => order[a.sev] - order[b.sev]);
  return { items: I, score, grade, nb, nw, nok: I.filter(x => x.sev === 'ok').length };
}
function win11Ready() {
  const i = D.info || {};
  return !!(i.tpm && /2\.0/.test(i.tpm.ver) && i.secureBoot !== false && (i.firmware || '').toUpperCase() === 'UEFI' && (i.cs || {}).ram >= 3.6 * 2 ** 30);
}
const GTEXT = { A: 'Excelente estado', B: 'Buen estado con detalles', C: 'Requiere atención' };

/* ---------- navegación ---------- */
const PAGES = [['resumen', 'Resumen', 'home'], ['hardware', 'Hardware', 'chip'], ['software', 'Software', 'shield'], ['antivirus', 'Antivirus', 'bug'], ['pruebas', 'Pruebas', 'test'], ['rendimiento', 'Rendimiento', 'gauge'], ['optimizar', 'Optimizar', 'bolt'], ['informe', 'Informe', 'doc']];
function renderNav() {
  if (!ACTIVE()) return;
  const A = D.info || D.soft ? analyze() : null;
  $q('#nav').innerHTML = PAGES.map(p => '<button class="nav' + (D.page === p[0] ? ' on' : '') + '" data-p="' + p[0] + '">' + icon(p[2], null, 19) + '<span>' + p[1] + '</span>' + (p[0] === 'resumen' && A && A.nb ? '<em class="bdg">' + A.nb + '</em>' : '') + (p[0] === 'antivirus' && AV.job && AV.job.state === 'running' && !AV.job.stale ? '<span class="spin sm" style="margin-left:auto"></span>' : p[0] === 'antivirus' && AV.st && arr(AV.st.threats).filter(avActive).length ? '<em class="bdg">' + arr(AV.st.threats).filter(avActive).length + '</em>' : '') + '</button>').join('');
  $q('#nav').querySelectorAll('[data-p]').forEach(b => b.onclick = () => go(b.dataset.p));
  $q('#adm').innerHTML = D.admin
    ? '<span class="pill ok" style="align-self:flex-start">' + icon('shield', '#86EFAC', 12) + ' Administrador</span>'
    : '<button class="b sec sm full" id="beadmin">' + icon('admin', null, 15) + '<span class="t">Ejecutar como admin</span></button><span class="mut t" style="font-size:11.5px;line-height:15px">Algunas lecturas (SMART, temperatura, limpieza del sistema) lo necesitan.</span>';
  const ba = $q('#beadmin'); if (ba) ba.onclick = async () => { const r = await action('admin'); if (r.ok) setTimeout(() => { try { window.close(); } catch (e) {} }, 800); };
}
function go(p) {
  D.cleanup.forEach(f => { try { f(); } catch (e) {} }); D.cleanup = [];
  D.page = p; if (!ACTIVE()) return; renderNav(); main.scrollTop = 0;
  ({ resumen: pResumen, hardware: pHardware, software: pSoftware, antivirus: pAntivirus, pruebas: pPruebas, rendimiento: pRendimiento, optimizar: pOptimizar, informe: pInforme }[p] || pResumen)();
}
function loadingBlock(text) { return '<div class="card fade" style="display:flex;align-items:center;gap:14px"><span class="spin sm"></span><span>' + text + '</span></div>'; }
function bindActs(root) {
  (root || main).querySelectorAll('[data-run]').forEach(b => b.onclick = () => action(b.dataset.run));
  (root || main).querySelectorAll('[data-go]').forEach(b => b.onclick = () => go(b.dataset.go));
}
function actBtn(a, cls) { if (!a) return ''; return a.run ? '<button class="b sec sm ' + (cls || '') + '" data-run="' + a.run + '">' + a.label + '</button>' : '<button class="b sec sm ' + (cls || '') + '" data-go="' + a.page + '">' + a.label + '</button>'; }
function issueRow(x) {
  return '<div class="li"><span class="dot ' + x.sev + '"></span><span class="tx"><b>' + esc(x.title) + '</b>' + (x.detail ? '<span>' + esc(x.detail) + '</span>' : '') + '</span><span class="pill">' + esc(x.area) + '</span>' + actBtn(x.act) + '</div>';
}

/* ---------- RESUMEN ---------- */
function pResumen() {
  const dv = device(), os = osInfo(), i = D.info || {};
  if (!D.info) { main.innerHTML = '<div class="page"><div class="head"><div class="stack"><span class="eyebrow">MiVibra PC</span><h1 class="xl">Analizando tu equipo…</h1><span class="mut">Leyendo hardware, discos, batería, Windows y seguridad. Tarda entre 10 y 40 segundos.</span></div></div><div class="tiles">' + '<div class="skel" style="height:86px"></div>'.repeat(6) + '</div><div class="skel" style="height:220px;margin-top:14px"></div></div>'; return; }
  const A = analyze(), b = battery(), v = sysDisk();
  const cpu = arr(i.cpu)[0] || {}, gpu = arr(i.gpu).filter(g => !/Basic Display|Remote|Virtual|Parsec|DisplayLink/i.test(g.name));
  const disks = arr(i.disks);
  const tiles = [
    ['Procesador', clean(cpu.name).replace(/^\d+(th|st|nd|rd) Gen\s+/i, '').replace(/ with .*$/i, ''), (cpu.cores || '?') + ' núcleos · ' + (cpu.threads || '?') + ' hilos'],
    ['Memoria RAM', ramGB((i.cs || {}).ram || 0), arr(i.ram).length ? arr(i.ram).length + ' módulo' + (arr(i.ram).length > 1 ? 's' : '') + ' · ' + (RAMT[arr(i.ram)[0].type] || '') + ' ' + (arr(i.ram)[0].speed || '') + ' MHz' : ''],
    ['Gráficos', gpu.map(g => clean(g.name)).join(' + ') || '—', gpu[0] && gpu[0].w ? gpu[0].w + '×' + gpu[0].h + ' · ' + gpu[0].hz + ' Hz' : ''],
    ['Almacenamiento', disks.map(d => fmtDisk(d.size) + ' ' + mediaOf(d)).join(' + ') || '—', v ? fmtB(v.free) + ' libres en ' + v.id : ''],
    ['Windows', os.caption || '—', (os.display ? os.display + ' · ' : '') + 'compilación ' + os.build + (os.ubr ? '.' + os.ubr : '')],
    [b ? 'Batería' : 'Equipo', b ? (b.health != null ? b.health + ' % de salud' : 'Sin datos de salud') : (dv.laptop ? 'Portátil' : 'Escritorio'), b ? (b.cycles ? b.cycles + ' ciclos · ' : '') + 'carga ' + (b.charge || '?') + ' %' : (i.bios ? 'BIOS ' + i.bios.version : '')]
  ];
  main.innerHTML = '<div class="page fade">' +
    '<div class="head"><div class="stack"><span class="eyebrow">' + esc(dv.maker || 'Equipo') + (dv.laptop ? ' · portátil' : '') + '</span><h1 class="xl">' + esc(dv.model) + '</h1><span class="mono mut" style="font-size:12.5px">' + esc([i.os && i.os.computer, dv.code !== dv.model ? dv.code : '', dv.serial ? 'S/N ' + dv.serial : ''].filter(Boolean).join(' · ')) + '</span></div>' +
    '<button class="b lg" id="full">' + icon('test', '#140A02', 18) + 'Diagnóstico completo</button></div>' +
    '<div style="display:grid;grid-template-columns:330px 1fr;gap:14px">' +
      '<div class="card" style="display:flex;flex-direction:column;align-items:center;gap:12px;justify-content:center">' +
        ring(A.score, 170, 12, GCOL[A.grade], '<span class="big" style="font-size:58px;color:' + GCOL[A.grade] + '">' + A.grade + '</span><span class="mono mut" style="font-size:12px">' + A.score + ' / 100</span>', 'Puntaje ' + A.score) +
        '<b style="font-family:var(--fb);font-size:20px">' + GTEXT[A.grade] + '</b>' +
        '<div class="row" style="gap:8px"><span class="pill bad">' + A.nb + ' problemas</span><span class="pill warn">' + A.nw + ' avisos</span><span class="pill ok">' + A.nok + ' OK</span></div>' +
        (D.soft ? '' : '<span class="mut row" style="gap:8px"><span class="spin sm"></span>Revisando Windows…</span>') +
      '</div>' +
      '<div class="tiles">' + tiles.map(t => '<div class="tile"><span>' + t[0] + '</span><b title="' + esc(t[1]) + '">' + esc(t[1]) + '</b><small>' + esc(t[2]) + '</small></div>').join('') + '</div>' +
    '</div>' +
    '<div class="live" id="live"></div>' +
    '<h3>Lo que encontramos<span>' + A.items.filter(x => x.sev !== 'ok').length + ' por revisar</span></h3>' +
    (A.items.some(x => x.sev !== 'ok') ? '<div class="list">' + A.items.filter(x => x.sev !== 'ok').slice(0, 10).map(issueRow).join('') + '</div>' : '<div class="card"><p>No encontramos problemas. Ejecuta el diagnóstico completo para probar también el hardware a fondo.</p></div>') +
    (A.items.filter(x => x.sev !== 'ok').length > 10 ? '<button class="lnk" data-go="informe">Ver todo en el informe</button>' : '') +
    '<div id="recs"></div></div>';
  $('#full').onclick = runAll;
  bindActs();
  SHELL.drawRecs($q('#recs'));
  liveTiles();
}
function liveTiles() {
  const draw = () => {
    const l = D.live, el = $q('#live'); if (!l || !el) return;
    const ram = (l.ramTotal - l.ramAvail) / l.ramTotal * 100, dk = l.diskTotal ? (l.diskTotal - l.diskFree) / l.diskTotal * 100 : 0;
    const col = p => p >= 90 ? '#F87171' : p >= 75 ? '#FBBF24' : '#FF6900';
    const t = (lab, val, pct, c, sub) => '<div class="tile"><span>' + lab + '</span><b>' + val + '</b><div class="bar" style="margin-top:4px"><i style="width:' + Math.round(pct) + '%;background:' + c + '"></i></div>' + (sub ? '<small>' + sub + '</small>' : '') + '</div>';
    el.innerHTML = t('Procesador ahora', l.cpu >= 0 ? Math.round(l.cpu) + ' %' : '—', Math.max(0, l.cpu), col(l.cpu)) +
      t('RAM en uso', Math.round(ram) + ' %', ram, col(ram), fmtB(l.ramAvail) + ' libres') +
      t('Disco del sistema', Math.round(dk) + ' %', dk, col(dk), fmtB(l.diskFree) + ' libres') +
      (l.batFlag !== 128 && l.batPct <= 100 ? t('Batería', l.batPct + ' %', l.batPct, l.batPct <= 20 ? '#F87171' : '#FF6900', l.ac ? 'Conectado' : (l.batSecs > 0 ? 'Quedan ~' + Math.round(l.batSecs / 60) + ' min' : 'Con batería')) : t('Encendido', Math.round(l.uptimeMs / 36e5) + ' h', 0, '#FF6900', 'desde el último reinicio'));
  };
  draw();
  const iv = setInterval(draw, 2000); D.cleanup.push(() => clearInterval(iv));
}

/* ---------- HARDWARE ---------- */
function pHardware() {
  const i = D.info;
  if (!i) { main.innerHTML = '<div class="page">' + loadingBlock('Leyendo el hardware…') + '</div>'; return; }
  const dv = device(), b = battery(), cpu = arr(i.cpu)[0] || {};
  const kv = rows => '<div class="kv">' + rows.filter(r => r[1] !== '' && r[1] != null && r[1] !== undefined).map(r => '<span>' + r[0] + '</span><span>' + esc(r[1]) + '</span>').join('') + '</div>';
  const card = (ic, title, body, extra) => '<div class="card"><h2><span class="ic">' + icon(ic, '#FF9A4D', 18) + '</span>' + title + (extra || '') + '</h2>' + body + '</div>';
  const st = x => '<span class="dot ' + (x === 'OK' ? 'ok' : x ? 'bad' : '') + '"></span>';
  const slots = i.ramSlots || arr(i.ram).length;
  const ramMods = arr(i.ram).map(m => '<div class="li" style="padding:10px 0;border-color:var(--line)"><span class="tx"><b>' + fmtB(m.cap) + ' ' + (RAMT[m.type] || '') + ' · ' + (m.conf || m.speed || '?') + ' MHz</b><span>' + esc([m.slot, m.maker, m.part].filter(x => !junkStr(x)).join(' · ')) + '</span></span></div>').join('');
  const disks = arr(i.disks).map(d => { const h = healthOf(d); const c = h === 'Healthy' ? 'ok' : h === 'Warning' ? 'warn' : h === 'Unhealthy' ? 'bad' : '';
    return '<div style="padding:10px 0;border-bottom:1px solid var(--line)"><div class="row"><b class="grow">' + esc(clean(d.name)) + '</b><span class="pill ' + c + '">' + ({ Healthy: 'Saludable', Warning: 'Advertencia', Unhealthy: 'Dañado' }[h] || 'Sin datos') + '</span></div><span class="mut mono" style="font-size:12px">' + esc([mediaOf(d), busOf(d), fmtDisk(d.size), d.temp != null ? d.temp + ' °C' : '', d.wear != null ? 'desgaste ' + d.wear + ' %' : '', d.hours != null ? d.hours + ' h de uso' : ''].filter(Boolean).join(' · ')) + '</span></div>'; }).join('');
  const vols = arr(i.volumes).map(v => { const p = v.size ? (v.size - v.free) / v.size * 100 : 0; return '<div style="margin-top:10px"><div class="row" style="font-size:13.5px"><b class="grow">' + esc(v.id + ' ' + (v.label || '')) + '</b><span class="mono mut" style="font-size:12px">' + fmtB(v.free) + ' libres de ' + fmtB(v.size) + '</span></div><div class="bar" style="margin-top:6px"><i style="width:' + p + '%;background:' + (p > 90 ? '#F87171' : p > 85 ? '#FBBF24' : '#FF6900') + '"></i></div></div>'; }).join('');
  const lst = (a, f) => arr(a).length ? arr(a).map(f).join('') : '<span class="mut">No detectado</span>';
  main.innerHTML = '<div class="page fade"><div class="head"><div class="stack"><span class="eyebrow">Hardware</span><h1>' + esc(dv.maker + ' ' + dv.model) + '</h1></div><button class="b sec" id="ref">' + icon('refresh', null, 16) + 'Volver a leer</button></div>' +
    '<div class="cards">' +
    card('laptop', 'Equipo', kv([['Fabricante', dv.maker], ['Modelo', dv.model], ['Código', dv.code], ['Número de serie', dv.serial], ['Tipo', dv.laptop ? 'Portátil' : 'Escritorio'], ['Placa base', i.board ? [makerName(i.board.maker), i.board.product].filter(x => !junkStr(x)).join(' ') : ''], ['BIOS', i.bios ? i.bios.version + ' · ' + fmtDate(i.bios.date) : ''], ['Firmware', i.firmware || ''], ['Arranque seguro', i.secureBoot == null ? 'Sin datos' : i.secureBoot ? 'Activado' : 'Desactivado'], ['TPM', i.tpm ? (i.tpm.ver || 'Presente') : 'No detectado (o requiere admin)'], ['Listo para Windows 11', win11Ready() ? 'Sí' : 'No / sin datos suficientes']])) +
    card('chip', 'Procesador', kv([['Modelo', clean(cpu.name)], ['Núcleos / hilos', cpu.cores + ' / ' + cpu.threads], ['Velocidad base', cpu.mhz ? (cpu.mhz / 1000).toFixed(2) + ' GHz' : ''], ['Caché L2 / L3', (cpu.l2 ? cpu.l2 / 1024 + ' MB' : '—') + ' / ' + (cpu.l3 ? cpu.l3 / 1024 + ' MB' : '—')], ['Virtualización', cpu.virt ? 'Activada' : 'Desactivada'], ['Uso actual', '<live>']]).replace('&lt;live&gt;', '<span id="cpuNow">—</span>')) +
    card('ram', 'Memoria', kv([['Total', ramGB((i.cs || {}).ram || 0)], ['Ranuras usadas', arr(i.ram).length + ' de ' + (slots || '?')], ['Máximo soportado', i.ramMaxKB ? Math.round(i.ramMaxKB / 1048576) + ' GB' : '']]) + '<div class="sep"></div>' + (ramMods || '<span class="mut">Sin detalle de módulos</span>')) +
    card('gpu', 'Gráficos', lst(i.gpu, g => '<div style="padding:8px 0;border-bottom:1px solid var(--line)"><div class="row"><b class="grow">' + esc(clean(g.name)) + '</b>' + st(g.status) + '</div><span class="mut mono" style="font-size:12px">' + esc([g.vram > 0 ? fmtB(g.vram) : '', g.w ? g.w + '×' + g.h + ' @ ' + g.hz + ' Hz' : '', 'controlador ' + g.driver + ' (' + fmtDate(g.driverDate) + ')'].filter(Boolean).join(' · ')) + '</span></div>')) +
    card('disk', 'Almacenamiento', (disks || '<span class="mut">Sin datos</span>') + vols + (D.admin ? '' : '<p class="mut" style="margin-top:10px;font-size:12.5px">Temperatura, desgaste y horas de uso del disco requieren ejecutar como administrador.</p>')) +
    card('battery', 'Batería', b ? '<div class="row" style="gap:18px">' + ring(b.health || 0, 110, 9, b.health == null ? '#57514B' : b.health < 80 ? '#F87171' : b.health < 85 ? '#FBBF24' : '#FF6900', '<span class="big" style="font-size:28px">' + (b.health != null ? b.health : '—') + '<small style="font-size:14px;color:var(--mut)">%</small></span><span class="mut" style="font-size:10.5px">salud</span>', 'Salud ' + b.health) +
      '<div class="grow">' + kv([['Capacidad de fábrica', b.design ? (b.design / 1000).toFixed(1) + ' Wh' : 'Sin datos'], ['Capacidad actual', b.full ? (b.full / 1000).toFixed(1) + ' Wh' : 'Sin datos'], ['Ciclos', b.cycles || 'Sin datos'], ['Carga', b.charge + ' %'], ['Fabricante', b.maker || ''], ['Química', b.chem || '']]) + '</div></div><button class="b sec sm" data-run="batteryreport" style="margin-top:12px">' + icon('doc', null, 15) + 'Informe completo de Windows</button>' : '<p class="mut">Este equipo no tiene batería (escritorio) o no se detectó.</p>') +
    card('monitor', 'Pantallas', lst(i.monitors, m => '<div class="row" style="padding:6px 0"><b class="grow">' + esc(m.name || (m.internal ? 'Pantalla integrada' : 'Monitor')) + '</b><span class="mono mut" style="font-size:12px">' + esc([m.maker, m.inches ? m.inches + '"' : '', m.year ? m.year : ''].filter(Boolean).join(' · ')) + '</span></div>')) +
    card('wifi', 'Red', lst(i.net, n => '<div class="row" style="padding:6px 0"><span class="dot ' + (n.status === 'Up' ? 'ok' : '') + '"></span><span class="grow"><b style="font-size:14px">' + esc(n.name) + '</b><br><span class="mut" style="font-size:12px">' + esc(n.desc) + '</span></span><span class="mono mut" style="font-size:12px">' + esc(n.status === 'Up' ? n.speed : 'Desconectado') + '</span></div>') + (i.wifiSignal != null ? '<div class="sep"></div>' + kv([['Red WiFi', i.wifiSsid || '—'], ['Señal', i.wifiSignal + ' %'], ['Estándar', i.wifiRadio || '']]) : '')) +
    card('audio', 'Audio y cámaras', lst(i.audio, x => '<div class="row" style="padding:5px 0">' + st(x.status) + '<span>' + esc(x.name) + '</span></div>') + '<div class="sep"></div>' + lst(i.cams, x => '<div class="row" style="padding:5px 0">' + st(x.status) + '<span>' + esc(x.name) + '</span></div>')) +
    card('bt', 'Bluetooth y entrada', lst(i.bt, x => '<div class="row" style="padding:5px 0">' + st(x.status) + '<span>' + esc(x.name) + '</span></div>') + '<div class="sep"></div>' + lst(i.keyboards, x => '<div class="row" style="padding:5px 0">' + icon('kb', '#A39C94', 15) + '<span>' + esc(x) + '</span></div>') + lst(i.pointing, x => '<div class="row" style="padding:5px 0">' + icon('mouse', '#A39C94', 15) + '<span>' + esc(x) + '</span></div>')) +
    '</div></div>';
  $('#ref').onclick = async () => { main.innerHTML = '<div class="page">' + loadingBlock('Leyendo el hardware de nuevo…') + '</div>'; D.info = await api('/api/info?refresh=1').catch(() => D.info); go('hardware'); };
  bindActs();
  const iv = setInterval(() => { const l = D.live; if (l && l.cpu >= 0) $('#cpuNow').textContent = Math.round(l.cpu) + ' %'; }, 1500); D.cleanup.push(() => clearInterval(iv));
}

/* ---------- SOFTWARE ---------- */
function pSoftware() {
  const s = D.soft;
  if (!s) { main.innerHTML = '<div class="page"><div class="head"><div class="stack"><span class="eyebrow">Software</span><h1>Revisando Windows…</h1></div></div>' + loadingBlock('Leyendo activación, actualizaciones, seguridad, errores y controladores. Puede tardar hasta un minuto.') + '</div>'; return; }
  const A = analyze(), os = osInfo();
  const groups = ['Windows', 'Seguridad', 'Estabilidad', 'Controladores', 'Rendimiento'];
  const items = A.items.filter(x => groups.includes(x.area));
  const lst = (title, a, f, empty) => '<div class="card"><h2 style="font-size:16px">' + title + '</h2>' + (arr(a).length ? arr(a).map(f).join('') : '<span class="mut">' + (empty || 'Nada que reportar') + '</span>') + '</div>';
  main.innerHTML = '<div class="page fade"><div class="head"><div class="stack"><span class="eyebrow">Software</span><h1>' + esc(os.caption) + '</h1><span class="mono mut" style="font-size:12.5px">' + esc((os.display || '') + ' · compilación ' + os.build + ' · instalado ' + fmtDate(os.installed)) + '</span></div><button class="b sec" id="ref">' + icon('refresh', null, 16) + 'Volver a revisar</button></div>' +
    groups.map(g => { const it = items.filter(x => x.area === g); return it.length ? '<h3>' + g + '<span>' + it.filter(x => x.sev !== 'ok').length + ' por revisar</span></h3><div class="list">' + it.map(issueRow).join('') + '</div>' : ''; }).join('') +
    '<h3>Detalle</h3><div class="cards">' +
    lst('Dispositivos con problemas', arr(s.badDevices), d => '<div class="row" style="padding:6px 0"><span class="dot ' + (d.code === 22 ? '' : 'warn') + '"></span><span class="grow">' + esc(d.name || 'Dispositivo desconocido') + '</span><span class="pill">' + (d.code === 28 ? 'Sin controlador' : d.code === 22 ? 'Deshabilitado' : 'Código ' + d.code) + '</span></div>', 'Todos los dispositivos funcionan') +
    lst('Programas que inician con Windows (' + arr(s.startup).length + ')', arr(s.startup), x => '<div class="row" style="padding:5px 0"><span class="grow">' + esc(x.name) + '</span></div>') +
    lst('Errores del sistema más frecuentes (7 días)', arr(s.topErrors), e => '<div class="row" style="padding:5px 0"><span class="grow">' + esc(e.src.replace('Microsoft-Windows-', '')) + '</span><span class="pill">' + e.n + '</span></div>', 'Sin errores críticos') +
    lst('Apps que se cerraron solas (7 días)', arr(s.topCrashes), e => '<div class="row" style="padding:5px 0"><span class="grow">' + esc(e.app) + '</span><span class="pill">' + e.n + '</span></div>', 'Ninguna') +
    '<div class="card"><h2 style="font-size:16px">Más datos</h2><div class="kv">' +
      [['Programas instalados', s.programs], ['Plan de energía', s.powerPlan], ['Encendido desde', fmtDate(s.os && s.os.boot)], ['Apagados inesperados (30 d)', s.unexpected], ['Pantallazos azules (30 d)', s.bsod], ['Errores de hardware WHEA (30 d)', s.whea], ['Puntos de restauración', s.restorePoints], ['Sensor de almacenamiento', s.storageSense ? 'Activado' : 'Desactivado']].map(r => '<span>' + r[0] + '</span><span>' + esc(r[1] == null ? '—' : r[1]) + '</span>').join('') +
    '</div></div></div></div>';
  bindActs();
  $('#ref').onclick = async () => { D.soft = null; go('software'); D.soft = await api('/api/software?refresh=1').catch(() => null); if (D.page === 'software') go('software'); };
}

/* ---------- motor de pruebas interactivas ---------- */
let WIZ = null; // { list, i } durante el diagnóstico completo

function step(t, html, setup, o) {
  o = o || {};
  return new Promise(res => {
    const segs = WIZ ? '<div class="segs">' + WIZ.list.map((x, k) => { const r = D.tests[x.id]; return '<i class="' + (k === WIZ.i ? 'cur' : r ? (r.st === 'ok' ? 'ok' : r.st === 'bad' ? 'bad' : 'skip') : '') + '"></i>'; }).join('') + '</div>' : '';
    main.innerHTML = '<div class="page fade" style="max-width:900px">' +
      '<div class="row" style="margin-bottom:6px"><button class="b sec sm" id="tback">' + icon(WIZ ? 'close' : 'back', null, 15) + (WIZ ? 'Salir' : 'Volver') + '</button><span class="grow"></span>' + (WIZ ? '<span class="mono mut" style="font-size:12px">PRUEBA ' + (WIZ.i + 1) + ' / ' + WIZ.list.length + '</span>' : '') + '</div>' + segs +
      '<div class="stack" style="display:flex;flex-direction:column;gap:6px;margin-bottom:16px"><span class="eyebrow">Prueba de hardware</span><h1>' + t.name + '</h1></div>' +
      '<div id="tb">' + html + '</div><div id="vd"></div>' +
      '<div class="acts" id="man"><button class="b bad" data-r="bad">' + icon('close', '#F87171', 17, 2.4) + (o.labels ? o.labels[1] : 'No funciona') + '</button><button class="b ok" data-r="ok">' + icon('check', '#15803D', 17, 2.6) + (o.labels ? o.labels[0] : 'Funciona') + '</button><span class="grow"></span><button class="lnk" data-r="skip">' + (WIZ ? 'Omitir' : 'Cancelar') + '</button></div></div>';
    let done = false, clean = null;
    const fin = (st, note) => { if (done) return; done = true; try { clean && clean(); } catch (e) {} res(st ? { st, note: note || '' } : null); };
    main.querySelectorAll('[data-r]').forEach(b => b.onclick = () => fin(b.dataset.r === 'skip' ? (WIZ ? 'skip' : null) : b.dataset.r));
    $('#tback').onclick = () => { if (WIZ) WIZ.abort = true; fin(null); };
    if (setup) { try { clean = setup(fin) || null; } catch (e) { console.error(e); } }
  });
}
const autoOk = (fin, note, ms) => setTimeout(() => fin('ok', note), ms || 700);

/* Teclado */
const KROWS = [
  ['Escape', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'Delete'],
  ['Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal', 'Backspace'],
  ['Tab', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight', 'Backslash'],
  ['CapsLock', 'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote', 'Enter'],
  ['ShiftLeft', 'IntlBackslash', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash', 'ShiftRight'],
  ['ControlLeft', 'MetaLeft', 'AltLeft', 'Space', 'AltRight', 'ControlRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'ArrowRight']
];
const KLAB = { Escape: 'Esc', Delete: 'Supr', Backquote: '|', Minus: "'", Equal: '¿', Backspace: '⌫', Tab: 'Tab', BracketLeft: '´', BracketRight: '+', Backslash: '}', CapsLock: 'Mayús', Semicolon: 'Ñ', Quote: '{', Enter: 'Enter', ShiftLeft: 'Shift', IntlBackslash: '<', Comma: ',', Period: '.', Slash: '-', ShiftRight: 'Shift', ControlLeft: 'Ctrl', MetaLeft: 'Win', AltLeft: 'Alt', Space: 'Espacio', AltRight: 'AltGr', ControlRight: 'Ctrl', ArrowLeft: '←', ArrowUp: '↑', ArrowDown: '↓', ArrowRight: '→' };
const KW = { Backspace: 2, Tab: 1.5, Backslash: 1.5, CapsLock: 1.8, Enter: 2.2, ShiftLeft: 1.3, ShiftRight: 2.6, Space: 6, ControlLeft: 1.3, ControlRight: 1.3 };
function tKeyboard(t) {
  const lab = c => KLAB[c] || c.replace(/^Key|^Digit/, '');
  const total = KROWS.flat().length;
  return step(t, '<p>Presiona <b>todas las teclas</b> una por una. Cada tecla que responda se pinta de naranja. Las teclas que no se pinten pueden estar dañadas.</p>' +
    '<div class="row" style="margin:12px 0"><span class="mono" id="kc">0 / ' + total + '</span><span class="grow"></span><span class="mut" id="kl">Última tecla: —</span></div>' +
    '<div class="kb">' + KROWS.map(r => '<div class="kr">' + r.map(c => '<div class="k" data-k="' + c + '" style="flex-grow:' + (KW[c] || 1) + '">' + esc(lab(c)) + '</div>').join('') + '</div>').join('') + '</div>' +
    '<p class="mut" style="margin-top:10px;font-size:12.5px">Algunas teclas (Fn, Impr Pant, multimedia) las maneja directamente Windows y no se pueden detectar aquí.</p>', fin => {
    const seen = new Set();
    const h = e => {
      e.preventDefault();
      const el = main.querySelector('[data-k="' + e.code + '"]');
      $('#kl').textContent = 'Última tecla: ' + (e.key === ' ' ? 'Espacio' : e.key) + ' (' + e.code + ')';
      main.querySelectorAll('.k.now').forEach(x => x.classList.remove('now'));
      if (el) { el.classList.add('on', 'now'); if (e.key.length === 1 && e.key !== ' ') el.textContent = e.key.toUpperCase(); seen.add(e.code); }
      $('#kc').textContent = seen.size + ' / ' + total;
      if (seen.size === total) autoOk(fin, 'Todas las teclas responden');
    };
    window.addEventListener('keydown', h, true);
    return () => window.removeEventListener('keydown', h, true);
  }, { labels: ['Todas funcionan', 'Hay teclas dañadas'] });
}

/* Pantalla */
function tScreen(t) {
  return step(t, '<p>Se mostrará la pantalla completa en varios colores. Haz clic para avanzar. Busca <b>píxeles muertos, manchas, líneas, zonas amarillentas o con sombras</b>.</p><button class="b" id="go">' + icon('screen', '#140A02', 17) + 'Iniciar prueba de pantalla</button>', () => {
    let ov = null;
    $('#go').onclick = () => {
      const C = [['#ff0000', 'Rojo'], ['#00ff00', 'Verde'], ['#0000ff', 'Azul'], ['#ffffff', 'Blanco'], ['#000000', 'Negro'], ['#7f7f7f', 'Gris'], ['linear-gradient(90deg,#000,#fff)', 'Degradado'], ['repeating-conic-gradient(#000 0 25%,#fff 0 50%) 0 0/4px 4px', 'Cuadrícula fina']];
      let i = 0;
      ov = document.createElement('div'); ov.className = 'ov';
      const paint = () => { ov.style.background = C[i][0]; ov.style.color = /fff|00ff00|gradient/.test(C[i][0]) ? '#333' : '#999'; ov.textContent = C[i][1] + ' · ' + (i + 1) + '/' + C.length + ' · clic para seguir · Esc para salir'; };
      paint(); document.body.appendChild(ov);
      document.documentElement.requestFullscreen && document.documentElement.requestFullscreen().catch(() => {});
      const end = () => { if (ov) { ov.remove(); ov = null; } if (document.fullscreenElement) document.exitFullscreen().catch(() => {}); window.removeEventListener('keydown', k); };
      const k = e => { if (e.key === 'Escape') end(); };
      window.addEventListener('keydown', k);
      ov.onclick = () => { if (++i >= C.length) end(); else paint(); };
    };
    return () => { if (ov) ov.remove(); };
  }, { labels: ['Se ve perfecta', 'Vi defectos'] });
}

/* Altavoces */
let AC = null;
function tone(pan, kind) {
  AC = AC || new (window.AudioContext || window.webkitAudioContext)(); AC.resume();
  const o = AC.createOscillator(), g = AC.createGain(), p = AC.createStereoPanner ? AC.createStereoPanner() : null;
  const t0 = AC.currentTime;
  if (kind === 'sweep') { o.frequency.setValueAtTime(60, t0); o.frequency.exponentialRampToValueAtTime(12000, t0 + 5); g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(0.35, t0 + 0.1); g.gain.setValueAtTime(0.35, t0 + 4.8); g.gain.exponentialRampToValueAtTime(0.0001, t0 + 5); o.start(t0); o.stop(t0 + 5.05); }
  else { [523, 659, 784, 1047].forEach((f, i) => o.frequency.setValueAtTime(f, t0 + i * 0.25)); g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(0.5, t0 + 0.03); g.gain.setValueAtTime(0.5, t0 + 0.95); g.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.05); o.start(t0); o.stop(t0 + 1.1); }
  if (p) { p.pan.value = pan; o.connect(g); g.connect(p); p.connect(AC.destination); } else { o.connect(g); g.connect(AC.destination); }
}
function tSpeakers(t) {
  return step(t, '<p>Sube el volumen. Cada botón suena por un lado distinto: el sonido debe salir <b>solo por ese lado</b>, claro y sin distorsión. El barrido recorre de graves a agudos: escucha si algo vibra o zumba.</p>' +
    '<div class="row" style="gap:10px;flex-wrap:wrap;margin-top:12px"><button class="b sec" id="sL">' + icon('audio', null, 16) + 'Izquierdo</button><button class="b sec" id="sR">Derecho' + icon('audio', null, 16) + '</button><button class="b sec" id="sB">Ambos</button><button class="b sec" id="sS">Barrido de frecuencias</button><button class="b sec sm" data-run="sound">Ajustes de sonido</button></div>', () => {
    $('#sL').onclick = () => tone(-1); $('#sR').onclick = () => tone(1); $('#sB').onclick = () => tone(0); $('#sS').onclick = () => tone(0, 'sweep');
    bindActs($q('#tb'));
  }, { labels: ['Se escuchan bien', 'Falla algún lado'] });
}

/* Micrófono */
function tMic(t) {
  return step(t, '<p>Activa el micrófono y habla o aplaude. Si la barra se mueve, la prueba pasa sola. Si Windows bloquea el acceso, revisa los permisos de privacidad.</p><button class="b" id="go">' + icon('mic', '#140A02', 17) + 'Activar micrófono</button><div class="meter"><i id="mt"></i></div><p class="mut" id="mn" style="margin-top:10px"></p><button class="b sec sm" data-run="privacymic" style="margin-top:6px">Privacidad del micrófono</button>', fin => {
    let stream = null, ctx = null, raf = 0, hits = 0;
    bindActs($q('#tb'));
    $('#go').onclick = async () => {
      try { stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } }); }
      catch (e) { $('#mn').textContent = e.name === 'NotAllowedError' ? 'Permiso denegado. Permite el micrófono e inténtalo de nuevo.' : 'No se encontró micrófono.'; return; }
      $('#go').disabled = true; $('#go').textContent = 'Escuchando…';
      const tr = stream.getAudioTracks()[0]; $('#mn').textContent = 'Dispositivo: ' + (tr && tr.label || 'micrófono');
      ctx = new AudioContext(); const an = ctx.createAnalyser(); an.fftSize = 1024; ctx.createMediaStreamSource(stream).connect(an);
      const buf = new Uint8Array(an.fftSize);
      const loop = () => { an.getByteTimeDomainData(buf); let s = 0; for (let i = 0; i < buf.length; i++) { const v = (buf[i] - 128) / 128; s += v * v; } const l = Math.min(1, Math.sqrt(s / buf.length) * 6); $('#mt').style.width = l * 100 + '%'; if (l > 0.22) hits++; if (hits > 15) return autoOk(fin, 'Capta sonido · ' + (tr && tr.label || '')); raf = requestAnimationFrame(loop); };
      loop();
    };
    return () => { cancelAnimationFrame(raf); if (stream) stream.getTracks().forEach(x => x.stop()); if (ctx) ctx.close().catch(() => {}); };
  });
}

/* Cámara */
function tCamera(t) {
  return step(t, '<p>Revisa que la imagen sea <b>nítida, con buena luz y colores</b>, sin manchas ni rayas.</p><div class="row" style="gap:10px"><button class="b" id="go">' + icon('cam', '#140A02', 17) + 'Abrir cámara</button><button class="b sec sm" data-run="privacycam">Privacidad de la cámara</button></div><p class="mut" id="cn" style="margin-top:10px"></p><video id="cv" playsinline muted autoplay style="display:none"></video>', () => {
    let stream = null;
    bindActs($q('#tb'));
    $('#go').onclick = async () => {
      try { stream = await navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 1920 } }, audio: false }); }
      catch (e) { $('#cn').textContent = e.name === 'NotAllowedError' ? 'Permiso denegado o la cámara está apagada (algunos portátiles tienen un interruptor o tapa física).' : 'No se encontró cámara o la está usando otra app.'; return; }
      const v = $q('#cv'); v.srcObject = stream; v.style.display = 'block'; $('#go').style.display = 'none';
      const s = stream.getVideoTracks()[0].getSettings(); $('#cn').textContent = (stream.getVideoTracks()[0].label || 'Cámara') + (s.width ? ' · ' + s.width + '×' + s.height : '');
    };
    return () => { if (stream) stream.getTracks().forEach(x => x.stop()); };
  });
}

/* Mouse / touchpad */
function tMouse(t) {
  return step(t, '<p>Dentro del recuadro: haz <b>clic izquierdo, clic derecho, doble clic</b> y mueve la <b>rueda o el desplazamiento de dos dedos</b> hacia arriba y abajo.</p><div class="pad" id="pad">Usa el mouse o touchpad aquí</div><div class="pills">' +
    [['l', 'Clic izquierdo'], ['r', 'Clic derecho'], ['d', 'Doble clic'], ['m', 'Clic central'], ['u', 'Desplazar arriba'], ['w', 'Desplazar abajo']].map(x => '<div class="p" id="m' + x[0] + '">' + x[1] + '</div>').join('') + '</div><p class="mut" style="margin-top:8px;font-size:12.5px">El clic central es opcional: muchos touchpads no lo tienen.</p>', fin => {
    const pad = $q('#pad'), s = {};
    const mark = k => { s[k] = 1; $('#m' + k).classList.add('on'); if (s.l && s.r && s.d && s.u && s.w) autoOk(fin, 'Clics y desplazamiento responden' + (s.m ? ' (incluido clic central)' : ''), 900); };
    pad.addEventListener('mousedown', e => { if (e.button === 0) mark('l'); if (e.button === 2) mark('r'); if (e.button === 1) { e.preventDefault(); mark('m'); } });
    pad.addEventListener('dblclick', () => mark('d'));
    pad.addEventListener('contextmenu', e => e.preventDefault());
    pad.addEventListener('wheel', e => { e.preventDefault(); mark(e.deltaY < 0 ? 'u' : 'w'); }, { passive: false });
    pad.addEventListener('mousemove', e => { pad.textContent = 'x ' + e.offsetX + ' · y ' + e.offsetY; });
  });
}

/* USB */
function tUSB(t) {
  return step(t, '<p>Conecta una memoria USB, mouse o celular <b>en cada puerto, uno por uno</b>. Cada vez que Windows detecte algo nuevo aparecerá en la lista.</p><div class="card" style="margin-top:12px"><div class="row"><b class="grow">Detectados</b><span class="spin sm" id="us"></span></div><div id="ul" class="mut" style="margin-top:8px">Esperando dispositivos…</div></div>', fin => {
    let base = null, alive = true; const found = [];
    const poll = async () => {
      while (alive) {
        try {
          const d = arr(await api('/api/usb'));
          const ids = new Set(d.map(x => x.id));
          if (base === null) base = ids;
          else d.forEach(x => { if (!base.has(x.id) && !found.some(f => f.id === x.id)) { found.push({ id: x.id, name: x.name, at: new Date() }); } });
          if (base) base = new Set([...base].filter(id => ids.has(id)).concat(found.map(f => f.id)));
          if (found.length) $('#ul').innerHTML = found.map((f, k) => '<div class="row" style="padding:6px 0;color:var(--txt)"><span class="dot ok"></span><span class="grow">' + esc(f.name || f.id) + '</span><span class="mono mut" style="font-size:12px">conexión ' + (k + 1) + ' · ' + f.at.toLocaleTimeString('es-CO') + '</span></div>').join('');
        } catch (e) {}
        await sleep(2500);
      }
    };
    poll();
    const okb = main.querySelector('[data-r="ok"]');
    okb.onclick = () => fin('ok', found.length ? found.length + ' conexión(es) detectada(s)' : 'Confirmado por el usuario');
    return () => { alive = false; };
  }, { labels: ['Todos los puertos funcionan', 'Algún puerto falla'] });
}

const TESTS = [
  { id: 'kb', name: 'Teclado', desc: 'Todas las teclas', ico: 'kb', run: tKeyboard },
  { id: 'screen', name: 'Pantalla', desc: 'Píxeles y colores', ico: 'screen', run: tScreen },
  { id: 'spk', name: 'Altavoces', desc: 'Izquierdo, derecho y barrido', ico: 'audio', run: tSpeakers },
  { id: 'mic', name: 'Micrófono', desc: 'Nivel de captura', ico: 'mic', run: tMic },
  { id: 'cam', name: 'Cámara web', desc: 'Imagen y resolución', ico: 'cam', run: tCamera },
  { id: 'mouse', name: 'Mouse y touchpad', desc: 'Clics y desplazamiento', ico: 'mouse', run: tMouse },
  { id: 'usb', name: 'Puertos USB', desc: 'Detección de conexión', ico: 'usb', run: tUSB }
];

/* ---------- PRUEBAS ---------- */
function pPruebas() {
  const LBL = { ok: ['ok', 'Funciona'], bad: ['bad', 'Falla'], skip: ['', 'Omitida'] };
  main.innerHTML = '<div class="page fade"><div class="head"><div class="stack"><span class="eyebrow">Pruebas interactivas</span><h1>Prueba cada componente</h1><span class="mut">Revisa físicamente teclado, pantalla, audio, cámara, mouse y puertos.</span></div><button class="b" id="all">Hacer todas</button></div>' +
    '<div class="tgrid">' + TESTS.map(x => { const r = D.tests[x.id], l = r ? LBL[r.st] : null; return '<button class="tcard" data-t="' + x.id + '"><span class="row"><span class="ic">' + icon(x.ico, '#FF9A4D') + '</span><span class="grow"></span>' + (l ? '<span class="pill ' + l[0] + '">' + l[1] + '</span>' : '<span class="pill or">Probar</span>') + '</span><b>' + x.name + '</b><span>' + (r && r.note ? esc(r.note) : x.desc) + '</span></button>'; }).join('') + '</div></div>';
  main.querySelectorAll('[data-t]').forEach(b => b.onclick = async () => { const t = TESTS.find(x => x.id === b.dataset.t); const r = await t.run(t); if (r) D.tests[t.id] = r; go('pruebas'); });
  $('#all').onclick = () => runTests().then(() => go('pruebas'));
}
async function runTests() {
  WIZ = { list: TESTS, i: 0 };
  for (let i = 0; i < TESTS.length; i++) {
    WIZ.i = i;
    const r = await TESTS[i].run(TESTS[i]);
    if (WIZ.abort) break;
    if (r) D.tests[TESTS[i].id] = r;
  }
  const aborted = WIZ.abort; WIZ = null;
  return !aborted;
}

/* ---------- RENDIMIENTO ---------- */
const BENCH = {
  cpu: { name: 'Procesador', ico: 'chip', desc: 'Calcula durante 11 segundos con un núcleo y con todos, y mide si pierde velocidad por calor.', secs: 12 },
  ram: { name: 'Memoria RAM', ico: 'ram', desc: 'Escribe y verifica patrones en una parte de la memoria libre para detectar errores.', secs: 8 },
  disk: { name: 'Disco', ico: 'disk', desc: 'Escribe y lee 512 MB sin la caché de Windows y mide accesos aleatorios.', secs: 15 },
  net: { name: 'Internet', ico: 'globe', desc: 'Latencia, DNS y velocidad de descarga.', secs: 14 }
};
function benchResult(k) {
  const r = D.bench[k]; if (!r) return '';
  if (r.err) return '<div class="verdict bad"><span class="vi">' + icon('close', '#2A0606', 14, 3) + '</span><span><b>No se pudo completar</b><small>' + esc(r.err) + '</small></span></div>';
  const tile = (l, v) => '<div class="tile"><span>' + l + '</span><b>' + v + '</b></div>';
  const verdict = (sev, t, d) => '<div class="verdict ' + sev + '"><span class="vi">' + icon(sev === 'ok' ? 'check' : sev === 'warn' ? 'warn' : 'close', '#140A02', 14, 3) + '</span><span><b>' + t + '</b><small>' + d + '</small></span></div>';
  if (k === 'cpu') return '<div class="res">' + tile('Un núcleo', r.single + ' MB/s') + tile('Todos los núcleos (' + r.threads + ')', r.multi + ' MB/s') + tile('Escalado', r.scaling + '×') + tile('Pérdida bajo carga', Math.max(0, r.drop) + ' %') + '</div>' +
    (r.drop > 25 ? verdict('warn', 'Pierde velocidad al calentarse', 'Bajó ' + Math.round(r.drop) + ' % en 8 segundos: revisar ventilación y pasta térmica.') : verdict('ok', 'Rendimiento estable', 'Mantiene la velocidad bajo carga continua.'));
  if (k === 'ram') return '<div class="res">' + tile('Escritura', r.write + ' GB/s') + tile('Lectura', r.read + ' GB/s') + tile('Memoria probada', r.mb + ' MB') + tile('Errores', r.errors) + '</div>' +
    (r.errors > 0 ? verdict('bad', 'Se encontraron errores', 'La RAM puede estar dañada. Ejecuta el Diagnóstico de memoria de Windows (mdsched) para confirmarlo.') : verdict('ok', 'Sin errores', 'La memoria probada responde correctamente.'));
  if (k === 'disk') { const cls = r.read >= 1500 ? ['ok', 'SSD NVMe rápido'] : r.read >= 400 ? ['ok', 'Velocidad de SSD'] : r.read >= 150 ? ['warn', 'SSD lento o disco híbrido'] : ['bad', 'Velocidad de disco mecánico o con problemas'];
    return '<div class="res">' + tile('Lectura secuencial', Math.round(r.read) + ' MB/s') + tile('Escritura secuencial', Math.round(r.write) + ' MB/s') + tile('Lecturas aleatorias 4K', r.iops.toLocaleString('es-CO') + ' IOPS') + tile('Latencia', r.latMs + ' ms') + '</div>' + verdict(cls[0], cls[1], 'Probado en ' + esc(r.dir)); }
  if (k === 'net') return '<div class="res">' + tile('Internet', r.internet ? 'Conectado' : 'Sin conexión') + tile('Latencia', r.pingMs != null ? r.pingMs + ' ms' : '—') + tile('DNS', r.dns ? r.dnsMs + ' ms' : 'Falla') + tile('Descarga', r.downMbps != null ? r.downMbps + ' Mbps' : '—') + '</div>' +
    (!r.internet ? verdict('bad', 'Sin internet', 'Revisa el WiFi o el cable.') : r.pingMs > 150 ? verdict('warn', 'Conexión lenta', 'Latencia alta.') : verdict('ok', 'Conexión correcta', r.jitterMs != null ? 'Variación ' + r.jitterMs + ' ms' : ''));
}
async function runBench(k) {
  const el = $q('#br-' + k), b = $q('#bb-' + k);
  if (b) b.disabled = true;
  if (el) el.innerHTML = '<div class="row" style="gap:10px;margin-top:6px"><span class="spin sm"></span><span class="mut">Midiendo… unos ' + BENCH[k].secs + ' segundos</span></div>';
  try { D.bench[k] = await api('/api/bench/' + k); } catch (e) { D.bench[k] = { err: 'Error de comunicación' }; }
  if (b) { b.disabled = false; b.textContent = 'Repetir'; }
  if ($q('#br-' + k)) $q('#br-' + k).innerHTML = benchResult(k);
  renderNav();
}
function pRendimiento() {
  main.innerHTML = '<div class="page fade"><div class="head"><div class="stack"><span class="eyebrow">Rendimiento</span><h1>Pruebas de rendimiento</h1><span class="mut">Cierra otros programas pesados mientras se ejecutan para obtener datos confiables.</span></div><button class="b" id="all">Ejecutar todas</button></div>' +
    '<div class="cards">' + Object.keys(BENCH).map(k => '<div class="card bench"><h2><span class="ic">' + icon(BENCH[k].ico, '#FF9A4D', 18) + '</span>' + BENCH[k].name + '<span class="grow"></span><button class="b sec sm" id="bb-' + k + '">' + (D.bench[k] ? 'Repetir' : 'Ejecutar') + '</button></h2><p class="mut">' + BENCH[k].desc + '</p><div id="br-' + k + '">' + benchResult(k) + '</div></div>').join('') + '</div></div>';
  Object.keys(BENCH).forEach(k => $('#bb-' + k).onclick = () => runBench(k));
  $('#all').onclick = async () => { $('#all').disabled = true; for (const k of Object.keys(BENCH)) await runBench(k); $('#all').disabled = false; };
}

/* ---------- OPTIMIZAR ---------- */
const TOOLS = [
  ['startup', 'Programas de inicio', 'Desactiva los que no necesitas al encender', 'bolt'],
  ['flushdns', 'Limpiar caché DNS', 'Soluciona páginas que no cargan', 'globe'],
  ['sfc', 'Reparar archivos de Windows', 'SFC: revisa y repara archivos del sistema (admin)', 'wrench'],
  ['dism', 'Reparar imagen de Windows', 'DISM: repara el almacén de componentes (admin)', 'wrench'],
  ['chkdsk', 'Revisar el disco', 'CHKDSK: busca errores del sistema de archivos (admin)', 'disk'],
  ['optimize', 'Optimizar unidades', 'Desfragmenta HDD y aplica TRIM a SSD', 'disk'],
  ['highperf', 'Plan de alto rendimiento', 'Prioriza la velocidad sobre el consumo', 'gauge'],
  ['balanced', 'Plan equilibrado', 'Vuelve al plan recomendado por Windows', 'gauge'],
  ['restorepoint', 'Crear punto de restauración', 'Para deshacer cambios si algo sale mal (admin)', 'shield'],
  ['netreset', 'Restablecer la red', 'Reinicia Winsock, IP y DNS (admin)', 'wifi'],
  ['update', 'Windows Update', 'Buscar e instalar actualizaciones', 'refresh'],
  ['storage', 'Sensor de almacenamiento', 'Limpieza automática de Windows', 'trash'],
  ['apps', 'Desinstalar programas', 'Aplicaciones instaladas', 'trash'],
  ['devmgr', 'Administrador de dispositivos', 'Controladores y hardware', 'chip'],
  ['reliability', 'Monitor de confiabilidad', 'Historial de fallos de Windows', 'doc']
];
function pOptimizar() {
  main.innerHTML = '<div class="page fade"><div class="head"><div class="stack"><span class="eyebrow">Optimizar</span><h1>Limpieza y mantenimiento</h1></div></div>' +
    '<div class="card"><div class="row"><h2 class="grow">Limpieza de archivos</h2><button class="b sec sm" id="scan">' + icon('refresh', null, 15) + 'Analizar</button></div><div id="cl" style="margin-top:12px">' + loadingBlock('Calculando espacio recuperable…') + '</div></div>' +
    '<h3>Herramientas</h3><div class="cards3">' + TOOLS.map(x => '<button class="tcard" data-tool="' + x[0] + '"><span class="ic">' + icon(x[3], '#FF9A4D') + '</span><b>' + x[1] + '</b><span>' + x[2] + '</span></button>').join('') + '</div></div>';
  main.querySelectorAll('[data-tool]').forEach(b => b.onclick = async () => { b.disabled = true; await action(b.dataset.tool); b.disabled = false; });
  $('#scan').onclick = scanClean;
  if (D.clean) drawClean(); else scanClean();
}
async function scanClean() {
  $('#cl').innerHTML = loadingBlock('Calculando espacio recuperable…');
  try { D.clean = await api('/api/clean/scan'); } catch (e) { $('#cl').innerHTML = '<p class="mut">No se pudo analizar.</p>'; return; }
  drawClean();
}
function drawClean(result) {
  const c = D.clean; if (!c || !$q('#cl')) return;
  const cats = arr(c.cats), total = cats.filter(x => !x.locked).reduce((a, x) => a + x.bytes, 0);
  $('#cl').innerHTML = (result ? '<div class="verdict ok" style="margin:0 0 12px"><span class="vi">' + icon('check', '#06210F', 14, 3) + '</span><span><b>Se liberaron ' + fmtB(result.bytes) + '</b><small>' + result.files + ' archivos eliminados. Algunos pueden quedar si estaban en uso.</small></span></div>' : '') +
    '<div class="row" style="margin-bottom:10px"><span class="grow"><span class="mut" style="font-size:12.5px">Se puede liberar</span><br><b style="font-family:var(--fb);font-size:30px">' + fmtB(total) + '</b></span><button class="b" id="doclean">' + icon('trash', '#140A02', 16) + 'Limpiar seleccionados</button></div>' +
    '<div class="list">' + cats.map(x => '<label class="check"><input type="checkbox" data-c="' + x.id + '"' + (x.locked || !x.bytes ? ' disabled' : x.id === 'browsers' ? '' : ' checked') + '><span class="grow"><b style="font-weight:600">' + esc(x.label) + '</b><br><span class="mut" style="font-size:12.5px">' + esc(x.desc) + (x.locked ? ' · requiere ejecutar como administrador' : '') + '</span></span><span class="mono" style="text-align:right;white-space:nowrap">' + fmtB(x.bytes) + '<br><span class="mut" style="font-size:11.5px">' + x.files + ' archivos</span></span></label>').join('') + '</div>' +
    '<p class="mut" style="margin-top:10px;font-size:12.5px">Cierra los navegadores antes de limpiar su caché. No se borran documentos, fotos ni contraseñas.</p>';
  $('#doclean').onclick = async () => {
    const sel = [...main.querySelectorAll('[data-c]:checked')].map(x => x.dataset.c);
    if (!sel.length) return toast('Selecciona al menos una categoría');
    if (!confirm('¿Eliminar los archivos seleccionados? No se puede deshacer.')) return;
    $('#doclean').disabled = true; $('#doclean').innerHTML = '<span class="spin sm"></span> Limpiando…';
    let r; try { r = await api('/api/clean/run', { cats: sel }); } catch (e) { r = { bytes: 0, files: 0 }; }
    try { D.clean = await api('/api/clean/scan'); } catch (e) {}
    drawClean(r);
  };
}

/* ---------- INFORME ---------- */
function reportText() {
  const A = analyze(), dv = device(), os = osInfo(), i = D.info || {}, cpu = arr(i.cpu)[0] || {};
  const L = ['INFORME DE DIAGNÓSTICO · MiVibra PC', 'Fecha: ' + new Date().toLocaleString('es-CO'), '',
    'Equipo: ' + dv.maker + ' ' + dv.model + (dv.serial ? ' (S/N ' + dv.serial + ')' : ''), 'Windows: ' + os.caption + ' ' + (os.display || '') + ' (' + os.build + ')',
    'Procesador: ' + clean(cpu.name), 'RAM: ' + ramGB((i.cs || {}).ram || 0), 'Almacenamiento: ' + arr(i.disks).map(d => fmtDisk(d.size) + ' ' + mediaOf(d)).join(' + '),
    'Gráficos: ' + arr(i.gpu).map(g => clean(g.name)).join(' + '), '', 'RESULTADO: Categoría ' + A.grade + ' · ' + A.score + '/100 · ' + GTEXT[A.grade], ''];
  const sym = { bad: '✘', warn: '!', ok: '✔', info: '·' };
  A.items.forEach(x => L.push(sym[x.sev] + ' [' + x.area + '] ' + x.title + (x.detail ? ' — ' + x.detail : '')));
  return L.join('\n');
}
function pInforme() {
  if (!D.info) { main.innerHTML = '<div class="page">' + loadingBlock('Esperando los datos del equipo…') + '</div>'; return; }
  const A = analyze(), dv = device(), os = osInfo(), i = D.info, cpu = arr(i.cpu)[0] || {};
  const missing = [!D.soft && 'revisión de Windows', !Object.keys(D.bench).length && 'pruebas de rendimiento', !Object.keys(D.tests).length && 'pruebas interactivas'].filter(Boolean);
  main.innerHTML = '<div class="page fade"><div class="head"><div class="stack"><span class="eyebrow">Informe · ' + new Date().toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' }) + '</span><h1>' + esc(dv.maker + ' ' + dv.model) + '</h1><span class="mono mut" style="font-size:12.5px">' + esc([os.caption, dv.serial ? 'S/N ' + dv.serial : ''].filter(Boolean).join(' · ')) + '</span></div>' +
    '<div class="row noprint" style="gap:8px"><button class="b sec" id="cp">' + icon('copy', null, 16) + 'Copiar</button><button class="b sec" id="pr">' + icon('print', null, 16) + 'Imprimir / PDF</button><button class="b" id="sv">' + icon('dl', '#140A02', 16) + 'Guardar</button></div></div>' +
    (missing.length ? '<div class="verdict warn noprint" style="margin:0 0 14px"><span class="vi">' + icon('warn', '#2A1A02', 14, 2.6) + '</span><span><b>Informe parcial</b><small>Falta: ' + missing.join(', ') + '. </small></span><span class="grow"></span><button class="b sm" id="runall">Completar diagnóstico</button></div>' : '') +
    '<div class="card" style="display:flex;gap:24px;align-items:center">' + ring(A.score, 140, 11, GCOL[A.grade], '<span class="big" style="font-size:50px;color:' + GCOL[A.grade] + '">' + A.grade + '</span><span class="mono mut" style="font-size:12px">' + A.score + '/100</span>', 'Puntaje') +
    '<div class="grow"><h2 style="font-size:26px;margin-bottom:8px">' + GTEXT[A.grade] + '</h2><div class="row" style="gap:8px;margin-bottom:12px"><span class="pill bad">' + A.nb + ' problemas</span><span class="pill warn">' + A.nw + ' avisos</span><span class="pill ok">' + A.nok + ' correctos</span></div>' +
    '<div class="kv" style="max-width:560px">' + [['Procesador', clean(cpu.name)], ['RAM', ramGB((i.cs || {}).ram || 0)], ['Almacenamiento', arr(i.disks).map(d => fmtDisk(d.size) + ' ' + mediaOf(d)).join(' + ')], ['Gráficos', arr(i.gpu).map(g => clean(g.name)).join(' + ')], ['Batería', battery() ? (battery().health != null ? battery().health + ' % de salud' : 'Sin datos') : 'No aplica']].map(r => '<span>' + r[0] + '</span><span>' + esc(r[1]) + '</span>').join('') + '</div></div></div>' +
    ['bad', 'warn', 'ok'].map(sv => { const it = A.items.filter(x => x.sev === sv); return it.length ? '<h3>' + { bad: 'Problemas', warn: 'Avisos', ok: 'Correcto' }[sv] + '<span>' + it.length + '</span></h3><div class="list">' + it.map(issueRow).join('') + '</div>' : ''; }).join('') +
    '<p class="mut" style="margin-top:22px;font-size:12px">Generado por MiVibra PC ' + esc(D.version) + '. Diagnóstico orientativo: confirma las fallas físicas con un técnico.</p></div>';
  bindActs();
  $('#cp').onclick = () => navigator.clipboard.writeText(reportText()).then(() => toast('Informe copiado'), () => toast('No se pudo copiar'));
  $('#pr').onclick = () => window.print();
  $('#sv').onclick = saveReport;
  const ra = $q('#runall'); if (ra) ra.onclick = runAll;
}
function saveReport() {
  const page = main.querySelector('.page').cloneNode(true);
  page.querySelectorAll('.noprint,button').forEach(x => x.remove());
  const css = [...document.querySelectorAll('style')].map(s => s.textContent).join('\n');
  const html = '<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Informe MiVibra</title><style>' + css + '</style></head><body style="overflow:auto"><main style="overflow:visible">' + page.outerHTML + '</main></body></html>';
  const a = document.createElement('a');
  const dv = device();
  a.href = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
  a.download = ('MiVibra-informe-' + (dv.maker + '-' + dv.model).replace(/[^\w-]+/g, '-') + '-' + new Date().toISOString().slice(0, 10) + '.html');
  document.body.appendChild(a); a.click(); a.remove();
  toast('Informe guardado en Descargas');
}

/* ---------- diagnóstico completo ---------- */
async function runAll() {
  const ks = Object.keys(BENCH);
  D.page = 'rendimiento'; renderNav();
  main.innerHTML = '<div class="page fade" style="max-width:820px"><span class="eyebrow">Diagnóstico completo · paso 1 de 2</span><h1 style="margin:6px 0 6px">Midiendo el rendimiento</h1><p class="mut">No uses el equipo mientras tanto. Después siguen las pruebas interactivas.</p><div class="list" style="margin-top:18px">' +
    ks.map(k => '<div class="li" id="rl-' + k + '"><span class="ic" style="width:34px;height:34px;border-radius:10px;background:var(--orbg);display:flex;align-items:center;justify-content:center">' + icon(BENCH[k].ico, '#FF9A4D', 17) + '</span><span class="tx"><b>' + BENCH[k].name + '</b><span id="rs-' + k + '">En espera</span></span><span id="ri-' + k + '"></span></div>').join('') + '</div></div>';
  for (const k of ks) {
    $('#rs-' + k).textContent = 'Midiendo… ~' + BENCH[k].secs + ' s'; $('#ri-' + k).innerHTML = '<span class="spin sm"></span>';
    try { D.bench[k] = await api('/api/bench/' + k); } catch (e) { D.bench[k] = { err: 'Error' }; }
    const r = D.bench[k];
    $('#rs-' + k).textContent = r.err ? r.err : k === 'cpu' ? r.multi + ' MB/s · pérdida ' + Math.max(0, r.drop) + ' %' : k === 'ram' ? r.errors + ' errores · ' + r.read + ' GB/s' : k === 'disk' ? Math.round(r.read) + ' MB/s lectura' : (r.internet ? (r.downMbps || '?') + ' Mbps · ' + r.pingMs + ' ms' : 'Sin internet');
    $('#ri-' + k).innerHTML = '<span class="dot ' + (r.err ? 'bad' : 'ok') + '"></span>';
  }
  await sleep(600);
  const ok = await runTests();
  go(ok ? 'informe' : 'resumen');
}

/* ---------- ANTIVIRUS (motor de Microsoft Defender) ---------- */
const AV = { st: null, job: null, upd: true, path: '', pollT: 0, loading: false };
const AVSEV = { 0: ['Desconocida', ''], 1: ['Baja', 'ok'], 2: ['Moderada', 'warn'], 4: ['Alta', 'bad'], 5: ['Grave', 'bad'] };
const AVSTAT = { 0: ['Detectada', 'warn'], 1: ['Activa', 'bad'], 2: ['Limpiada', 'ok'], 3: ['En cuarentena', 'ok'], 4: ['Eliminada', 'ok'], 5: ['Permitida', 'warn'], 6: ['Bloqueada', 'ok'], 102: ['No se pudo poner en cuarentena', 'bad'], 103: ['No se pudo eliminar', 'bad'], 104: ['Falló', 'bad'], 105: ['Abandonada', ''], 107: ['No se pudo bloquear', 'bad'] };
const AVOPN = { quick: 'Escaneo rápido', full: 'Escaneo completo', custom: 'Escaneo de carpeta', remove: 'Eliminar amenazas', restore: 'Restaurar archivo', update: 'Actualizar base de virus', offline: 'Escaneo sin conexión', list: 'Leer historial' };
const avActive = t => t.active || [1, 102, 103, 107].includes(t.status);
async function avLoad(refresh) {
  if (AV.loading) return; AV.loading = true;
  try { AV.st = await api('/api/av/status' + (refresh ? '?refresh=1' : '')); } catch (e) { AV.st = { err: 'No se pudo leer el estado' }; }
  AV.loading = false;
  renderNav(); if (D.page === 'antivirus') pAntivirus(); SHELL.changed();
}
async function avPoll() {
  clearTimeout(AV.pollT);
  let j; try { j = await api('/api/av/job'); } catch (e) {}
  const was = AV.job && AV.job.state === 'running';
  AV.job = j && !j.none ? j : null;
  const run = AV.job && AV.job.state === 'running' && !AV.job.stale;
  if (run) AV.pollT = setTimeout(avPoll, 2000);
  if (was && !run) { if (AV.job && AV.job.status) AV.st = Object.assign({}, AV.st, AV.job.status, { needAdmin: (AV.st || {}).needAdmin }); avLoad(true); avNotify(); }
  renderNav(); if (D.page === 'antivirus') pAntivirus();
}
function avNotify() {
  const j = AV.job; if (!j) return;
  if (j.state === 'done') toast(AVOPN[j.op] + ': ' + (['quick', 'full', 'custom'].includes(j.op) ? (j.found ? j.found + ' amenaza' + (j.found > 1 ? 's' : '') + ' encontrada' + (j.found > 1 ? 's' : '') : 'no se encontraron amenazas') : 'listo'));
  else if (j.state === 'error') toast(AVOPN[j.op] + ': ' + avErr(j.msg));
}
function avErr(m) {
  m = String(m || '');
  if (/0x800106ba|passive|pasiv/i.test(m)) return 'Microsoft Defender está apagado porque hay otro antivirus instalado. Usa ese antivirus o desinstálalo para usar este escaneo.';
  if (/0x80508023/i.test(m)) return 'La carpeta no existe o no se puede leer.';
  if (/0x80070005|acceso denegado|access is denied/i.test(m)) return 'Windows negó el acceso. Abre MiVibra como administrador e inténtalo de nuevo.';
  if (/0x8050800c|0x80508026/i.test(m)) return 'Defender está ocupado con otro escaneo; espera a que termine.';
  return m || 'Error desconocido';
}
async function avRun(op, arg) {
  if (op === 'offline' && !confirm('El escaneo sin conexión REINICIA el equipo de inmediato y tarda unos 15 minutos. Guarda tu trabajo antes de continuar. ¿Reiniciar ahora?')) return;
  if (op === 'restore' && !confirm('Restaura «' + arg + '» solo si estás seguro de que es un falso positivo (un programa confiable). ¿Restaurar?')) return;
  if (op === 'remove' && !confirm('Se eliminarán las amenazas activas encontradas. ¿Continuar?')) return;
  if (!D.admin) toast('Acepta el permiso de administrador de Windows');
  let r; try { r = await api('/api/av/run', { op, arg: arg || '', update: AV.upd }); } catch (e) { r = { ok: false, msg: 'Error de comunicación' }; }
  if (!r.ok) { toast(r.msg || 'No se pudo iniciar'); return; }
  AV.job = { state: 'running', op, arg, start: new Date().toISOString(), step: 'Esperando el permiso de Windows…', found: 0 };
  pAntivirus(); setTimeout(avPoll, 1500);
}
function avElapsed(s) { if (!s) return '0:00'; const t = Math.max(0, Math.round((Date.now() - new Date(s)) / 1000)); return Math.floor(t / 60) + ':' + String(t % 60).padStart(2, '0'); }
function pAntivirus() {
  const s = AV.st, j = AV.job, running = j && j.state === 'running' && !j.stale;
  if (!s) { main.innerHTML = '<div class="page"><div class="head"><div class="stack"><span class="eyebrow">Antivirus</span><h1>Revisando la protección…</h1></div></div>' + loadingBlock('Consultando Microsoft Defender…') + '</div>'; avLoad(); return; }
  const df = s.defender || {}, others = arr(s.av).filter(a => !/defender/i.test(a.name));
  const threats = arr(s.threats), act = threats.filter(avActive);
  const sigDays = daysAgo(df.sig), qDays = daysAgo(df.quick), fDays = daysAgo(df.full);
  const passive = df.mode && !/normal/i.test(df.mode);
  const prot = act.length ? ['bad', act.length + ' amenaza' + (act.length > 1 ? 's' : '') + ' activa' + (act.length > 1 ? 's' : ''), 'Elimínalas ahora para proteger el equipo.']
    : !df.rt && !others.some(a => a.on) ? ['bad', 'Equipo sin protección en tiempo real', 'Activa la protección en Seguridad de Windows.']
    : passive ? ['warn', 'Protegido por ' + (others.filter(a => a.on).map(a => a.name).join(', ') || 'otro antivirus'), 'Microsoft Defender está en modo pasivo; el escaneo de aquí no funcionará hasta quitar el otro antivirus.']
    : sigDays != null && sigDays > 3 ? ['warn', 'Base de virus desactualizada', 'Tiene ' + sigDays + ' días. Actualízala antes de escanear.']
    : ['ok', 'Equipo protegido', 'Microsoft Defender activo con protección en tiempo real.'];
  const col = SEVCOL[prot[0]];
  const ago = d => d == null ? 'nunca' : d === 0 ? 'hoy' : d === 1 ? 'ayer' : 'hace ' + d + ' días';
  const kinds = [['quick', 'Rápido', 'bolt', '5 a 15 min', 'Revisa donde suele esconderse el malware: memoria, inicio, Descargas y sistema.'], ['full', 'Completo', 'disk', '30 a 120 min', 'Revisa todos los archivos de todos los discos. Ideal al recibir un equipo.'], ['custom', 'Carpeta o USB', 'usb', 'según tamaño', 'Revisa solo una carpeta o memoria USB que elijas.']];
  const vols = arr((D.info || {}).volumes).map(v => v.id).filter(Boolean);
  const home = s.home || '';
  if (!AV.path) AV.path = home ? home + '\\Downloads' : 'C:\\';
  const quickPaths = [[home + '\\Downloads', 'Descargas'], [home + '\\Desktop', 'Escritorio']].filter(x => home).concat(vols.filter(v => v !== 'C:').map(v => [v + '\\', 'Unidad ' + v]));
  const tRow = t => { const sv = AVSEV[t.sev] || AVSEV[0], stt = AVSTAT[t.status] || ['Estado ' + t.status, ''], isAct = avActive(t);
    return '<div class="li avt' + (isAct ? ' act' : '') + '"><span class="avi ' + (isAct ? 'bad' : stt[1]) + '">' + icon(isAct ? 'warn' : 'shield', null, 16) + '</span><span class="tx"><b>' + esc(t.name) + '</b><span class="mono" style="font-size:12px;word-break:break-all">' + esc(arr(t.res).join(' · ') || 'Sin ruta') + '</span><span style="font-size:12px">' + fmtDate(t.when) + (t.proc ? ' · ' + esc(t.proc) : '') + '</span></span>' +
      '<span class="pill ' + sv[1] + '">' + sv[0] + '</span><span class="pill ' + (isAct ? 'bad' : stt[1]) + '">' + (isAct ? 'Activa' : stt[0]) + '</span>' +
      (t.status === 3 && !running ? '<button class="b sec sm" data-avrestore="' + esc(t.name) + '" title="Solo si es un falso positivo">Restaurar</button>' : '') + '</div>'; };
  main.innerHTML = '<div class="page fade">' +
    '<div class="head"><div class="stack"><span class="eyebrow">Antivirus · motor de Microsoft Defender</span><h1>Escaneo de virus</h1><span class="mut">Busca virus, troyanos, ransomware y programas no deseados, y los elimina.</span></div>' +
      '<button class="b sec" id="avref"' + (running ? ' disabled' : '') + '>' + icon('refresh', null, 16) + 'Actualizar estado</button></div>' +
    '<div class="avhero" style="--c:' + col + '"><div class="avshield">' + icon(prot[0] === 'ok' ? 'shield' : 'warn', col, 46, 1.8) + '</div><div class="grow"><b>' + esc(prot[1]) + '</b><small>' + esc(prot[2]) + '</small>' +
      '<div class="avfacts"><span>' + icon('shield', null, 13) + 'Tiempo real: ' + (df.rt ? 'activado' : 'desactivado') + '</span><span>' + icon('refresh', null, 13) + 'Base de virus: ' + ago(sigDays) + (df.sigVer ? ' (' + esc(df.sigVer) + ')' : '') + '</span><span>' + icon('bolt', null, 13) + 'Último rápido: ' + ago(qDays) + '</span><span>' + icon('disk', null, 13) + 'Último completo: ' + ago(fDays) + '</span>' + others.map(a => '<span>' + icon('shield', null, 13) + esc(a.name) + (a.on ? ' activo' : ' apagado') + '</span>').join('') + '</div></div>' +
      (act.length && !running ? '<button class="b lg avdanger" id="avrm">' + icon('trash', '#fff', 17) + 'Eliminar ' + act.length + ' amenaza' + (act.length > 1 ? 's' : '') + '</button>' : sigDays != null && sigDays > 1 && !running ? '<button class="b sec" data-av="update">' + icon('dl', null, 16) + 'Actualizar base</button>' : '') + '</div>' +
    (s.err ? '<div class="verdict bad"><span class="vi">' + icon('close', '#2A0606', 14, 3) + '</span><span><b>' + esc(s.err) + '</b><small>El escaneo necesita Microsoft Defender (incluido en Windows 10 y 11).</small></span></div>' : '') +
    (running ? '<div class="avrun"><div class="row" style="gap:16px"><span class="spin" style="margin:0;width:42px;height:42px"></span><div class="grow"><b>' + esc(AVOPN[j.op] || 'Antivirus') + (j.op === 'custom' && j.arg ? ' · ' + esc(j.arg) : '') + '</b><small>' + esc(j.step || 'Trabajando…') + ' · ' + '<span id="avel">' + avElapsed(j.scanStart || j.start) + '</span></small></div>' +
        '<div class="avfound' + (j.found ? ' bad' : '') + '"><b>' + (j.found || 0) + '</b><small>amenaza' + (j.found === 1 ? '' : 's') + '</small></div>' + (['quick', 'full', 'custom'].includes(j.op) ? '<button class="b sec" id="avcancel">' + icon('close', null, 15) + 'Detener</button>' : '') + '</div>' +
        '<div class="avbar"><i></i></div><p class="mut" style="font-size:12.5px;margin-top:8px">Puedes seguir usando MiVibra o minimizarlo; el escaneo continúa. Windows no informa el porcentaje, solo el tiempo transcurrido.</p></div>'
      : (j && j.stale ? '<div class="verdict warn"><span class="vi">' + icon('warn', '#2A1A02', 14, 2.6) + '</span><span><b>El escaneo dejó de responder</b><small>Puede que se haya cancelado el permiso de administrador o que Windows lo haya detenido.</small></span></div>' : '') +
        (j && j.state === 'error' ? '<div class="verdict bad"><span class="vi">' + icon('close', '#2A0606', 14, 3) + '</span><span><b>' + esc(AVOPN[j.op] || 'Antivirus') + ': no se pudo completar</b><small>' + esc(avErr(j.msg)) + '</small></span></div>' : '') +
        (j && j.state === 'done' && ['quick', 'full', 'custom'].includes(j.op) ? '<div class="verdict ' + (j.found ? 'bad' : 'ok') + '"><span class="vi">' + icon(j.found ? 'warn' : 'check', j.found ? '#2A0606' : '#06210F', 14, 2.8) + '</span><span><b>' + esc(AVOPN[j.op]) + ' terminado: ' + (j.found ? j.found + ' amenaza' + (j.found > 1 ? 's' : '') + ' encontrada' + (j.found > 1 ? 's' : '') : 'no se encontraron amenazas') + '</b><small>' + (j.found ? 'Defender ya las puso en cuarentena o están abajo para eliminarlas.' : 'El equipo está limpio según la última base de virus.') + '</small></span></div>' : '') +
        '<h3>Elige el tipo de escaneo</h3><div class="avkinds">' + kinds.map(k => '<div class="avk"><span class="ki">' + icon(k[2], null, 20) + '</span><b>' + k[1] + '</b><span class="mut" style="font-size:12px">' + k[3] + '</span><p>' + k[4] + '</p>' +
          (k[0] === 'custom' ? '<input id="avpath" class="mono" value="' + esc(AV.path) + '" spellcheck="false"><div class="avchips">' + quickPaths.map(q => '<button class="chip-s" data-avpath="' + esc(q[0]) + '">' + esc(q[1]) + '</button>').join('') + '</div>' : '') +
          '<button class="b' + (k[0] === 'quick' ? '' : ' sec') + ' full" data-av="' + k[0] + '"' + (s.err ? ' disabled' : '') + '>' + icon('test', k[0] === 'quick' ? '#140A02' : null, 15) + 'Escanear</button></div>').join('') + '</div>' +
        '<div class="row wrap" style="gap:16px;margin-top:12px"><label class="sw"><input type="checkbox" id="avupd"' + (AV.upd ? ' checked' : '') + '><i></i>Actualizar la base de virus antes de escanear</label><span class="grow"></span><button class="lnk sm" data-av="offline" title="Detecta rootkits que se esconden mientras Windows está encendido">' + icon('shield', null, 13) + ' Escaneo sin conexión (reinicia el equipo)</button></div>') +
    '<h3>Amenazas encontradas<span>' + (threats.length ? threats.length + ' en el historial' : '') + '</span></h3>' +
    (threats.length ? '<div class="list">' + threats.map(tRow).join('') + '</div>'
      : s.needAdmin ? '<div class="card row wrap" style="gap:14px"><span class="grow mut">Windows solo muestra el historial de amenazas con permiso de administrador.</span><button class="b sec sm" data-av="list"' + (running ? ' disabled' : '') + '>' + icon('admin', null, 15) + 'Ver historial</button></div>'
      : '<div class="card row" style="gap:12px">' + icon('check', '#4ADE80', 20, 2.6) + '<span>No hay amenazas registradas en este equipo.</span></div>') +
    (s.threatsAt ? '<p class="mut" style="font-size:12px;margin-top:8px">Historial leído en el último escaneo (' + fmtDate(s.threatsAt) + ').</p>' : '') +
    '<p class="mut" style="font-size:12.5px;margin-top:18px">«En cuarentena» significa que el archivo ya está encerrado y no puede hacer daño. Usa «Restaurar» solo con programas de confianza que Defender bloqueó por error (falsos positivos).</p>' +
    '</div>';
  main.querySelectorAll('[data-av]').forEach(b => b.onclick = () => { const op = b.dataset.av; if (op === 'custom') { AV.path = $q('#avpath').value.trim(); if (!AV.path) return toast('Escribe la carpeta a revisar'); } avRun(op, op === 'custom' ? AV.path : ''); });
  main.querySelectorAll('[data-avpath]').forEach(b => b.onclick = () => { AV.path = b.dataset.avpath; $q('#avpath').value = AV.path; });
  main.querySelectorAll('[data-avrestore]').forEach(b => b.onclick = () => avRun('restore', b.dataset.avrestore));
  const ip = $q('#avpath'); if (ip) ip.oninput = () => AV.path = ip.value;
  const up = $q('#avupd'); if (up) up.onchange = () => AV.upd = up.checked;
  $('#avrm').onclick = () => avRun('remove');
  $('#avcancel').onclick = async () => { await api('/api/av/cancel', {}); toast('Deteniendo el escaneo…'); };
  $('#avref').onclick = () => { AV.st = null; pAntivirus(); avLoad(true); };
  if (running) { const iv = setInterval(() => { const e = $q('#avel'); if (e) e.textContent = avElapsed(j.scanStart || j.start); }, 1000); D.cleanup.push(() => clearInterval(iv)); }
}

/* ---------- arranque (lo controla el shell) ---------- */
function init() {
  avLoad(); avPoll();
  const live = async () => { if (!ACTIVE() && D.live) return; try { D.live = await api('/api/live'); } catch (e) {} };
  live(); setInterval(live, 2000);
  api('/api/info').then(d => { D.info = d; if (d.admin != null) D.admin = d.admin; renderNav(); if (['resumen', 'hardware', 'informe'].includes(D.page) && !WIZ) go(D.page); SHELL.changed(); }).catch(() => { D.info = {}; go(D.page); });
  api('/api/software').then(d => { D.soft = d; renderNav(); if (['resumen', 'software', 'informe'].includes(D.page) && !WIZ) go(D.page); SHELL.changed(); }).catch(() => { D.soft = {}; });
}
function mount(page) { renderNav(); go(page || D.page); }
function unmount() { D.cleanup.forEach(f => { try { f(); } catch (e) {} }); D.cleanup = []; }
function summary() { if (!D.info) return null; const A = analyze(); return { grade: A.grade, score: A.score, nb: A.nb, nw: A.nw, soft: !!D.soft, issues: A.items.filter(x => x.sev !== 'ok'), device: device() }; }
return { init, mount, unmount, summary, setAdmin(a) { if (D.admin !== a) { D.admin = a; renderNav(); } }, get busy() { return !!WIZ; } };
})();
