/* ===== Handwriting recognizer: strokes -> digits. Small neural net trained on ~8,500 handwritten digits; runs on the iPad. ===== */
const HW = (() => {
  let model = null;
  async function load(url) {
    const j = await (await fetch(url)).json();
    model = j.layers.map(L => {
      const raw = atob(L.w), q = new Int8Array(raw.length);
      for (let i = 0; i < raw.length; i++) q[i] = (raw.charCodeAt(i) << 24) >> 24;
      const W = new Float32Array(q.length); for (let i = 0; i < q.length; i++) W[i] = q[i] * L.scale;
      return { inn: L.in, out: L.out, W, b: Float32Array.from(L.b) };
    });
    return true;
  }
  function predict(x) {                       // x: Float32Array(784) -> {digit, conf}
    let h = x;
    model.forEach((L, li) => {
      const o = new Float32Array(L.out); o.set(L.b);
      for (let i = 0; i < L.inn; i++) { const v = h[i]; if (!v) continue; const row = i * L.out; for (let j = 0; j < L.out; j++) o[j] += v * L.W[row + j]; }
      if (li < model.length - 1) for (let j = 0; j < o.length; j++) if (o[j] < 0) o[j] = 0;
      h = o;
    });
    let m = -Infinity, k = 0; for (let j = 0; j < h.length; j++) if (h[j] > m) { m = h[j]; k = j; }
    let s = 0; for (let j = 0; j < h.length; j++) s += Math.exp(h[j] - m);
    return { digit: k, conf: 1 / s };
  }
  /* same steps as training: crop to ink, longer side to 20px (bilinear), center of mass at (14,14) */
  function normalize(img, H, W) {
    let r0 = H, r1 = -1, c0 = W, c1 = -1;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (img[y * W + x] > 0.15) { if (y < r0) r0 = y; if (y > r1) r1 = y; if (x < c0) c0 = x; if (x > c1) c1 = x; }
    const out = new Float32Array(784); if (r1 < 0) return out;
    const h = r1 - r0 + 1, w = c1 - c0 + 1, s = 20 / Math.max(h, w);
    const zh = Math.max(1, Math.round(h * s)), zw = Math.max(1, Math.round(w * s)), z = new Float32Array(zh * zw);
    for (let y = 0; y < zh; y++) for (let x = 0; x < zw; x++) {
      const sy = zh > 1 ? y * (h - 1) / (zh - 1) : 0, sx = zw > 1 ? x * (w - 1) / (zw - 1) : 0;
      const y0 = Math.floor(sy), x0 = Math.floor(sx), y1 = Math.min(y0 + 1, h - 1), x1 = Math.min(x0 + 1, w - 1), fy = sy - y0, fx = sx - x0;
      const g = (yy, xx) => img[(r0 + yy) * W + c0 + xx];
      z[y * zw + x] = Math.min(1, Math.max(0, g(y0, x0) * (1 - fy) * (1 - fx) + g(y0, x1) * (1 - fy) * fx + g(y1, x0) * fy * (1 - fx) + g(y1, x1) * fy * fx));
    }
    let m = 0, my = 0, mx = 0; for (let y = 0; y < zh; y++) for (let x = 0; x < zw; x++) { const v = z[y * zw + x]; m += v; my += v * y; mx += v * x; }
    const cy = m ? my / m : zh / 2, cx = m ? mx / m : zw / 2, oy = Math.round(14 - cy), ox = Math.round(14 - cx);
    for (let y = 0; y < zh; y++) { const ty = y + oy; if (ty < 0 || ty > 27) continue;
      for (let x = 0; x < zw; x++) { const tx = x + ox; if (tx >= 0 && tx < 28) out[ty * 28 + tx] = z[y * zw + x]; } }
    return out;
  }
  /* group strokes into digits left to right: strokes that overlap sideways belong to the same digit */
  function group(strokes) {
    const boxes = strokes.filter(s => s.length).map(s => { let a = Infinity, b = -Infinity, c = Infinity, d = -Infinity;
      for (const [x, y] of s) { if (x < a) a = x; if (x > b) b = x; if (y < c) c = y; if (y > d) d = y; } return { s: [s], x0: a, x1: b, y0: c, y1: d }; });
    boxes.sort((p, q) => p.x0 - q.x0);
    const gs = [];
    for (const b of boxes) {
      const g = gs[gs.length - 1];
      if (g) { const ov = Math.min(g.x1, b.x1) - Math.max(g.x0, b.x0), narrow = Math.min(g.x1 - g.x0, b.x1 - b.x0);
        if (ov > 0.3 * narrow || ov > 0.45 * Math.min(g.y1 - g.y0, b.y1 - b.y0)) {
          g.s.push(...b.s); g.x0 = Math.min(g.x0, b.x0); g.x1 = Math.max(g.x1, b.x1); g.y0 = Math.min(g.y0, b.y0); g.y1 = Math.max(g.y1, b.y1); continue; } }
      gs.push({ ...b });
    }
    return gs;
  }
  const off = document.createElement('canvas'); off.width = off.height = 112; const octx = off.getContext('2d', { willReadFrequently: true });
  function rasterize(g) {                    // draw one digit's strokes at 4x, average down to 28x28
    const bw = Math.max(g.x1 - g.x0, 1), bh = Math.max(g.y1 - g.y0, 1), s = 84 / Math.max(bw, bh);
    const ox = 56 - (g.x0 + bw / 2) * s, oy = 56 - (g.y0 + bh / 2) * s;
    octx.setTransform(1, 0, 0, 1, 0, 0); octx.clearRect(0, 0, 112, 112);
    octx.lineWidth = 10; octx.lineCap = octx.lineJoin = 'round'; octx.strokeStyle = '#000'; octx.fillStyle = '#000';
    for (const st of g.s) {
      if (st.length === 1) { octx.beginPath(); octx.arc(st[0][0] * s + ox, st[0][1] * s + oy, 5, 0, 7); octx.fill(); continue; }
      octx.beginPath(); st.forEach(([x, y], i) => i ? octx.lineTo(x * s + ox, y * s + oy) : octx.moveTo(x * s + ox, y * s + oy)); octx.stroke();
    }
    const a = octx.getImageData(0, 0, 112, 112).data, img = new Float32Array(784);
    for (let y = 0; y < 28; y++) for (let x = 0; x < 28; x++) { let t = 0;
      for (let dy = 0; dy < 4; dy++) for (let dx = 0; dx < 4; dx++) t += a[((y * 4 + dy) * 112 + x * 4 + dx) * 4 + 3];
      img[y * 28 + x] = t / (16 * 255); }
    return normalize(img, 28, 28);
  }
  function read(strokes) {                   // -> {text, conf}
    if (!model) return { text: '', conf: 0 };
    const gs = group(strokes); if (!gs.length) return { text: '', conf: 0 };
    let text = '', conf = 1;
    for (const g of gs) { const p = predict(rasterize(g)); text += p.digit; conf = Math.min(conf, p.conf); }
    return { text: text.replace(/^0+(?=\d)/, ''), conf };
  }
  return { load, read, predict, normalize, ready: () => !!model };
})();
