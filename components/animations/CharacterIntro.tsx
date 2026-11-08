"use client";

import { useEffect, useRef } from "react";

// Read each supplied frame's opaque bounds at runtime. This keeps the original
// artwork untouched and removes the sheets' unequal transparent margins.
export function CharacterIntro({ ready, onSit, forceMotion = false }: { ready: boolean; onSit: () => void; forceMotion?: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const readyRef = useRef(ready);
  readyRef.current = ready;
  const callback = useRef(onSit);
  callback.current = onSit;
  useEffect(() => {
    let cancelled = false, raf = 0;
    const load = (src: string) => new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image(); img.onload = () => resolve(img); img.onerror = reject; img.src = src;
    });
    Promise.all([load("/pixel/walking-and-sitting.webp"), load("/pixel/looking-around.webp")]).then(([walk, idle]) => {
      if (cancelled) return;
      const frames = (img: HTMLImageElement, cols: number, rowEdges: number[]) => {
        const temp = document.createElement("canvas"); temp.width = img.width; temp.height = img.height;
        const ctx = temp.getContext("2d")!; ctx.drawImage(img, 0, 0);
        const pixels = ctx.getImageData(0, 0, img.width, img.height).data;
        // The artwork is not perfectly aligned to equal-width cells. Find the
        // transparent gutters per row so a frame cannot include its neighbour.
        const gutters = rowEdges.slice(0, -1).map((edge, row) => {
          const y0 = Math.floor(img.height * edge), y1 = Math.floor(img.height * rowEdges[row + 1]);
          const counts = Array.from({ length: img.width }, (_, x) => {
            let count = 0;
            for (let y = y0; y < y1; y++) if (pixels[(y * img.width + x) * 4 + 3] > 100) count++;
            return count;
          });
          const edges = [0];
          for (let c = 1; c < cols; c++) {
            const expected = Math.floor(c * img.width / cols);
            const radius = Math.floor(img.width / cols * .22);
            let best = expected;
            for (let x = expected - radius; x <= expected + radius; x++) {
              if (counts[x] < counts[best] || (counts[x] === counts[best] && Math.abs(x - expected) < Math.abs(best - expected))) best = x;
            }
            edges.push(best);
          }
          return [...edges, img.width];
        });
        return Array.from({ length: cols * (rowEdges.length - 1) }, (_, i) => {
          const row = Math.floor(i / cols), col = i % cols;
          const x0 = gutters[row][col], x1 = gutters[row][col + 1];
          const y0 = Math.floor(img.height * rowEdges[row]), y1 = Math.floor(img.height * rowEdges[row + 1]);
          let left = x1, right = x0, top = y1, bottom = y0;
          for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) if (pixels[(y * img.width + x) * 4 + 3] > 100) {
            left = Math.min(left, x); right = Math.max(right, x); top = Math.min(top, y); bottom = Math.max(bottom, y);
          }
          return { x: left, y: top, w: right-left+1, h: bottom-top+1 };
        });
      };
      // Row boundaries follow the supplied artwork, including the bottom margin.
      const walking = frames(walk, 8, [0, 350 / 1086, 632 / 1086, 1]);
      const resting = frames(idle, 8, [0, .5, 1]);
      const validFrame = (frame: typeof walking[number] | undefined) =>
        !!frame && frame.w > 0 && frame.h > 0;
      const fallbackWalk = walking.find(validFrame);
      const fallbackIdle = resting.find(validFrame);
      if (!fallbackWalk || !fallbackIdle) { callback.current(); return; }
      const maxWalkHeight = Math.max(...walking.filter(validFrame).map(frame => frame.h));
      const lastSeated = walking[23];
      const seatedHeight = (validFrame(lastSeated) ? lastSeated.h : maxWalkHeight) / maxWalkHeight * 218;
      const maxIdleHeight = Math.max(...resting.filter(validFrame).map(frame => frame.h));
      // Intro timing (ms): walk in, sit down, short pause, then reveal the page.
      const walkEnd = 1500, sitFrame = 100;
      const sitFinished = walkEnd + 12 * sitFrame;
      const revealAt = sitFinished + 200;
      const reduced = !forceMotion && matchMedia("(prefers-reduced-motion: reduce)").matches;
      const skip = reduced;
      const start = performance.now(); let settled = false;
      let forcedSkip = skip;
      const render = (now: number) => {
        if (cancelled || !canvas.current) return;
        if (readyRef.current && !settled) forcedSkip = true;
        // RAF timestamps can precede performance.now() captured during a frame.
        // Clamp that first negative delta instead of indexing a sequence at -1.
        const delta = Number.isFinite(now) ? Math.max(0, now - start) : 0;
        const elapsed = forcedSkip ? revealAt + delta : delta;
        const isIdle = elapsed >= revealAt;
        const index = isIdle ? Math.floor((elapsed-revealAt)/240)%16 : elapsed < walkEnd ? Math.floor(elapsed/90)%12 : Math.min(23,12+Math.floor((elapsed-walkEnd)/sitFrame));
        const candidate = (isIdle ? resting : walking)[index];
        const f = validFrame(candidate) ? candidate : (isIdle ? fallbackIdle : fallbackWalk);
        const ctx = canvas.current.getContext("2d");
        if (!ctx) { if (!settled) callback.current(); return; }
        ctx.clearRect(0,0,240,280); ctx.imageSmoothingEnabled = false;
        const height = isIdle ? f.h / maxIdleHeight * seatedHeight : f.h / maxWalkHeight * 218;
        const width = height*f.w/f.h;
        const baseline = 210 + Math.min(1, Math.max(0, (elapsed - walkEnd) / (sitFinished - walkEnd))) * 60;
        ctx.drawImage(isIdle ? idle : walk, f.x,f.y,f.w,f.h,120-width/2,baseline-height,width,height);
        const travel = Math.max(0, canvas.current.parentElement?.offsetLeft ?? innerWidth * .6);
        canvas.current.style.transform = `translateX(${forcedSkip ? 0 : -Math.max(0,1-elapsed/walkEnd)*travel}px)`;
        canvas.current.dataset.phase = elapsed < walkEnd ? "walking" : elapsed < sitFinished ? "sitting" : elapsed < revealAt ? "settling" : "idle";
        if (elapsed >= revealAt && !settled) { settled = true; callback.current(); }
        if (!reduced) raf = requestAnimationFrame(render);
      };
      raf = requestAnimationFrame(render);
    }).catch(() => { if (!cancelled) callback.current(); });
    return () => { cancelled = true; cancelAnimationFrame(raf); };
  }, []); // One continuous animation, independent of hero reveal state.
  return <canvas ref={canvas} width={240} height={280} className="character" aria-label="Pixel Phillip walking and sitting on the upper page edge" role="img" />;
}

