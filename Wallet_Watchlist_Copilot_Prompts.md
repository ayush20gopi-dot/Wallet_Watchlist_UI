# Wallet Watchlist UI — Copilot Prompt Kit (Scratch Build)

Use these prompts in order. Paste each into **Copilot Chat** (not inline completion) so it has full context. Copilot free gives you limited chat requests, so each prompt below is front-loaded to get a complete, usable chunk of code in one go — review/tweak with inline completions rather than re-prompting from scratch.

---

## 0. Before you prompt anything — decide your stack once

Recommended (fast to scaffold, easy for Copilot to reason about, plays well with mocked data):

- **React + Vite + TypeScript**
- **Tailwind CSS** for styling
- **React Router** for navigation (wallet list → wallet detail)
- **Mock Service Worker (MSW)** or a tiny local Express mock server for the "mock API" (pick MSW if you want everything in-browser with no separate server process)
- **Zod** for form validation schemas
- Local component state / Context — no need for Redux at this scope

State this stack explicitly in every prompt so Copilot stays consistent.

---

## 1. Project Scaffold Prompt

```
Scaffold a React + TypeScript + Vite project called "wallet-watchlist" with:
- Tailwind CSS configured
- React Router v6 set up with two routes: "/" (WalletList) and "/wallets/:id" (WalletDetail)
- Mock Service Worker (MSW) configured for browser mocking
- A basic folder structure: src/components, src/pages, src/api, src/types, src/mocks, src/hooks

Define TypeScript types in src/types/wallet.ts for:
- Wallet { id, label, address, chain, createdAt }
- TokenBalance { symbol, amount, usdValue }
- ActivityItem { id, type ('send'|'receive'|'swap'), status ('pending'|'confirmed'|'failed'), amount, symbol, timestamp }

Generate mock data (8-10 wallets across a couple chains, each with a few token balances and 5-8 activity items) in src/mocks/data.ts, and MSW handlers in src/mocks/handlers.ts for:
- GET /api/wallets
- POST /api/wallets
- PATCH /api/wallets/:id
- DELETE /api/wallets/:id
- GET /api/wallets/:id/balances
- GET /api/wallets/:id/activity?status=

Show me the full file contents for each file.
```

---

## 2. API Client + Hooks Prompt

```
Using the wallet-watchlist project (React + TS + Vite, MSW mock API from before), create:

1. src/api/walletApi.ts — a typed fetch-based API client with functions:
   getWallets(), createWallet(data), updateWallet(id, data), deleteWallet(id),
   getBalances(walletId), getActivity(walletId, statusFilter?)
   Include basic error handling (throw a typed ApiError with status + message).

2. Custom hooks in src/hooks/ that wrap these with loading/error/data state:
   useWallets(), useWalletMutations(), useBalances(walletId), useActivity(walletId, statusFilter)
   Use simple useState/useEffect (no external data-fetching library) so it's easy to explain in my write-up.

Show full file contents.
```

---

## 3. Wallet List + Filter UI Prompt

```
Build src/pages/WalletList.tsx for wallet-watchlist:
- Uses useWallets() hook
- Renders a searchable/filterable table or card grid of wallets (filter by chain and by text match on label/address)
- Each row links to /wallets/:id
- Handles loading state (skeleton), empty state (no wallets / no results after filter), and error state (retry button)
- Includes an "Add Wallet" button that opens a modal/drawer with a form

Style with Tailwind, keep it clean and readable, no over-engineering.
Show full file contents plus any small subcomponents you introduce (e.g., WalletCard, FilterBar).
```

---

## 4. Add / Edit / Delete Wallet Form Prompt

```
Build a WalletForm component (src/components/WalletForm.tsx) for wallet-watchlist, used for both add and edit:
- Fields: label (required, 2-40 chars), address (required, validate format e.g. 0x + 40 hex chars for EVM chains), chain (select: Ethereum, Polygon, Solana, Bitcoin)
- Use Zod for schema validation, react-hook-form for form state
- Inline field-level error messages, disable submit while invalid or submitting
- On submit calls createWallet or updateWallet from useWalletMutations()
- Show success/error toast or inline banner after submit
- Include a DeleteWalletButton with a confirm step (not a raw window.confirm — a small confirm UI)

Show full file contents.
```

---

## 5. Wallet Detail (Balances + Activity) Prompt

```
Build src/pages/WalletDetail.tsx for wallet-watchlist:
- Reads :id from route params
- Shows wallet header info (label, address, chain) with edit/delete actions
- Tab or section for Token Balances: uses useBalances(walletId), shows list with symbol, amount, usd value, loading/empty/error states
- Tab or section for Activity: uses useActivity(walletId, statusFilter), with a status filter dropdown (all/pending/confirmed/failed), loading/empty/error states, and a status badge per item

Show full file contents plus subcomponents (e.g., BalanceList, ActivityList, StatusBadge).
```

---

## 6. Polish Pass Prompt (do this last, once everything works)

```
Review the wallet-watchlist app so far. Suggest and implement small improvements for:
- Consistent loading/empty/error UI patterns across WalletList and WalletDetail (extract a shared <AsyncState> wrapper if it reduces duplication)
- Accessibility basics: labels on form fields, focus management in modal/drawer, aria-live for toasts
- Responsive layout check for mobile width

Keep changes minimal and targeted — don't restructure what already works.
```

---

## 7. Optional: Basic Tests Prompt

```
Add a few basic tests using Vitest + React Testing Library for wallet-watchlist:
- WalletForm: shows validation error on invalid address, calls createWallet on valid submit
- WalletList: renders empty state when filter matches nothing
- ActivityList: filters items correctly by status

Show full test file contents and any test setup config needed.
```

---

## 8. Write-up Prompt (for your submission notes)

```
Based on the wallet-watchlist codebase we've built, draft 5-10 bullet points summarizing:
- Architecture decisions (stack choice, state management approach, mock API approach)
- Trade-offs made given the 4-hour time-box
- What you'd add/improve with more time

Keep it concise and factual, written from my perspective as the developer.
```

---

## Tips for Copilot Free specifically

- **Batch your asks.** Free tier has a monthly cap on chat requests — the prompts above are deliberately chunky (whole files at once) rather than incremental, to get more done per request.
- **Use inline completion (not chat) for repetitive small edits** — e.g., adding a new mock wallet entry, tweaking Tailwind classes — since inline suggestions don't count against your chat quota.
- **Paste actual error messages** into chat rather than re-describing the bug — Copilot fixes faster with the real stack trace/console output.
- **Keep each chat prompt scoped to one file or one feature** — asking for "the whole app" in one shot tends to produce inconsistent code you'll spend more time reconciling than writing yourself.
