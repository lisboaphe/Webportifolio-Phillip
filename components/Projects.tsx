import { site } from "@/data/site";
import { SectionHeading } from "./SectionHeading";

export function Projects() {
  return (
    <section id="work" className="px-5 py-24 sm:px-7 sm:py-28 lg:px-10 lg:py-36">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          kicker="02 / selected work"
          title="Projects that deserve more than a small card."
          body="Personal projects, experiments and the source code behind them."
        />

        <div className="mt-12 space-y-5">
          {site.projects.map((project, index) => (
            <article
              key={project.number}
              className="content-glass group grid overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/[0.024] transition duration-300 hover:border-white/18 hover:bg-white/[0.035] lg:grid-cols-[.92fr_1.08fr]"
            >
              <div className={`relative min-h-[17rem] overflow-hidden border-b border-white/8 lg:min-h-[28rem] lg:border-b-0 ${index % 2 ? "lg:order-2 lg:border-l" : "lg:border-r"}`}>
                <div className="project-grid absolute inset-0 opacity-45" />
                <div className={`absolute inset-0 ${index % 3 === 0 ? "bg-[radial-gradient(circle_at_30%_35%,rgba(217,70,239,.22),transparent_38%),radial-gradient(circle_at_72%_67%,rgba(34,211,238,.20),transparent_38%)]" : index % 3 === 1 ? "bg-[radial-gradient(circle_at_60%_36%,rgba(59,130,246,.22),transparent_35%),radial-gradient(circle_at_30%_68%,rgba(139,92,246,.18),transparent_40%)]" : "bg-[radial-gradient(circle_at_40%_45%,rgba(34,197,94,.13),transparent_36%),radial-gradient(circle_at_75%_70%,rgba(34,211,238,.18),transparent_40%)]"}`} />

                <div className="absolute left-1/2 top-1/2 w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/12 bg-black/45 p-3 shadow-2xl backdrop-blur-xl sm:w-[62%] lg:w-[68%]">
                  <div className="mb-3 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                    <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                    <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                  </div>
                  <div className="aspect-[16/10] rounded-xl border border-white/8 bg-gradient-to-br from-white/7 to-white/[0.015] p-4">
                    <div className="h-2 w-20 bg-white/14" />
                    <div className="mt-4 h-10 w-3/4 bg-white/8" />
                    <div className="mt-3 h-2 w-full bg-white/8" />
                    <div className="mt-2 h-2 w-4/5 bg-white/8" />
                    <div className="mt-5 flex gap-2">
                      <div className="h-7 w-20 rounded-md bg-white/10" />
                      <div className="h-7 w-16 rounded-md border border-white/10" />
                    </div>
                  </div>
                </div>
              </div>

              <div className={`flex min-h-[22rem] flex-col justify-between p-6 sm:p-8 lg:p-10 ${index % 2 ? "lg:order-1" : ""}`}>
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-mono text-xs text-white/28">{project.number}</span>
                    <span className="rounded-full border border-white/9 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-white/32">
                      {project.status}
                    </span>
                  </div>
                  <h3 className="mt-7 text-3xl font-semibold tracking-[-0.035em] text-white sm:text-4xl">
                    {project.title}
                  </h3>
                  <p className="mt-4 max-w-xl leading-7 text-white/48">{project.description}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-lg border border-white/9 bg-white/[0.025] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.13em] text-white/38"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {project.href !== "#" ? <a
                  href={project.href}
                  className="mt-10 inline-flex w-fit items-center gap-2 text-sm font-medium text-white/70 transition group-hover:text-white"
                >
                  Open project
                </a> : <span className="mt-10 text-sm text-white/50">Project details coming soon</span>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
