import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getCurrentUser } from "../services/userService.ts";
import type { User } from "../types/User";

const WelcomeLoginPage = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Failed to load user:", error);
        navigate("/login", { replace: true });
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [navigate]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return null;
  }

  return (
    <main className="welcome-page">
      <section className="welcome-card">
        <h1>Welcome, {user.username}!</h1>

        <p>
          You are logged in as <strong>{user.role}</strong>.
        </p>

        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="welcome-login-button"
        >
          Continue to Dashboard
        </button>
      </section>
    </main>
  );
};

export default WelcomeLoginPage;
