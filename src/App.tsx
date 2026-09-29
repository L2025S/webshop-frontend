import "./Styles.css";
import Header from "./components/Header";
import { Route, Routes } from "react-router";
import LoginPage from "./pages/loginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import WelcomeLoginPage from "./pages/WelcomeLoginPage";
import ProductPage from "./pages/ProductPage";
import Footer from "./components/Footer";
import { useState } from "react";
import type { CartItem } from "./types/CartItem";
import type { Product } from "./types/Product";
import CartPanel from "./components/CartPanel";

const App = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  function addToCart(product: Product, quantity: number) {
    setItems((prevItems) => {
      const existing = prevItems.find((item) => item.product.id === product.id);

      if (existing) {
        return prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [...prevItems, { product, quantity }];
    });
  }

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <Header
        totalCount={totalCount}
        onToggleCart={() => setIsOpen((prev) => !prev)}
      />
      <CartPanel
        items={items}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
      <main>
        <div>
          <h1>Webshop</h1>
        </div>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/products"
            element={<ProductPage onAddToCart={addToCart} />}
          />

          <Route element={<ProtectedRoute />}>
            <Route path="/welcome" element={<WelcomeLoginPage />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </>
  );
};

export default App;
