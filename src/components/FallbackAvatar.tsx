"use client";

import { useEffect, useRef } from "react";
import type { Lab } from "@/data/avatar-colors";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// FallbackAvatar — a generated avatar for people without a photo, adapted
// from the fallback-avatar component and pixelated the same way as PixelSvg.
//   <FallbackAvatar name="Paul C." color={[38.75, 56.51, -87.01]} size={40} />
//
// `color` is a CSS lab() value (see src/data/avatar-colors.ts); a darker step
// on its tonal ramp is the second shade. The blobs are screen-blended over
// the brand purple (#6633ee) rather than black. The name is hashed into three blob
// positions, so people with similar colors still get different shapes. A WebGL fragment shader screen-blends the blobs, rendered at only
// `cols`×`cols` pixels; CSS scales that up with `image-rendering: pixelated`.
// The round outline is also sampled per pixel center (lit only if the center
// is inside the circle), so its edge is stepped pixels, not an anti-aliased
// rounded-full. The same name and color always produce the same avatar.
//
// The shader came with a time-based animation; it's drawn once, at time 0.
// All avatars share one hidden WebGL canvas: browsers cap live WebGL
// contexts at around 16, and the page has 31 cards. Without WebGL, the avatar
// falls back to a flat circle in the darker shade.
// ---------------------------------------------------------------------------

// --- color and name -> shades and blob positions ---

type RGB = [number, number, number];

function hashString(str: string): [number, number] {
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return [h1 >>> 0, h2 >>> 0];
}

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// CSS lab() (CIELAB, D50) -> sRGB, each channel 0..1, clamped to the gamut
const XYZ_D50_TO_LINEAR_SRGB = [
  [3.1341359569958707, -1.6173863321612538, -0.4906619460083532],
  [-0.978795502912089, 1.916254567259524, 0.03344273116131949],
  [0.07195537988411677, -0.2289768264158322, 1.405386058324125],
];
const D50_WHITE = [0.3457 / 0.3585, 1, (1 - 0.3457 - 0.3585) / 0.3585];

function labToRgb([L, a, b]: Lab): RGB {
  const e = 216 / 24389;
  const k = 24389 / 27;
  const fy = (L + 16) / 116;
  const finv = (t: number) => (t ** 3 > e ? t ** 3 : (116 * t - 16) / k);
  const xyz = [finv(fy + a / 500), finv(fy), finv(fy - b / 200)].map(
    (v, i) => v * D50_WHITE[i]!,
  );
  const gamma = (v: number) =>
    Math.max(
      0,
      Math.min(1, v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055),
    );
  const [r, g, bl] = XYZ_D50_TO_LINEAR_SRGB.map((row) =>
    gamma(row[0]! * xyz[0]! + row[1]! * xyz[1]! + row[2]! * xyz[2]!),
  );
  return [r!, g!, bl!];
}

interface Uniforms {
  P: number[]; // blob 1 and 2 positions
  Q: number[]; // blob 3 position (+ 2 unused)
  C1: RGB; // the assigned color
  C2: RGB; // a darker step on the same tonal ramp
}

function computeUniforms(name: string, color: Lab): Uniforms {
  const rng = mulberry32(hashString(name)[0]);
  const p = Array.from({ length: 8 }, rng);
  const [L, a, b] = color;
  return {
    P: p.slice(0, 4),
    Q: p.slice(4, 8),
    C1: labToRgb(color),
    // same hue, half the lightness, a little less chroma
    C2: labToRgb([L * 0.5, a * 0.7, b * 0.7]),
  };
}

// --- shared WebGL renderer ---

const VERT_SRC = "attribute vec2 a;void main(){gl_Position=vec4(a,0,1);}";

const FRAG_SRC = `precision mediump float;
uniform vec2 R;
uniform vec4 P,Q;
uniform vec3 C1,C2;
uniform float T;
void main(){
  vec2 uv=gl_FragCoord.xy/R;
  vec2 b1=P.xy, b2=P.zw, b3=Q.xy;
  vec2 c1=b1+vec2(sin(T*.7+b1.x*6.)*.08, cos(T*.9+b1.y*6.)*.08);
  vec2 c2=b2+vec2(sin(T*.6+2.1)*.1, cos(T*.8+1.3)*.07);
  vec2 c3=b3+vec2(sin(T*.5+4.2)*.07, cos(T*1.1+3.7)*.09);
  float d1=(1.-length(uv-c1)*1.5)*(1.+sin(T*1.3)*.06);
  float d2=(1.-length(uv-c2)*1.5)*(1.+sin(T*1.7+1.)*.05);
  float d3=(1.-length(uv-c3)*1.5)*(1.+sin(T*1.1+2.)*.05);
  vec3 col=vec3(0.4,0.2,0.933); // base: brand purple #6633ee, not black
  col=1.-(1.-col)*(1.-C1*max(d1,0.));
  col=1.-(1.-col)*(1.-C2*max(d2,0.));
  col=1.-(1.-col)*(1.-mix(C1,C2,.5+sin(T*.4)*.15)*max(d3,0.));
  gl_FragColor=vec4(clamp(col,0.,1.),1);
}`;

let shared: {
  canvas: HTMLCanvasElement;
  gl: WebGLRenderingContext;
  prog: WebGLProgram;
} | null = null;
let glUnavailable = false;

function getGL() {
  if (shared || glUnavailable) return shared;
  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl", {
    antialias: false,
    depth: false,
    preserveDrawingBuffer: true,
  });
  if (!gl) {
    glUnavailable = true;
    return null;
  }
  const shader = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, shader(gl.VERTEX_SHADER, VERT_SRC));
  gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FRAG_SRC));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    glUnavailable = true;
    return null;
  }
  gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW,
  );
  const pos = gl.getAttribLocation(prog, "a");
  gl.enableVertexAttribArray(pos);
  gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
  shared = { canvas, gl, prog };
  return shared;
}

// draw one frame into the avatar's own low-res 2D canvas, then cut the
// circle by pixel center
function render(target: HTMLCanvasElement, u: Uniforms) {
  const ctx = target.getContext("2d");
  if (!ctx) return;
  const n = target.width;
  const renderer = getGL();

  if (renderer) {
    const { canvas, gl, prog } = renderer;
    if (canvas.width !== n) canvas.width = canvas.height = n;
    gl.viewport(0, 0, n, n);
    const at = (name: string) => gl.getUniformLocation(prog, name);
    gl.uniform2f(at("R"), n, n);
    gl.uniform4fv(at("P"), u.P);
    gl.uniform4fv(at("Q"), u.Q);
    gl.uniform3fv(at("C1"), u.C1);
    gl.uniform3fv(at("C2"), u.C2);
    gl.uniform1f(at("T"), 0); // still frame
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    ctx.clearRect(0, 0, n, n);
    ctx.drawImage(canvas, 0, 0);
  } else {
    ctx.fillStyle = `rgb(${u.C2.map((c) => Math.round(c * 255)).join(",")})`;
    ctx.fillRect(0, 0, n, n);
  }

  const img = ctx.getImageData(0, 0, n, n);
  const r = n / 2;
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++)
      if (Math.hypot(x + 0.5 - r, y + 0.5 - r) > r)
        img.data[(y * n + x) * 4 + 3] = 0;
  ctx.putImageData(img, 0, 0);
}

// --- component ---

export interface FallbackAvatarProps {
  /** seeds the blob positions */
  name: string;
  /** CSS lab() value [L, a, b] */
  color: Lab;
  /** displayed size in px */
  size?: number;
  /** pixels across (fewer = chunkier) */
  cols?: number;
  className?: string;
}

export function FallbackAvatar({
  name,
  color,
  size = 40,
  cols = 10,
  className,
}: FallbackAvatarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // depend on the color's values, not the array's identity
  const [L, A, B] = color;
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) render(canvas, computeUniforms(name, [L, A, B]));
  }, [name, cols, L, A, B]);

  return (
    <canvas
      ref={canvasRef}
      width={cols}
      height={cols}
      aria-hidden
      className={cn("shrink-0 [image-rendering:pixelated]", className)}
      style={{ width: size, height: size }}
    />
  );
}
