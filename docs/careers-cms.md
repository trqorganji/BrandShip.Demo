# Careers CMS handoff

## What is ready

- Public job board: `careers.html#positions`.
- HR welcome and authenticated editor entry: `admin/` (under the same deployment base).
- Repository: `trqorganji/BrandShip.Demo`, branch `main`.
- Editable content: `public/content/careers.json`.
- Decap CMS configuration: `src/careers-cms-config.mjs`.
- Admin-only dependency: Decap CMS 3.17.1, loaded on demand from jsDelivr.

The public board has no invented vacancies. Its initial JSON contains an empty jobs list.
General applications go to `labeeb@ourbrandship.com`. Role-specific links populate the
email subject with the selected role. Nothing sends an email or uploads a CV automatically.
HR can add, edit, reorder or remove positions, or switch off accepting applications to
close a position without deleting its details. Only open positions are rendered on the
board. Closed entries still exist in the public JSON/repository and are not confidential.

## Required before Labeeb can publish

**GitHub sign-in is not connected yet.** The HR page shows this explicitly and disables
editor launch until an approved OAuth origin is configured. This is preparation, not a
live, authenticated publishing service. No OAuth app, account, credentials or external
service has been created, and no repository invitations or settings have been changed.

1. Commit/push this implementation and the JSON content file through the normal workflow.
2. Give Labeeb's approved GitHub account the repository permission required for publishing.
   Decap's direct GitHub backend requires push access. The collection UI only offers the
   positions file, but this is **not** a security boundary restricting GitHub permissions
   to that file. Account/repository access must be approved by the owner.
3. Configure an approved Decap-compatible GitHub OAuth service and OAuth application.
   GitHub Pages cannot itself run the secret-bearing OAuth callback. Use the provider's
   documented callback URL, secure state validation and an explicit CMS-origin allowlist.
   Production admin origin: `https://trqorganji.github.io`, path `/BrandShip.Demo/admin/`.
   Only allow localhost for development when deliberately required.
4. Store the OAuth client secret exclusively in that service's server-side configuration.
   Do not put a secret, personal token or password in the frontend, JSON, Git history or
   `VITE_` variables. Do not accept arbitrary callback or token destinations.
5. Set the repository Actions variable `VITE_CAREERS_CMS_AUTH_ORIGIN` to that approved
   service's HTTPS **origin**, for example `https://cms-auth.yourdomain.com`. This is a
   public address, not a secret. The frontend uses its `/auth` endpoint. The provider must
   support Decap's GitHub popup authentication protocol, not just a generic OAuth endpoint.
6. Rebuild/deploy. Sign in as Labeeb and verify a real publish, close and delete workflow.
   Review branch protection and GitHub Pages environment approvals: these may require
   approval or additional access before a CMS commit can reach the deployed site.

For local setup, the same public origin can be supplied in a local `.env` file. No local
proxy backend or anonymous editing mode is enabled. The URL query string cannot select
an auth service or enable the editor.

## HR workflow after connection

1. Open Careers > HR access, then Open HR editor and sign in with the authorised account.
2. Open Careers > Open positions. Add a Position, or expand an existing title.
3. Fill in role title, team, location/working arrangement and employment type.
4. Add 1 to 4 plain-text requirements, at most 140 characters each. Use clear sentences
   and ordinary punctuation. Avoid confidential information: this repository is public.
5. Keep Accepting applications on to show the role. Switch it off to close the role, or
   remove the list item to delete it. Save/publish the updated positions file.
6. Wait for the GitHub Pages deployment to succeed and check the public Careers page.
   Publishing commits content to GitHub; it is not an immediate database update. Git
   history preserves previous content for recovery through the normal review process.

This editor intentionally manages recruitment content only. Applicant CVs and personal
information must never be uploaded into this public content repository.

## Content contract

```json
{
  "version": 1,
  "jobs": [
    {
      "title": "Example role, not an actual vacancy",
      "team": "Creative",
      "location": "Use the actual location",
      "type": "Full-time",
      "requirements": ["A short, accurate requirement."],
      "open": false
    }
  ]
}
```

The source file is capped at 50 roles, titles/locations at 80 characters, and requirements
at 4 items of 140 characters each. Team and employment type are allowlisted. Blank text,
control characters and long/double dashes are rejected by shared validation. The client
renders CMS content as text, never HTML. No editable application URLs are accepted.

Every build validates the careers content before Vite generates the site. Invalid
content fails the build instead of replacing the last working deployment.

The board requests the deployed JSON without a browser cache and only shows `open:true`
roles. A load/validation failure shows an explicit unavailable state, a retry action and
the general application email, not stale roles or a misleading zero-vacancy message.
The CMS is not imported into the public Careers bundle. It only downloads after the HR
editor is configured and deliberately opened.

## Sources and checks

This implementation follows Decap's official [GitHub backend](https://decapcms.org/docs/github-backend/),
[manual initialization](https://decapcms.org/docs/manual-initialization/),
[file collection](https://decapcms.org/docs/collection-file/) and
[list widget](https://decapcms.org/docs/widgets/list/) documentation.

Run `scripts/check-careers-jobs.mjs` using the existing Playwright environment variables.
It mocks content loads and never authenticates, publishes or sends real applications.
Actual GitHub OAuth, authorised publishing and deployment must still be verified after
the owner configures the connection.
