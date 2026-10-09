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
import ShowProductPage from "./pages/ShowProductPage";
import AdminRoute from "./routes/AdminRoute";
import AdminProductPage from "./pages/AdminPage";

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
          <Route path="/product/:id" element={<ShowProductPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/welcome" element={<WelcomeLoginPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
          <Route element={<AdminRoute />}>
          <Route path="/admin"element={
            <AdminProductPage />}/></Route>
        </Routes>
      </main>
      <Footer />
    </>
  );
};

export default App;
