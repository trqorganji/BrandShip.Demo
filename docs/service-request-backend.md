# Brandship service request: backend handoff

The form is at `contact.html`. Existing “Let’s talk” and service-page contact links lead there.

## Current behaviour

With no endpoint configured, clients can complete the questionnaire, select proposal files,
review their request, edit it, and download their answers as a text brief. The Send button is
disabled and the interface explicitly says nothing has been sent. The downloaded text file
does **not** contain the documents. Files and answers are held only in the current tab; this
feature does not persist them in local storage or send them to analytics.

The static GitHub Pages demo does not itself receive or store submissions. No backend,
email-delivery account, external upload service or database has been created.

## Configure delivery

1. Implement or connect an HTTPS endpoint with the contract below.
2. Copy `.env.example` to your local environment configuration and set
   `VITE_SERVICE_REQUEST_ENDPOINT=https://your-api.example/service-requests`.
3. Restart the dev server, or rebuild and deploy. For GitHub Actions, provide the variable
   to the **build** step using the repository's approved configuration mechanism.
4. Test actual file storage and request delivery before making the form live.

Alternatively, a developer can set the form's `data-endpoint` attribute. The environment
variable takes precedence. Query parameters never select the submission destination.
Only HTTPS is accepted, except HTTP on localhost/loopback for development. Embedded URL
credentials, fragments and redirects are rejected. `VITE_` values are public browser
configuration: **do not put secrets or API keys there**.

## Request contract

`POST` with browser-generated `multipart/form-data`; do not manually set its Content-Type
or boundary. The client sends `Accept: application/json`, omits cookies, and times out after
30 seconds. Configure CORS for the deployed site's exact origin when using another origin.

| Field | Type / meaning |
| --- | --- |
| `form_version` | `2` (short enquiry) |
| `client_request_id` | Opaque idempotency ID; reused when retrying an unchanged review |
| `name` | Required, trimmed, maximum 100 characters |
| `email` | Required valid email, maximum 200 characters |
| `company`, `phone` | Optional; maximum 200, 50 characters respectively |
| `services` | Repeated field: one or more of the service keys below |
| `other_service` | Required if `other` is selected; maximum 500 characters |
| `message` | Up to 4,000 trimmed characters; a nonempty note OR at least one valid proposal is required |
| `consent` | Must equal `yes` |
| `contact_website` | Honeypot; expected to be empty |
| `proposals` | Repeated file field, optional; up to 3 files |

Service keys mirror the website's published catalogue:

- Branding: `strategy`, `visual-identity`, `visual-language`.
- Marketing & communication: `marcom-strategies`, `analytics`, `internal-culture`,
  `sentiment-analysis`, `sonic-branding`, `video-conceptualization`, `ai-lensing`.
- Additional client-defined service: `other`.
- Guidance requested: `not-sure` (clients do not have to know the right service).

The initial view contains name, email, a collapsible service picker, and the note/upload
area. Company and phone sit in a collapsed optional section. Version 2
does not ask for website, project name, brand stage, audience, timing or budget. Do not require legacy
version 1 fields or a minimum note length on the backend. If no valid files are received,
a nonempty trimmed note is required. Review only includes optional answers supplied.

The optional `?service=visual-identity` URL parameter preselects an allowlisted service.
Repeat the parameter to preselect more than one. Unknown values are ignored.

## Responses

Return a 2xx JSON response **only after** the request and its associated files have been
durably accepted by the backend, for example:

```json
{"ok": true}
```

The interface never shows success on a redirect, an HTML page, a plain 2xx response, or a
response without `ok: true`. On network, timeout, validation, server or rate-limit errors,
answers and selected files stay available for editing or retry. Use HTTP 429 for rate
limiting and a suitable 4xx/5xx status for other failures. No server-supplied error text is
rendered as HTML. Honour the idempotency ID so retries cannot duplicate a request that
was accepted before its response was lost.

## Backend responsibilities before launch

Browser validation is a usability feature, **not** a security boundary. The backend must:

- Independently validate every field, service key, consent value and honeypot.
- Enforce at most 3 files, 10 MiB per file and 20 MiB combined; reject empty files.
- Accept PDF, DOC, DOCX, PPT and PPTX only. Check actual file contents/signatures, not just
  client-supplied extensions or MIME types. Scan uploads; handle archive-based Office
  formats safely and reject macro-enabled or unsupported content.
- Set an appropriate request-body limit, rate limits and abuse protection.
- Generate safe storage names; never trust client paths or filenames.
- Keep uploads private and authorised, not in this public repo or a publicly browsable
  bucket. Define and approve access, retention, deletion and notification behaviour.
- Keep email/provider/storage credentials server-side and redact personal details/files
  from application logs. CORS alone is not anti-spam or authorisation.
- Send acknowledgements or staff notifications only through an explicitly configured
  server-side delivery service. No response-time promise has been added to the form.

## Verification

`scripts/check-service-request.mjs` exercises preview mode, catalogue coverage, conditional
Other fields, file selection/removal/limits, review and brief download, safe text rendering,
and mocked failure/success responses. Its POST interceptor prevents real enquiry delivery.
Use the same `PLAYWRIGHT_MODULE`, `CHROME_EXECUTABLE` and `RESPONSIVE_BASE_URL` environment
variables as the existing responsive checks. An end-to-end check of the chosen backend's
storage and delivery is still required after connection.
