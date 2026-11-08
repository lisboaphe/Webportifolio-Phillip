"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/data/portfolio-content";
import { AboutSection } from "@/components/sections/AboutSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { TechStackSection } from "@/components/sections/TechStackSection";
import { PixelIcon } from "@/components/ui/PixelIcon";
import { NextStepsSection } from "@/components/sections/NextStepsSection";
import { WorkstationArtwork } from "./WorkstationArtwork";
import { CharacterIntro } from "@/components/animations/CharacterIntro";
import { animateTileTransition } from "@/components/animations/animateTileTransition";
import { ResumeSection } from "@/components/sections/ResumeSection";
import { ContactSection } from "@/components/sections/ContactSection";

const INTRO_SEEN_KEY = "intro-seen";
type Page = "about" | "projects" | "stack" | "resume" | "next" | "message";
const tabs: { id: Page; label: string; icon?: string; glyph?: string; detail: string }[] = [
  { id: "about", label: "About me", icon: "Icon_AboutME", detail: "Turning curiosity into code, systems, and security." },
  { id: "projects", label: "Projects", icon: "Icon_Projects", detail: "Ideas brought to life" },
  { id: "stack", label: "My stack", icon: "Icon_Stack", detail: "Tools of the trade" },
  { id: "next", label: "Next steps", icon: "Icon_Next", detail: "Building, learning, growing" },
  { id: "resume", label: "Résumé", icon: "Icon_Resume", detail: "My background & experience" },
];
// Pages that open as a panel but have no tile of their own.
const pages = [...tabs, { id: "message" as Page, label: "Send a message", detail: "" }];

const focusAreas = [
  {title: "Web Development", icon: "Web", text: "Building modern web experiences with React, Next.js and Tailwind CSS."},
  {title: "Linux & Systems", icon: "Linux", text: "Hands-on experience with Linux, VMs, troubleshooting and system customization."},
  {title: "Cybersecurity", icon: "Security", text: "Learning security through networking, tools, labs and hands-on experimentation."},
];
const socialItems = [
  {label: "GitHub", icon: "Icon_GitHub-small.webp", href: site.socials.github === "#" ? "" : site.socials.github},
  {label: "LinkedIn", icon: "Icon_LinkedIn-small.webp", href: site.socials.linkedin === "#" ? "" : site.socials.linkedin},
];
function SocialItem({item, compact = false}: {item: typeof socialItems[number]; compact?: boolean}) {
  const children = <><img src={`/pixel/${item.icon}`} alt=""/>{!compact && <span>{item.label}{!item.href && <small>Coming soon</small>}</span>}</>;
  return item.href ? <a className="contact-link" href={item.href} aria-label={item.label} title={item.label} target="_blank" rel="noopener noreferrer">{children}</a> : <span className="contact-link unavailable" aria-label={`${item.label} — coming soon`} title={`${item.label} — coming soon`}>{children}</span>;
}

export function PortfolioLayout() {
  const [revealed, setRevealed] = useState(false);
  const [page, setPage] = useState<Page | null>(null);
  const [busy, setBusy] = useState(false);
  const hero = useRef<HTMLDivElement>(null);
  const anchor = useRef<HTMLDivElement>(null);
  const [introRun, setIntroRun] = useState(0);
  const [forceMotion, setForceMotion] = useState(true);
  const [contactOpen, setContactOpen] = useState(false);
  const [drops, setDrops] = useState<{ id: number; step: 1 | 2; x: number; y: number }[]>([]);
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
    try { localStorage.setItem(INTRO_SEEN_KEY, "1"); } catch {}
  };
  // Small and medium ripple under the character's feet on the line, where he is at that step.
  const drop = (step: 1 | 2) => {
    const a = anchor.current?.querySelector("canvas")?.getBoundingClientRect(), h = hero.current?.getBoundingClientRect(), s = stage.current?.getBoundingClientRect();
    if (!a || !h || !s) return;
    setDrops(list => [...list, { id: Date.now() + step, step, x: a.left + a.width / 2 - s.left, y: h.top - s.top }]);
  };
  const replay = () => { hero.current?.style.removeProperty("clip-path"); hero.current?.style.removeProperty("animation"); hero.current?.style.removeProperty("filter"); setForceMotion(true); setRevealed(false); setIntroRun(n => n + 1); window.scrollTo(0, 0); };
  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try { seen = localStorage.getItem(INTRO_SEEN_KEY) === "1"; } catch {}
    if (reduce) setForceMotion(false);
    if (reduce || seen) reveal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // While the intro plays, any click or key press skips it.
  useEffect(() => {
    if (revealed) return;
    const skip = (event: Event) => {
      if (event instanceof KeyboardEvent && ["Tab", "Shift", "Alt", "Control", "Meta"].includes(event.key)) return;
      reveal();
    };
    window.addEventListener("pointerdown", skip);
    window.addEventListener("keydown", skip);
    return () => { window.removeEventListener("pointerdown", skip); window.removeEventListener("keydown", skip); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealed]);
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
      await animateTileTransition({
        surface: overlay.current, source, rect, panelRef: panel,
        target: target !== null,
        label: pages.find(tab => tab.id === target)?.label || "",
        onCommit: () => { setPage(target); opened.current = target; },
      });
    }
    transitionLock.current = false;
    setPage(target); opened.current = target; setBusy(false);
    if (target) requestAnimationFrame(() => { panel.current?.scrollTo(0,0); panel.current?.focus(); });
    else lastButton.current?.focus();
  };
  useEffect(() => {
    const sync = () => {
      const id = location.hash.slice(1) as Page;
      const target = pages.some(t=>t.id===id) ? id : null;
      if (target !== opened.current) void transition(target);
    };
    sync(); window.addEventListener("popstate",sync);
    return () => window.removeEventListener("popstate",sync);
  }, [busy]);
  const openMessage = (button: HTMLButtonElement) => { setContactOpen(false); history.pushState(null,"","#message"); void transition("message", button); };
  const close = () => { history.pushState(null,"",location.pathname); void transition(null); };
  return <main className={`portfolio-shell ${revealed ? "intro-complete" : "intro-playing"} ${forceMotion ? "force-motion motion-enabled" : "motion-reduced"}`}>
    <div ref={stage} className="stage">
    <div className="sitting-line" aria-hidden="true"/>
    {drops.map(d => <span key={d.id} className={`pre-ripple step-${d.step}`} style={{left: d.x, top: d.y}} aria-hidden="true" onAnimationEnd={() => setDrops(list => list.filter(x => x.id !== d.id))}/>)}
    <header className="identity" aria-hidden={!revealed || !!page}><div className="identity-content"><h1>Phillip Lisboa</h1><p>Wirtschaftsinformatik Student · Developer · Cybersecurity Enthusiast</p></div></header>
    <nav className={`rim-socials ${page ? "character-hidden" : ""}`} aria-label="Social links" inert={!revealed || !!page || busy}>{socialItems.map(item=><SocialItem key={item.label} item={item} compact/>)}<button type="button" className="contact-link" aria-label="Send me a message" title="Send me a message" onClick={e=>openMessage(e.currentTarget)}><img src="/pixel/Icon_Email.svg" alt=""/></button></nav>
    <div ref={hero} onAnimationEnd={event => { if (event.target === event.currentTarget && event.animationName === "water-reveal") { event.currentTarget.style.setProperty("animation", "none", "important"); event.currentTarget.style.setProperty("clip-path", "none", "important"); event.currentTarget.style.setProperty("filter", "none", "important"); } }} className={`hero-surface ${revealed ? "is-revealed" : ""}`} inert={!revealed || !!page || busy}>
      <div className="bento-layout">
        <section className="focus-areas" aria-label="What I do">{focusAreas.map(area => <article className="focus-card" key={area.title}><PixelIcon name={`Icon_${area.icon}`}/><h2>{area.title}</h2><p>{area.text}</p></article>)}</section>
        <div ref={photo} className="photo-tile"><img src="/chibi/phillip.webp" alt="Pixel-art Phillip wearing a black hoodie" className="portrait-image"/><div className="photo-caption"><span>PHILLIP</span><span>One pixel at a time.</span></div></div>
        <nav className="portal-nav" aria-label="Explore my portfolio">{tabs.map((tab)=><button key={tab.id} disabled={busy} onClick={e=>{history.pushState(null,"",`#${tab.id}`);void transition(tab.id,e.currentTarget);}} className={`portal-button tile-${tab.id}`}>{tab.icon ? <PixelIcon name={tab.icon}/> : <span className="portal-glyph">{tab.glyph}</span>}<span className="portal-text"><strong>{tab.label}</strong><small>{tab.detail}</small></span></button>)}
        <div className={`portal-button tile-contact contact-card ${contactOpen ? "contact-open" : ""}`} onKeyDown={e=>{if(e.key==="Escape") {setContactOpen(false);e.currentTarget.querySelector("button")?.focus();}}}>
          <button className="contact-toggle" aria-expanded={contactOpen} aria-controls="contact-options" onClick={()=>setContactOpen(v=>!v)}><span className="contact-heading"><PixelIcon name="Icon_Contact"/><span className="portal-text"><strong>Contact</strong><small>Let’s connect</small></span></span></button>
          <div id="contact-options" className="contact-options" inert={!contactOpen} aria-hidden={!contactOpen}><div>{socialItems.map(item=><SocialItem key={item.label} item={item}/>)}<button type="button" className="contact-link" onClick={e=>openMessage(e.currentTarget)}><img src="/pixel/Icon_Email.svg" alt=""/><span>Email<small>Send me a message</small></span></button></div></div>
        </div></nav>
      </div>
    </div>
    <div ref={anchor} className={`character-anchor ${page ? "character-hidden" : ""}`}><CharacterIntro key={`${introRun}-${forceMotion}`} forceMotion={forceMotion} ready={revealed} onSit={reveal} onCue={drop}/></div>
    </div>
    {revealed && !page && <WorkstationArtwork/> }
    {revealed && !page && !busy && <div className="motion-controls"><button onClick={() => setForceMotion(v => !v)} aria-pressed={forceMotion}>Tile animations: {forceMotion ? "on" : "off"}</button><button onClick={replay}>Replay intro</button></div>}
    {!revealed && !page && !busy && <button className="skip-intro" onClick={reveal}>Skip intro</button>}
    <div className="transition-surface" ref={overlay} aria-hidden="true" inert/>
    {page && <div ref={panel} className="destination" role="dialog" aria-modal="true" aria-label={pages.find(t=>t.id===page)?.label} tabIndex={-1} onKeyDown={e=>{if(e.key==="Escape")close();
      if(e.key==="Tab") {
        const items = panel.current?.querySelectorAll<HTMLElement>('button:not([disabled]),a[href],input:not([disabled]):not([tabindex="-1"]),textarea:not([disabled]),[tabindex="0"]');
        if(items?.length) {
          const first=items[0], last=items[items.length-1];
          if(e.shiftKey && (document.activeElement===first || document.activeElement===panel.current)){e.preventDefault();last.focus();}
          else if(!e.shiftKey && document.activeElement===last){e.preventDefault();first.focus();}
        }
      }}}><div className="panel-close-anchor"><button className="panel-close" onClick={close} disabled={busy} aria-label="Close expanded tile" title="Close (Esc)"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg></button></div><div className={`topic-content ${forceMotion ? "animate__animated animate__fadeInUp" : ""}`}>{page==="about" ? <AboutSection/> : page==="projects" ? <ProjectsSection/> : page==="stack" ? <TechStackSection/> : page==="next" ? <NextStepsSection/> : page==="message" ? <ContactSection/> : <ResumeSection/>}</div></div>}
  </main>;
}
