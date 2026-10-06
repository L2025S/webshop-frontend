import "./styles/Styles.css";
import Header from "./components/Header";
import { Route, Routes } from "react-router";
import LoginPage from "./pages/loginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import WelcomeLoginPage from "./pages/WelcomeLoginPage";
import ProductPage from "./pages/ProductPage";
import Footer from "./components/Footer";
import CartPanel from "./components/CartPanel";
import NotFoundPage from "./pages/NotFoundPage";
import HomePage from "./pages/HomePage";

const App = () => {
  return (
    <>
      <Header />
      <CartPanel />
      <main>
        <Routes>
          <Route path="/" element={< HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/products" element={<ProductPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/welcome" element={<WelcomeLoginPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
};

export default App;
