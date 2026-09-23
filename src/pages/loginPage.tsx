import { useState } from "react";
import { useNavigate } from "react-router";
import { login } from "../services/authService.ts";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      await login({ username, password });

      // Navigate to WelcomeLoginPage after successful login
      navigate("/welcome");
    } catch (error) {
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

        {error && <p>{error}</p>}

        <button type="submit">Logga in</button>
      </form>
    </div>
  );
}

export default Login;
