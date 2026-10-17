type TransitionOptions = {
  surface: HTMLElement;
  source: HTMLElement;
  rect: DOMRect;
  panelRef: { current: HTMLDivElement | null };
  target: boolean;
  label: string;
  onCommit: () => void;
};

// The only place that controls tile flip/expand/shrink timing and geometry.
export async function animateTileTransition({surface, source, rect, panelRef, target, label, onCommit}: TransitionOptions) {
  const front = source.cloneNode(true) as HTMLElement;
  front.removeAttribute("id"); front.tabIndex = -1;
  front.classList.add("flip-front");
  const back = !target && panelRef.current ? panelRef.current.cloneNode(true) as HTMLElement : document.createElement("div");
  back.removeAttribute("id"); back.removeAttribute("role");
  back.className = !target ? "destination flip-back closing-snapshot" : "flip-back";
  if (target) back.textContent = label;
  const rotor = document.createElement("div");
  rotor.className = "flip-rotor";
  rotor.replaceChildren(front, back);
  surface.replaceChildren(rotor);
  const gap = innerWidth <= 560 ? 12 : 28;
  const width = innerWidth - gap * 2, height = innerHeight - gap * 2;
  // Set layout once; animate transforms only on synchronized layers.
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
  if (!target && panelRef.current) {
    back.scrollTop = panelRef.current.scrollTop;
    panelRef.current.style.visibility = "hidden";
  }
  const options: KeyframeAnimationOptions = {duration: target ? 680 : 620, easing:"linear", fill:"forwards"};
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
    onCommit();
    await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
  } catch {
    onCommit();
  } finally {
    surface.style.visibility = "hidden";
    movement.cancel(); rotation.cancel();
    source.style.visibility = "";
    if (panelRef.current) panelRef.current.style.visibility = "";
    surface.replaceChildren();
  }
}
