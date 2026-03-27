import { useState } from "react";

export default function ExpandableCard({ children, details, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <article className="card">
      {children}
      <button className="card__toggle" onClick={() => setOpen(!open)}>
        <span className={`card__toggle-icon ${open ? "open" : ""}`}>&#9654;</span>
        {open ? "collapse" : "expand details"}
      </button>
      <div className={`card__details-wrapper ${open ? "open" : ""}`}>
        <div className="card__details-inner">
          <ul className="card__details">
            {details.map((d, j) => (
              <li key={j}>{d}</li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}
