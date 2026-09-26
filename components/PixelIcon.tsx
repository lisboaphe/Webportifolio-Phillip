import { iconBounds } from "@/data/iconBounds";
export function PixelIcon({name}: {name: string}) {
  if(name === "Icon_Next") return <svg className="tile-icon" viewBox="0 0 24 24" aria-hidden="true" shapeRendering="crispEdges"><path fill="#254164" d="M3 2h18v20H3z"/><path fill="#9adfff" d="M5 4h14v16H5z"/><path fill="#e9f9ff" d="M7 6h10v2H7zM7 10h10v2H7z"/><path fill="#a277eb" d="M7 14h3v3H7zM12 14h5v2h-5z"/></svg>;
  const b=iconBounds[name];
  return b ? <svg className="tile-icon" viewBox={b.slice(0,4).join(" ")} aria-hidden="true"><image href={`/pixel/${name}.png`} width={b[4]} height={b[5]}/></svg> : null;
}
