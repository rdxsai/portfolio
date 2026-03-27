export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <span>&copy; {new Date().getFullYear()}</span>
        <span>::</span>
        <a href="https://github.com/rdxsai" target="_blank" rel="noopener noreferrer">
          Rudra Desai
        </a>
      </div>
    </footer>
  );
}
