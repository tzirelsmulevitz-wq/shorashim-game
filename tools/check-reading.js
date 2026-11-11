#!/usr/bin/env node
// Checks the STORIES data in reading/index.html before it is published.
// Usage (from the repo folder): node tools/check-reading.js
// Prints "OK" and exits 0 when everything is fine; otherwise lists each problem and exits 1.
const fs = require('fs'), vm = require('vm'), path = require('path');

const file = path.join(__dirname, '..', 'reading', 'index.html');
const html = fs.readFileSync(file, 'utf8');
const errs = [];
const fail = list => { list.forEach(e => console.log('✗ ' + e)); process.exit(1); };

const m = html.match(/const STORIES = (\[[\s\S]*?\n\]);/);
if (!m) fail(['Could not find "const STORIES = [ ... ];" in reading/index.html']);
let S;
try { S = vm.runInNewContext('(' + m[1] + ')'); } catch (e) { fail(['STORIES is not valid JavaScript: ' + e.message]); }
if (!Array.isArray(S) || !S.length) fail(['STORIES is empty']);

const ids = new Set(), titles = new Set();
S.forEach((s, n) => {
  const at = `story ${n + 1} (${s.id || 'no id'})`;
  ['id', 'title', 'topic', 'emoji'].forEach(k => { if (typeof s[k] !== 'string' || !s[k].trim()) errs.push(`${at}: missing ${k}`); });
  if (!/^[a-z0-9-]+$/.test(s.id || '')) errs.push(`${at}: id must be lowercase-with-dashes`);
  if (ids.has(s.id)) errs.push(`${at}: duplicate id`);
  if (titles.has(s.title)) errs.push(`${at}: duplicate title`);
  ids.add(s.id); titles.add(s.title);
  if (s.type === 'adventure') return checkAdventure(s, at);

  if (!Array.isArray(s.paras) || !s.paras.length) { errs.push(`${at}: no paragraphs`); return; }
  if (s.paras.some(p => typeof p !== 'string' || !p.trim())) errs.push(`${at}: empty paragraph`);
  const text = s.paras.join(' ');
  const words = s.paras.map(p => p.replace(/^## /, '')).join(' ').split(/\s+/).filter(Boolean).length;
  if (words < 150 || words > 450) errs.push(`${at}: ${words} words (aim for 220–350)`);
  if (/["<>]/.test(text)) errs.push(`${at}: story text has a straight " or HTML; use curly quotes “ ” and plain text`);

  if (!Array.isArray(s.qs) || s.qs.length < 5 || s.qs.length > 8) errs.push(`${at}: needs 5–8 questions`);
  (s.qs || []).forEach((q, i) => {
    const qa = `${at} Q${i + 1}`;
    if (typeof q.q !== 'string' || !q.q.trim()) errs.push(`${qa}: missing question text`);
    if (!Array.isArray(q.a) || q.a.length !== 4) errs.push(`${qa}: needs exactly 4 answers, right one first`);
    else if (new Set(q.a).size !== 4) errs.push(`${qa}: two answers are the same`);
    if (typeof q.why !== 'string' || !q.why.trim()) errs.push(`${qa}: missing "why"`);
    if (!Array.isArray(q.look) || !q.look.length) errs.push(`${qa}: needs at least one "look" sentence`);
    (q.look || []).forEach(l => { if (!text.includes(l)) errs.push(`${qa}: "look" text is not word-for-word in the story: ${l}`); });
  });
});

// Choose-your-path adventures: every choice goes to a real page, every page can be reached
// from the start, every page eventually leads to an ending, and the quick checks are sound.
function checkAdventure(s, at) {
  const N = s.nodes || {}, keys = Object.keys(N);
  if (!keys.length) return errs.push(`${at}: no pages`);
  if (!N[s.start]) errs.push(`${at}: start page "${s.start}" not found`);
  let words = 0, endings = 0, supers = 0, checks = 0;
  keys.forEach(k => {
    const n = N[k], pa = `${at} page "${k}"`;
    if (!/^[a-z0-9-]+$/.test(k)) errs.push(`${pa}: page names must be lowercase-with-dashes`);
    if (!Array.isArray(n.paras) || !n.paras.length || n.paras.some(p => typeof p !== 'string' || !p.trim())) return errs.push(`${pa}: needs paragraphs`);
    const text = n.paras.join(' ');
    if (/["<>]/.test(text)) errs.push(`${pa}: straight " or HTML in the text; use curly quotes`);
    words += text.split(/\s+/).filter(Boolean).length;
    if (n.ending) {
      endings++; if (n.ending.kind === 'super') supers++;
      if (!['super', 'good', 'oops'].includes(n.ending.kind)) errs.push(`${pa}: ending kind must be super, good or oops`);
      if (!n.ending.title || !n.ending.tip) errs.push(`${pa}: ending needs a title and a tip`);
      if (n.choices && n.choices.length) errs.push(`${pa}: an ending page can't have choices`);
      if (n.check) errs.push(`${pa}: no quick check on an ending page`);
    } else {
      if (!Array.isArray(n.choices) || n.choices.length < 1 || n.choices.length > 3) errs.push(`${pa}: needs 1–3 choices`);
      (n.choices || []).forEach(c => { if (!c.text || !N[c.to]) errs.push(`${pa}: choice "${c.text}" goes to a missing page "${c.to}"`); });
    }
    if (n.check) {
      checks++;
      const c = n.check;
      if (!c.q || !c.why) errs.push(`${pa}: quick check needs q and why`);
      if (!Array.isArray(c.a) || c.a.length < 3 || c.a.length > 4 || new Set(c.a).size !== c.a.length) errs.push(`${pa}: quick check needs 3–4 different answers, right one first`);
      if (!Array.isArray(c.look) || !c.look.length) errs.push(`${pa}: quick check needs a "look" sentence`);
      (c.look || []).forEach(l => { if (!text.includes(l)) errs.push(`${pa}: "look" text is not word-for-word on this page: ${l}`); });
    }
  });
  const reach = new Set(), stack = [s.start];
  while (stack.length) { const k = stack.pop(); if (reach.has(k) || !N[k]) continue; reach.add(k); (N[k].choices || []).forEach(c => stack.push(c.to)); }
  keys.filter(k => !reach.has(k)).forEach(k => errs.push(`${at}: page "${k}" can't be reached from the start`));
  const canEnd = new Set(keys.filter(k => N[k].ending));
  for (let grew = true; grew;) { grew = false; keys.forEach(k => { if (!canEnd.has(k) && (N[k].choices || []).some(c => canEnd.has(c.to))) { canEnd.add(k); grew = true; } }); }
  keys.filter(k => !canEnd.has(k)).forEach(k => errs.push(`${at}: page "${k}" never leads to an ending`));
  if (endings < 3) errs.push(`${at}: needs at least 3 endings`);
  if (supers < 1) errs.push(`${at}: needs a super ending`);
  if (checks < 3) errs.push(`${at}: needs at least 3 quick checks`);
  if (words < 500 || words > 2200) errs.push(`${at}: ${words} words across all pages (aim for 800–1500)`);
}

if (errs.length) fail(errs);
console.log(`OK: ${S.length} stories. Newest: "${S[0].title}" (${S[0].topic}).`);
