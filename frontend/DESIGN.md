# Design System

The authenticated app uses a SaaS-style shell (sidebar + top bar) and a small
set of shared primitives. New and existing pages should be built from these so
every module looks and behaves the same.

## Foundations

| Token | Value | Use |
|---|---|---|
| Canvas | `bg-canvas` (#f6f7f9) | Page background (set by the shell) |
| Surface | `bg-white` | Cards, tables, popovers |
| Border | `border-slate-200` (`/80` on cards) | All dividers and outlines |
| Inner divider | `border-slate-100` / `divide-slate-100` | Rows inside a card |
| Primary | `blue-600` / hover `blue-700` | Primary actions, active nav, links |
| Text | `slate-900` headings · `slate-700` body · `slate-500` secondary · `slate-400` muted |
| Shadow | `shadow-card` (resting) · `shadow-pop` (menus, modals) |
| Radius | `rounded-xl` cards/modals · `rounded-lg` buttons/inputs/nav · `rounded-md` badges |
| Font | Geist; headings `font-semibold tracking-tight`, never `font-black` |

Status colors are semantic only (see `utils/ui/statusColors.ts`):
success = emerald, warning = amber, danger = red, info = blue, neutral = slate.
Always pair a status color with a text label.

Avoid: gradients on surfaces/text, `rounded-3xl`, `shadow-2xl`, hover
translate/lift on cards, colored top bars on cards, `font-black`, emoji.

## Primitives (`components/ui`)

- `PageContainer` — `<main>` wrapper with standard width and padding. Every page uses it.
- `PageHeader` — title, description, icon, `meta` (e.g. count badge), `actions`.
- `Button` / `ButtonLink` — variants `primary | secondary | ghost | danger | danger-soft | success | link`; sizes `sm | md | lg | icon | icon-sm`; `loading` prop.
- `Card`, `CardHeader` (title/description/icon/actions), `CardContent`, `CardFooter`.
- `Badge` — `tone` (`success | warning | danger | info | neutral | brand`), optional `dot`.
- `StatCard` — KPI tile (`label`, `value`, `hint`, `icon`, `tone`, `loading`, `href`).
- `States` — `LoadingState`, `ErrorState`, `EmptyState`, `Skeleton`, `FullPageLoader`.
- `Modal`, `ConfirmationModal` — dialogs.

`cn()` from `@/lib/utils` merges classes.

## Patterns

**Page layout**
```tsx
<PageContainer>
  <PageHeader title="Payroll" description="..." icon={WalletCards} actions={...} />
  {/* filters card */}
  {/* stat cards: grid grid-cols-2 gap-3 xl:grid-cols-4 */}
  {/* content card / table */}
</PageContainer>
```

**Tables** — inside a `Card` with `overflow-hidden`; wrapper `overflow-x-auto`.
`thead`: `bg-slate-50/80 text-xs font-medium text-slate-500` (no uppercase-heavy
tracking), cells `px-4 py-3`, rows `divide-y divide-slate-100 hover:bg-slate-50/60`.
Numbers right-aligned.

**Filters** — one `Card` with `CardContent` and a responsive grid of controls.
Raw inputs/selects: `h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm
shadow-card focus:border-blue-500 focus:outline-none focus:ring-3 focus:ring-blue-500/15`.
Labels: `text-xs font-medium text-slate-600 mb-1.5`.

**Forms** — sections as `Card`s with `CardHeader`; fields in
`grid gap-4 sm:grid-cols-2`; actions right-aligned at the end (`secondary` cancel, `primary` submit).

**Sticky elements** — the top bar is sticky; don't make page headers sticky.
