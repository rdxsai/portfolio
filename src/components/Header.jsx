const sections = ["about", "experience", "projects", "skills"];

export default function Header({ active, onNavigate }) {
  return (
    <header className="header">
      <div className="header__logo">
        <a href="#" onClick={(e) => { e.preventDefault(); onNavigate("about"); }}>
          rudra desai
        </a>
      </div>
      <nav className="header__nav">
        <ul>
          {sections.map((s) => (
            <li key={s}>
              <a
                href={`#${s}`}
                className={active === s ? "active" : ""}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(s);
                }}
              >
                {s}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
