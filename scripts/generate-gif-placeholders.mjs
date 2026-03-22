/**
 * Erzeugt Loop-GIFs (jugendfrei, bündisch-thematisch).
 * Lagerfeuer: 640×360, fBm-Rauschturbulenz + Flammenform + Glut (prozedural, kein Foto).
 * Übrige Clips: 400×225, stilisiert.
 * Ausführen: npm run generate:gifs
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import gifenc from 'gifenc'

const { GIFEncoder, applyPalette, quantize } = gifenc

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, '..', 'public', 'gifs')

/** Thumbnail-Maße (16∶9), klein genug für schnelle Ladezeit */
const W = 400
const H = 225

/** @param {number} x */
function clampByte(x) {
  return Math.max(0, Math.min(255, x | 0))
}

/** @param {Uint8Array} buf @param {number} w @param {number} h */
function setPx(buf, w, h, x, y, r, g, b, a = 255) {
  if (x < 0 || y < 0 || x >= w || y >= h) return
  const i = (y * w + x) * 4
  buf[i] = r
  buf[i + 1] = g
  buf[i + 2] = b
  buf[i + 3] = a
}

/** @param {Uint8Array} buf @param {number} w @param {number} h */
function fill(buf, w, h, r, g, b, a = 255) {
  for (let i = 0; i < w * h * 4; i += 4) {
    buf[i] = r
    buf[i + 1] = g
    buf[i + 2] = b
    buf[i + 3] = a
  }
}

/**
 * @param {Uint8Array} buf
 * @param {number} w
 * @param {number} h
 * @param {number} cx
 * @param {number} cy
 * @param {number} rx
 * @param {number} ry
 * @param {[number, number, number]} rgb
 */
function fillEllipse(buf, w, h, cx, cy, rx, ry, rgb) {
  for (let y = Math.max(0, cy - ry); y < Math.min(h, cy + ry); y++) {
    for (let x = Math.max(0, cx - rx); x < Math.min(w, cx + rx); x++) {
      const nx = (x - cx) / rx
      const ny = (y - cy) / ry
      if (nx * nx + ny * ny <= 1) setPx(buf, w, h, x, y, rgb[0], rgb[1], rgb[2])
    }
  }
}

/**
 * @param {Uint8Array} allFrames
 * @param {number} delayMs
 * @param {string} filename
 */
/**
 * @param {Uint8Array[]} allFrames
 * @param {number} delayMs
 * @param {string} filename
 * @param {number} width
 * @param {number} height
 */
function saveGifSized(allFrames, delayMs, filename, width, height) {
  const frameCount = allFrames.length
  if (frameCount === 0) return

  let total = 0
  for (const f of allFrames) total += f.length
  const combined = new Uint8Array(total)
  let off = 0
  for (const f of allFrames) {
    combined.set(f, off)
    off += f.length
  }

  const palette = quantize(combined, 256)
  const gif = GIFEncoder()
  for (let i = 0; i < frameCount; i++) {
    const idx = applyPalette(allFrames[i], palette)
    if (i === 0) {
      gif.writeFrame(idx, width, height, { palette, delay: delayMs, repeat: 0 })
    } else {
      gif.writeFrame(idx, width, height, { delay: delayMs })
    }
  }
  gif.finish()
  mkdirSync(OUT, { recursive: true })
  writeFileSync(join(OUT, filename), Buffer.from(gif.bytes()))
  console.log('written', filename, `(${frameCount} frames @ ${width}x${height})`)
}

function saveGif(allFrames, delayMs, filename) {
  saveGifSized(allFrames, delayMs, filename, W, H)
}

/** @param {number} a @param {number} b @param {number} t */
function smoothstep(a, b, t) {
  const x = Math.max(0, Math.min(1, (t - a) / (b - a)))
  return x * x * (3 - 2 * x)
}

/** @param {number} a @param {number} b @param {number} t */
function lerp(a, b, t) {
  return a + (b - a) * t
}

/** deterministischer PRNG für Sterne */
function mulberry32(seed) {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), a | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Flammenfarbe: weicher Verlauf (dunkelrot → Orange → Gelb → Weiß)
 * @param {number} heat 0…1+
 * @returns {[number, number, number]}
 */
function heatToRgb(heat) {
  const h = Math.max(0, Math.min(1, heat))
  if (h < 0.06) return [0, 0, 0]
  if (h < 0.22) {
    const t = smoothstep(0.06, 0.22, h)
    return [clampByte(lerp(25, 120, t)), clampByte(lerp(6, 28, t)), clampByte(lerp(4, 12, t))]
  }
  if (h < 0.4) {
    const t = (h - 0.22) / 0.18
    return [clampByte(lerp(120, 220, t)), clampByte(lerp(28, 85, t)), clampByte(lerp(12, 28, t))]
  }
  if (h < 0.58) {
    const t = (h - 0.4) / 0.18
    return [clampByte(lerp(220, 255, t)), clampByte(lerp(85, 180, t)), clampByte(lerp(28, 55, t))]
  }
  if (h < 0.78) {
    const t = (h - 0.58) / 0.2
    return [255, clampByte(lerp(180, 245, t)), clampByte(lerp(55, 140, t))]
  }
  const t = (h - 0.78) / 0.22
  return [255, 255, clampByte(lerp(140, 235, t))]
}

/** @param {{ data: Float32Array; sz: number }} grid */
function sampleNoiseGrid(grid, x, y) {
  const { data, sz } = grid
  let xf = x % sz
  let yf = y % sz
  if (xf < 0) xf += sz
  if (yf < 0) yf += sz
  const x0 = xf | 0
  const y0 = yf | 0
  const x1 = (x0 + 1) % sz
  const y1 = (y0 + 1) % sz
  const fx = xf - x0
  const fy = yf - y0
  const sx = fx * fx * (3 - 2 * fx)
  const sy = fy * fy * (3 - 2 * fy)
  const a = data[y0 * sz + x0]
  const b = data[y0 * sz + x1]
  const c = data[y1 * sz + x0]
  const d = data[y1 * sz + x1]
  return lerp(lerp(a, b, sx), lerp(c, d, sx), sy)
}

/** @param {{ data: Float32Array; sz: number }} grid */
function fbm(grid, x, y, octaves) {
  let v = 0
  let a = 0.5
  let f = 1
  for (let o = 0; o < octaves; o++) {
    v += a * sampleNoiseGrid(grid, x * f, y * f)
    f *= 2
    a *= 0.5
  }
  return v
}

/** @param {number} seed */
function createNoiseGrid(seed) {
  const rng = mulberry32(seed)
  const sz = 512
  const data = new Float32Array(sz * sz)
  for (let i = 0; i < data.length; i++) data[i] = rng()
  return { data, sz }
}

/** Lagerfeuer: höhere Auflösung für realistischeren Look */
const LAGER_W = 640
const LAGER_H = 360

/**
 * Nachthimmel, Sterne, fBm-Flammen (organische Turbulenz), Glut, Holz, Rauch
 * @returns {Uint8Array[]}
 */
function framesLagerfeuer() {
  const w = LAGER_W
  const h = LAGER_H
  const rng = mulberry32(0x4c616765)
  const noiseA = createNoiseGrid(0x63616d70)
  const noiseB = createNoiseGrid(0x66697265)

  /** @type {{ x: number; y: number; br: number; sz: number; ph: number; sp: number }[]} */
  const stars = []
  for (let i = 0; i < 380; i++) {
    stars.push({
      x: rng() * w,
      y: rng() * h * 0.46,
      br: 0.2 + rng() * 0.8,
      sz: rng() > 0.92 ? 2 : 1,
      ph: rng() * Math.PI * 2,
      sp: 0.3 + rng() * 1.15,
    })
  }

  const embers = []
  for (let i = 0; i < 22; i++) {
    embers.push({
      xn: 0.36 + rng() * 0.28,
      phase: rng() * 32,
      span: 16 + rng() * 24,
      wob: (rng() - 0.5) * 16,
    })
  }

  const horizon = h * 0.52
  const cx = w * 0.5
  const fireTop = h * 0.34
  const fireBottom = h - 1.5

  const frames = []
  const nFrames = 32

  for (let f = 0; f < nFrames; f++) {
    const buf = new Uint8Array(w * h * 4)
    const ft = f * 0.196
    const flick = 0.72 + 0.28 * Math.sin(ft * 1.55 + Math.sin(ft * 0.37) * 2.1)
    const flick2 = 0.84 + 0.16 * Math.sin(ft * 2.4 + 0.8)

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (y < horizon) {
          const yn = y / horizon
          const dusk = smoothstep(0.72, 1, yn)
          let r = lerp(4, 12, yn) + dusk * 10
          let g = lerp(8, 24, yn) + dusk * 14
          let b = lerp(22, 44, yn) + dusk * 18
          const vign = 1 - Math.pow(Math.abs(x / w - 0.5) * 1.2, 2) * 0.14
          r *= vign
          g *= vign
          b *= vign
          setPx(buf, w, h, x, y, clampByte(r), clampByte(g), clampByte(b))
        } else {
          const gn = (y - horizon) / (h - horizon)
          const n = 0.04 * sampleNoiseGrid(noiseA, x * 0.03, y * 0.03 + ft * 0.02)
          const gr = lerp(16, 5, gn) + n * 255
          const gg = lerp(12, 4, gn) + n * 180
          const gb = lerp(10, 3, gn) + n * 120
          setPx(buf, w, h, x, y, clampByte(gr), clampByte(gg), clampByte(gb))
        }
      }
    }

    for (const s of stars) {
      const tw = 0.5 + 0.5 * Math.sin(ft * s.sp + s.ph)
      const br = s.br * tw
      const rr = clampByte(210 * br + 45 * br)
      const gg = clampByte(225 * br + 30 * br)
      const bb = clampByte(255 * br)
      if (s.sz === 1) {
        setPx(buf, w, h, s.x | 0, s.y | 0, rr, gg, bb)
      } else {
        for (let dy = 0; dy <= 1; dy++) {
          for (let dx = 0; dx <= 1; dx++) {
            const d = dx + dy === 0 ? 1 : 0.62
            setPx(buf, w, h, (s.x + dx) | 0, (s.y + dy) | 0, clampByte(rr * d), clampByte(gg * d), clampByte(bb * d))
          }
        }
      }
    }

    for (let y = horizon | 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const dxn = (x - cx) / (w * 0.38)
        const dyn = (y - horizon) / (h - horizon)
        const glow = Math.exp(-dxn * dxn * 2.4) * Math.exp(-dyn * dyn * 0.85) * 0.26 * flick
        const i = (y * w + x) * 4
        buf[i] = clampByte(buf[i] + glow * 130)
        buf[i + 1] = clampByte(buf[i + 1] + glow * 58)
        buf[i + 2] = clampByte(buf[i + 2] + glow * 16)
      }
    }

    const fh = fireBottom - fireTop

    for (let y = fireTop | 0; y < fireBottom; y++) {
      const py = (y - fireTop) / fh
      const halfW = w * (0.038 + 0.44 * Math.pow(py, 1.38))
      const curl =
        32 * Math.sin(py * 4.2 + ft * 1.05) +
        18 * Math.sin(py * 8.1 - ft * 0.65) +
        10 * Math.sin(py * 14 + ft * 1.2)

      for (let x = 0; x < w; x++) {
        const px = x - cx + curl
        const dxn = Math.abs(px) / halfW
        if (dxn > 1.18) continue

        const flowU = px * 0.019 + ft * 0.32
        const flowV = y * 0.021 - ft * 0.48 + py * 1.8
        const wisp = fbm(noiseA, flowU, flowV, 5)
        const detail = fbm(noiseB, px * 0.048 + ft * 0.62, y * 0.052 - ft * 0.72, 4)
        const fine = fbm(noiseA, px * 0.11 + ft * 0.9, y * 0.1 - ft * 1.1, 3)

        const edge = smoothstep(1.08, 0.22, dxn)
        /** py=0 oben (Spitze), py=1 unten — Spitze bleibt sichtbar (schmal durch halfW) */
        const vertical = Math.pow(py + 0.1, 0.3) * (0.5 + 0.5 * flick2)

        let heat =
          edge *
          vertical *
          flick *
          (0.1 + 0.9 * wisp) *
          (0.72 + 0.28 * detail) *
          (0.82 + 0.18 * fine)

        heat *= 0.78 + 0.22 * Math.sin(ft * 2.8 + px * 0.03 + y * 0.025)

        const core =
          0.52 *
          Math.exp(-(dxn * dxn) / 0.1) *
          Math.exp(-((py - 0.86) ** 2) / 0.038) *
          flick
        heat += core

        const micro = Math.sin(x * 0.31 + y * 0.29 + ft * 3.2) * 0.04
        heat += micro

        if (heat < 0.028) continue

        const hn = Math.min(1, heat * 1.05)
        const [fr, fg, fb] = heatToRgb(hn)
        const i = (y * w + x) * 4
        const a = Math.min(1, heat * 1.15)
        buf[i] = clampByte(lerp(buf[i], fr, a))
        buf[i + 1] = clampByte(lerp(buf[i + 1], fg, a))
        buf[i + 2] = clampByte(lerp(buf[i + 2], fb, a))
      }
    }

    for (const e of embers) {
      const prog = ((f + e.phase) % e.span) / e.span
      const ey = fireBottom - 6 - prog * (fh - 8)
      const ex = e.xn * w + Math.sin(prog * Math.PI * 4 + ft) * e.wob
      const emHeat = (1 - prog) * (0.5 + 0.5 * Math.sin(ft * 4.5 + prog * 12))
      if (emHeat < 0.07) continue
      const [er, eg, eb] = heatToRgb(0.52 + emHeat * 0.42)
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const d = dx === 0 && dy === 0 ? 1 : 0.42
          setPx(buf, w, h, (ex + dx) | 0, (ey + dy) | 0, clampByte(er * d), clampByte(eg * d), clampByte(eb * d))
        }
      }
    }

    for (let k = 0; k < 3; k++) {
      const ox = (k - 1) * w * 0.065 + Math.sin(ft * 0.85 + k * 1.1) * 5
      fillEllipse(buf, w, h, cx + ox, h - 7 + k * 2, 54 - k * 9, 11 - k * 2, [18, 11, 7])
    }
    fillEllipse(buf, w, h, cx, h - 13, 50, 13, [24, 15, 9])

    const smokeY0 = fireTop - 2
    const smokeY1 = fireTop - 36
    for (let sy = smokeY1; sy < smokeY0; sy++) {
      for (let sx = 0; sx < w; sx++) {
        const sn =
          fbm(noiseB, sx * 0.035 + ft * 0.12, sy * 0.05 + ft * 0.18, 3) *
          Math.exp(-Math.pow((sx - cx) / (w * 0.11), 2)) *
          0.22
        if (sn < 0.05) continue
        const i = (sy * w + sx) * 4
        const sm = sn * 0.6
        buf[i] = clampByte(lerp(buf[i], 32, sm))
        buf[i + 1] = clampByte(lerp(buf[i + 1], 34, sm))
        buf[i + 2] = clampByte(lerp(buf[i + 2], 44, sm))
      }
    }

    frames.push(buf)
  }

  return frames
}

// --- 2) Knoten: zwei „Seile“ kreuzen sich, leichte Bewegung ---
function framesKnoten() {
  const frames = []
  const n = 20
  for (let f = 0; f < n; f++) {
    const buf = new Uint8Array(W * H * 4)
    fill(buf, W, H, 62, 48, 38)
    const wob = Math.sin((f / n) * Math.PI * 2) * 6
    for (let i = 0; i < 220; i++) {
      const x = 120 + i * 1.2 + wob * Math.sin(i * 0.04)
      const y = 60 + i * 0.85 + wob * 0.5
      for (let t = -2; t <= 2; t++) {
        for (let u = -2; u <= 2; u++) {
          setPx(buf, W, H, x + t + u * 0.3, y + u, 230, 225, 210)
        }
      }
    }
    for (let i = 0; i < 220; i++) {
      const x = 360 - i * 1.1 - wob * Math.sin(i * 0.035)
      const y = 55 + i * 0.88 - wob * 0.4
      for (let t = -2; t <= 2; t++) {
        for (let u = -2; u <= 2; u++) {
          setPx(buf, W, H, x + t, y + u + t * 0.02, 210, 200, 185)
        }
      }
    }
    fillEllipse(buf, W, H, 240, 145, 28, 28, [90, 70, 55])
    frames.push(buf)
  }
  return frames
}

// --- 3) Rucksack: bunte „Items“ wandern im Loop ---
function framesRucksack() {
  const frames = []
  const n = 24
  const items = [
    { w: 40, h: 28, rgb: [200, 60, 50] },
    { w: 32, h: 36, rgb: [70, 130, 200] },
    { w: 44, h: 22, rgb: [240, 200, 60] },
    { w: 36, h: 32, rgb: [90, 180, 100] },
  ]
  for (let f = 0; f < n; f++) {
    const buf = new Uint8Array(W * H * 4)
    fill(buf, W, H, 18, 42, 32)
    items.forEach((it, k) => {
      const phase = ((f + k * 6) / n) % 1
      const x0 = -60 + phase * (W + 120)
      const y = 80 + k * 38 + Math.sin(phase * Math.PI * 2) * 8
      for (let yp = 0; yp < it.h; yp++) {
        for (let xp = 0; xp < it.w; xp++) {
          setPx(buf, W, H, (x0 + xp) | 0, (y + yp) | 0, it.rgb[0], it.rgb[1], it.rgb[2])
        }
      }
    })
    fillEllipse(buf, W, H, 240, 200, 100, 70, [55, 45, 38])
    frames.push(buf)
  }
  return frames
}

// --- 4) Zelt: Nacht + Dreieck + Sterne funkeln ---
function framesZelt() {
  const frames = []
  const n = 18
  const stars = [
    [100, 50],
    [200, 40],
    [350, 55],
    [400, 70],
    [280, 35],
  ]
  for (let f = 0; f < n; f++) {
    const buf = new Uint8Array(W * H * 4)
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const v = 12 + (y / H) * 35
        setPx(buf, W, H, x, y, v * 0.35, v * 0.45, v * 0.55)
      }
    }
    const apex = [240, 95]
    const left = [140, 210]
    const right = [340, 210]
    for (let y = apex[1]; y <= left[1]; y++) {
      const p = (y - apex[1]) / (left[1] - apex[1])
      const xl = apex[0] + (left[0] - apex[0]) * p
      const xr = apex[0] + (right[0] - apex[0]) * p
      for (let x = xl; x <= xr; x++) {
        const shade = 180 - p * 55
        setPx(buf, W, H, x | 0, y | 0, shade, shade * 0.85, 40)
      }
    }
    stars.forEach(([sx, sy], i) => {
      const tw = 0.5 + 0.5 * Math.sin((f / n) * Math.PI * 2 * 2 + i)
      const b = clampByte(200 + tw * 55)
      setPx(buf, W, H, sx, sy, b, b, b)
      setPx(buf, W, H, sx - 1, sy, b, b, b)
      setPx(buf, W, H, sx + 1, sy, b, b, b)
      setPx(buf, W, H, sx, sy - 1, b, b, b)
      setPx(buf, W, H, sx, sy + 1, b, b, b)
    })
    frames.push(buf)
  }
  return frames
}

// --- 5) Matsch-Boots: langsamer Lichtstreifen (schlank komprimierbar) ---
function framesBoots() {
  const frames = []
  const n = 14
  for (let f = 0; f < n; f++) {
    const buf = new Uint8Array(W * H * 4)
    const shift = (f / n) * W
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const wave = Math.sin((x + shift) * 0.025 + y * 0.018)
        const m = 52 + wave * 22
        const g = 40 + wave * 14
        const b = 30 + wave * 8
        setPx(buf, W, H, x, y, clampByte(m), clampByte(g), clampByte(b))
      }
    }
    fillEllipse(buf, W, H, 200, 175, 90, 35, [35, 30, 25])
    fillEllipse(buf, W, H, 290, 178, 88, 36, [40, 34, 28])
    frames.push(buf)
  }
  return frames
}

// --- 6) Eintopf: Blasen steigen ---
function framesEintopf() {
  const frames = []
  const n = 20
  for (let f = 0; f < n; f++) {
    const buf = new Uint8Array(W * H * 4)
    fill(buf, W, H, 28, 24, 20)
    fillEllipse(buf, W, H, 240, 155, 190, 95, [55, 38, 28])
    fillEllipse(buf, W, H, 240, 160, 170, 75, [120, 65, 35])
    for (let b = 0; b < 18; b++) {
      const phase = ((f + b * 1.7) / n) % 1
      const bx = 140 + (b * 37) % 280
      const by = 200 - phase * 130
      const br = 4 + (b % 4)
      for (let y = -br; y <= br; y++) {
        for (let x = -br; x <= br; x++) {
          if (x * x + y * y <= br * br) {
            const c = 180 + (b % 3) * 20
            setPx(buf, W, H, bx + x, by + y, c, c * 0.65, 40)
          }
        }
      }
    }
    frames.push(buf)
  }
  return frames
}

saveGifSized(framesLagerfeuer(), 75, 'lagerfeuer.gif', LAGER_W, LAGER_H)
saveGif(framesKnoten(), 55, 'knoten.gif')
saveGif(framesRucksack(), 50, 'rucksack.gif')
saveGif(framesZelt(), 80, 'zelt.gif')
saveGif(framesBoots(), 55, 'boots.gif')
saveGif(framesEintopf(), 65, 'eintopf.gif')

console.log('Done. Output:', OUT)
