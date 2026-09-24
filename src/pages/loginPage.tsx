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
    <div>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Show the error message when login fails */}
        {error && <p>{error}</p>}

        <button type="submit">Logga in</button>
      </form>
    </div>
  );
}

export default Login;
