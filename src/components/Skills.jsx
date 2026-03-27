import { skills } from "../data/resume";
import RevealSection from "./RevealSection";

export default function Skills() {
  return (
    <section className="section" id="skills">
      <RevealSection>
        <h2 className="section__title">skills</h2>
      </RevealSection>

      {Object.entries(skills).map(([category, items], i) => (
        <RevealSection key={category}>
          <div className="skills__group">
            <p className="skills__label">{category}</p>
            <ul className="skills__list">
              {items.map((item, j) => (
                <li
                  key={item}
                  style={{ transitionDelay: `${j * 30}ms` }}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </RevealSection>
      ))}
    </section>
  );
}
