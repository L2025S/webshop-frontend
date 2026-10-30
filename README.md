# Webshop Frontend

Webshop Frontend is the browser-based storefront for the webshop. It is built with React and TypeScript and communicates with backend services through the Webshop Gateway.

---

## Contents

- [Responsibilities](#responsibilities)
- [System overview](#system-overview)
- [Technologies](#technologies)
- [Data storage](#data-storage)
- [Environment variables](#environment-variables)
- [Running the application locally](#running-the-application-locally)
- [Pages and navigation](#pages-and-navigation)
- [Gateway API](#gateway-api)
- [Mock API](#mock-api)
- [Tests](#tests)
- [Lint and production build](#lint-and-production-build)
- [Project structure](#project-structure)
- [Troubleshooting](#troubleshooting)
- [Related repositories](#related-repositories)

---

## Responsibilities

The frontend is responsible for:

1. **Browsing products.** Showing the product catalog and product details, with search by name or description and category filtering.
2. **Managing the cart.** Adding products, adjusting quantities, and displaying cart totals.
3. **Submitting orders.** Sending the cart contents to the Order Service through the gateway.
4. **User interface and sessions.** Showing the sign-in page, protected customer page, and cookie/session-protection information.
5. **Product administration.** Providing an admin page to create and delete products and update stock.

The backend is responsible for authentication, permissions, product and category data, inventory, and order processing. The Mail Service handles asynchronous email delivery for backend notifications; the frontend does not call it directly.

---

## System overview

```text
+--------------------+
| Webshop Frontend   |
|       :5173        |
+---------+----------+
          |
          | HTTP requests (session cookies where required)
          v
+--------------------+
| Webshop Gateway    |
|       :8090        |
+---+--------+---+---+
    |        |   |
    v        v   v
  Auth    Product  Order
 Server   Service  Service
 :8080     :8081    :8082
                     |
                     | email notifications (backend flow)
                     v
             RabbitMQ -> Mail Service (:8085)
```

The frontend sends API requests to the gateway. The gateway routes them to the backend services. Order-related email delivery is handled by backend services through RabbitMQ and the Mail Service, not by the frontend.

---

## Technologies

- **UI:** React and React DOM.
- **Language:** TypeScript.
- **Build and development server:** Vite.
- **Routing:** React Router.
- **HTTP requests:** Fetch API.
- **Linting:** Oxlint.
- **Tests:** Vitest and React Testing Library.
- **Test environment:** jsdom.
- **API mocking:** Mock Service Worker (MSW).

Dependency version ranges are defined in `package.json`; exact installed versions are recorded in `package-lock.json`. This project does not currently include Playwright or a separate end-to-end test suite.

---

## Data storage

The frontend does not have its own database. Cart contents are kept in the browser's `sessionStorage` for the current session. User, product, category, stock, and order data are managed by backend services.

The frontend does not require database credentials or backend secrets. Do not put passwords, private keys, or other secrets in frontend environment variables.

---

## Environment variables

Create `.env.local` in the project root, next to `package.json`. For the local gateway setup:

```env
VITE_API_BASE_URL=http://localhost:8090/gateway
VITE_PRODUCT_SERVICE_URL=http://localhost:8090/gateway
VITE_ORDER_SERVICE_URL=http://localhost:8090/gateway
VITE_ENABLE_MSW=false
```

| Variable                   | Default                 | Required                   | Description                                                                              |
| -------------------------- | ----------------------- | -------------------------- | ---------------------------------------------------------------------------------------- |
| `VITE_API_BASE_URL`        | None                    | Yes for auth/user requests | Base URL used for authentication and current-user requests.                              |
| `VITE_PRODUCT_SERVICE_URL` | None                    | Yes for catalog requests   | Base URL used for product and category requests.                                         |
| `VITE_ORDER_SERVICE_URL`   | `http://localhost:8082` | Yes for order requests     | Base URL used to submit orders. Set this to the gateway URL for the local gateway setup. |
| `VITE_ENABLE_MSW`          | Disabled                | No                         | Starts the MSW worker when set to `true`.                                                |

The service clients append endpoint paths to the configured base URLs. Use the gateway URL ending in `/gateway` without a trailing slash. Restart the Vite development server after changing `.env.local`.

Vite exposes variables prefixed with `VITE_` to browser code. Use these variables only for public configuration, never for secrets.

---

## Running the application locally

### Prerequisites

- Node.js supported by Vite 8 (Node.js 22.12 or newer is recommended).
- npm.
- Git.
- A web browser.
- The gateway and required backend services for the flows you want to use.

The auth service is needed for sign-in and protected pages. The product service is needed for product and category data. The order service is needed to submit orders. The Mail Service and RabbitMQ are only needed for backend flows that send email notifications. See each backend repository for its own setup and environment configuration.

### Install dependencies

```bash
git clone https://github.com/L2025S/webshop-frontend.git
cd webshop-frontend
npm ci
```

### Start the backend

The linked services document their own startup instructions. The local setup commonly uses these ports:

- Auth Server: `8080`.
- Product Service: `8081`.
- Order Service: `8082`.
- Mail Service: `8085` (for backend email notifications).
- Webshop Gateway: `8090`.

Make sure the gateway is configured to route requests to the services and that its CORS settings allow the frontend's origin and credentialed requests.

### Configure and start the frontend

Check that `.env.local` contains the correct gateway URLs and that `VITE_ENABLE_MSW` is set appropriately. Then start the development server:

```bash
npm run dev
```

Open the address printed by Vite, normally:

```text
http://localhost:5173
```

To require port `5173` explicitly:

```bash
npm run dev -- --port 5173 --strictPort
```

---

## Pages and navigation

The routes are defined in `src/App.tsx`:

| Route          | Page                     |
| -------------- | ------------------------ |
| `/`            | Home page                |
| `/login`       | Sign-in                  |
| `/products`    | Product catalog          |
| `/product/:id` | Product details          |
| `/welcome`     | Protected customer page  |
| `/admin`       | Admin product management |
| `/cookie-info` | Cookie information       |

The `/welcome` route is protected by `ProtectedRoute`. The `/admin` route uses `AdminRoute`, which checks the current user's role. Backend services remain responsible for authorization of API operations.

---

## Gateway API

The frontend makes requests to the configured gateway base URLs. The service clients use these endpoint paths:

| Method   | Path                                                  | Purpose                                                  |
| -------- | ----------------------------------------------------- | -------------------------------------------------------- |
| `POST`   | `/auth/login`                                         | Sign in.                                                 |
| `POST`   | `/auth/logout`                                        | Sign out.                                                |
| `GET`    | `/appusers/me`                                        | Check the current session and retrieve the current user. |
| `GET`    | `/products/all`                                       | List products.                                           |
| `GET`    | `/products/{id}`                                      | Retrieve a product.                                      |
| `POST`   | `/products/new`                                       | Create a product.                                        |
| `DELETE` | `/products/{id}`                                      | Delete a product.                                        |
| `PATCH`  | `/products/{uuid}/stock/increase?quantity={quantity}` | Increase product stock.                                  |
| `PATCH`  | `/products/{uuid}/stock/reduce?quantity={quantity}`   | Reduce product stock.                                    |
| `GET`    | `/categories/all`                                     | List categories.                                         |
| `POST`   | `/order`                                              | Submit an order.                                         |

For example, with the local gateway URL `http://localhost:8090/gateway`, the product list request is sent to:

```text
http://localhost:8090/gateway/products/all
```

Requests that require a logged-in session include browser credentials so the backend can process its session cookie. The app displays a notice that the authentication token is held in an HttpOnly cookie; cookie issuance and validation are handled by the backend.

---

## Mock API

Set `VITE_ENABLE_MSW=true` to start the included Mock Service Worker during development. The current handlers mock:

- `GET */gateway/appusers/me`
- `GET */gateway/products/all`
- `GET */gateway/categories/all`

These handlers are intentionally limited. Login, product details and administration, and order submission still require a suitable backend or additional mocks.

---

## Tests

Run the Vitest suite once:

```bash
npm test -- --run
```

The test setup is configured in `vite.config.ts` and uses jsdom with `src/tests/setup.ts`. Tests are in `src/tests` and include component, page, and service tests. MSW is also used in tests to provide mock API responses.

---

## Lint and production build

Run Oxlint:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

The build command runs TypeScript project checks and then Vite's production build, which outputs files to `dist/`.

Preview the production build locally:

```bash
npm run preview
```

---

## Project structure

- `src/components` - Reusable interface components.
- `src/context` - Shopping cart state and actions.
- `src/mocks` - MSW handlers, browser worker, and mock data.
- `src/pages` - Route-level pages.
- `src/routes` - Route guards.
- `src/services` - API clients for authentication, users, products, categories, and orders.
- `src/styles` - Application styles.
- `src/tests` - Vitest and React Testing Library tests.
- `src/types` - Shared TypeScript types.
- `src/App.tsx` - Application routes and shared page layout.
- `src/main.tsx` - React application entry point and optional MSW startup.

---

## Troubleshooting

- **Dependencies are missing:** run `npm ci` from the project root.
- **Requests contain `undefined`:** check that `.env.local` is in the project root and that variable names match those used by the app.
- **Changes to `.env.local` have no effect:** restart the Vite development server.
- **Network or CORS errors:** verify the gateway is running, the service URLs are correct, and gateway CORS allows the frontend origin and credentialed requests.
- **HTTP 401:** sign in again and check that the browser sends the session cookie to the gateway.
- **HTTP 403:** check the user's permissions and role in the backend.
- **Products or categories do not load in mock mode:** confirm `VITE_ENABLE_MSW=true`; only the endpoints listed in the Mock API section are currently mocked.

---

## Related repositories

- [Webshop Gateway](https://github.com/L2025S/webshop-gateway)
- [Auth Server](https://github.com/OP-Devloop/Micro-Project-Auth-Server)
- [Product Service](https://github.com/L2025S/micro-project-product-service)
- [Order Service](https://github.com/Yunus-CanYucel/Micro-ProjectOrder-Service)
- [Mail Service](https://github.com/FredrikAlmen93/Mail-Service)
