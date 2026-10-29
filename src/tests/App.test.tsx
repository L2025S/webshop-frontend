
// import { describe, expect, it } from "vitest";
// import { render, screen } from "@testing-library/react";
// import { MemoryRouter } from "react-router-dom";
// import { CartProvider } from "../context/CartContext";
// import App from "../App";
// import { http, HttpResponse } from "msw";
// import { server } from "../mocks/server";
// import { mockUsers, mockProducts } from "../mocks/data";

// function renderApp() {
//   return render(
//     // Render the Application within a MemoryRouter to simulate routing in tests.
//     // The initial route is set to "/products" to test the products page.
//     <MemoryRouter initialEntries={["/products"]}>
//       <CartProvider>
//         <App />
//       </CartProvider>
//     </MemoryRouter>,
//   );
// }

// describe("App products tests using MSW", () => {
//   it("Allows an authenticated user to view products", async () => {
//     server.use(
//       http.get("*/appusers/me", () => {
//         // Mock handler for fetching the authenticated user.
//         return HttpResponse.json(mockUsers);
//       }),

//       http.get("*/products/all", () => {
//         // Mock handler for fetching all products.
//         return HttpResponse.json(mockProducts);
//       }),
//       http.get("*/gateway/categories/all", () => {
//         // Mock handler for fetching all categories.
//         return HttpResponse.json([]);
//       }),
//     );
//     // Render the Application with the mocked API responses.
//     renderApp();

//     // Wait for the product name to appear in the document.
//     // Verify that the product name from the mocked products is displayed correctly in the UI.
//     expect(await screen.findByText(mockProducts[0].name)).toBeInTheDocument();
//   });

//   it("Displays an error message when the products API fails", async () => {
//     // Simulate a successful response from the user API.
//     server.use(
//       http.get("*/appusers/me", () => {
//         return HttpResponse.json(mockUsers);
//       }),
//       // Simulate a failure response from the products API.
//       http.get("*/products/all", () => {
//         return HttpResponse.json(
//           { message: "Internal Server Error" },
//           { status: 500 },
//         );
//       }),
//       // Simulate a successful response from the categories API.
//       http.get("*/gateway/categories/all", () => {
//         return HttpResponse.json([]);
//       }),
//     );
//     // Render the Application with the mocked API responses.
//     renderApp();
//     // Wait for the error message to appear in the document.
//     // Verify that the error message is displayed correctly in the UI when the products API fails.
//     expect(
//       await screen.findByText(/failed to load products \(status code: 500\)/i),
//     ).toBeInTheDocument();
//   });
// });  




// ========================== Test (see if it can pass CI) ================================================

// ✅ Changed: added "beforeEach" so every auth test starts with the cookie popup already dismissed.

import { beforeEach, describe, expect, it } from "vitest";
// ✅ Changed: added "waitFor" so the test can wait until the mocked request was really received.

import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CartProvider } from "../context/CartContext";
import App from "../App";
import { http, HttpResponse } from "msw";
import { server } from "../mocks/server";
import { mockUsers, mockProducts } from "../mocks/data";

function renderApp() {
  return render(
    // Render the Application within a MemoryRouter to simulate routing in tests.
    // The initial route is set to "/products" to test the products page.
    <MemoryRouter initialEntries={["/products"]}>
      <CartProvider>
        <App />
      </CartProvider>
    </MemoryRouter>,
  );
}

describe("App products tests using MSW", () => {
  it("Allows an authenticated user to view products", async () => {
    server.use(
      http.get("*/appusers/me", () => {
        // Mock handler for fetching the authenticated user.
        return HttpResponse.json(mockUsers);
      }),

      http.get("*/products/all", () => {
        // Mock handler for fetching all products.
        return HttpResponse.json(mockProducts);
      }),
      http.get("*/gateway/categories/all", () => {
        // Mock handler for fetching all categories.
        return HttpResponse.json([]);
      }),
    );
    // Render the Application with the mocked API responses.
    renderApp();

    // Wait for the product name to appear in the document.
    // Verify that the product name from the mocked products is displayed correctly in the UI.
    expect(await screen.findByText(mockProducts[0].name)).toBeInTheDocument();
  });

  it("Displays an error message when the products API fails", async () => {
    // Simulate a successful response from the user API.
    server.use(
      http.get("*/appusers/me", () => {
        return HttpResponse.json(mockUsers);
      }),
      // Simulate a failure response from the products API.
      http.get("*/products/all", () => {
        return HttpResponse.json(
          { message: "Internal Server Error" },
          { status: 500 },
        );
      }),
      // Simulate a successful response from the categories API.
      http.get("*/gateway/categories/all", () => {
        return HttpResponse.json([]);
      }),
    );
    // Render the Application with the mocked API responses.
    renderApp();
    // Wait for the error message to appear in the document.
    // Verify that the error message is displayed correctly in the UI when the products API fails.
    expect(
      await screen.findByText(/failed to load products \(status code: 500\)/i),
    ).toBeInTheDocument();
  });
});

// ✅ Changed: new test suite for the teacher's instruction.
// Why: render <App /> and mock the "current user" endpoint, then check both outcomes.
// Effect: proves the user is restored on a successful response and treated as logged out on 401.
// Note: this project calls "/appusers/me" (not "/auth/me"), so that is the endpoint mocked here.
describe("App authentication state using MSW", () => {
  beforeEach(() => {
    // Mark the cookie popup as already seen so it does not open during these tests.
    localStorage.setItem("hasSeenCookieInfo", "true");
  });

  // Mocks the products and categories endpoints that the products page loads,
  // so the only thing that changes between the tests is the "current user" response.
  function mockProductPageData() {
    server.use(
      http.get("*/products/all", () => HttpResponse.json(mockProducts)),
      http.get("*/gateway/categories/all", () => HttpResponse.json([])),
    );
  }

  it("Restores the user when the current user request succeeds", async () => {
    mockProductPageData();
    server.use(
      http.get("*/appusers/me", () => {
        // Successful response: the backend recognises the session cookie.
        return HttpResponse.json(mockUsers);
      }),
    );

    renderApp();

    // The Logout button only appears when the header considers the user authenticated.
    expect(
      await screen.findByRole("button", { name: "Logout" }),
    ).toBeInTheDocument();
    // The Login link must be gone for an authenticated user.
    expect(screen.queryByRole("link", { name: "Login" })).not.toBeInTheDocument();
  });

  it("Treats the user as logged out when the current user request returns 401", async () => {
    mockProductPageData();
    let wasCurrentUserRequested = false;
    server.use(
      http.get("*/appusers/me", () => {
        wasCurrentUserRequested = true;
        // 401 response: no valid session, so the user is not authenticated.
        return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
      }),
    );

    renderApp();

    // Wait until the mocked 401 response has actually been requested.
    // Without this the test could pass before the request finishes,
    // because the header shows "Login" by default.
    await waitFor(() => expect(wasCurrentUserRequested).toBe(true));

    // A logged out user sees the Login link and no Logout button.
    expect(await screen.findByRole("link", { name: "Login" })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Logout" }),
    ).not.toBeInTheDocument();
  });
});