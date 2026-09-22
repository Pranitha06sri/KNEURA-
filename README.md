# KNEURA

Evidence-led knee MRI frontend built with React 19, TypeScript and Vite. A paper-ticket theme inspired by https://my.hackprinceton.com/, with radiologist, orthopedist and patient views. Powder-blue backgrounds, cream paper surfaces, peach accents, navy outlines, dashed dividers, and offset shadows carry across the application.

## Run

```sh
npm install
npm run dev
```

Use `npm run build` for the production bundle and `npm run lint` for static checks. Run `node --test tests/workflow.test.mjs` for review-gate tests (Node 22.6+).

## Backend connection

Copy `.env.example` to `.env.local`, set `VITE_API_BASE_URL` to your backend API base URL, and restart Vite. Without a backend the application shows an explicitly unconnected, empty workspace. No sample patients, MRI images, AI probabilities, approvals or validation metrics are manufactured.

The repository did not contain a backend. `src/api.ts` defines the proposed integration contract; adapt it to the actual backend endpoints. Responses are direct JSON objects, not envelopes. TypeScript interfaces live in `src/types.ts`.

| Method | Endpoint | Response / behavior |
| --- | --- | --- |
| GET | /auth/me | Authenticated User |
| POST | /auth/login | `{ email, password, role }` → User; server authorizes actual role |
| POST | /auth/logout | End session |
| GET | /cases | Case[] scoped to authenticated user |
| GET | /cases/:id | Authorized Case |
| POST | /cases | Multipart `files` → server-validated Case |
| POST | /cases/:id/analysis | Begin analysis → Case; processing cases poll every 6 seconds |
| POST | /cases/:id/findings/:findingId/decision | `{ status: APPROVED or REJECTED }` → updated Case |
| POST | /cases/:id/report | `{ approvedFindingIds: string[] }` → Case containing draft Report |
| PATCH | /cases/:id/report | `{ findings, impression }` → Case with updated draft and traceability |
| POST | /cases/:id/report/finalize | Final approval → updated Case |
| GET | /model | ModelMetadata |
| GET | /validation | ValidationMetrics |

Requests use cookie credentials. The backend must enforce authentication, role and patient access, all 12 canonical decisions, approved-only report input, report versioning, final-report immutability and authoritative audit events. Role selection in an unconnected preview provides navigation only, not authorization. Orthopedist and patient views display only final reports. The backend must also return role-appropriate data, rather than relying on client filtering for privacy.

MRI images are backend-rendered image URLs, ordered by InstanceNumber. DICOM decoding, study validation, series selection, AI inference and Grad-CAM generation belong to the backend. Evidence URLs represent the window's starting slice; overlays are available only for matching evidence. No artificial progress is used: upload progress comes from XMLHttpRequest and analysis state comes from the server.

All 12 unique canonical findings require explicit APPROVED or REJECTED states. Decisions lock after draft generation. Only approved finding IDs are submitted to report generation; rejected findings are excluded. Save edits before final approval. The backend must regenerate statement-to-finding trace links after edits, validate report contents and independently enforce these gates. Finalization requires explicit confirmation by an authenticated radiologist.

## Routes

- `/login`
- `/radiologist/overview`, `/radiologist/cases`, `/radiologist/review`, `/radiologist/reports`, `/radiologist/audit`
- `/radiologist/cases/:id`, `/radiologist/cases/:id/review`, `/radiologist/cases/:id/report`, `/radiologist/cases/:id/audit`
- `/radiologist/model`, `/radiologist/validation`
- `/orthopedist/overview`, `/orthopedist/cases`, `/orthopedist/cases/:id`, `/orthopedist/reports`, `/orthopedist/evidence`
- `/patient/overview`, `/patient/mri/:id`, `/patient/report/:id`, `/patient/findings`, `/patient/report`

Configure the production host to serve `index.html` for client-side routes. The default route opens the radiologist overview. On mobile, detailed imaging decisions are hidden while case information and report review remain accessible. Native dialogs support keyboard focus and Escape dismissal. Reduced-motion and print styles are included.

The theme is defined in `src/theme.css`, with global tokens in `src/index.css`. Typography uses Barlow Condensed and IBM Plex Mono from Google Fonts, with local fallbacks. KNEURA retains its own branding and clinical workflows. No additional runtime UI dependencies are required.

