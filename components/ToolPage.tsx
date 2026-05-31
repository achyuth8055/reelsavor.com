import { Breadcrumb } from "@/components/Bits";
import { ToolIcon } from "@/components/Illustrations";

const DEFAULT_CHIPS = ["Runs in your browser", "No uploads", "Free — no sign-up"];

export function ToolHero({
  slug,
  eyebrow = "Free browser tool",
  title,
  subtitle,
  chips = DEFAULT_CHIPS,
}: {
  slug: string;
  eyebrow?: string;
  title: string;
  subtitle: string;
  chips?: string[];
}) {
  return (
    <header className="tool-hero">
      <div className="container">
        <Breadcrumb
          items={[
            { href: "/", label: "Home" },
            { href: "/tools/", label: "Tools" },
            { label: title },
          ]}
        />
        <div className="tool-hero-inner">
          <span className="tool-icon-tile" aria-hidden>
            <ToolIcon slug={slug} size={40} />
          </span>
          <div>
            <span className="eyebrow">{eyebrow}</span>
            <h1 style={{ margin: "6px 0 8px" }}>{title}</h1>
            <p className="tool-hero-sub">{subtitle}</p>
            <ul className="chip-row" aria-label="Tool highlights">
              {chips.map((c) => (
                <li key={c} className="chip">
                  <span aria-hidden>✓</span> {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}

export function StepCards({
  steps,
  heading = "How it works",
}: {
  heading?: string;
  steps: { title: string; body: string }[];
}) {
  return (
    <section aria-label={heading} style={{ margin: "8px 0" }}>
      <h2>{heading}</h2>
      <ol className="step-cards">
        {steps.map((s, i) => (
          <li className="step-card" key={s.title}>
            <span className="step-num" aria-hidden>
              {i + 1}
            </span>
            <div>
              <strong>{s.title}</strong>
              <p>{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
