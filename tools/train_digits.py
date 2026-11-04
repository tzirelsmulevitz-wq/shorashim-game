import json, sys, time, base64, numpy as np
from scipy import ndimage
from sklearn.neural_network import MLPClassifier
rng = np.random.default_rng(7)
D = sys.argv[1]; OUT = sys.argv[2]

def normalize(img):
    """Crop to ink, scale longer side to 20px, center of mass at (14,14) in 28x28. Mirrored exactly in the game's JS."""
    m = img > 0.15
    if not m.any(): return np.zeros((28, 28), np.float32)
    r = np.where(m.any(1))[0]; c = np.where(m.any(0))[0]
    crop = img[r[0]:r[-1]+1, c[0]:c[-1]+1]
    h, w = crop.shape; s = 20.0 / max(h, w)
    z = np.clip(ndimage.zoom(crop, (max(1, round(h*s))/h, max(1, round(w*s))/w), order=1), 0, 1)
    out = np.zeros((28, 28), np.float32)
    cy, cx = ndimage.center_of_mass(z) if z.sum() > 0 else (z.shape[0]/2, z.shape[1]/2)
    oy, ox = int(round(14 - cy)), int(round(14 - cx))
    for y in range(z.shape[0]):
        ty = y + oy
        if 0 <= ty < 28:
            for x in range(z.shape[1]):
                tx = x + ox
                if 0 <= tx < 28: out[ty, tx] = z[y, x]
    return out

def augment(img):
    a = np.deg2rad(rng.uniform(-14, 14)); sh = rng.uniform(-0.25, 0.25); sc = rng.uniform(0.8, 1.15)
    M = np.array([[np.cos(a), -np.sin(a)], [np.sin(a), np.cos(a)]]) @ np.array([[1, sh], [0, 1]]) / sc
    cen = np.array([14, 14]); off = cen - M @ cen
    o = ndimage.affine_transform(img, M, offset=off, order=1)
    t = rng.random()
    if t < 0.3: o = ndimage.grey_dilation(o, size=(2, 2))
    elif t < 0.4: o = ndimage.grey_erosion(o, size=(2, 2)) * 0.5 + o * 0.5
    return np.clip(o, 0, 1)

X, y = [], []
for d in range(10):
    arr = np.array(json.load(open(f'{D}/{d}.json'))['data'], np.float32).reshape(-1, 28, 28)
    X.append(arr); y += [d] * len(arr)
X = np.concatenate(X); y = np.array(y)
idx = rng.permutation(len(X)); X, y = X[idx], y[idx]
n_test = 1500
Xte_raw, yte = X[:n_test], y[:n_test]; Xtr_raw, ytr0 = X[n_test:], y[n_test:]
t0 = time.time()
Xte = np.stack([normalize(i) for i in Xte_raw]).reshape(n_test, -1)
base = [normalize(i) for i in Xtr_raw]
Xtr = [b for b in base]; ytr = list(ytr0)
for k in range(5):
    Xtr += [normalize(augment(b)) for b in base]; ytr += list(ytr0)
Xtr = np.stack(Xtr).reshape(len(Xtr), -1); ytr = np.array(ytr)
print('train', Xtr.shape, 'test', Xte.shape, f'prep {time.time()-t0:.0f}s', flush=True)
# also a harder test: augmented versions of the held-out digits
Xte_aug = np.stack([normalize(augment(i)) for i in Xte_raw]).reshape(n_test, -1)

clf = MLPClassifier(hidden_layer_sizes=(160, 64), alpha=2e-4, batch_size=256, learning_rate_init=1e-3,
                    max_iter=40, early_stopping=True, validation_fraction=0.08, n_iter_no_change=6, random_state=1, verbose=False)
t0 = time.time(); clf.fit(Xtr, ytr)
print(f'trained {time.time()-t0:.0f}s, epochs {clf.n_iter_}', flush=True)
print('held-out accuracy:', round(clf.score(Xte, yte)*100, 2), '%  | held-out, tilted/thick:', round(clf.score(Xte_aug, yte)*100, 2), '%')

# export, 8-bit quantized per layer
layers = []
for W, b in zip(clf.coefs_, clf.intercepts_):
    s = float(np.abs(W).max() / 127)
    q = np.clip(np.round(W / s), -127, 127).astype(np.int8)
    layers.append({'in': W.shape[0], 'out': W.shape[1], 'scale': s, 'w': base64.b64encode(q.tobytes()).decode(), 'b': [round(float(v), 5) for v in b]})
json.dump({'layers': layers}, open(OUT + '/digits-model.json', 'w'))
# check quantized model gives same accuracy
def fwd(Xs):
    h = Xs
    for i, L in enumerate(layers):
        W = np.frombuffer(base64.b64decode(L['w']), np.int8).reshape(L['in'], L['out']).astype(np.float32) * L['scale']
        h = h @ W + np.array(L['b'])
        if i < len(layers) - 1: h = np.maximum(h, 0)
    return h.argmax(1)
print('quantized held-out accuracy:', round((fwd(Xte) == yte).mean()*100, 2), '%')
np.save(OUT + '/test_imgs.npy', Xte[:200]); np.save(OUT + '/test_labels.npy', yte[:200])
import os; print('model file KB', os.path.getsize(OUT + '/digits-model.json')//1024)
