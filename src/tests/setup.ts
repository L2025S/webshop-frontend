import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, beforeAll, afterAll, vi } from "vitest";
import { server } from "../mocks/server";

beforeAll(() => {
  // Start the MSW server before all tests to intercept network requests.
  server.listen();
});

beforeEach(() => {
  // Not needed right now, but added for potential future tests
});

afterEach(() => {
  // Remove any rendered React-components from the testing environment
  cleanup();
  // Restore any mocked functions to their original implementations.
  vi.restoreAllMocks();
  // Restore MSW-handlers to their original implementations.
  server.resetHandlers();
});

afterAll(() => {
  // Close MSW-server after all tests are done.
  server.close();
});
