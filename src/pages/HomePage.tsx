import {Link} from "react-router";

function HomePage() {
  return (
    <section className="home-page">
        <div className="home-page-content">
            <h1>Welcome to Our Webshop!</h1>
            <p>Discover a wide range of products and enjoy a seamless shopping experience.</p>
            <Link to="/products" className="home-button">
                Shop Now
            </Link>
        </div>
    </section>
  );
}

export default HomePage;