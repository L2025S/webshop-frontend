import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, vi } from "vitest";

beforeEach(() => {
  // Not needed right now, but added for potential future tests
});

afterEach(() => {
  cleanup();
});
