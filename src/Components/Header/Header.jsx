// src/components/Header.js
import "./Header.css";

const Header = () => {
  const user = "Robert Fox";

  return (
    <header className="header">
      <div className="welcome-message">
        <h1>Welcome Back, {user}!</h1>
        <p>
          There are many variations of passages of Lorem Ipsum available, but
          the majority have suffered alteration
        </p>
        <button>Get Started</button>
      </div>
    </header>
  );
};

export default Header;
