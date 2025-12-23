# Copilot Instructions for KBOF

## Architecture Overview

This is a **TanStack Start** full-stack React application with file-based routing, using:

- **Neon PostgreSQL** with Drizzle ORM for database
- **Better Auth** for authentication (email/password + Google OAuth + magic links)
- **TanStack Router** for file-based routing (`src/routes/`)
- **TanStack Form** with custom form hook abstraction
- **Shadcn UI (new-york style)** for components
- **Nitro** as the server runtime via Vite

## Project Structure

```
src/
├── routes/           # File-based routing (TanStack Router)
├── db/               # Drizzle schema, relations, migrations
├── lib/
│   ├── auth/         # Better Auth server & client configs
│   ├── actions/      # Server functions (createServerFn)
│   ├── queris/       # Database query functions
│   ├── validations/  # Zod schemas
│   └── middleware.ts # Route middleware (auth/guest)
├── hooks/
│   ├── actions/      # Feature-specific form hooks
│   └── use-form.ts   # Custom TanStack Form hook
└── components/
    └── ui/fragments/
        ├── shadcn-ui/ # Shadcn components
        └── custom-ui/ # Custom form controls, data-table
```

## Key Patterns

### Server Functions

Use `createServerFn` from `@tanstack/react-start` for server-side mutations. Call with `useServerFn` hook:

```typescript
// src/lib/actions/mess-actions.ts
export const addMess = createServerFn({ method: 'POST' })
  .inputValidator(createMesschema)
  .handler(async ({ data }) => {
    /* ... */
  })

// In component/hook
const addMessFn = useServerFn(addMess)
await addMessFn({ data })
```

### Route Middleware

Apply `authMiddleware` or `guestMiddleware` in route `server.middleware`:

```typescript
export const Route = createFileRoute('/dashboard')({
  server: { middleware: [authMiddleware] },
})
```

### Custom Form System

Forms use `useAppForm` from `src/hooks/use-form.ts` with pre-registered field components:

```typescript
// Create domain-specific form hook
export function useCreateMessForm({ onSuccess, onError }) {
  return useAppForm({
    validators: { onSubmit: createMesschema },
    defaultValues: { name: '', /* ... */ },
    onSubmit: async ({ value }) => { /* ... */ },
  })
}

// In form component, use AppField with registered components
<form.AppField name="name">
  {(field) => <field.Input label="Name" placeholder="name" />}
</form.AppField>
```

### Database Schema

Drizzle schema in `src/db/schema.ts` uses enums extensively. Access enum values directly:

```typescript
import { mess } from '@/db/schema'
mess.status.enumValues // ['active', 'not-active']
```

### Shadcn Components

Install with: `pnpm dlx shadcn@latest add <component>`
Components go to `src/components/ui/fragments/shadcn-ui/` (configured in `components.json`)

## Commands

| Task               | Command                   |
| ------------------ | ------------------------- |
| Dev server         | `npm run dev` (port 3000) |
| Build              | `npm run build`           |
| Lint & format      | `npm run check`           |
| Tests              | `npm run test`            |
| Drizzle migrations | `npx drizzle-kit push`    |

## Environment Variables

Required in `.env`:

- `DATABASE_URL` - Neon connection string
- `BETTER_AUTH_URL` - Auth base URL
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` - OAuth
- `RESEND_API_KEY` - Email sending
- `EMAIL_SENDER_NAME` / `EMAIL_SENDER_ADDRESS` - Magic link emails

## Important Conventions

1. **Path aliases**: Use `@/` prefix (e.g., `@/lib/utils`, `@/components/ui`)
2. **Auth client**: Import `signIn`, `signOut`, `useSession` from `@/lib/auth/auth-client`
3. **Validation**: Zod schemas in `src/lib/validations/` with matching type exports
4. **Queries**: Database queries go in `src/lib/queris/` using Drizzle query builder
5. **Data tables**: Use `useDataTable` hook with `nuqs` for URL-synced state
