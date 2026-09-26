type SectionHeadingProps = {
  kicker: string;
  title: string;
  body?: string;
};

export function SectionHeading({ kicker, title, body }: SectionHeadingProps) {
  return (
    <div className="max-w-2xl">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-cyan-200/55">
        {kicker}
      </p>
      <h2 className="mt-3 text-balance text-3xl font-semibold tracking-[-0.035em] text-white sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {body ? <p className="mt-4 leading-7 text-white/48 sm:text-lg">{body}</p> : null}
    </div>
  );
}
