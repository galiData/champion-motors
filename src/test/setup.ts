import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Vitest runs without globals, so Testing Library's automatic cleanup never
// registers itself. Without this, renders leak between tests in the same file.
afterEach(cleanup);
