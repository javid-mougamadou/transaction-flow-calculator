# Transaction Flow Calculator — Explanation

This document summarizes the internal workings of the application, including the business logic, custom hooks, and utilities.

## General Architecture

The main application (`src/App.tsx`) orchestrates the interface by relying on section components (`src/components/` folder) that each encapsulate part of the flow:

- `HeaderSection`: title, light/dark toggle button, global reset button.
- `AccountsSection`: management of the account list and add input.
- `TransferFormSection`: form for creating transfers (sender/recipient selectors + amount).
- `TransactionsSection`: list of entered transfers with delete action.
- `GroupedTransfersSection`: simple aggregates by account pair.
- `SummarySection`: simplified summary (net flows), date selection and validation to reports.
- `ReportsSection`: validation history, via a custom accordion that exposes transfers for each report.
- `AppFooter`: daisyUI attribution.

Shared types are in `src/types.ts`, while business utilities (`format`, `transactions`) are grouped in `src/utils/`.

## Hooks

### usePersistentState (`src/hooks/usePersistentState.ts`)
Generic hook to store state in `localStorage` in addition to React state:

- Parameters: `key`, `defaultValue`, optional serialization/deserialization.
- Returns `[state, setState, reset]` with support for functional setters (like `useState`).
- Automatic save on each change (except reset) and restoration on initialization.
- Used for:
  - Accounts (`accounts`)
  - Inputs (`accountInput`, `transactionForm`, `reportDate`)
  - Transactions (`transactions`)
  - Theme (`theme` light/dark)
  - Reports (`reports`)

## Business Logic

### Transaction Simplification (`src/utils/transactions.ts`)
- `simplifyTransactions`: transforms the list of transfers into net flows between debitors/creditors by balancing balances (generation of simplified transfers). Steps:
  1. Calculate a balance (map account → net balance).
  2. Separate debitors/creditors.
  3. Perform matching by minimizing remaining amounts.
  4. Aggregate final flows by `from->to` pair.

- `groupTransactions`: simply adds amounts by `from/to` pair to display intermediate groupings.

### Formatting (`src/utils/format.ts`)
- `formatAmount`: formats amounts in euros (`Intl.NumberFormat`), used in all sections displaying amounts.

## Processing in `App.tsx`

1. **Persisted states**: initialized via `usePersistentState` (accounts, transactions, form, reports, theme, etc.).
2. **Theme effect**: `useEffect` applies `data-theme` on `document.documentElement` to activate light/dark (compatible with daisyUI).
3. **Handlers**:
   - `handleAddAccount`: validation + account addition (optionally fills form selectors).
   - `handleAddTransaction`: form validation and transfer addition (UUID `crypto.randomUUID`).
   - `handleTransactionFieldChange` / `handleAccountInputChange`: field updates with error reset.
   - `handleValidateSummary`: creates a report if the date is filled and there are simplified flows; saves a copy of the summary and resets the date.
   - `handleRemoveTransaction` / `handleRemoveReport`: targeted deletion.
   - `handleResetAll`: resets accounts, transactions and forms (but keeps the reporting history as requested).
4. **Derived `useMemo`**:
   - `simplifiedTransfers`: result of `simplifyTransactions` on transfers.
   - `groupedTransactions`: grouping by pair.
5. **Rendering**: sections receive necessary states/handlers via props. `ReportsSection` locally controls the expansion state (`openId`).

## Reporting & Accordion

In `ReportsSection`:
- Local `useState` to know which report is open (`openId`).
- The header is a clickable div that adds/removes `collapse-open` (DaisyUI) according to state.
- `Remove` button deletes a report after `preventDefault` + `stopPropagation` to avoid toggling the accordion.
- Saved summaries keep the formatted date (`Intl.DateTimeFormat`) + `createdAt` timestamp.

## Theme & DaisyUI

- `HeaderSection` offers a button to toggle between `theme === 'dark'` and `light`. The value is persisted.
- Tailwind classes use DaisyUI variables (`bg-base-…`, `text-base-content`, `text-primary`, etc.) to automatically reflect the active theme.
- The application uses a central container (`base-100`, `border-base-300`) so both themes remain readable.

## Key Points

- **Offline**: Service Worker (`public/service-worker.js`) manages the application cache and pre-caches the app shell (pre-assembled via Vite). Client-side data depends on `localStorage` to persist.
- **Validation**: The summary cannot be validated without date or net flow.
- **Selective deletion**: Reset clears accounts/transfers, not reports.
- **Extraction**: Types, helpers and modular components facilitate future evolution (e.g., adding API, backend synchronization).

This guide serves as a quick reference for understanding the structure and extending the application.

## Automated Tests

All tests run via `npm test` (Vitest). They cover:

- `src/components/__tests__/HeaderSection.test.tsx`: theme toggle, reset request and confirmation.
- `src/components/__tests__/AccountsSection.test.tsx`: account rendering, input and addition.
- `src/components/__tests__/TransferFormSection.test.tsx`: field updates and form submission.
- `src/components/__tests__/TransactionsSection.test.tsx`: transfer display and deletion.
- `src/components/__tests__/GroupedTransfersSection.test.tsx`: conditional display of groupings and amounts.
- `src/components/__tests__/SummarySection.test.tsx`: validation button enable/disable, handler call.
- `src/components/__tests__/ReportsSection.test.tsx`: accordion behavior and report deletion.
- `src/utils/__tests__/transactions.test.ts`: scenarios on `groupTransactions` and `simplifyTransactions` (independent cases and flow chains).
- `src/App.test.tsx`: "Hello world" smoke test.

`ReactDOMTestUtils.act` warnings may appear (expected behavior with React 18 + Testing Library), without impacting test success.
