"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/data/site";
import { About } from "./About";
import { Projects } from "./Projects";
import { Stack } from "./Stack";
import { PixelIcon } from "./PixelIcon";
import { NextSteps } from "./NextSteps";
import { Workstation } from "./Workstation";
import { Resume } from "./Resume";

type Page = "about" | "projects" | "stack" | "resume" | "next";
const tabs: { id: Page; label: string; icon?: string; glyph?: string; detail: string }[] = [
  { id: "about", label: "About me", icon: "Icon_AboutME", detail: "Turning curiosity into code, systems, and security." },
  { id: "projects", label: "Projects", icon: "Icon_Projects", detail: "Ideas brought to life" },
  { id: "stack", label: "My stack", icon: "Icon_Stack", detail: "Tools of the trade" },
  { id: "next", label: "Next steps", icon: "Icon_Next", detail: "Building, learning, growing" },
  { id: "resume", label: "Résumé", icon: "Icon_Resume", detail: "My background & experience" },
];

const focusAreas = [
  {title: "Web Development", icon: "Web", text: "Building modern web experiences with React, Next.js and Tailwind CSS."},
  {title: "Linux & Systems", icon: "Linux", text: "Hands-on experience with Linux, VMs, troubleshooting and system customization."},
  {title: "Cybersecurity", icon: "Security", text: "Learning security through networking, tools, labs and hands-on experimentation."},
];
const socialItems = [
  {label: "Email", icon: "Icon_Email.svg", href: site.email && site.email !== "hello@example.com" ? `mailto:${site.email}` : ""},
  {label: "GitHub", icon: "Icon_GitHub.png", href: site.socials.github === "#" ? "" : site.socials.github},
  {label: "LinkedIn", icon: "Icon_LinkedIn.png", href: site.socials.linkedin === "#" ? "" : site.socials.linkedin},
];
function SocialItem({item, compact = false}: {item: typeof socialItems[number]; compact?: boolean}) {
  const children = <><img src={`/pixel/${item.icon}`} alt=""/>{!compact && <span>{item.label}{!item.href && <small>Coming soon</small>}</span>}</>;
  return item.href ? <a className="contact-link" href={item.href} aria-label={item.label} title={item.label} target={item.label === "Email" ? undefined : "_blank"} rel="noopener noreferrer">{children}</a> : <span className="contact-link unavailable" aria-label={`${item.label} — coming soon`} title={`${item.label} — coming soon`}>{children}</span>;
}

// Read each supplied frame's opaque bounds at runtime. This keeps the original
// artwork untouched and removes the sheets' unequal transparent margins.
function Character({ ready, onSit, forceMotion = false }: { ready: boolean; onSit: () => void; forceMotion?: boolean }) {
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
    Promise.all([load("/pixel/walkind_and_sitting.png"), load("/pixel/looking_around.png")]).then(([walk, idle]) => {
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
      const sitFinished = 3950;
      const revealAt = sitFinished + 500;
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
        const index = isIdle ? Math.floor((elapsed-revealAt)/240)%16 : elapsed < 2300 ? Math.floor(elapsed/110)%12 : Math.min(23,12+Math.floor((elapsed-2300)/150));
        const candidate = (isIdle ? resting : walking)[index];
        const f = validFrame(candidate) ? candidate : (isIdle ? fallbackIdle : fallbackWalk);
        const ctx = canvas.current.getContext("2d");
        if (!ctx) { if (!settled) callback.current(); return; }
        ctx.clearRect(0,0,240,280); ctx.imageSmoothingEnabled = false;
        const height = isIdle ? f.h / maxIdleHeight * seatedHeight : f.h / maxWalkHeight * 218;
        const width = height*f.w/f.h;
        const baseline = 210 + Math.min(1, Math.max(0, (elapsed - 2300) / 1650)) * 60;
        ctx.drawImage(isIdle ? idle : walk, f.x,f.y,f.w,f.h,120-width/2,baseline-height,width,height);
        const travel = Math.max(0, canvas.current.parentElement?.offsetLeft ?? innerWidth * .6);
        canvas.current.style.transform = `translateX(${forcedSkip ? 0 : -Math.max(0,1-elapsed/2300)*travel}px)`;
        canvas.current.dataset.phase = elapsed < 2300 ? "walking" : elapsed < sitFinished ? "sitting" : elapsed < revealAt ? "settling" : "idle";
        if (elapsed >= revealAt && !settled) { settled = true; callback.current(); }
        if (!reduced) raf = requestAnimationFrame(render);
      };
      raf = requestAnimationFrame(render);
    }).catch(() => { if (!cancelled) callback.current(); });
    return () => { cancelled = true; cancelAnimationFrame(raf); };
  }, []); // One continuous animation, independent of hero reveal state.
  return <canvas ref={canvas} width={240} height={280} className="character" aria-label="Pixel Phillip walking and sitting on the upper page edge" role="img" />;
}

export function Portfolio() {
  const [revealed, setRevealed] = useState(false);
  const [page, setPage] = useState<Page | null>(null);
  const [busy, setBusy] = useState(false);
  const hero = useRef<HTMLDivElement>(null);
  const anchor = useRef<HTMLDivElement>(null);
  const [introRun, setIntroRun] = useState(0);
  const [forceMotion, setForceMotion] = useState(true);
  const [contactOpen, setContactOpen] = useState(false);
  const photo = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const transitionLock = useRef(false);
  const overlay = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const lastButton = useRef<HTMLButtonElement | null>(null);
  const opened = useRef<Page | null>(null);
  const reveal = () => {
    const rect = anchor.current?.getBoundingClientRect();
    if (hero.current && rect) {
      hero.current.style.setProperty("--origin-x", `${rect.left + rect.width/2 - hero.current.getBoundingClientRect().left}px`);
      hero.current.style.setProperty("--origin-y", "0px");
    }
    setRevealed(true);
  };
  const replay = () => { hero.current?.style.removeProperty("clip-path"); hero.current?.style.removeProperty("animation"); setForceMotion(true); setRevealed(false); setIntroRun(n => n + 1); window.scrollTo(0, 0); };
  useEffect(() => {
    const align = () => {
      if (!photo.current || !stage.current) return;
      const a = photo.current.getBoundingClientRect();
      const b = stage.current.getBoundingClientRect();
      stage.current.style.setProperty("--character-center", `${Math.min(a.left + a.width / 2 - b.left, b.width - 178)}px`);
    };
    align();
    const observer = new ResizeObserver(align);
    if (stage.current) observer.observe(stage.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!page) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [page]);
  const transition = async (target: Page | null, button?: HTMLButtonElement) => {
    if (transitionLock.current) return;
    transitionLock.current = true;
    setBusy(true);
    if (button) lastButton.current = button;
    const source = lastButton.current;
    const rect = source?.getBoundingClientRect();
    const reduced = !forceMotion;
    if (overlay.current && rect && source && !reduced) {
      const surface = overlay.current;
      const front = source.cloneNode(true) as HTMLElement;
      front.removeAttribute("id"); front.tabIndex = -1;
      front.classList.add("flip-front");
      const back = !target && panel.current ? panel.current.cloneNode(true) as HTMLElement : document.createElement("div");
      back.removeAttribute("id"); back.removeAttribute("role");
      back.className = !target ? "destination flip-back closing-snapshot" : "flip-back";
      if (target) back.textContent = tabs.find(t => t.id === target)?.label || "";
      const rotor = document.createElement("div");
      rotor.className = "flip-rotor";
      rotor.replaceChildren(front, back);
      surface.replaceChildren(rotor);
      const gap = innerWidth <= 560 ? 12 : 28;
      const width = innerWidth - gap * 2, height = innerHeight - gap * 2;
      // Layout is set once. Every moving frame changes only transform.
      Object.assign(surface.style, {left:"0px", top:"0px", width:`${width}px`, height:`${height}px`});
      surface.style.setProperty("--tile-accent", getComputedStyle(source).getPropertyValue("--tile-accent"));
      surface.style.setProperty("--front-width", `${rect.width}px`);
      surface.style.setProperty("--front-height", `${rect.height}px`);
      surface.style.setProperty("--front-scale-x", `${width / rect.width}`);
      surface.style.setProperty("--front-scale-y", `${height / rect.height}`);
      const small = `translate3d(${rect.left}px,${rect.top}px,0) scale(${rect.width/width},${rect.height/height})`;
      const large = `translate3d(${gap}px,${gap}px,0) scale(1,1)`;
      surface.style.transform = target ? small : large;
      rotor.style.transform = `rotateY(${target ? 0 : 180}deg)`;
      surface.style.visibility = "visible";
      source.style.visibility = "hidden";
      if (!target && panel.current) {
        back.scrollTop = panel.current.scrollTop;
        panel.current.style.visibility = "hidden";
      }
      const options: KeyframeAnimationOptions = {duration: target ? 680 : 620, easing:"linear", fill:"forwards"};
      // Slightly overlap the phase boundaries so neither handoff comes to a stop.
      const movement = surface.animate(target ? [
        {transform:small, offset:0},
        {transform:small, offset:.24, easing:"cubic-bezier(.2,.65,.25,1)"},
        {transform:large, offset:1},
      ] : [
        {transform:large, offset:0, easing:"cubic-bezier(.25,.1,.35,1)"},
        {transform:small, offset:.76},
        {transform:small, offset:1},
      ], options);
      const rotation = rotor.animate(target ? [
        {transform:"rotateY(0deg)",offset:0,easing:"cubic-bezier(.3,0,.7,1)"},
        {transform:"rotateY(180deg)",offset:.34},
        {transform:"rotateY(180deg)",offset:1},
      ] : [
        {transform:"rotateY(180deg)",offset:0},
        {transform:"rotateY(180deg)",offset:.66,easing:"cubic-bezier(.3,0,.7,1)"},
        {transform:"rotateY(0deg)",offset:1},
      ], options);
      try {
        await Promise.all([movement.finished, rotation.finished]);
        setPage(target); opened.current = target;
        // Keep the final animated face until React has painted the real panel/tile.
        await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
      } catch {
        setPage(target); opened.current = target;
      } finally {
        surface.style.visibility = "hidden";
        movement.cancel(); rotation.cancel();
        source.style.visibility = "";
        if (panel.current) panel.current.style.visibility = "";
        surface.replaceChildren();
      }
    }
    transitionLock.current = false;
    setPage(target); opened.current = target; setBusy(false);
    if (target) requestAnimationFrame(() => { panel.current?.scrollTo(0,0); panel.current?.focus(); });
    else lastButton.current?.focus();
  };
  useEffect(() => {
    const sync = () => {
      const id = location.hash.slice(1) as Page;
      const target = tabs.some(t=>t.id===id) ? id : null;
      if (target !== opened.current) void transition(target);
    };
    sync(); window.addEventListener("popstate",sync);
    return () => window.removeEventListener("popstate",sync);
  }, [busy]);
  const close = () => { history.pushState(null,"",location.pathname); void transition(null); };
  return <main className={`portfolio-shell ${revealed ? "intro-complete" : "intro-playing"} ${forceMotion ? "force-motion motion-enabled" : "motion-reduced"}`}>
    <div ref={stage} className="stage">
    <div className="sitting-line" aria-hidden="true"/>
    <header className="identity" aria-hidden={!revealed || !!page}><div className="identity-content"><h1>Phillip Lisboa</h1><p>Wirtschaftsinformatik Student · Developer · Cybersecurity Enthusiast</p></div></header>
    <nav className={`rim-socials ${page ? "character-hidden" : ""}`} aria-label="Social links" inert={!revealed || !!page || busy}>{[socialItems[1],socialItems[2],socialItems[0]].map(item=><SocialItem key={item.label} item={item} compact/>)}</nav>
    <div ref={hero} onAnimationEnd={event => { if (event.target === event.currentTarget && event.animationName === "water-reveal") { event.currentTarget.style.animation = "none"; event.currentTarget.style.clipPath = "none"; } }} className={`hero-surface ${revealed ? "is-revealed" : ""}`} inert={!revealed || !!page || busy}>
      <div className="bento-layout">
        <section className="focus-areas" aria-label="What I do">{focusAreas.map(area => <article className="focus-card" key={area.title}><PixelIcon name={`Icon_${area.icon}`}/><h2>{area.title}</h2><p>{area.text}</p></article>)}</section>
        <div ref={photo} className="photo-tile"><img src="/chibi/phillip.png" alt="Temporary illustrated portrait of Phillip" className="portrait-image"/><div className="photo-caption"><span>PHILLIP</span><span>One pixel at a time.</span></div></div>
        <nav className="portal-nav" aria-label="Explore my portfolio">{tabs.map((tab)=><button key={tab.id} disabled={busy} onClick={e=>{history.pushState(null,"",`#${tab.id}`);void transition(tab.id,e.currentTarget);}} className={`portal-button tile-${tab.id}`}>{tab.icon ? <PixelIcon name={tab.icon}/> : <span className="portal-glyph">{tab.glyph}</span>}<span className="portal-text"><strong>{tab.label}</strong><small>{tab.detail}</small></span></button>)}
        <div className={`portal-button tile-contact contact-card ${contactOpen ? "contact-open" : ""}`} onKeyDown={e=>{if(e.key==="Escape") {setContactOpen(false);e.currentTarget.querySelector("button")?.focus();}}}>
          <button className="contact-toggle" aria-expanded={contactOpen} aria-controls="contact-options" onClick={()=>setContactOpen(v=>!v)}><span className="contact-heading"><PixelIcon name="Icon_Contact"/><span className="portal-text"><strong>Contact</strong><small>Let’s connect</small></span></span></button>
          <div id="contact-options" className="contact-options" inert={!contactOpen} aria-hidden={!contactOpen}><div>{socialItems.map(item=><SocialItem key={item.label} item={item}/>)}</div></div>
        </div></nav>
      </div>
    </div>
    <div ref={anchor} className={`character-anchor ${page ? "character-hidden" : ""}`}><Character key={introRun} forceMotion={forceMotion} ready={revealed} onSit={reveal}/></div>
    </div>
    {revealed && !page && <Workstation animated={forceMotion && !busy}/> }
    {revealed && !page && !busy && <div className="motion-controls"><button onClick={() => setForceMotion(v => !v)} aria-pressed={forceMotion}>Tile animations: {forceMotion ? "on" : "off"}</button><button onClick={replay}>Replay intro ↺</button></div>}
    {!revealed && !page && !busy && <button className="skip-intro" onClick={reveal}>Skip intro ↗</button>}
    <div className="transition-surface" ref={overlay} aria-hidden="true" inert/>
    {page && <div ref={panel} className="destination" role="dialog" aria-modal="true" aria-label={tabs.find(t=>t.id===page)?.label} tabIndex={-1} onKeyDown={e=>{if(e.key==="Escape")close();
      if(e.key==="Tab") {
        const items = panel.current?.querySelectorAll<HTMLElement>('button:not([disabled]),a[href],[tabindex="0"]');
        if(items?.length) {
          const first=items[0], last=items[items.length-1];
          if(e.shiftKey && (document.activeElement===first || document.activeElement===panel.current)){e.preventDefault();last.focus();}
          else if(!e.shiftKey && document.activeElement===last){e.preventDefault();first.focus();}
        }
      }}}><div className="panel-close-anchor"><button className="panel-close" onClick={close} disabled={busy} aria-label="Close expanded tile" title="Close (Esc)"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg></button></div><div className={`topic-content ${forceMotion ? "animate__animated animate__fadeInUp" : ""}`}>{page==="about" ? <About/> : page==="projects" ? <Projects/> : page==="stack" ? <Stack/> : page==="next" ? <NextSteps/> : <Resume/>}</div></div>}
  </main>;
}
