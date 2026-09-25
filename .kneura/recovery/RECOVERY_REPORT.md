# KNEURA backend bytecode recovery report

Date: 2026-09-24

No production source file was created or changed. The inspected artifact is `backend/__pycache__/app.cpython-314.pyc`.

## 1. Recovery confidence

The bytecode is valid Python 3.14 bytecode (magic `2b0e0d0a`, flags `0`, 56,810 bytes) and records the original filename as `backend/app.py`. Structural confidence is high: imports, function/class names, route paths, decorators, line numbers and configuration constants are recoverable. Source-text recovery confidence is currently low because no Python 3.14-compatible decompiler is installed and Python bytecode does not preserve comments, formatting or all original expressions in readable source form.

The bytecode SHA-256 is `46C195B612016C3D6136D12113E6780AA29EC327E91425B446207D9229CD94CD`.

## 2. Exact recovered routes

| Method | Route |
| --- | --- |
| POST | `/api/auth/login` |
| GET | `/api/auth/me` |
| POST | `/api/auth/logout` |
| GET | `/api/health` |
| GET | `/api/cases` |
| GET | `/api/cases/{case_id}` |
| POST | `/api/integration/cases` |
| POST | `/api/cases` |
| POST | `/api/cases/{case_id}/analysis` |
| POST | `/api/cases/{case_id}/findings/{finding_id}/decision` |
| POST | `/api/cases/{case_id}/report` |
| PATCH | `/api/cases/{case_id}/report` |
| POST | `/api/cases/{case_id}/report/finalize` |
| GET | `/api/cases/{case_id}/images/{filename}` |
| GET | `/api/model` |
| GET | `/api/validation` |
| GET | `/api/integration/cases/{case_id}/result` |
| GET | `/api/cases/{case_id}/export` |
| GET | `/api/system/llm/health` |
| GET | `/api/v1/system/llm/health` |
| POST | `/api/cases/{case_id}/report-jobs` |
| GET | `/api/cases/{case_id}/report-jobs/{job_id}` |
| GET | `/api/v1/audit/{case_id}/verify` |
| POST | `/api/cases/{case_id}/report/statements/{statement_id}/evidence` |
| GET | `/api/cases/{case_id}/source-images/{image_id}` |
| GET | `/api/system/readiness` |

The compiled decorators show the upload route accepts multipart files plus `patient_name` (maximum 120), `patient_age` (0–130), and `patient_gender` form values. The analysis route is radiologist-only. Health is public. Other dependencies include `user`, `radiologist`, `public_user`, or `authorized` according to handler.

## 3. Recovered imports and dependencies

Standard library imports: `contextlib`, `copy`, `hashlib`, `json`, `logging`, `os`, `pathlib.Path`, `secrets`, `shutil`, `sqlite3`, `threading`, `time`, `uuid`, `sys`.

Third-party imports: FastAPI (`FastAPI`, `Depends`, `HTTPException`, `Request`, `Response`, `UploadFile`, `File`, `BackgroundTasks`, `Query`, `Form`, `FileResponse`) and Pydantic (`BaseModel`, `Field`).

KNEURA modules imported: `relationships.validate_case_links`, `auth.identity_provider/password_hash`, `audit.now/event/verify`, `inference.metadata/analyze`, `ingestion.ingest/MAX_BYTES`, `reporting.approved_findings/compose/edited_statements`, and package modules `narrative/report_jobs`.

## 4. Configuration and storage references

Recovered constants and calls show `KNEURA_DATA_DIR` is read through `os.getenv`; the default is a `.kneura` directory beside the project root. A process-wide `threading.RLock` named `LOCK` and a logger named `kneura` are created. SQLite is imported and database helpers are present: `db`, `init_db`, `save_case`, and `get_case`. `DATA / 'studies' / case_id` and `DATA / 'checkpoints'` are referenced by upload/inference paths. `KNEURA_ORIGINS`, secure cookie behavior, LLM configuration and readiness are delegated to the imported modules; their exact environment reads must be confirmed from their own source/bytecode.

## 5. AI and evidence integration

The recovered module imports `inference.metadata` and `inference.analyze`, and its `run_analysis` handler is a background analysis path. The upload handler calls `ingestion.ingest`; the compiled route set stores series/images before analysis. Image serving uses `/api/cases/{case_id}/images/{filename}`. The newer source-image route is `/api/cases/{case_id}/source-images/{image_id}` and accepts query parameters visible in bytecode for width, center and opacity. No model architecture or Grad-CAM code is embedded in `app.py`; those remain delegated to `backend.inference` and the frozen model module.

## 6. LLM and report integration

The module imports `narrative` and `report_jobs`, exposes both LLM health routes, defines `PermittedContext`, `NarrativeRequest`, and `narrative_request_fingerprint`, and exposes persisted asynchronous report-job routes. The older synchronous report routes remain present for compatibility. Report editing/finalization and statement evidence attachment are separate handlers. Exact prompt and validation behavior belongs to `narrative`/`report_jobs`, not this module.

## 7. Audit/readiness integration

The module imports `audit.verify`, exposes `/api/v1/audit/{case_id}/verify`, and exposes `/api/system/readiness`. It also exposes `/api/health`, model metadata, validation metadata, case export, integration result, and authentication routes.

## 8. Comparison with current frontend/API expectations

The recovered route set covers the frontend's core authentication, case listing/detail, upload, analysis, decisions, report editing/finalization, model/validation and image endpoints. It also contains the newer narrative job, audit verification, source-image and readiness routes expected by the finals UI. The current checked-in `src/api.ts` in this workspace is an older/minimal client and currently calls the synchronous report route; the richer finals client changes previously made are not present in that file. This is a frontend/source-state discrepancy, not a bytecode reconstruction.

The recovered upload decorator supports patient demographic form fields, while the current backend process that was previously running had been loaded before the latest frontend demographic changes. A clean restart must be tested after source recovery.

## 9. Decompiler and validation status

`decompyle3` and `uncompyle6` are not installed. No compatible Python 3.14 decompiler was found in the current environment. The inspection script produced `metadata.txt` and `disassembly.txt` in this recovery folder. The `.pyc` imports successfully at the marshal/disassembly level, but importing it as a normal `backend.app` module cannot be validated without its sibling backend source modules (`auth`, `audit`, `inference`, `ingestion`, `relationships`, `reporting`, `narrative`, and `report_jobs`). No recovered `.py` was created, so syntax/import validation of source is not yet possible.

## 10. Unrecovered details

The exact function bodies, SQL statements, response shaping, exception branches, middleware settings, Pydantic field declarations, and route dependency combinations are not safely recoverable as source without a compatible decompiler or manual reconstruction from bytecode. Reconstructing those by hand would be a redesign and is intentionally not done. The existing `.pyc` remains untouched.

## Recovery artifacts

- `app14_inspect.py`: read-only inspection script.
- `metadata.txt`: bytecode header, imports and recursive code-object inventory.
- `disassembly.txt`: Python 3.14 disassembly.
- `RECOVERY_REPORT.md`: this report.
