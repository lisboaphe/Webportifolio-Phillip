import { site } from "@/data/site";
import { SectionHeading } from "./SectionHeading";

export function Stack() {
  return (
    <section id="stack" className="px-5 py-24 sm:px-7 sm:py-28 lg:px-10 lg:py-36">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          kicker="03 / stack"
          title="The tools behind the pixels."
          body="Languages and tools I use to build interfaces, explore systems and turn ideas into working projects."
        />

        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {site.skills.map((skill, index) => (
            <div
              key={skill}
              className="content-glass group flex min-h-28 items-end justify-between rounded-2xl border border-white/9 bg-white/[0.022] p-5 transition hover:-translate-y-1 hover:border-white/15 hover:bg-white/[0.04]"
            >
              <span className="text-lg font-medium text-white/75 group-hover:text-white">{skill}</span>
              <span className="font-mono text-xs text-white/20">0{index + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
