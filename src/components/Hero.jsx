import { personal } from "../data/resume";
import useTypewriter from "../hooks/useTypewriter";

export default function Hero() {
  const greeting = useTypewriter("$ whoami", 80, 300);
  const name = useTypewriter(personal.name, 70, 1200);
  const title = useTypewriter(personal.title, 50, 2200);

  return (
    <section className="hero" id="about">
      <p className="hero__greeting">
        {greeting.displayed}
        {!greeting.done && <span className="hero__cursor" />}
      </p>
      <h1 className="hero__name">
        {name.displayed}
        {greeting.done && !name.done && <span className="hero__cursor" />}
      </h1>
      <h2 className="hero__title">
        {title.displayed}
        {name.done && !title.done && <span className="hero__cursor" />}
      </h2>
      {title.done && (
        <>
          <p className="hero__summary">{personal.summary}</p>
          <ul className="hero__contact">
            <li>
              <a href={`mailto:${personal.email}`}>{personal.email}</a>
            </li>
            <li>
              <a href={`https://${personal.linkedin}`} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </li>
            <li>
              <a href={`https://${personal.github}`} target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </li>
            <li>
              <a href={`tel:${personal.phone}`}>{personal.phone}</a>
            </li>
          </ul>
        </>
      )}
    </section>
  );
}
