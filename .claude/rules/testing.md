# Testing

## Tools
- **Vitest** — unit and component tests (fast, native Vite integration)
- **React Testing Library** — rendering and interacting with React components in tests

## What to test
Focus effort on code where a bug has real consequences. In this product that means
anything touching money, availability, or Hebrew rendering.

**Test these:**
1. **Leasing and pricing logic** — monthly payment, down payment, VAT, term calculations.
   A wrong number here is a customer-facing commitment.
2. **Formatters and parsers** — currency (`₪`), Hebrew dates, model-name normalization,
   API payload → internal type mapping
3. **Business logic utilities** — availability rules, service-center matching by marque,
   filter and sort logic
4. **Critical UI states** — empty, error and loading states for the model catalog,
   leasing flow and service-center finder
5. **RTL correctness** — components that use directional layout or mirrored icons

**Do not test these:**
- Simple presentational components with no logic
- Client/config setup files
- Third-party library wrappers
- Types-only files

## File conventions
- Co-locate test files with source: `ModelCard.test.tsx` lives next to `ModelCard.tsx`
- Hook tests: `useLeasingQuote.test.ts` next to `useLeasingQuote.ts`
- Utility tests: `formatCurrency.test.ts` next to `formatCurrency.ts`
- Naming pattern: `describe('ModelCard')` → `it('shows empty state when models array is empty')`
- Test names in English, even when asserting on Hebrew strings

## Mocking
- Use `vi.mock()` to mock the API client and external calls — never make real network
  calls in tests
- Mock at the module boundary (e.g. mock `src/lib/api/client.ts`), not deep inside
  implementation
- Use `vi.fn()` for function mocks; assert with `.toHaveBeenCalledWith()`
- Never mock the thing under test

## RTL in tests
Render inside an RTL container so directional assertions are meaningful:

```tsx
const renderRtl = (ui: React.ReactElement) =>
  render(ui, {
    wrapper: ({ children }) => (
      <div dir="rtl" lang="he">
        {children}
      </div>
    ),
  });
```

Assert on visible Hebrew text and accessible roles — not on class names or DOM order.

## Running tests
```bash
npm run test        # watch mode during development
npm run test:run    # single run (for CI)
npm run test:ui     # visual Vitest UI (optional)
```

## Example test structure
```typescript
import { describe, it, expect } from "vitest";
import { formatMonthlyPayment } from "@/utils/formatCurrency";

describe("formatMonthlyPayment", () => {
  it("formats a monthly payment with a shekel sign and thousands separator", () => {
    expect(formatMonthlyPayment(1162)).toBe("1,162 ₪");
  });

  it("rounds to whole shekels — no agorot in leasing quotes", () => {
    expect(formatMonthlyPayment(1162.4)).toBe("1,162 ₪");
  });

  it("returns an em dash for a missing price rather than 0 ₪", () => {
    expect(formatMonthlyPayment(null)).toBe("—");
  });
});
```
