export const moveTransitions = [
  { id: "liquid", name: "Liquid", label: "液体のゆがみ", number: 0 },
  { id: "dissolve", name: "Dissolve", label: "ノイズで溶ける", number: 1 },
  { id: "chromatic", name: "Chromatic", label: "RGBをずらす", number: 2 },
  { id: "pixel", name: "Pixel", label: "ピクセルにほどける", number: 3 },
  { id: "iris", name: "Iris", label: "円形にひらく", number: 4 },
];

// One canonical scroll position drives the pair in both directions.
export function getTransitionFrame(position: number, count: number) {
  const last = Math.max(0, count - 1);
  const value = Math.max(
    0,
    Math.min(last, Number.isFinite(position) ? position : 0),
  );
  const from = Math.min(Math.floor(value), last);
  return { from, to: Math.min(from + 1, last), progress: value - from };
}

export const vertexShader = `
attribute vec2 aPosition;
varying vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

export const fragmentShader = `
precision mediump float;
varying vec2 vUv;
uniform sampler2D uFrom;
uniform sampler2D uTo;
uniform float uProgress;
uniform float uStrength;
uniform int uMode;
const vec4 PAPER = vec4(0.92549, 0.92549, 0.90588, 1.0);

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0)), f.x), f.y);
}
vec4 sampleFrom(vec2 uv) {
  // The outgoing image advances toward the viewer; the next approaches from depth.
  vec2 p = (uv - 0.5) / (1.0 + uProgress * 0.65) + 0.5;
  return texture2D(uFrom, clamp(p, 0.0, 1.0));
}
vec4 sampleTo(vec2 uv) {
  float scale = mix(0.72, 1.0, uProgress);
  vec2 p = (uv - 0.5) / scale + 0.5;
  float inside = step(0.0, p.x) * step(p.x, 1.0) * step(0.0, p.y) * step(p.y, 1.0);
  return mix(PAPER, texture2D(uTo, clamp(p, 0.0, 1.0)), inside);
}
void main() {
  float p = uProgress;
  // Exact endpoints avoid a jump when the texture pair changes at integer positions.
  if (p <= 0.0) { gl_FragColor = texture2D(uFrom, vUv); return; }
  if (p >= 1.0) { gl_FragColor = texture2D(uTo, vUv); return; }
  float envelope = sin(p * 3.14159265);
  float amount = envelope * uStrength;
  float blend = smoothstep(0.0, 1.0, p);
  vec2 uv = vUv;
  vec4 color;

  if (uMode == 0) {
    vec2 wave = vec2(sin(uv.y * 16.0 + p * 7.0), cos(uv.x * 13.0 - p * 6.0));
    vec2 flow = wave * amount * 0.085;
    color = mix(sampleFrom(uv + flow), sampleTo(uv - flow), blend);
  } else if (uMode == 1) {
    float field = noise(uv * 11.0) * 0.7 + noise(uv * 35.0) * 0.3;
    float softness = mix(0.22, 0.045, uStrength);
    float threshold = mix(-softness, 1.0 + softness, p);
    float mask = 1.0 - smoothstep(threshold - softness, threshold + softness, field);
    color = mix(sampleFrom(uv), sampleTo(uv), mask);
  } else if (uMode == 2) {
    float slice = noise(vec2(floor(uv.y * 30.0), floor(p * 20.0)));
    vec2 offset = vec2((slice - 0.5) * amount * 0.13, 0.0);
    vec2 split = vec2(amount * 0.035, 0.0);
    vec4 base = mix(sampleFrom(uv + offset), sampleTo(uv - offset), blend);
    float red = mix(sampleFrom(uv + offset + split).r, sampleTo(uv - offset + split).r, blend);
    float blue = mix(sampleFrom(uv + offset - split).b, sampleTo(uv - offset - split).b, blend);
    color = vec4(red, base.g, blue, 1.0);
  } else if (uMode == 3) {
    float size = max(0.001, amount * 0.09);
    vec2 pixel = (floor(uv / size) + 0.5) * size;
    vec2 quantized = mix(uv, pixel, smoothstep(0.0, 0.15, envelope));
    color = mix(sampleFrom(quantized), sampleTo(quantized), blend);
  } else {
    vec2 center = uv - 0.5;
    float radius = length(center);
    float edge = p * 0.95;
    float mask = 1.0 - smoothstep(edge - 0.09, edge + 0.09, radius + 0.1);
    vec2 ripple = center / max(radius, 0.001) * sin(radius * 45.0 - p * 14.0) * amount * 0.03;
    color = mix(sampleFrom(uv + ripple), sampleTo(uv - ripple), mask);
  }
  gl_FragColor = color;
}`;
