"use client";

import { useEffect, useRef, useState } from "react";

// ---------------------------------------------------------------------------
// PixelSvg — draws any SVG the way a low-res rasterizer would, and bobs it.
//   <PixelSvg src="/shared/bubble.svg" cols={48} className="w-60" />
//
// The canvas is only `cols` pixels wide and CSS scales it up with
// `image-rendering: pixelated`. Canvas fill() always anti-aliases, so instead
// a pixel takes a shape's color only if the pixel's center is inside that
// shape (isPointInPath / isPointInStroke). The artwork moves at sub-pixel
// amounts underneath the fixed grid, so its silhouette is re-sampled each step
// and edge pixels flip on and off, like a shape on real low-res hardware.
//
// How the SVG is read: it's fetched, mounted off-screen so the browser
// resolves classes, <style> rules, inheritance and transforms, then every
// path / rect / circle / ellipse / line / polyline / polygon becomes a Path2D
// with its computed fill, stroke, fill-rule and opacity. Shapes paint in
// document order, so later shapes cover earlier ones.
//
// Not supported: text, <image>, masks, clip-paths, filters, patterns. A
// gradient fill uses its first stop's color.
//
// Knobs (props):
// - cols: grid width in pixels (fewer = chunkier). Rows follow the aspect.
// - amplitude: bob travel in grid pixels. Fractions give the edge shimmer;
//   whole numbers move it like a sprite with a fixed silhouette. 0 = still.
// - period: ms per full bob.
// - fps: animation steps per second; low values read as retro.
// ---------------------------------------------------------------------------

const SHAPES = "path, rect, circle, ellipse, line, polyline, polygon";
const PAD = 2; // grid pixels of empty space around the artwork

type Shape = {
  path: Path2D;
  matrix: DOMMatrix; // shape's own space -> viewBox space
  bounds: { x0: number; y0: number; x1: number; y1: number }; // in viewBox space
  fill: string | null;
  fillRule: CanvasFillRule;
  stroke: string | null;
  strokeWidth: number;
  lineCap: CanvasLineCap;
  lineJoin: CanvasLineJoin;
  fillAlpha: number;
  strokeAlpha: number;
};

type Art = { shapes: Shape[]; vbX: number; vbY: number; vbW: number; vbH: number };

const num = (el: Element, name: string) => Number(el.getAttribute(name) ?? 0);

// getScreenCTM() returns an SVGMatrix in some browsers, which lacks transformPoint
const toDOMMatrix = (m: DOMMatrix2DInit & { a: number }) =>
  new DOMMatrix([m.a, m.b!, m.c!, m.d!, m.e!, m.f!]);

// SVG primitives -> path data that Path2D understands
function pathData(el: Element): string | null {
  switch (el.tagName.toLowerCase()) {
    case "path":
      return el.getAttribute("d");
    case "rect": {
      const [x, y, w, h] = ["x", "y", "width", "height"].map((n) => num(el, n));
      let rx = Number(el.getAttribute("rx") ?? el.getAttribute("ry") ?? 0);
      let ry = Number(el.getAttribute("ry") ?? el.getAttribute("rx") ?? 0);
      rx = Math.min(rx, w / 2);
      ry = Math.min(ry, h / 2);
      if (!rx || !ry) return `M${x},${y}h${w}v${h}h${-w}Z`;
      return `M${x + rx},${y}h${w - 2 * rx}a${rx},${ry} 0 0 1 ${rx},${ry}v${h - 2 * ry}a${rx},${ry} 0 0 1 ${-rx},${ry}h${-(w - 2 * rx)}a${rx},${ry} 0 0 1 ${-rx},${-ry}v${-(h - 2 * ry)}a${rx},${ry} 0 0 1 ${rx},${-ry}Z`;
    }
    case "circle":
    case "ellipse": {
      const cx = num(el, "cx");
      const cy = num(el, "cy");
      const rx = el.hasAttribute("r") ? num(el, "r") : num(el, "rx");
      const ry = el.hasAttribute("r") ? num(el, "r") : num(el, "ry");
      return `M${cx - rx},${cy}a${rx},${ry} 0 1 0 ${2 * rx},0a${rx},${ry} 0 1 0 ${-2 * rx},0Z`;
    }
    case "line":
      return `M${num(el, "x1")},${num(el, "y1")}L${num(el, "x2")},${num(el, "y2")}`;
    case "polyline":
    case "polygon": {
      const pts = el.getAttribute("points")?.trim();
      if (!pts) return null;
      return `M${pts}${el.tagName.toLowerCase() === "polygon" ? "Z" : ""}`;
    }
  }
  return null;
}

// computed fill/stroke -> a canvas color; gradients fall back to their first stop
function paint(value: string, svg: SVGSVGElement): string | null {
  if (value === "none") return null;
  const ref = value.match(/url\(["']?#([^"')]+)["']?\)/);
  if (!ref) return value;
  const stop = svg.querySelector(`[id="${ref[1]}"] stop`);
  return stop ? getComputedStyle(stop).stopColor : null;
}

// mount the SVG off-screen and pull out every drawable shape
function readSvg(markup: string): Art | null {
  const doc = new DOMParser().parseFromString(markup, "image/svg+xml");
  const parsed = doc.documentElement;
  if (parsed.tagName.toLowerCase() !== "svg") return null;
  // never run anything embedded in the file
  parsed.querySelectorAll("script, foreignObject").forEach((n) => n.remove());
  for (const n of [parsed, ...parsed.querySelectorAll("*")])
    for (const a of [...n.attributes]) if (a.name.startsWith("on")) n.removeAttribute(a.name);

  const svg = document.importNode(parsed, true) as unknown as SVGSVGElement;
  const vb = svg.viewBox.baseVal;
  const vbW = vb?.width || Number.parseFloat(svg.getAttribute("width") ?? "") || 0;
  const vbH = vb?.height || Number.parseFloat(svg.getAttribute("height") ?? "") || 0;
  if (!vbW || !vbH) return null;
  const vbX = vb?.width ? vb.x : 0;
  const vbY = vb?.width ? vb.y : 0;

  const host = document.createElement("div");
  // opacity, not visibility, so the shapes don't inherit "hidden"
  host.style.cssText = "position:fixed;left:-99999px;top:0;opacity:0;pointer-events:none";
  svg.setAttribute("width", String(vbW));
  svg.setAttribute("height", String(vbH));
  host.appendChild(svg);
  document.body.appendChild(host);

  try {
    const rootCtm = svg.getScreenCTM();
    if (!rootCtm) return null;
    const rootInv = toDOMMatrix(rootCtm).inverse();
    const shapes: Shape[] = [];
    for (const el of svg.querySelectorAll<SVGGraphicsElement>(SHAPES)) {
      if (el.closest("defs, clipPath, mask, pattern, symbol, marker")) continue;
      const d = pathData(el);
      const ctm = el.getScreenCTM();
      if (!d || !ctm) continue;
      const cs = getComputedStyle(el);
      if (cs.display === "none" || cs.visibility === "hidden") continue;

      // opacity doesn't inherit, so multiply it down from the ancestors
      let alpha = 1;
      for (let n: Element | null = el; n && n !== host; n = n.parentElement)
        alpha *= Number(getComputedStyle(n).opacity);
      const fill = paint(cs.fill, svg);
      const stroke = paint(cs.stroke, svg);
      const strokeWidth = Number.parseFloat(cs.strokeWidth) || 0;
      if (!fill && !(stroke && strokeWidth)) continue;

      // the root's inverse CTM brings screen space back to viewBox space
      const matrix = rootInv.multiply(toDOMMatrix(ctm));
      const box = el.getBBox();
      const sw = stroke ? strokeWidth / 2 : 0;
      const corners = [
        [box.x - sw, box.y - sw],
        [box.x + box.width + sw, box.y - sw],
        [box.x - sw, box.y + box.height + sw],
        [box.x + box.width + sw, box.y + box.height + sw],
      ].map(([x, y]) => matrix.transformPoint({ x, y }));
      shapes.push({
        path: new Path2D(d),
        matrix,
        bounds: {
          x0: Math.min(...corners.map((p) => p.x)),
          y0: Math.min(...corners.map((p) => p.y)),
          x1: Math.max(...corners.map((p) => p.x)),
          y1: Math.max(...corners.map((p) => p.y)),
        },
        fill: fill && Number(cs.fillOpacity) > 0 ? fill : null,
        fillRule: cs.fillRule === "evenodd" ? "evenodd" : "nonzero",
        stroke: stroke && strokeWidth && Number(cs.strokeOpacity) > 0 ? stroke : null,
        strokeWidth,
        lineCap: cs.strokeLinecap as CanvasLineCap,
        lineJoin: (cs.strokeLinejoin === "arcs" || cs.strokeLinejoin === "miter-clip"
          ? "miter"
          : cs.strokeLinejoin) as CanvasLineJoin,
        fillAlpha: alpha * Number(cs.fillOpacity),
        strokeAlpha: alpha * Number(cs.strokeOpacity),
      });
    }
    return { shapes, vbX, vbY, vbW, vbH };
  } finally {
    host.remove();
  }
}

export interface PixelSvgProps {
  /** URL of the SVG, e.g. "/shared/bubble.svg" */
  src: string;
  /** grid width in pixels */
  cols?: number;
  /** bob travel in grid pixels (0 = still) */
  amplitude?: number;
  /** ms per full bob */
  period?: number;
  /** animation steps per second */
  fps?: number;
  className?: string;
}

export function PixelSvg({
  src,
  cols = 48,
  amplitude = 1.5,
  period = 2400,
  fps = 12,
  className = "",
}: PixelSvgProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [art, setArt] = useState<Art | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(src)
      .then((res) => (res.ok ? res.text() : Promise.reject(new Error(`${res.status} ${src}`))))
      .then((markup) => {
        if (!cancelled) setArt(readSvg(markup));
      })
      .catch((err) => console.error("PixelSvg:", err));
    return () => {
      cancelled = true;
    };
  }, [src]);

  // fit the artwork's width into the grid, leaving room for padding and the bob
  const scale = art ? (cols - PAD * 2) / art.vbW : 1;
  const rows = art ? Math.ceil(art.vbH * scale + (PAD + Math.abs(amplitude)) * 2) : 1;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !art) return;

    const originX = PAD - art.vbX * scale;
    const originY = (rows - art.vbH * scale) / 2 - art.vbY * scale;
    const lit: number[] = [];

    const draw = (offsetY: number) => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, cols, rows);
      const place = new DOMMatrix([scale, 0, 0, scale, originX, originY + offsetY]);

      for (const s of art.shapes) {
        // only test pixels inside this shape's bounding box
        const gx0 = Math.max(0, Math.floor(s.bounds.x0 * scale + originX));
        const gx1 = Math.min(cols - 1, Math.ceil(s.bounds.x1 * scale + originX));
        const gy0 = Math.max(0, Math.floor(s.bounds.y0 * scale + originY + offsetY));
        const gy1 = Math.min(rows - 1, Math.ceil(s.bounds.y1 * scale + originY + offsetY));

        // isPointInPath tests canvas-pixel coordinates against the path under
        // the current transform, so the transform places and scales the shape.
        ctx.setTransform(place.multiply(s.matrix));
        ctx.lineWidth = s.strokeWidth;
        ctx.lineCap = s.lineCap;
        ctx.lineJoin = s.lineJoin;

        for (const [color, alpha, test] of [
          [s.fill, s.fillAlpha, (x: number, y: number) => ctx.isPointInPath(s.path, x, y, s.fillRule)],
          [s.stroke, s.strokeAlpha, (x: number, y: number) => ctx.isPointInStroke(s.path, x, y)],
        ] as const) {
          if (!color) continue;
          lit.length = 0;
          for (let y = gy0; y <= gy1; y++)
            for (let x = gx0; x <= gx1; x++) if (test(x + 0.5, y + 0.5)) lit.push(x, y);
          ctx.save();
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.globalAlpha = alpha;
          ctx.fillStyle = color;
          for (let i = 0; i < lit.length; i += 2) ctx.fillRect(lit[i]!, lit[i + 1]!, 1, 1);
          ctx.restore();
        }
      }
    };

    if (!amplitude || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      draw(0);
      return;
    }

    let raf = 0;
    let lastStep = -1;
    const loop = (now: number) => {
      // only redraw when the stepped clock ticks over
      const step = Math.floor(now / (1000 / fps));
      if (step !== lastStep) {
        lastStep = step;
        const t = (step * (1000 / fps)) / period;
        draw(Math.sin(t * Math.PI * 2) * amplitude);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [art, cols, rows, scale, amplitude, period, fps]);

  return (
    <canvas
      ref={canvasRef}
      width={cols}
      height={rows}
      aria-hidden
      className={`[image-rendering:pixelated] ${className}`}
      style={{ aspectRatio: `${cols} / ${rows}` }}
    />
  );
}
