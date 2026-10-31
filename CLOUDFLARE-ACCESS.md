# PCF access and crawler protection

The deployed site should be protected at the hostname level by Cloudflare Access. The application must cover the entire production hostname (`your-hostname.example.com/*`), not only `/api/*`, so unauthenticated visitors and crawlers never receive the research content.

## Email registration and personal approval

1. In **Zero Trust → Integrations → Identity providers**, enable **One-time PIN**.
2. In **Zero Trust → Access controls → Applications**, create or edit the self-hosted application for the entire PCF hostname.
3. Add an **Allow** policy named `PCF — approved readers` and place it first:
   - Include: **Emails** — the addresses you have approved.
   - Require: **Login methods** — **One-time PIN**.
   - Choose the desired session duration.
4. Add a second **Allow** policy named `PCF — access requests` below it:
   - Include: **Everyone**.
   - Require: **Login methods** — **One-time PIN**.
   - Enable **Purpose justification**.
   - Enable **Temporary authentication** and enter the owner's email as the approver.
   - Use a short session duration.
5. After approving a person, add their address to `PCF — approved readers` if they should have persistent access. Otherwise, they must request approval again when their temporary session expires.

Cloudflare sends each temporary-access request to the configured approver. Request history is available in the temporary-authentication/JIT request logs. Authentication history, including user email and allow/deny decision, is available under **Zero Trust → Insights → Logs → Access authentication logs**.

The approved-email policy must remain above the request policy. Access stops after the first matching Allow or Block policy.

## Search and AI crawler controls

The repository provides four origin-level signals:

- `robots.txt` disallows every crawler.
- `_headers` sends `X-Robots-Tag: noindex, nofollow, noarchive, nosnippet, noimageindex` and prevents shared caching.
- `index.html` includes the equivalent robots meta directive.
- `functions/_middleware.js` applies the same response headers to Pages Function/API responses.

These directives are advisory. For enforcement, keep the full hostname behind Cloudflare Access and, in the domain dashboard, open **AI Crawl Control → Security** and set every listed AI crawler to **Block**. Access is the primary control because it prevents unauthenticated clients from receiving the content at all.
