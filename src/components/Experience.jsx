import { experience, education } from "../data/resume";
import RevealSection from "./RevealSection";
import ExpandableCard from "./ExpandableCard";

export default function Experience() {
  return (
    <section className="section" id="experience">
      <RevealSection>
        <h2 className="section__title">experience</h2>
      </RevealSection>

      {experience.map((job, i) => (
        <RevealSection key={i}>
          <ExpandableCard details={job.details} defaultOpen={i === 0}>
            <div className="card__header">
              <h3 className="card__title">{job.company}</h3>
              <span className="card__date">{job.date}</span>
            </div>
            <p className="card__subtitle">{job.role}</p>
            <p className="card__location">{job.location}</p>
          </ExpandableCard>
        </RevealSection>
      ))}

      <RevealSection>
        <h2 className="section__title">education</h2>
      </RevealSection>
      {education.map((edu, i) => (
        <RevealSection key={i}>
          <article className="card">
            <div className="card__header">
              <span className="education__school">{edu.school}</span>
              <span className="card__date">{edu.date}</span>
            </div>
            <p className="education__degree">
              {edu.degree} &mdash; {edu.location}
            </p>
          </article>
        </RevealSection>
      ))}
    </section>
  );
}
