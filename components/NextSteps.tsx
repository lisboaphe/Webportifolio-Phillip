const steps = [
  {label: "Building now", title: "This portfolio", text: "Refining the interface, animations and individual sections into a personal home for my work."},
  {label: "Learning next", title: "Linux, networking & security", text: "Continuing to learn through systems, virtual machines, security tools and hands-on experimentation."},
  {label: "Coming up", title: "Sharing the process", text: "Adding project write-ups and documenting what I build and learn."},
];
export function NextSteps() {
  return <section><p className="eyebrow">Next steps</p><h2>A little further, every day.</h2><p className="next-intro">What I’m building now and where I’d like to go next.</p><div className="next-grid">{steps.map(step=><article className="content-glass next-card" key={step.label}><p className="eyebrow">{step.label}</p><h3>{step.title}</h3><p>{step.text}</p></article>)}</div></section>;
}
