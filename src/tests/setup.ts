import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, beforeAll, afterAll, vi } from "vitest";
import { server } from "../mocks/server";

beforeAll(() => {
  server.listen();
});

beforeEach(() => {
  // Not needed right now, but added for potential future tests
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
