# Security

## Reporting

Report suspected vulnerabilities privately to the Qreasee maintainers. Do not
publish room links, access tokens, or project exports in a public issue.

## Threat model

- The Rust server is intended for localhost or a trusted LAN.
- The GitHub Pages build uses Supabase Auth. A room UUID is an edit capability;
  only share links with trusted people.
- Project documents and comments are untrusted input even when they arrive from
  a signed-in collaborator.

## OWASP Top 10 controls

### A01 Broken Access Control

- Supabase requires a signed-in user for room creation and exchange.
- Room owners control the link role: edit, comment, or view.
- Database RPC functions enforce roles server-side; client-side disabling is
  only a convenience.
- The admin dashboard is guarded by the `qreasee_admins` allowlist inside
  `security definer` functions. `anon` and `public` have no execute permission,
  and the allowlist table has no direct client grants. Only the seeded
  `rendynoorchandra@gmail.com` account starts as super admin.
- Admin metrics expose account emails, so the dashboard is limited to the
  allowlist and should not be screen-shared publicly.
- Tables are not exposed directly to `anon` or `authenticated`.
- Room identifiers are validated UUIDs before use.

### A02 Cryptographic Failures

- GitHub Pages and Supabase are served over HTTPS.
- The browser stores only the Supabase publishable key. Service-role and OAuth
  client secrets stay in Supabase/Google dashboards.
- OAuth uses the Supabase PKCE flow.

### A03 Injection

- SQL uses static statements with bound JSON parameters; no string-built SQL.
- User text is rendered with `textContent`, not HTML string interpolation.
- Object names, comments, mentions, and project titles are length-limited and
  rendered as text.
- `Content-Security-Policy` restricts scripts to same-origin files.

### A04 Insecure Design

- Document limits: 250 objects, 200 comments, 12 section planes, 1 MB edit.
- Section planes affect rendering only; they do not alter stored geometry.
- Room links remain capability URLs. Private per-user membership is future work.

### A05 Security Misconfiguration

- The Rust server sends CSP, frame-deny, no-referrer, nosniff, permissions, and
  cross-origin isolation headers.
- The static build includes a restrictive CSP meta policy and no-referrer.
- RPC functions use `security definer`, an empty `search_path`, and an 8-second
  statement timeout.
- Supabase table grants are revoked; only explicit RPC execution is allowed.

### A06 Vulnerable and Outdated Components

- Dependencies are locked by `package-lock.json` and `Cargo.lock`.
- `npm audit --omit=dev` and `npm audit` are part of release checks.

### A07 Identification and Authentication Failures

- Supabase Auth handles Google sign-in and session refresh.
- OAuth return hashes and remembered room IDs are revalidated as UUIDs.
- Room creation is rate-limited per account.

### A08 Software and Data Integrity Failures

- Published files are built from the committed tree; deployment hashes are
  compared against the live `gh-pages` assets.
- JSON edits are validated again by the Rust model and the Supabase RPC.
- No `eval`, `new Function`, or remote script sources are used.

### A09 Security Logging and Monitoring Failures

- Authentication and RPC failures surface as generic user-facing messages.
- Supabase and GitHub provide platform-level logs and build history.
- Avoid logging full room URLs, tokens, or document contents.

### A10 Server-Side Request Forgery

- The application does not fetch arbitrary user-supplied URLs.
- The only network destinations are the configured Supabase URL and local
  static assets.

## Operational checklist

1. Keep `supabase/001` through `supabase/007` applied in order.
2. Keep the Google OAuth client secret only in Supabase.
3. Do not commit `.env.local` or user access tokens.
4. Use HTTPS for any deployment reachable outside localhost.
5. Treat room URLs as passwords and rotate by creating a new room if a link
   leaks.
