
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router";
import Login from "../pages/loginPage";
import { login } from "../services/authService";

vi.mock("../services/authService", () => ({
  login: vi.fn(),
}));

const mockedLogin = vi.mocked(login);

function renderLogin() {
  return render(
    <MemoryRouter initialEntries={["/login"]}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/welcome" element={<h1>Welcome page</h1>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("Login component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the login form", () => {
    renderLogin();

    expect(
      screen.getByRole("heading", { name: "Welcome back" })
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Username")
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Password")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Logga in" })
    ).toBeInTheDocument();
  });

  it("allows the user to enter a username and password", async () => {
    const user = userEvent.setup();

    renderLogin();

    await user.type(
      screen.getByLabelText("Username"),
      "testuser"
    );

    await user.type(
      screen.getByLabelText("Password"),
      "password123"
    );

    expect(screen.getByLabelText("Username"))
      .toHaveValue("testuser");

    expect(screen.getByLabelText("Password"))
      .toHaveValue("password123");
  });

  it("logs in successfully and navigates to the welcome page", async () => {
    const user = userEvent.setup();

    mockedLogin.mockResolvedValue({
      accessToken: "test-token",
    } as Awaited<ReturnType<typeof login>>);

    renderLogin();

    await user.type(
      screen.getByLabelText("Username"),
      "testuser"
    );

    await user.type(
      screen.getByLabelText("Password"),
      "password123"
    );

    await user.click(
      screen.getByRole("button", { name: "Logga in" })
    );

    await waitFor(() => {
      expect(mockedLogin).toHaveBeenCalledWith({
        username: "testuser",
        password: "password123",
      });
    });

    expect(
      await screen.findByRole("heading", {
        name: "Welcome page",
      })
    ).toBeInTheDocument();
  });

  it("shows an error message when login fails", async () => {
    const user = userEvent.setup();

    mockedLogin.mockRejectedValue(new Error("Invalid credentials"));

    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    renderLogin();

    await user.type(
      screen.getByLabelText("Username"),
      "wronguser"
    );

    await user.type(
      screen.getByLabelText("Password"),
      "wrongpassword"
    );

    await user.click(
      screen.getByRole("button", { name: "Logga in" })
    );

    expect(
      await screen.findByText("Inloggningen misslyckades")
    ).toBeInTheDocument();

    expect(mockedLogin).toHaveBeenCalledWith({
      username: "wronguser",
      password: "wrongpassword",
    });

    consoleError.mockRestore();
  });

  it("does not navigate when login fails", async () => {
    const user = userEvent.setup();

    mockedLogin.mockRejectedValue(new Error("Login failed"));

    vi.spyOn(console, "error").mockImplementation(() => {});

    renderLogin();

    await user.type(screen.getByLabelText("Username"), "testuser");
    await user.type(screen.getByLabelText("Password"), "wrongpassword");

    await user.click(
      screen.getByRole("button", { name: "Logga in" })
    );

    expect(
      await screen.findByText("Inloggningen misslyckades")
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("heading", { name: "Welcome page" })
    ).not.toBeInTheDocument();
  });
});