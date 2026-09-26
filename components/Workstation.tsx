"use client";
import { useEffect, useRef, useState } from "react";
import { workstationFrames as frames, workstationSize } from "@/data/workstationFrames";
const width = Math.max(...frames.map(f=>f[2]));
const height = Math.max(...frames.map(f=>f[3]));
export function Workstation({animated}: {animated: boolean}) {
  const [frame,setFrame]=useState(0);
  const holder=useRef<HTMLElement>(null);
  useEffect(()=>{
    if(!animated) {setFrame(0);return;}
    let visible=true;
    const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;});
    if(holder.current) observer.observe(holder.current);
    const timer=window.setInterval(()=>{if(visible && !document.hidden) setFrame(f=>(f+1)%frames.length);},280);
    return ()=>{window.clearInterval(timer);observer.disconnect();};
  },[animated]);
  const f=frames[frame];
  return <figure ref={holder} className="workstation" aria-label="Animated pixel-art workstation with three monitors"><svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Linux, Windows and Omarchy workstation"><svg x={(width-f[2])/2} y={height-f[3]} width={f[2]} height={f[3]} viewBox={f.join(" ")} overflow="hidden"><image href="/pixel/workstation-loop.png" width={workstationSize[0]} height={workstationSize[1]}/></svg></svg></figure>;
}
