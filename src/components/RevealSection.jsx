import useReveal from "../hooks/useReveal";

export default function RevealSection({ children, className = "", id }) {
  const { ref, visible } = useReveal(0.1);

  return (
    <div
      ref={ref}
      id={id}
      className={`reveal ${visible ? "visible" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
