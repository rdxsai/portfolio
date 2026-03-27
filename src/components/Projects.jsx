import { projects } from "../data/resume";
import RevealSection from "./RevealSection";
import ExpandableCard from "./ExpandableCard";

export default function Projects() {
  return (
    <section className="section" id="projects">
      <RevealSection>
        <h2 className="section__title">projects</h2>
      </RevealSection>

      {projects.map((proj, i) => (
        <RevealSection key={i}>
          <ExpandableCard details={proj.details} defaultOpen={i === 0}>
            <h3 className="card__title">{proj.title}</h3>
            <ul className="card__tech">
              {proj.tech.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </ExpandableCard>
        </RevealSection>
      ))}
    </section>
  );
}
