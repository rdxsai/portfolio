import { useState, useEffect } from "react";
import "./styles/global.css";
import "./styles/layout.css";
import "./styles/header.css";
import "./styles/footer.css";
import "./styles/sections.css";

import Starfield from "./components/Starfield";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Skills from "./components/Skills";

const sectionIds = ["about", "experience", "projects", "skills"];

export default function App() {
  const [active, setActive] = useState("about");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  const handleNavigate = (section) => {
    setActive(section);
    const el = document.getElementById(section);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Starfield />
      <div className="container">
        <Header active={active} onNavigate={handleNavigate} />
        <main className="content">
          <Hero />
          <hr />
          <Experience />
          <hr />
          <Projects />
          <hr />
          <Skills />
        </main>
        <Footer />
      </div>
    </>
  );
}
