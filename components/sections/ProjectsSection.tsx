import { site } from "@/data/portfolio-content";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function ProjectsSection() {
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

                <div className={`project-shots ${project.layout === "tall" ? "is-tall" : "is-wide"} ${project.images.length > 1 ? "has-two" : ""}`}>
                  {project.images.map((image) => (
                    <div className="project-shot" key={image.src}>
                      <img src={image.src} alt={image.alt} loading="lazy" />
                    </div>
                  ))}
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
                  <p className="project-category">{project.category}</p>
                  <h3 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-white sm:text-4xl">
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
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-10 inline-flex w-fit items-center gap-2 text-sm font-medium text-white/70 transition group-hover:text-white"
                >
                  View on GitHub →
                </a> : <span className="mt-10 text-sm text-white/50">Project details coming soon</span>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
