/* ===================== Módulo: Instalador ===================== */
const INST = (() => {
const ACTIVE = () => SHELL.mode === 'inst';
/* ===================== MiVibra Instalador ===================== */
const $q = s => document.querySelector(s);
const NOOP = new Proxy(function () {}, { get: (t, k) => k === 'classList' ? { add() {}, remove() {}, toggle() {} } : k === 'style' ? {} : undefined, set: () => true });
const $ = s => document.querySelector(s) || NOOP;
const main = $q('#main');
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
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
const fmtB = b => b >= 1073741824 ? (b / 1073741824).toFixed(1) + ' GB' : b >= 1048576 ? Math.round(b / 1048576) + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB';
const IC = {
  box: '<path d="M21 8l-9-5-9 5 9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/>',
  folder: '<path d="M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
  refresh: '<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4v7h-7"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>', close: '<path d="M6 6l12 12M18 6L6 18"/>',
  dots: '<circle cx="5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="19" cy="12" r="1.3"/>',
  dl: '<path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M5 21h14"/>',
  play: '<path d="M7 4v16l13-8z"/>', grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  cloud: '<path d="M7 18a5 5 0 1 1 .9-9.9A6 6 0 0 1 19 10a4 4 0 0 1-1 8z"/>', lib: '<path d="M4 4h4v16H4zM10 4h4v16h-4z"/><path d="M16 5l3.5-1 3 15-3.5 1z"/>',
  shield: '<path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z"/><path d="M9 12l2 2 4-4"/>', admin: '<path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z"/><path d="M12 8v5"/><path d="M12 16h.01"/>',
  gh: '<path d="M9 19c-4 1.5-4-2-6-2.5m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/>',
  plus: '<path d="M12 5v14M5 12h14"/>', warn: '<path d="M12 3l10 18H2z"/><path d="M12 10v5"/><path d="M12 18h.01"/>', trash: '<path d="M4 7h16"/><path d="M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13"/><path d="M9 7V4h6v3"/>'
};
const icon = (k, c, s, w) => '<svg width="' + (s || 20) + '" height="' + (s || 20) + '" viewBox="0 0 24 24" fill="none" stroke="' + (c || 'currentColor') + '" stroke-width="' + (w || 2) + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (IC[k] || '') + '</svg>';

Object.assign(IC, {
  home: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
  chev: '<path d="M9 6l6 6-6 6"/>', down: '<path d="M6 9l6 6 6-6"/>',
  star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13"/><path d="M3.5 6h.01M3.5 12h.01M3.5 18h.01"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18"/>',
  doc: '<path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h6"/>',
  film: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4"/>',
  pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  chat: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>',
  monitor: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
  wrench: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z"/>',
  puzzle: '<path d="M10 3h4v3a2 2 0 1 0 4 0V3h3v7h-3a2 2 0 1 0 0 4h3v7h-7v-3a2 2 0 1 0-4 0v3H3v-7h3a2 2 0 1 0 0-4H3V3h7"/>',
  game: '<rect x="2" y="7" width="20" height="11" rx="5"/><path d="M7 11v3M5.5 12.5h3"/><circle cx="16" cy="11.5" r=".8"/><circle cx="18" cy="13.5" r=".8"/>',
  code: '<path d="M8 8l-5 4 5 4M16 8l5 4-5 4M14 5l-4 14"/>',
  phone: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
  archive: '<rect x="3" y="4" width="18" height="5" rx="1"/><path d="M5 9v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9"/><path d="M10 13h4"/>',
  chip: '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>',
  spark: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>',
  book: '<path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H20v15H5.5A1.5 1.5 0 0 0 4 19.5z"/><path d="M4 19.5A1.5 1.5 0 0 0 5.5 21H20v-3"/>',
  usb: '<path d="M12 2v14"/><path d="M8 6l4-4 4 4"/><circle cx="12" cy="19" r="2.5"/><path d="M12 11l-4-2v-2M12 13l4-2v-2"/>',
  brush: '<path d="M9.5 14.5L18 6a2.1 2.1 0 0 0-3-3l-8.5 8.5"/><path d="M7 13c-2 0-3 1.5-3 3.5 0 1.2-.7 2-1.5 2.5 3 1 7 .5 7.5-3.5z"/>',
  palette: '<path d="M12 3a9 9 0 1 0 0 18c1 0 1.5-.8 1.5-1.6 0-1.2-1-1.6-1-2.6 0-1 .8-1.8 1.8-1.8H17a4 4 0 0 0 4-4C21 6.6 17 3 12 3z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7" r="1"/><circle cx="15" cy="7" r="1"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>', save: '<path d="M5 3h11l5 5v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M7 3v5h8M7 21v-7h10v7"/>',
  sel: '<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M8 12l3 3 5-6"/>', kit: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/><path d="M12 11v5M9.5 13.5h5"/>'
});

const S = { gh: {}, ghPend: new Set(), stars: {}, items: [], profiles: {}, sel: new Set(), cat: 'home', filter: 'all', q: '', sort: 'rec', layout: 'grid', reboot: false, admin: false, winget: '', folder: '', view: 'grid', job: null, loading: true, types: {}, silent: {}, tray: false, fold: {} };
const LS = { get(k, d) { try { const v = localStorage.getItem('mvi.' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem('mvi.' + k, JSON.stringify(v)); } catch (e) {} } };
S.layout = LS.get('layout', 'grid'); S.fold = LS.get('fold', {}); S.sort = LS.get('sort', 'rec');

/* ---------- datos ---------- */
async function load(rescan) {
  try {
    const st = await api('/api/state' + (rescan ? '?rescan=1' : ''));
    Object.assign(S, { items: st.items || [], profiles: st.profiles || {}, admin: st.admin, winget: st.winget, folder: st.folder, types: st.types || {}, silent: st.silent || {}, loading: false });
    const ids = new Set(S.items.map(x => x.id));
    S.sel = new Set([...S.sel].filter(id => ids.has(id)));
  } catch (e) { S.loading = false; toast('No se pudo leer la biblioteca'); }
  render();
  SHELL.changed();
}
const visibleAll = () => S.items.filter(x => !x.hidden);
const isLibreCat = c => /^Libre · /.test(c || '');
const catLabel = c => (c || '').replace(/^Libre · /, '');
const starsOf = x => x.kind === 'github' ? (S.stars[x.repo] || x.stars || 0) : -1;
const fmtStars = n => n >= 1000 ? (n >= 10000 ? Math.round(n / 1000) : (n / 1000).toFixed(1).replace('.0', '').replace('.', ',')) + ' mil' : String(n);
const inScope = x => S.cat === 'all' || S.cat === 'home' || (S.cat === '@lib' ? x.kind === 'local' : S.cat === '@web' ? x.kind === 'winget' : S.cat === '@gh' ? x.kind === 'github' : x.category === S.cat);
function filtered() {
  const q = S.q.trim().toLowerCase();
  const words = q.split(/\s+/).filter(Boolean);
  const list = visibleAll().filter(x => inScope(x) &&
    (S.filter === 'all' || (S.filter === 'todo' ? !x.installed : x.installed)) &&
    (!words.length || (h => words.every(w => h.includes(w)))((x.name + ' ' + catLabel(x.category) + ' ' + (x.publisher || '') + ' ' + (x.wingetId || '') + ' ' + (x.file || '') + ' ' + (x.repo || '') + ' ' + (x.desc || '')).toLowerCase())));
  const ghView = S.cat === '@gh' || isLibreCat(S.cat);
  const sort = S.sort === 'rec' ? (ghView ? 'stars' : 'none') : S.sort;
  if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name, 'es'));
  else if (sort === 'stars') list.sort((a, b) => starsOf(b) - starsOf(a));
  if (q) list.sort((a, b) => (b.name.toLowerCase().startsWith(q) ? 1 : 0) - (a.name.toLowerCase().startsWith(q) ? 1 : 0));
  return list;
}
/* consulta la versión solo de los programas de GitHub que se están viendo (GitHub permite 60 consultas por hora) */
function ghLazy(list, force) {
  if (S.cat === 'all' && !S.q && !force) return;
  const need = list.filter(x => x.kind === 'github' && !S.gh[x.repo] && !S.ghPend.has(x.repo)).map(x => x.repo).slice(0, 40);
  if (!need.length) return;
  need.forEach(r => S.ghPend.add(r));
  api('/api/ghinfo?repos=' + encodeURIComponent(need.join(','))).then(g => { Object.assign(S.gh, g || {}); }).catch(() => { need.forEach(r => { S.gh[r] = S.gh[r] || { err: 'Sin conexión' }; }); })
    .finally(() => { need.forEach(r => S.ghPend.delete(r)); refreshCards(need); });
}
/* actualiza solo las tarjetas afectadas (sin perder scroll ni foco) */
function refreshCards(repos) {
  if (!ACTIVE()) return;
  if (S.view !== 'grid') return;
  repos.forEach(r => { const x = S.items.find(i => i.repo === r); if (!x) return; main.querySelectorAll('[data-id="' + CSS.escape(x.id) + '"]').forEach(el => { const n = document.createElement('div'); n.innerHTML = (el.classList.contains('lrow') ? row(x) : card(x)); const ne = n.firstElementChild; el.replaceWith(ne); bindCard(ne); }); });
}
const byId = id => S.items.find(x => x.id === id);

/* ---------- iconos de categoría y avatares ---------- */
const CAT_IC = [[/navegador/i, 'globe'], [/oficina|nota/i, 'doc'], [/multimedia/i, 'film'], [/diseño/i, 'pen'], [/comunica/i, 'chat'], [/remoto/i, 'monitor'], [/nube/i, 'cloud'], [/técnic|herramient/i, 'wrench'], [/segur/i, 'shield'], [/librer/i, 'puzzle'], [/juego/i, 'game'], [/desarroll/i, 'code'], [/celular/i, 'phone'], [/compres/i, 'archive'], [/driver|hardware/i, 'chip'], [/\bia\b|ia en/i, 'spark'], [/libro/i, 'book'], [/usb de rescate/i, 'usb'], [/personaliz/i, 'brush'], [/artcraft/i, 'palette'], [/instalador|agregad/i, 'box']];
const catIcon = c => { for (const [re, k] of CAT_IC) if (re.test(c)) return k; return 'folder'; };
const HUES = [['#2A1A0E', '#FF9A4D'], ['#13222B', '#7CC7F2'], ['#1B2416', '#9BDB7A'], ['#271728', '#E39BEA'], ['#2A2210', '#F5C451'], ['#14232A', '#5FD4C4'], ['#2A1518', '#F59AA5'], ['#1C1B2E', '#A9A4F5']];
function hue(s) { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0; return HUES[h % HUES.length]; }
function initials(n) { const w = (n || '?').replace(/[^A-Za-z0-9ÁÉÍÓÚÑáéíóúñ+ ]/g, ' ').trim().split(/\s+/); return ((w[0] || '?').charAt(0) + (w.length > 1 && w[1] ? w[1].charAt(0) : (w[0] || '').charAt(1) || '')).toUpperCase(); }
function avatar(x, size) {
  const st = size ? ' style="width:' + size + 'px;height:' + size + 'px;font-size:' + Math.round(size * .38) + 'px"' : '';
  if (x.icon) return '<span class="av img"' + st + '><img alt="" src="data:image/png;base64,' + x.icon + '"></span>';
  const [bg, fg] = hue(x.name || x.id);
  return '<span class="av" style="background:' + bg + ';color:' + fg + (size ? ';width:' + size + 'px;height:' + size + 'px;font-size:' + Math.round(size * .38) + 'px' : '') + '">' + esc(initials(x.name)) + '</span>';
}
function ghState(x) {
  const g = S.gh[x.repo];
  if (S.ghPend.has(x.repo)) return '<span class="chip-s">consultando…</span>';
  if (g && g.err) return '<span class="chip-s warn">' + esc(g.err.indexOf('Windows') >= 0 ? 'Sin versión Windows aún' : g.err.indexOf('limitó') >= 0 ? 'GitHub ocupado' : 'Sin conexión') + '</span>';
  if (g && g.pre && g.version) return '<span class="chip-s warn">Versión de prueba</span>';
  return '';
}
function meta(x) {
  const g = x.kind === 'github' ? S.gh[x.repo] : null;
  const src = x.kind === 'local' ? icon('lib', null, 13) + 'Biblioteca · ' + esc(S.types[x.type] || x.type) : x.kind === 'github' ? icon('gh', null, 13) + 'GitHub' : x.source === 'msstore' ? icon('box', null, 13) + 'Store' : icon('cloud', null, 13) + 'winget';
  const bits = [];
  if (x.kind === 'github' && starsOf(x) > 0) bits.push('<span class="m star">' + icon('star', null, 12) + fmtStars(starsOf(x)) + '</span>');
  if (g && g.version) bits.push('<span class="m">v' + esc(g.version) + '</span>');
  else if (x.kind === 'local' && x.version) bits.push('<span class="m">v' + esc(x.version) + '</span>');
  if (x.kind === 'local' && x.size) bits.push('<span class="m">' + fmtB(x.size) + '</span>');
  else if (g && g.size) bits.push('<span class="m">' + fmtB(g.size) + '</span>');
  if (x.portable) bits.push('<span class="m">Portable</span>');
  if (x.iso) bits.push('<span class="m">ISO</span>');
  if (x.mode === 'normal') bits.push('<span class="m">Manual</span>');
  return '<span class="src">' + src + '</span>' + bits.join('');
}
const status = x => x.installed ? '<span class="inst">' + icon('check', null, 12, 3) + (x.iso ? 'En el kit' : 'Instalado') + '</span>' : '';
function descOf(x) { return x.desc || (x.kind === 'local' ? [x.publisher, x.file].filter(Boolean).join(' · ') : ''); }
function card(x) {
  const sel = S.sel.has(x.id);
  return '<div class="prog' + (sel ? ' sel' : '') + (x.installed ? ' done' : '') + '" data-id="' + esc(x.id) + '" role="checkbox" aria-checked="' + sel + '" tabindex="0">' +
    '<div class="ph">' + avatar(x) + '<div class="pt"><b title="' + esc(x.name) + '">' + esc(x.name) + '</b>' + status(x) + '</div><span class="ck">' + icon('check', '#140A02', 13, 3.2) + '</span></div>' +
    '<p class="ds" title="' + esc(descOf(x)) + '">' + esc(descOf(x)) + '</p>' +
    '<div class="pm">' + meta(x) + ghState(x) + '</div>' +
    '<button class="more" data-edit="' + esc(x.id) + '" title="Opciones" aria-label="Opciones de ' + esc(x.name) + '">' + icon('dots', null, 18) + '</button></div>';
}
function row(x) {
  const sel = S.sel.has(x.id);
  return '<div class="lrow' + (sel ? ' sel' : '') + '" data-id="' + esc(x.id) + '" role="checkbox" aria-checked="' + sel + '" tabindex="0"><span class="ck">' + icon('check', '#140A02', 13, 3.2) + '</span>' + avatar(x, 34) +
    '<span class="ln"><b>' + esc(x.name) + '</b><span>' + esc(descOf(x)) + '</span></span><span class="lc">' + esc(catLabel(x.category)) + '</span><span class="lm">' + meta(x) + ghState(x) + '</span><span class="ls">' + status(x) + '</span>' +
    '<button class="more" data-edit="' + esc(x.id) + '" title="Opciones" aria-label="Opciones de ' + esc(x.name) + '">' + icon('dots', null, 18) + '</button></div>';
}
const listHTML = it => S.layout === 'list' ? '<div class="ltable">' + it.map(row).join('') + '</div>' : '<div class="pgrid">' + it.map(card).join('') + '</div>';

/* ---------- barra lateral ---------- */
function renderSide() {
  if (!ACTIVE()) return;
  const all = visibleAll();
  const cats = {};
  all.forEach(x => cats[x.category] = (cats[x.category] || 0) + 1);
  const n = k => all.filter(x => x.kind === k).length;
  const btn = (k, label, cnt, ic) => '<button class="cat' + (S.cat === k && S.view !== 'queue' ? ' on' : '') + '" data-cat="' + esc(k) + '" title="' + esc(label) + '">' + icon(ic, null, 17) + '<span>' + esc(label) + '</span>' + (cnt != null ? '<em>' + cnt + '</em>' : '') + '</button>';
  const group = (id, title, keys) => { const open = !S.fold[id] || keys.includes(S.cat); return '<button class="sidelabel" data-fold="' + id + '" aria-expanded="' + open + '"><span>' + title + '</span>' + icon(open ? 'down' : 'chev', null, 13) + '</button>' + (open ? '<div class="grp">' + keys.map(c => btn(c, catLabel(c), cats[c], catIcon(c))).join('') + '</div>' : ''); };
  const normal = Object.keys(cats).filter(c => !isLibreCat(c)).sort((a, b) => a.localeCompare(b, 'es'));
  const libre = Object.keys(cats).filter(isLibreCat).sort((a, b) => a.localeCompare(b, 'es'));
  $q('#nav').innerHTML = btn('home', 'Inicio', null, 'home') + btn('all', 'Todos', all.length, 'grid') + btn('@lib', 'Mi biblioteca', n('local'), 'lib') + btn('@web', 'Catálogo winget', n('winget'), 'cloud') + btn('@gh', 'Software libre', n('github'), 'gh') +
    group('cats', 'Categorías', normal) + (libre.length ? group('libre', 'Software libre por tema', libre) : '');
  $q('#nav').querySelectorAll('[data-cat]').forEach(b => b.onclick = () => go(b.dataset.cat));
  $q('#nav').querySelectorAll('[data-fold]').forEach(b => b.onclick = () => { S.fold[b.dataset.fold] = !S.fold[b.dataset.fold] && b.getAttribute('aria-expanded') === 'true'; LS.set('fold', S.fold); renderSide(); });
  $q('#adm').innerHTML = (S.admin ? '<span class="pill ok" style="align-self:flex-start">' + icon('shield', '#86EFAC', 12) + ' Administrador</span>' : '<span class="hint t">Windows pedirá permiso de administrador una sola vez por instalación.</span>') +
    '<button class="b sec sm full" id="ofold" title="Carpeta de instaladores">' + icon('folder', null, 15) + '<span class="t">Carpeta de instaladores</span></button>';
  $('#ofold').onclick = () => api('/api/open', { what: 'folder' });
}
function go(cat, q) {
  S.cat = cat; S.q = q || ''; S.filter = 'all';
  S.view = S.job && !S.job.done && !S.job.stale ? 'queue' : 'grid';
  render(); main.scrollTop = 0;
}

/* ---------- inicio ---------- */
const KIT_IC = n => /celular|taller/i.test(n) ? 'phone' : /técnic/i.test(n) ? 'wrench' : /oficina/i.test(n) ? 'doc' : /gamer|juego/i.test(n) ? 'game' : /artcraft/i.test(n) ? 'palette' : /básico|basico/i.test(n) ? 'bolt' : 'kit';
function pHome() {
  if (!ACTIVE()) return;
  const all = visibleAll();
  const libN = all.filter(x => x.kind === 'local').length, inst = all.filter(x => x.installed).length;
  const profs = Object.keys(S.profiles).sort((a, b) => a.localeCompare(b, 'es'));
  const kit = p => {
    const ids = (S.profiles[p] || []).filter(id => byId(id)), its = ids.map(byId);
    const on = ids.length && ids.every(id => S.sel.has(id)), done = its.filter(x => x.installed).length;
    return '<div class="kit' + (on ? ' on' : '') + '"><div class="kh"><span class="ki">' + icon(KIT_IC(p), null, 20) + '</span><button class="kdel" data-kdel="' + esc(p) + '" title="Eliminar kit" aria-label="Eliminar kit ' + esc(p) + '">' + icon('trash', null, 14) + '</button></div>' +
      '<b>' + esc(p) + '</b><span class="mut">' + ids.length + ' programa' + (ids.length === 1 ? '' : 's') + (done ? ' · ' + done + ' ya instalado' + (done > 1 ? 's' : '') : '') + '</span>' +
      '<div class="stack-av">' + its.slice(0, 6).map(x => avatar(x, 26)).join('') + (its.length > 6 ? '<span class="more-n">+' + (its.length - 6) + '</span>' : '') + '</div>' +
      '<button class="b ' + (on ? 'ok' : 'sec') + ' sm full" data-kit="' + esc(p) + '">' + (on ? icon('check', null, 14, 3) + 'En la selección' : icon('plus', null, 14) + 'Agregar a la selección') + '</button></div>';
  };
  const top = all.filter(x => x.kind === 'github').sort((a, b) => starsOf(b) - starsOf(a)).slice(0, 8);
  const cats = {}; all.forEach(x => cats[x.category] = (cats[x.category] || 0) + 1);
  const catTile = c => '<button class="ctile" data-go="' + esc(c) + '"><span class="ci">' + icon(catIcon(c), null, 18) + '</span><span class="cn">' + esc(catLabel(c)) + '</span><em>' + cats[c] + '</em></button>';
  const normal = Object.keys(cats).filter(c => !isLibreCat(c)).sort((a, b) => a.localeCompare(b, 'es'));
  const libre = Object.keys(cats).filter(isLibreCat).sort((a, b) => a.localeCompare(b, 'es'));
  main.innerHTML = '<div class="page fade">' +
    '<section class="hero"><span class="eyebrow">MiVibra Instalador</span><h1 class="xl">¿Qué instalamos hoy?</h1>' +
    '<p class="lead">Elige un kit, busca un programa o explora por categoría. Todo se instala en fila y en silencio.</p>' +
    '<div class="search big">' + icon('search', '#A39C94', 20) + '<input id="hq" placeholder="Buscar entre ' + all.length + ' programas…" autocomplete="off"><kbd>Ctrl K</kbd></div>' +
    '<div class="stats">' +
      stat('lib', libN, 'en tu biblioteca', 'Funcionan sin internet', '@lib') + stat('cloud', all.filter(x => x.kind === 'winget').length, 'en winget', S.winget ? 'Catálogo oficial de Windows' : 'winget no disponible', '@web') +
      stat('gh', all.filter(x => x.kind === 'github').length, 'libres de GitHub', 'Siempre la última versión', '@gh') + stat('check', inst, 'ya instalados', 'en este equipo', 'all:inst') + '</div></section>' +
    '<div id="xhealth">' + SHELL.healthCard() + '</div>' +
    (!S.winget ? banner('warn', 'winget no está disponible', 'El catálogo winget necesita «Instalador de aplicación» de Microsoft Store (viene con Windows 10/11 actualizado). Tu biblioteca y el software libre funcionan igual.') : '') +
    (!libN ? '<div class="empty">' + icon('folder', '#FF9A4D', 26) + '<div><b>Arma tu biblioteca de instaladores</b><p class="mut">Copia tus .exe y .msi en <span class="code">' + esc(S.folder) + '</span>. Cada subcarpeta es una categoría. O usa «Descargar al kit» para guardarlos desde internet.</p></div><button class="b sm" id="bfold">' + icon('folder', '#140A02', 15) + 'Abrir carpeta</button></div>' : '') +
    '<div class="sec-h"><div><h2>Kits rápidos</h2><p class="mut">Un clic agrega todos sus programas a la selección.</p></div><button class="b sec sm" id="ksave">' + icon('save', null, 15) + 'Guardar selección como kit</button></div>' +
    '<div class="kits">' + profs.map(kit).join('') + '</div>' +
    (top.length ? '<div class="sec-h"><div><h2>Lo más popular del software libre</h2><p class="mut">Los proyectos con más estrellas en GitHub.</p></div><button class="b sec sm" data-go="@gh">Ver los ' + all.filter(x => x.kind === 'github').length + ' ' + icon('chev', null, 14) + '</button></div>' + '<div class="pgrid">' + top.map(card).join('') + '</div>' : '') +
    '<div class="sec-h"><div><h2>Explorar categorías</h2></div></div><div class="ctiles">' + normal.map(catTile).join('') + '</div>' +
    (libre.length ? '<div class="sec-h"><div><h2>Software libre por tema</h2></div></div><div class="ctiles">' + libre.map(catTile).join('') + '</div>' : '') +
    '</div>';
  const hq = $q('#hq');
  hq.oninput = () => { const v = hq.value; if (v.trim()) { go('all', v); const q = $q('#q'); if (q) { q.focus(); q.setSelectionRange(v.length, v.length); } } };
  main.querySelectorAll('[data-go]').forEach(b => b.onclick = () => { const [c, f] = b.dataset.go.split(':'); go(c); if (f) { S.filter = f; pGrid(); } });
  main.querySelectorAll('[data-kit]').forEach(b => b.onclick = () => {
    const p = b.dataset.kit, ids = (S.profiles[p] || []).filter(id => byId(id));
    const on = ids.length && ids.every(id => S.sel.has(id));
    ids.forEach(id => on ? S.sel.delete(id) : S.sel.add(id));
    toast(on ? 'Kit «' + p + '» quitado de la selección' : 'Kit «' + p + '»: ' + ids.length + ' programas agregados');
    keepScroll(pHome);
  });
  main.querySelectorAll('[data-kdel]').forEach(b => b.onclick = async e => { e.stopPropagation(); const p = b.dataset.kdel; if (!confirm('¿Eliminar el kit «' + p + '»? Los programas no se borran.')) return; await api('/api/profile', { name: p, delete: true }); await load(); toast('Kit eliminado'); });
  $('#ksave').onclick = saveKit;
  SHELL.bindShell($q('#xhealth'));
  $('#bfold').onclick = () => api('/api/open', { what: 'folder' });
  main.querySelectorAll('.prog').forEach(bindCard);
  renderDock();
  ghLazy(top, true);
}
function stat(ic, n, label, sub, goTo) { return '<button class="stat" data-go="' + goTo + '"><span class="si">' + icon(ic, null, 18) + '</span><span><b>' + n + '</b> ' + label + '<small>' + sub + '</small></span></button>'; }
function banner(kind, title, text) { return '<div class="verdict ' + kind + '" style="margin:0 0 18px"><span class="vi">' + icon(kind === 'ok' ? 'check' : 'warn', '#1A1204', 14, 2.6) + '</span><span><b>' + title + '</b><small>' + text + '</small></span></div>'; }
function keepScroll(fn) { const st = main.scrollTop; fn(); main.scrollTop = st; }
async function saveKit() {
  if (!S.sel.size) return toast('Primero selecciona los programas del kit');
  const n = prompt('Nombre del kit (' + S.sel.size + ' programas)', '');
  if (!n || !n.trim()) return;
  await api('/api/profile', { name: n.trim(), ids: [...S.sel] }); await load(); toast('Kit «' + n.trim() + '» guardado');
}

/* ---------- catálogo ---------- */
function titleOf() { return S.cat === 'all' ? (S.q ? 'Resultados' : 'Todos los programas') : S.cat === '@lib' ? 'Mi biblioteca' : S.cat === '@web' ? 'Catálogo winget' : S.cat === '@gh' ? 'Software libre' : catLabel(S.cat); }
function crumb() { return S.cat === '@gh' ? 'GitHub · ordenado por estrellas' : isLibreCat(S.cat) ? 'Software libre' : S.cat === '@lib' ? 'Instaladores en tu carpeta' : S.cat === '@web' ? 'winget' : S.cat === 'all' ? 'Catálogo' : 'Categoría'; }
function skeleton() { return '<div class="pgrid">' + Array.from({ length: 9 }, () => '<div class="skel" style="height:132px;border-radius:18px"></div>').join('') + '</div>'; }
function pGrid() {
  if (!ACTIVE()) return;
  if (S.cat === 'home' && !S.q) return S.loading ? (main.innerHTML = '<div class="page"><div class="skel" style="height:260px;border-radius:24px;margin-bottom:24px"></div>' + skeleton() + '</div>') : pHome();
  if (S.loading) { main.innerHTML = '<div class="page"><div class="skel" style="height:90px;border-radius:18px;margin-bottom:22px"></div>' + skeleton() + '</div>'; return; }
  const list = filtered();
  const scopeN = visibleAll().filter(inScope).length;
  const ghV = S.cat === '@gh' || isLibreCat(S.cat);
  const note = ghV ? '<p class="note">' + icon('gh', null, 14) + '<span>Proyectos libres mejor calificados. Se instala siempre la última versión oficial; los portables quedan en <span class="code">Archivos de programa\\MiVibra Portables</span> con acceso en el menú Inicio.</span></p>' : '';
  const iso = S.cat === 'Libre · USB de rescate' ? banner('ok', 'Kit USB de rescate', '«Instalar» guarda la imagen en Instaladores\\USB de rescate y, si hay una USB preparada con Ventoy conectada, la copia ahí. Luego arrancas el equipo desde la USB y la eliges en el menú.') : '';
  let body;
  if (!list.length) body = '<div class="empty">' + icon('search', '#FF9A4D', 26) + '<div><b>No encontramos «' + esc(S.q || 'programas con ese filtro') + '»</b><p class="mut">' + (S.q && S.winget ? 'Búscalo en el catálogo completo de winget (más de 10.000 programas).' : 'Prueba con otro filtro o categoría.') + '</p></div>' + (S.q && S.winget ? '<button class="b sm" id="bwq">' + icon('search', '#140A02', 15) + 'Buscar «' + esc(S.q) + '» en winget</button>' : '') + '</div>';
  else if (S.cat === 'all' && !S.q && S.sort === 'rec') {
    const cats = [...new Set(list.map(x => x.category))];
    const libCats = cats.filter(c => list.some(x => x.category === c && x.kind === 'local'));
    const order = libCats.concat(cats.filter(c => !libCats.includes(c) && !isLibreCat(c)), cats.filter(c => !libCats.includes(c) && isLibreCat(c)));
    body = order.map(c => { const it = list.filter(x => x.category === c); return '<div class="grp-h"><h3>' + icon(catIcon(c), null, 14) + esc(isLibreCat(c) ? catLabel(c) + ' · libre' : c) + '<span>' + it.length + '</span></h3><button class="lnk sm" data-selcat="' + esc(c) + '">Marcar todos</button></div>' + listHTML(it); }).join('');
  } else body = listHTML(list);
  const seg = (k, l) => '<button class="sg' + (S.filter === k ? ' on' : '') + '" data-f="' + k + '">' + l + '</button>';
  main.innerHTML = '<div class="page fade">' +
    '<div class="head"><div class="stack"><span class="eyebrow">' + esc(crumb()) + '</span><h1>' + esc(titleOf()) + '</h1><span class="mut">' + list.length + (list.length !== scopeN ? ' de ' + scopeN : '') + ' programa' + (list.length === 1 ? '' : 's') + '</span></div><div class="row" style="gap:8px">' +
      '<button class="b sec sm" id="bsearch">' + icon('cloud', null, 15) + 'Buscar en winget</button><button class="ib" id="bscan" title="Volver a analizar la carpeta de instaladores" aria-label="Analizar carpeta">' + icon('refresh', null, 17) + '</button></div></div>' +
    note + iso +
    '<div class="tools"><div class="search">' + icon('search', '#A39C94', 17) + '<input id="q" placeholder="Buscar programa…" value="' + esc(S.q) + '" autocomplete="off">' + (S.q ? '<button class="clr" id="qclr" aria-label="Borrar búsqueda">' + icon('close', null, 14) + '</button>' : '<kbd>/</kbd>') + '</div>' +
      '<div class="segc">' + seg('all', 'Todos') + seg('todo', 'Sin instalar') + seg('inst', 'Instalados') + '</div>' +
      '<select id="sort" aria-label="Ordenar"><option value="rec"' + (S.sort === 'rec' ? ' selected' : '') + '>Recomendado</option><option value="name"' + (S.sort === 'name' ? ' selected' : '') + '>Nombre (A-Z)</option><option value="stars"' + (S.sort === 'stars' ? ' selected' : '') + '>Más populares</option></select>' +
      '<div class="segc ic"><button class="sg' + (S.layout === 'grid' ? ' on' : '') + '" data-lay="grid" title="Tarjetas" aria-label="Ver como tarjetas">' + icon('grid', null, 15) + '</button><button class="sg' + (S.layout === 'list' ? ' on' : '') + '" data-lay="list" title="Lista" aria-label="Ver como lista">' + icon('list', null, 15) + '</button></div>' +
      '<button class="ib" id="selall" title="Marcar todos los visibles" aria-label="Marcar todos los visibles">' + icon('sel', null, 17) + '</button></div>' +
    body + '</div>';
  bindGrid(list);
  renderDock();
  ghLazy(list);
}
function bindCard(c) {
  const toggle = () => { const id = c.dataset.id; if (S.sel.has(id)) S.sel.delete(id); else S.sel.add(id); main.querySelectorAll('[data-id="' + CSS.escape(id) + '"]').forEach(e => { e.classList.toggle('sel', S.sel.has(id)); e.setAttribute('aria-checked', S.sel.has(id)); }); renderDock(); };
  c.onclick = e => { if (e.target.closest('.more')) return; toggle(); };
  c.onkeydown = e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(); } };
  const m = c.querySelector('[data-edit]'); if (m) m.onclick = e => { e.stopPropagation(); editItem(byId(m.dataset.edit)); };
}
function bindGrid(list) {
  main.querySelectorAll('.prog,.lrow').forEach(bindCard);
  main.querySelectorAll('[data-f]').forEach(b => b.onclick = () => { S.filter = b.dataset.f; keepScroll(pGrid); });
  main.querySelectorAll('[data-lay]').forEach(b => b.onclick = () => { S.layout = b.dataset.lay; LS.set('layout', S.layout); keepScroll(pGrid); });
  main.querySelectorAll('[data-selcat]').forEach(b => b.onclick = () => { const it = list.filter(x => x.category === b.dataset.selcat); const all = it.every(x => S.sel.has(x.id)); it.forEach(x => all ? S.sel.delete(x.id) : S.sel.add(x.id)); keepScroll(pGrid); });
  $('#sort').onchange = e => { S.sort = e.target.value; LS.set('sort', S.sort); pGrid(); };
  const q = $q('#q'); if (q) q.oninput = () => { S.q = q.value; clearTimeout(q._t); q._t = setTimeout(() => { if (!S.q.trim() && S.cat === 'all') { S.cat = 'home'; } pGrid(); const n = $q('#q') || $q('#hq'); if (n) { n.focus(); n.setSelectionRange(n.value.length, n.value.length); } }, 160); };
  $('#qclr').onclick = () => { S.q = ''; pGrid(); };
  $('#bwq').onclick = () => searchModal(S.q);
  $('#bscan').onclick = async () => { $('#bscan').disabled = true; $('#bscan').innerHTML = '<span class="spin sm"></span>'; await load(true); toast('Biblioteca actualizada'); };
  $('#bsearch').onclick = () => searchModal();
  $('#selall').onclick = () => { const all = list.every(x => S.sel.has(x.id)); list.forEach(x => all ? S.sel.delete(x.id) : S.sel.add(x.id)); toast(all ? 'Selección quitada' : list.length + ' programas marcados'); keepScroll(pGrid); };
}

/* ---------- barra de selección ---------- */
function renderDock() {
  if (!ACTIVE()) { const dk = document.querySelector('#dock'); if (dk) dk.remove(); return; }
  let d = $q('#dock');
  if (S.view !== 'grid') { if (d) d.remove(); S.tray = false; return; }
  if (!d) { d = document.createElement('div'); d.id = 'dock'; d.className = 'dock'; document.body.appendChild(d); }
  const sel = [...S.sel].map(byId).filter(Boolean);
  const web = sel.filter(x => (x.kind === 'winget' && x.source !== 'msstore') || x.kind === 'github');
  const pend = sel.filter(x => !x.installed).length;
  if (!sel.length) S.tray = false;
  d.classList.toggle('idle', !sel.length);
  d.innerHTML = (S.tray ? '<div class="tray fade"><div class="row" style="margin-bottom:8px"><b class="grow">Tu selección</b><button class="lnk sm" id="tsave">' + icon('save', null, 13) + ' Guardar como kit</button><button class="lnk sm" id="tclr">Vaciar</button></div><div class="tlist">' +
      sel.map(x => '<div class="ti">' + avatar(x, 28) + '<span class="grow"><b>' + esc(x.name) + '</b><small>' + esc(catLabel(x.category)) + (x.installed ? ' · ya instalado' : '') + '</small></span><button class="ib sm" data-rm="' + esc(x.id) + '" aria-label="Quitar ' + esc(x.name) + '">' + icon('close', null, 13) + '</button></div>').join('') + '</div></div>' : '') +
    '<div class="dbar">' +
    (sel.length ? '<button class="selbtn" id="tray" aria-expanded="' + S.tray + '"><span class="stack-av">' + sel.slice(0, 4).map(x => avatar(x, 30)).join('') + '</span><span class="sum"><b>' + sel.length + ' seleccionado' + (sel.length === 1 ? '' : 's') + '</b><span>' + (pend < sel.length ? (sel.length - pend) + ' ya instalado' + (sel.length - pend > 1 ? 's' : '') + ' · ' : '') + 'Ver lista</span></span>' + icon(S.tray ? 'down' : 'chev', null, 15) + '</button>'
      : '<span class="sum idle">' + icon('sel', '#A39C94', 18) + '<span>Toca los programas que quieres instalar, o elige un kit</span></span>') +
    '<span class="grow"></span>' +
    '<label class="sw" title="Reinicia el equipo cuando termine la instalación"><input type="checkbox" id="rb"' + (S.reboot ? ' checked' : '') + '><i></i>Reiniciar al terminar</label>' +
    (S.winget || web.length ? '<button class="b sec" id="bdl"' + (web.length ? '' : ' disabled') + ' title="Guarda los instaladores en tu carpeta para usarlos sin internet">' + icon('dl', null, 16) + 'Descargar al kit' + (web.length ? ' · ' + web.length : '') + '</button>' : '') +
    '<button class="b lg" id="binst"' + (sel.length ? '' : ' disabled') + '>' + icon('play', '#140A02', 15) + 'Instalar' + (sel.length ? ' ' + sel.length : '') + '</button></div>';
  $('#rb').onchange = e => S.reboot = e.target.checked;
  $('#binst').onclick = () => startJob('install', sel.map(x => x.id));
  $('#bdl').onclick = () => startJob('download', web.map(x => x.id));
  $('#tray').onclick = () => { S.tray = !S.tray; renderDock(); };
  $('#tclr').onclick = () => { S.sel.clear(); S.tray = false; syncSel(); };
  $('#tsave').onclick = saveKit;
  d.querySelectorAll('[data-rm]').forEach(b => b.onclick = () => { S.sel.delete(b.dataset.rm); syncSel(); });
}
function syncSel() { main.querySelectorAll('[data-id]').forEach(e => { const on = S.sel.has(e.dataset.id); e.classList.toggle('sel', on); e.setAttribute('aria-checked', on); }); if (S.cat === 'home' && !S.q) keepScroll(pHome); else renderDock(); }
document.addEventListener('click', e => { if (S.tray && document.body.contains(e.target) && !e.target.closest('#dock')) { S.tray = false; renderDock(); } });

/* ---------- edición ---------- */
function modal(html, wide) {
  const m = document.createElement('div'); m.className = 'modal';
  m.innerHTML = '<div class="box' + (wide ? ' wide' : '') + ' pop" role="dialog" aria-modal="true">' + html + '</div>';
  const close = () => { m.remove(); window.removeEventListener('keydown', k); };
  m.onclick = e => { if (e.target === m) close(); };
  const k = e => { if (e.key === 'Escape') close(); };
  window.addEventListener('keydown', k);
  document.body.appendChild(m);
  m.close = close;
  return m;
}
function editItem(x) {
  if (!x) return;
  const cats = [...new Set(S.items.map(i => i.category))].sort();
  const isLocal = x.kind === 'local';
  const sub = isLocal ? x.file + ' · ' + (S.types[x.type] || x.type) : x.kind === 'github' ? 'github.com/' + x.repo : x.wingetId + (x.source ? ' · ' + x.source : '');
  const g = x.kind === 'github' ? S.gh[x.repo] : null;
  const m = modal('<div class="mh">' + avatar(x, 52) + '<span class="grow"><span class="eyebrow">' + (isLocal ? 'Instalador local' : x.kind === 'github' ? 'Software libre' : 'Catálogo winget') + '</span><h2>' + esc(x.name) + '</h2><span class="mut mono" style="font-size:12px">' + esc(sub) + '</span></span><button class="ib" data-x aria-label="Cerrar">' + icon('close', null, 16) + '</button></div>' +
    (x.kind === 'github' ? '<div class="facts">' + (starsOf(x) > 0 ? '<span>' + icon('star', null, 13) + fmtStars(starsOf(x)) + ' estrellas</span>' : '') + (g && g.version ? '<span>Versión ' + esc(g.version) + '</span>' : '') + (g && g.file ? '<span class="mono">' + esc(g.file) + '</span>' : '') + (x.portable ? '<span>Portable</span>' : '') + '</div>' : '') +
    '<div class="fgrid"><label class="field"><span>Nombre</span><input id="en" value="' + esc(x.name) + '"></label>' +
    '<label class="field"><span>Categoría</span><input id="ec" list="catl" value="' + esc(x.category) + '"><datalist id="catl">' + cats.map(c => '<option value="' + esc(c) + '">').join('') + '</datalist></label></div>' +
    '<div class="field"><span>Modo de instalación</span><div class="segc wide"><button class="sg' + (x.mode !== 'normal' ? ' on' : '') + '" data-m="silent">' + icon('bolt', null, 14) + 'Silencioso<small>sin preguntas</small></button><button class="sg' + (x.mode === 'normal' ? ' on' : '') + '" data-m="normal">' + icon('monitor', null, 14) + 'Normal<small>con las ventanas del instalador</small></button></div></div>' +
    (isLocal && x.type !== 'msix' ? '<label class="field"><span>Parámetros silenciosos' + (x.type ? ' · sugeridos para ' + esc(S.types[x.type] || x.type) + ': <span class="code">' + esc(S.silent[x.type] || 'ninguno conocido') + '</span>' : '') + '</span><input id="ea" class="mono" value="' + esc(x.args) + '" placeholder="Ej: /S  ·  /VERYSILENT  ·  /quiet"></label>' : '') +
    '<label class="field"><span>Para qué sirve</span><input id="ed" value="' + esc(x.desc || '') + '" placeholder="Ej: Driver de sonido Realtek" maxlength="140"></label>' +
    '<label class="field"><span>Texto para detectar si ya está instalado</span><input id="ex" value="' + esc(x.match) + '"></label>' +
    '<label class="sw" style="margin-top:16px"><input type="checkbox" id="eh"' + (x.hidden ? ' checked' : '') + '><i></i>Ocultar de la lista</label>' +
    '<div class="row" style="gap:10px;margin-top:22px"><button class="lnk" id="erst">Restablecer</button><span class="grow"></span><button class="b sec" data-x>Cancelar</button><button class="b" id="esv">Guardar</button></div>');
  let mode = x.mode === 'normal' ? 'normal' : 'silent';
  m.querySelectorAll('[data-m]').forEach(b => b.onclick = () => { mode = b.dataset.m; m.querySelectorAll('[data-m]').forEach(o => o.classList.toggle('on', o === b)); });
  m.querySelectorAll('[data-x]').forEach(b => b.onclick = () => m.close());
  m.querySelector('#esv').onclick = async () => {
    const a = m.querySelector('#ea');
    await api('/api/item', { id: x.id, name: m.querySelector('#en').value.trim(), category: m.querySelector('#ec').value.trim(), mode, args: a ? a.value.trim() : '', match: (m.querySelector('#ex').value.trim() === x.match && x.match === x.name) ? m.querySelector('#en').value.trim() : m.querySelector('#ex').value.trim(), hidden: m.querySelector('#eh').checked, desc: m.querySelector('#ed').value.trim() });
    m.close(); await load(); toast('Guardado');
  };
  m.querySelector('#erst').onclick = async () => { await api('/api/item', { id: x.id }); m.close(); await load(); toast('Valores restablecidos'); };
  m.querySelector('#en').focus();
}

/* ---------- búsqueda en winget ---------- */
function searchModal(q0) {
  const cats = [...new Set(S.items.map(i => i.category))].sort();
  const m = modal('<div class="row"><span class="grow"><span class="eyebrow">Catálogo en línea</span><h2 style="margin-top:4px">Buscar en winget</h2></span><button class="ib" data-x aria-label="Cerrar">' + icon('close', null, 16) + '</button></div>' +
    '<p class="mut" style="margin-top:6px;font-size:13px">Más de 10.000 programas oficiales. Agrega los que uses a tu catálogo.</p>' +
    '<div class="row" style="gap:10px;margin-top:14px"><div class="search">' + icon('search', '#A39C94', 17) + '<input id="sq" placeholder="Ej: samsung, office, photoshop, drivers"></div><button class="b" id="sgo">Buscar</button></div>' +
    '<div class="row" style="gap:10px;margin-top:12px;font-size:13px"><span class="mut">Agregar en la categoría</span><input id="scat" list="catl2" value="Agregados" style="height:36px;border-radius:10px;border:1px solid var(--line);background:var(--card2);color:var(--txt);padding:0 10px"><datalist id="catl2">' + cats.map(c => '<option value="' + esc(c) + '">').join('') + '</datalist></div>' +
    '<div id="sres" style="margin-top:14px"></div>', true);
  m.querySelector('[data-x]').onclick = () => m.remove();
  const inp = m.querySelector('#sq'); inp.focus();
  const go = async () => {
    const q = inp.value.trim(); if (q.length < 2) return;
    const out = m.querySelector('#sres');
    out.innerHTML = '<div class="row" style="gap:10px"><span class="spin sm"></span><span class="mut">Buscando «' + esc(q) + '»…</span></div>';
    let r; try { r = await api('/api/search?q=' + encodeURIComponent(q)); } catch (e) { r = { err: 'Error al buscar' }; }
    if (r.err) { out.innerHTML = '<p class="mut">' + esc(r.err) + '</p>'; return; }
    const res = r.results || [];
    if (!res.length) { out.innerHTML = '<p class="mut">Sin resultados.</p>'; return; }
    const have = new Set(S.items.filter(x => x.wingetId).map(x => x.wingetId.toLowerCase()));
    out.innerHTML = '<div class="list">' + res.map((x, k) => '<div class="qrow"><span class="tx"><b>' + esc(x.name) + '</b><span class="mono">' + esc(x.id) + (x.version ? ' · ' + esc(x.version) : '') + '</span></span>' + (x.source ? '<span class="tag' + (x.source === 'msstore' ? ' store' : '') + '">' + esc(x.source) + '</span>' : '') +
      (have.has(x.id.toLowerCase()) ? '<span class="pill ok">En tu catálogo</span>' : '<button class="b sec sm" data-add="' + k + '">' + icon('plus', null, 14) + 'Agregar</button>') + '</div>').join('') + '</div>';
    out.querySelectorAll('[data-add]').forEach(b => b.onclick = async () => {
      const x = res[+b.dataset.add];
      await api('/api/catalog/add', { wingetId: x.id, name: x.name, category: m.querySelector('#scat').value.trim() || 'Agregados', desc: 'Agregado desde winget', source: x.source === 'msstore' ? 'msstore' : '', match: x.name });
      S.sel.add('w:' + x.id);
      b.outerHTML = '<span class="pill ok">Agregado y seleccionado</span>';
      load();
    });
  };
  m.querySelector('#sgo').onclick = go;
  inp.onkeydown = e => { if (e.key === 'Enter') go(); };
  if (q0) { inp.value = q0; go(); }
}

/* ---------- cola de instalación ---------- */
let pollT = 0;
async function startJob(op, ids) {
  if (!ids.length) return;
  if (op === 'install' && !S.admin) toast('Acepta el permiso de administrador de Windows');
  let r; try { r = await api('/api/install', { ids, op, reboot: op === 'install' && S.reboot }); } catch (e) { r = { ok: false, msg: 'Error de comunicación' }; }
  if (!r.ok) { toast(r.msg || 'No se pudo iniciar'); return; }
  S.view = 'queue'; S.job = null; render(); poll();
}
async function poll() {
  clearTimeout(pollT);
  try { const r = await api('/api/job'); if (r.job) { S.job = r.job; S.job.stale = r.stale; } } catch (e) {}
  if (S.view === 'queue') pQueue();
  if (S.job && !S.job.done && !S.job.stale) pollT = setTimeout(poll, 1000);
  else if (S.job && S.job.done) load();
}
const ST = { pending: ['', 'En espera'], running: ['run', 'Instalando…'], ok: ['ok', 'Listo'], error: ['error', 'Error'], cancelled: ['cancelled', 'Cancelado'] };
function ring(pct, color) {
  const r = 52, c = 2 * Math.PI * r;
  return '<svg width="128" height="128" viewBox="0 0 128 128" aria-hidden="true"><circle cx="64" cy="64" r="' + r + '" fill="none" stroke="#2A2622" stroke-width="10"/><circle cx="64" cy="64" r="' + r + '" fill="none" stroke="' + color + '" stroke-width="10" stroke-linecap="round" stroke-dasharray="' + c + '" stroke-dashoffset="' + (c * (1 - pct / 100)) + '" transform="rotate(-90 64 64)" style="transition:stroke-dashoffset .6s"/></svg>';
}
function pQueue() {
  if (!ACTIVE()) return;
  const j = S.job;
  if (!j) { main.innerHTML = '<div class="page fade" style="max-width:820px"><div class="qhero"><div class="ring">' + ring(0, '#FF6900') + '<div class="in"><span class="spin sm"></span></div></div><div><span class="eyebrow">Preparando</span><h1>Esperando el permiso de Windows</h1><p class="mut">Acepta el aviso de «Control de cuentas de usuario». Si no lo ves, revisa la barra de tareas.</p></div></div></div>'; return; }
  const n = j.items.length, done = j.items.filter(x => ['ok', 'error', 'cancelled'].includes(x.status)).length;
  const ok = j.items.filter(x => x.status === 'ok').length, err = j.items.filter(x => x.status === 'error').length, can = j.items.filter(x => x.status === 'cancelled').length;
  const isDl = j.items[0] && j.items[0].op === 'download';
  const cur = j.items.find(x => x.status === 'running');
  const pct = Math.round(done / n * 100);
  const col = j.done ? (err && !ok ? '#F87171' : err ? '#FBBF24' : '#4ADE80') : '#FF6900';
  const head = j.done ? (err ? (ok ? 'Terminó con ' + err + ' error' + (err > 1 ? 'es' : '') : 'No se pudo ' + (isDl ? 'descargar' : 'instalar')) : can && !ok ? 'Cancelado' : (isDl ? 'Descargas listas' : '¡Todo instalado!')) : (isDl ? 'Descargando' : 'Instalando') + ' ' + Math.min(done + 1, n) + ' de ' + n;
  const sub = j.done ? (isDl ? 'Los instaladores quedaron en tu carpeta para usarlos sin internet.' : ok ? ok + ' programa' + (ok > 1 ? 's' : '') + ' listo' + (ok > 1 ? 's' : '') + ' en este equipo.' : 'Revisa el motivo de cada error abajo.') : cur ? (cur.op === 'download' ? 'Descargando ' : cur.mode === 'normal' ? 'Sigue los pasos del instalador de ' : 'Instalando en silencio ') + cur.name + '…' : 'Preparando…';
  const dur = s => { if (!s.start) return ''; const t = (s.end || Date.now() / 1000) - s.start; return t < 60 ? Math.max(1, Math.round(t)) + ' s' : Math.floor(t / 60) + ' min ' + Math.round(t % 60) + ' s'; };
  const total = j.started ? Math.max(1, Math.max(0, ...j.items.map(s => s.end || 0)) - j.started) : 0;
  main.innerHTML = '<div class="page fade" style="max-width:860px">' +
    '<div class="qhero"><div class="ring">' + ring(j.done ? 100 : pct, col) + '<div class="in">' + (j.done ? icon(err && !ok ? 'close' : err ? 'warn' : 'check', col, 34, 3) : '<b class="big" style="font-size:28px">' + pct + '%</b>') + '</div></div>' +
    '<div class="grow"><span class="eyebrow">' + (isDl ? 'Descarga al kit' : 'Instalación') + '</span><h1>' + esc(head) + '</h1><p class="mut" style="margin-top:6px">' + esc(sub) + '</p>' +
    (j.done ? '<div class="qstats"><span class="ok">' + icon('check', null, 13, 3) + ok + ' listo' + (ok === 1 ? '' : 's') + '</span>' + (err ? '<span class="bad">' + icon('close', null, 13, 3) + err + ' con error</span>' : '') + (can ? '<span>' + can + ' cancelado' + (can > 1 ? 's' : '') + '</span>' : '') + '<span>' + icon('clock', null, 13) + (total < 60 ? Math.round(total) + ' s' : Math.round(total / 60) + ' min') + '</span></div>' : '') + '</div></div>' +
    (j.stale && !j.done ? banner('warn', 'El instalador no responde', 'Puede que Windows esté mostrando una ventana del instalador detrás de esta. Revisa la barra de tareas.') : '') +
    (j.error ? '<div class="verdict bad" style="margin:0 0 14px"><span class="vi">' + icon('close', '#2A0606', 14, 3) + '</span><span><b>' + esc(j.error) + '</b></span></div>' : '') +
    '<div class="list">' + j.items.map(x => { const s = ST[x.status] || ['', x.status]; const it = byId(x.id) || { name: x.name, id: x.id };
      const ic = x.status === 'running' ? '<span class="spin sm"></span>' : x.status === 'ok' ? icon('check', '#06210F', 13, 3) : x.status === 'error' ? icon('close', '#2A0606', 13, 3) : x.status === 'cancelled' ? icon('close', '#0D0C0B', 12, 3) : '<i class="dotp"></i>';
      return '<div class="qrow ' + s[0] + '">' + avatar(it, 36) + '<span class="tx"><b>' + esc(x.name) + '</b><span>' + esc(x.status === 'pending' ? s[1] : x.status === 'running' ? (x.op === 'download' ? 'Descargando…' : x.mode === 'normal' ? 'Sigue los pasos del instalador…' : 'Instalando en silencio…') : x.msg || s[1]) + '</span></span><span class="time">' + dur(x) + '</span><span class="st ' + s[0] + '">' + ic + '</span></div>'; }).join('') + '</div>' +
    (j.done ? (j.rebootNeeded && !j.reboot ? banner('warn', 'Reinicia el equipo', 'Algunos programas necesitan reiniciar para terminar.') : '') +
      (j.reboot && ok ? banner('warn', 'El equipo se reiniciará en 1 minuto', 'Para cancelarlo ejecuta: shutdown /a') : '') +
      '<div class="row wrap" style="gap:10px;margin-top:20px"><button class="b" id="qback">' + icon('home', '#140A02', 15) + 'Volver al inicio</button>' + (err ? '<button class="b sec" id="qretry">' + icon('refresh', null, 15) + 'Reintentar los que fallaron</button><button class="b sec" id="qlog">' + icon('doc', null, 15) + 'Ver detalles técnicos</button>' : '') + (isDl && ok ? '<button class="b sec" id="qfold">' + icon('folder', null, 15) + 'Ver carpeta</button>' : '') + '</div>'
      : '<div class="row wrap" style="gap:12px;margin-top:20px"><button class="b sec" id="qcancel">' + icon('close', null, 15) + 'Cancelar lo que falta</button><span class="mut" style="font-size:12.5px">Puedes minimizar esta ventana; la instalación sigue.</span></div>') + '</div>';
  $('#qback').onclick = () => { S.view = 'grid'; S.sel.clear(); S.cat = 'home'; S.q = ''; render(); };
  $('#qretry').onclick = () => startJob(isDl ? 'download' : 'install', j.items.filter(x => x.status === 'error').map(x => x.id));
  $('#qfold').onclick = () => api('/api/open', { what: 'folder' });
  $('#qlog').onclick = () => api('/api/open', { what: 'log' });
  $('#qcancel').onclick = async () => { if (confirm('¿Cancelar las instalaciones pendientes? La que está en curso se detendrá.')) { await api('/api/cancel', {}); toast('Cancelando…'); } };
}

/* ---------- render y arranque (lo controla el shell) ---------- */
function render() { if (!ACTIVE()) return; renderSide(); if (S.view === 'queue') { pQueue(); renderDock(); } else pGrid(); }
async function init() {
  await load();
  api('/api/ghstars').then(g => { S.stars = g || {}; if (S.view === 'grid' && !$q('.modal')) keepScroll(pGrid); }).catch(() => {});
  try { const r = await api('/api/job'); if (r.job && !r.job.done && !r.stale) { S.job = r.job; S.view = 'queue'; render(); poll(); } } catch (e) {}
}
function mount() { render(); }
function unmount() { const dk = document.querySelector('#dock'); if (dk) dk.remove(); S.tray = false; }
/* abre el instalador con programas ya marcados (recomendados por el diagnóstico) */
function recommend(ids, title) { ids.filter(id => byId(id)).forEach(id => S.sel.add(id)); S.cat = 'home'; S.q = ''; S.view = S.job && !S.job.done && !S.job.stale ? 'queue' : 'grid'; render(); main.scrollTop = 0; toast((title || 'Recomendados') + ': ' + ids.filter(id => byId(id)).length + ' programas marcados'); }
window.addEventListener('keydown', e => {
  if (!ACTIVE()) return;
  const typing = /INPUT|TEXTAREA|SELECT/.test((document.activeElement || {}).tagName || '');
  if ((e.ctrlKey && e.key.toLowerCase() === 'k') || (e.key === '/' && !typing)) {
    if ($q('.modal') || S.view !== 'grid') return;
    e.preventDefault(); const i = $q('#q') || $q('#hq'); if (i) { i.focus(); i.select(); }
  }
  if (e.key === 'Escape' && typing && document.activeElement.id === 'q' && S.q) { S.q = ''; if (S.cat === 'all') S.cat = 'home'; pGrid(); }
});
return { init, mount, unmount, recommend, has: id => !!byId(id), item: id => byId(id), setAdmin(a) { S.admin = a; }, get busy() { return !!(S.job && !S.job.done && !S.job.stale); } };
})();
