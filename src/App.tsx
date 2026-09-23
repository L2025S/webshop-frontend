import Header from "./components/Header";
import { Route, Routes } from "react-router";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import WelcomeLoginPage from "./pages/testWLP";
import Footer from "./components/Footer";

const App = () => {
    return (
        <>
        <Header />
        <main>
        <div>
            <h1>Webshop</h1>
        </div>
        <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route element={<ProtectedRoute />}>

              <Route path="/welcome" element={<WelcomeLoginPage/>} />
              
            </Route>
        </Routes>
        </main>
        <Footer />
        </>
    );
};

export default App;
