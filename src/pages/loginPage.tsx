import { useState } from "react";
import { useNavigate } from "react-router";
import { login } from "../services/authService.ts";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Handle the login form submission
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      // Log in and store the access token
      await login({ username, password });

      // Navigate to the welcome page after successful login
      navigate("/welcome");
    } catch (error) {
      // Display an error message if login fails
      console.error("Login failed:", error);
      setError("Inloggningen misslyckades");
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-header">
          <h1>Welcome back</h1>
          <p>Log in to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Show the error message when login fails */}
          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="login-button">
            Logga in
          </button>
        </form>
      </section>
    </main>
  );
}

export default Login;
