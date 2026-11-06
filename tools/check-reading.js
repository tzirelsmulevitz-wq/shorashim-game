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

if (errs.length) fail(errs);
console.log(`OK: ${S.length} stories. Newest: "${S[0].title}" (${S[0].topic}).`);
