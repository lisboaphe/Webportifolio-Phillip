import { site } from "@/data/site";

export function Contact() {
  const hasEmail = !!site.email && site.email !== "hello@example.com";
  return (
    <section id="contact" className="px-5 pb-8 pt-24 sm:px-7 sm:pt-28 lg:px-10 lg:pt-36">
      <div className="content-glass mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#0d0d10] px-6 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
        <div className="relative">
          <div className="pointer-events-none absolute -right-10 -top-20 h-64 w-64 rounded-full bg-cyan-400/10 blur-[90px]" />
          <div className="pointer-events-none absolute -bottom-20 left-10 h-64 w-64 rounded-full bg-fuchsia-500/10 blur-[90px]" />
          <p className="relative font-mono text-[11px] uppercase tracking-[0.22em] text-cyan-200/55">04 / contact</p>
          <div className="relative mt-6 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h2 className="max-w-4xl text-balance text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl">
                Have an idea? Let’s turn it into something people remember.
              </h2>
              <p className="mt-5 max-w-2xl leading-7 text-white/45">
                {hasEmail ? "Get in touch to talk about opportunities and projects." : "Contact details are coming soon."}
              </p>
            </div>
            {hasEmail ? <a
              href={`mailto:${site.email}`}
              className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:bg-cyan-100 sm:w-fit"
            >
              Say hello ↗
            </a> : <span className="inline-flex min-h-14 items-center rounded-xl border border-white/15 px-6 text-sm text-white/60">Email coming soon</span>}
          </div>
        </div>
      </div>

      <footer className="mx-auto flex max-w-7xl flex-col gap-4 px-1 py-8 text-xs text-white/28 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Phillip. Built with Next.js + Tailwind.</p>
        <div className="flex gap-5">
          {site.socials.github !== "#" ? <a href={site.socials.github} className="transition hover:text-white" target="_blank" rel="noopener noreferrer">GitHub</a> : <span>GitHub · coming soon</span>}
          {site.socials.linkedin !== "#" ? <a href={site.socials.linkedin} className="social-link" target="_blank" rel="noopener noreferrer"><img src="/pixel/Icon_LinkedIn.png" alt=""/>LinkedIn</a> : <span className="social-link"><img src="/pixel/Icon_LinkedIn.png" alt=""/>LinkedIn · coming soon</span>}
          <button onClick={event => event.currentTarget.closest('[role="dialog"]')?.scrollTo({ top: 0, behavior: "auto" })} className="transition hover:text-white">Back to top ↑</button>
        </div>
      </footer>
    </section>
  );
}
