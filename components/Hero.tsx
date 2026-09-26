import Image from "next/image";
import { site } from "@/data/site";
import { PixelBadge } from "./PixelBadge";

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center overflow-hidden px-5 pb-16 pt-28 sm:px-7 lg:px-10"
    >
      <div className="hero-grid absolute inset-0 opacity-35" />
      <div className="pointer-events-none absolute left-[-12rem] top-32 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-[110px] sm:h-[28rem] sm:w-[28rem]" />
      <div className="pointer-events-none absolute right-[-10rem] top-28 h-80 w-80 rounded-full bg-cyan-400/20 blur-[110px] sm:h-[30rem] sm:w-[30rem]" />
      <div className="pointer-events-none absolute bottom-[-14rem] left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-indigo-500/15 blur-[120px]" />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-14 lg:grid-cols-[1.05fr_.95fr] lg:gap-8">
        <div className="order-2 text-center lg:order-1 lg:text-left">
          <div className="mb-6 flex justify-center lg:justify-start">
            <PixelBadge>Available for the next chapter</PixelBadge>
          </div>

          <p className="mb-4 font-mono text-xs uppercase tracking-[0.24em] text-cyan-200/70 sm:text-sm">
            {site.eyebrow}
          </p>
          <h1 className="mx-auto max-w-3xl text-balance text-5xl font-semibold leading-[0.94] tracking-[-0.055em] text-white xs:text-6xl sm:text-7xl lg:mx-0 lg:text-[6.6rem]">
            {site.name}
            <span className="text-white/22">.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-balance text-lg leading-8 text-white/60 sm:text-xl lg:mx-0 lg:max-w-2xl">
            {site.heroLine}
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 xs:flex-row lg:justify-start">
            <a
              href="#work"
              className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:bg-cyan-100"
            >
              View my work
              <span className="transition group-hover:translate-x-0.5">↘</span>
            </a>
            <a
              href="#about"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/12 bg-white/[0.035] px-5 py-3 text-sm font-semibold text-white/75 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
            >
              About me
            </a>
          </div>

          <div className="mt-10 flex items-center justify-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-white/30 lg:justify-start">
            <span className="pixel-down">↓</span>
            Scroll to explore
          </div>
        </div>

        <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
          <div className="relative w-full max-w-[25rem] sm:max-w-[29rem]">
            <div className="absolute -inset-8 rounded-[3rem] bg-gradient-to-br from-fuchsia-500/10 via-transparent to-cyan-400/10 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/12 bg-[#101012]/75 p-3 shadow-[0_40px_120px_rgba(0,0,0,.45)] backdrop-blur-2xl">
              <div className="mb-3 flex items-center justify-between px-2 pt-1">
                <div className="flex gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-white/15" />
                  <span className="h-2 w-2 rounded-full bg-white/15" />
                  <span className="h-2 w-2 rounded-full bg-white/15" />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/30">
                  player_01
                </span>
              </div>

              <div className="relative aspect-square overflow-hidden rounded-[1.45rem] bg-[#ece2d5]">
                <Image
                  src="/chibi/phillip.png"
                  alt="Chibi portrait of Phillip"
                  fill
                  priority
                  sizes="(max-width: 1024px) 80vw, 420px"
                  className="object-cover transition duration-700 hover:scale-[1.035]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-white/5" />
                <div className="absolute bottom-4 left-4 rounded-lg border border-black/10 bg-black/65 px-3 py-2 text-left backdrop-blur-md">
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/45">
                    status
                  </p>
                  <p className="mt-0.5 text-xs font-medium text-white">Building something new ✦</p>
                </div>
              </div>

              <div className="flex items-end justify-between gap-4 px-2 pb-2 pt-4 text-left">
                <div>
                  <p className="text-sm font-semibold text-white">{site.name}</p>
                  <p className="mt-0.5 text-xs text-white/40">{site.role}</p>
                </div>
                <div className="grid h-9 w-9 place-items-center border border-white/10 bg-white/[0.035] font-mono text-xs text-white/55 shadow-[3px_3px_0_rgba(34,211,238,.12)]">
                  +1
                </div>
              </div>
            </div>

            <div className="pixel-star absolute -right-2 top-10 hidden sm:block">✦</div>
            <div className="pixel-star absolute -left-7 bottom-16 hidden text-fuchsia-200/70 sm:block">+</div>
          </div>
        </div>
      </div>
    </section>
  );
}
