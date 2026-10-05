import { Link, useNavigate } from "react-router";
import { isAuthenticated, logout } from "../services/authService";
import { useCart } from "../context/CartContext";



function Header() {
  const navigate = useNavigate();
  const authenticated = isAuthenticated();
  const { totalCount, toggleCart } = useCart();

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

        <button type="button" className="header-cart-button" onClick={toggleCart}>
          Cart({totalCount})
        </button>

  
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
