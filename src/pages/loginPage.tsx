import { useState } from "react";
import { useNavigate } from "react-router";
import { login } from "../services/authService.ts";
import "../styles/loginPage.css";

function Login() {
  // Store the username entered in the login form
  const [username, setUsername] = useState("");

  // Store the password entered in the login form
  const [password, setPassword] = useState("");

  // Store an error message to display if login fails
  const [error, setError] = useState("");

  // Provides navigation to other pages after login
  const navigate = useNavigate();

  // Handle the login form submission
  async function handleSubmit(e: React.FormEvent) {
    // Prevent the browser from reloading the page when the form is submitted
    e.preventDefault();

    try {
      // Authenticate the user using the entered credentials
      await login({ username, password });

      // Navigate to the welcome page after successful login
      navigate("/welcome");
    } catch (error) {
      // Log the error for debugging and display a message to the user
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

        {/* Submit the form when the user clicks the login button or presses Enter */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              // Keep the input value synchronized with the username state
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
              // Keep the input value synchronized with the password state
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Display the error message only when one exists */}
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
