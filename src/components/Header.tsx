function Header() {
  return (
    <header className="header">
      <nav className="header-nav">
        <a href="/" className="nav__link">
          Home
        </a>
        <a href="/products" className="nav__link">
          Products
        </a>
        <a href="/cart" className="nav__link">
          Cart
        </a>
        <a href="/login" className="nav__link">
          Login
        </a>
      </nav>
    </header>
  );
}
export default Header;
