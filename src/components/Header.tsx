import { Link, useNavigate } from "react-router";
import { isAuthenticated, logout } from "../services/authService";

function Header() {
  const navigate = useNavigate();
  const authenticated = isAuthenticated();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="header">
      <nav className="header-nav">
        <Link to="/">
          Home
        </Link>

        <Link to="/products">
          Products
        </Link>

        <Link to="/cart">
          Cart
        </Link>

        {authenticated ? (
          <button onClick={handleLogout} className="nav__button">
            Logout
          </button>
        ) : (
          <Link to="/login">
            Login
          </Link>
        )}
      </nav>
    </header>
  );
}

export default Header;
