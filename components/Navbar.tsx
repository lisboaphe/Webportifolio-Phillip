"use client";

import { useEffect, useState } from "react";

const links = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Stack", href: "#stack" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
      <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-white/10 bg-[#09090b]/75 px-4 py-3 shadow-2xl shadow-black/20 backdrop-blur-xl sm:px-5">
        <a
          href="#top"
          className="group flex items-center gap-2 font-semibold tracking-tight text-white"
          aria-label="Go to top"
        >
          <span className="h-2.5 w-2.5 bg-cyan-300 shadow-[3px_3px_0_rgba(168,85,247,.55)]" />
          PHILLIP<span className="text-white/35">.</span>
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-white/60 transition hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-white md:hidden"
          aria-label="Toggle navigation"
          aria-expanded={open}
        >
          <span className="font-mono text-lg">{open ? "×" : "≡"}</span>
        </button>

        {open && (
          <div className="absolute left-4 right-4 top-[76px] rounded-2xl border border-white/10 bg-[#0d0d10]/95 p-3 shadow-2xl backdrop-blur-xl md:hidden">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-4 py-3 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}
