# PCF access and crawler protection

The deployed site should be protected at the hostname level by Cloudflare Access. Use one self-hosted Access application for the whole production hostname (`pcf.antimaterie.ro` with the Path field empty, or equivalently `pcf.antimaterie.ro/*`), not separate applications for the site and `/api/*`. This both prevents unauthenticated visitors and crawlers from receiving the research content and lets the comment API reuse the site's authenticated session.

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
   - Choose a session duration long enough for a complete reading and commenting session (for example, 24 hours). If this policy expires while the page is open, the next API request, such as saving a comment, will trigger a new Access challenge.
5. After approving a person, add their address to `PCF — approved readers` if they should have persistent access. Otherwise, they must request approval again when their temporary session expires.

## Reuse the site login for comments

Comments must not have a second login. Every browser request to a protected `/api/*` endpoint must explicitly use Fetch's `credentials: 'same-origin'` option so the `CF_Authorization` cookie from the initial site login accompanies the request. Cloudflare then supplies the verified email to `/api/user` and `/api/save-comment` in the `Cf-Access-Jwt-Assertion` header; the application uses that email as the comment author.

In the PCF self-hosted application:

1. Keep the page and all `/api/*` routes in the same Access application. Remove any separate, more-specific Access application for `pcf.antimaterie.ro/api/*`; a more-specific application does not inherit the hostname application's policy.
2. Under **Advanced settings → Cookie settings**, leave **Cookie path** disabled. The authorization cookie must be valid for `/`, including both the page and `/api/*`.
3. Set the application and both policy session durations long enough for the intended reading and commenting session. For example, use 24 hours rather than a few minutes. A user should be challenged again only after that session expires.
4. Do not add an email or OTP prompt to the comment UI. Cloudflare Access is the identity provider for comments as well as page access.

To diagnose a repeated prompt after the first successful OTP login, inspect the browser's cookies for `pcf.antimaterie.ro`. There should be a `CF_Authorization` cookie whose Path is `/`. In the browser's Network panel, confirm that the failing `/api/save-comment` request includes the cookie and is not redirected to the Access login page. Then check **Zero Trust → Insights → Logs → Access authentication logs** for that request. If it starts a new login within the approved temporary-access period, treat that as a cookie/request failure rather than a normal timeout: verify `credentials: 'same-origin'`, the cookie-path setting, browser cookie restrictions, and that every PCF route has the same **Application Audience (AUD) Tag**.

Cloudflare sends each temporary-access request to the configured approver. Request history is available in the temporary-authentication/JIT request logs. Authentication history, including user email and allow/deny decision, is available under **Zero Trust → Insights → Logs → Access authentication logs**.

The approved-email policy must remain above the request policy. Access stops after the first matching Allow or Block policy.

## Search and AI crawler controls

The repository provides four origin-level signals:

- `robots.txt` disallows every crawler.
- `_headers` sends `X-Robots-Tag: noindex, nofollow, noarchive, nosnippet, noimageindex` and prevents shared caching.
- `index.html` includes the equivalent robots meta directive.
- `functions/_middleware.js` applies the same response headers to Pages Function/API responses.

These directives are advisory. For enforcement, keep the full hostname behind Cloudflare Access and, in the domain dashboard, open **AI Crawl Control → Security** and set every listed AI crawler to **Block**. Access is the primary control because it prevents unauthenticated clients from receiving the content at all.
