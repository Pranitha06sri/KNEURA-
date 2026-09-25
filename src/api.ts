import { approvedFindingIds } from './workflow'
import type { Case, PatientInformation, ModelMetadata, Report, Role, User, ValidationMetrics } from './types'

const base = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '')
export const configured = Boolean(base)
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  if (!base) throw new Error('Connect the KNEURA API to access this feature.')
  const response = await fetch(`${base}${path}`, { credentials: 'include', ...options, headers: { ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }), ...options.headers } })
<<<<<<< Updated upstream
  if (!response.ok) {
    if (path === '/auth/login') {
      if (response.status === 401) throw new Error('Email, password or workspace role is incorrect.')
      if (response.status === 429) throw new Error('Too many failed sign-in attempts. Retry after 15 minutes.')
    }
    if (path === '/cases' && response.status === 422) throw new Error('Please check the patient name, age (0-120), and gender.')
    if (path === '/cases' && response.status === 409) throw new Error('This submission was already used. Reopen New case to create another case.')
    throw new Error(response.status === 401 ? 'Your session has expired. Please sign in again.' : response.status === 403 ? 'Your account does not have permission for this action.' : `The request could not be completed (${response.status}). Please try again.`)
=======
  if (response.status === 401 && !path.startsWith('/auth/')) window.dispatchEvent(new Event('kneura-session-expired'))
  if (!response.ok) {
    const problem = await response.json().catch(() => null)
    throw new Error(typeof problem?.detail === 'string' ? problem.detail : `The request could not be completed (${response.status}).`)
>>>>>>> Stashed changes
  }
  if (response.status === 204) return undefined as T
  if (!response.headers.get('content-type')?.includes('application/json')) throw new Error('The API returned an unexpected response. Check the API connection.')
  return response.json() as Promise<T>
}
export const api = {
  exportUrl: (id: string) => `${base}/cases/${encodeURIComponent(id)}/export`,
  llmHealth: () => request<{configured:boolean;reachable:boolean;provider:string;model:string;error?:string}>('/system/llm/health'),
  verifyAudit: (id:string) => request<{valid:boolean;events:number;legacy_events:number;tampered_events:string[];reason?:string}>(`/v1/audit/${encodeURIComponent(id)}/verify`),
  generateNarrative: (item:Case,context:{indication:string},requestId:string) => request<{job_id:string;status:string}>(`/cases/${encodeURIComponent(item.id)}/report-jobs`,{method:'POST',body:JSON.stringify({approvedFindingIds:approvedFindingIds(item.findings),clinical_context:context,requestId})}),
  attachEvidence: (id:string,statementId:string,body:{findingId:string;evidenceId:string;version:number}) => request<Case>(`/cases/${encodeURIComponent(id)}/report/statements/${encodeURIComponent(statementId)}/evidence`,{method:'POST',body:JSON.stringify(body)}),
  health: () => request<{ status: string }>('/health'),
  session: () => request<User>('/auth/me'),
  login: (email: string, password: string, role: Role) => request<User>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password, role }) }),
  logout: () => request<void>('/auth/logout', { method: 'POST' }),
  createCase: (patient: PatientInformation, key: string) => request<Case>('/cases', { method: 'POST', headers: { 'Idempotency-Key': key }, body: JSON.stringify(patient) }),
  cases: () => request<Case[]>('/cases'),
  case: (id: string) => request<Case>(`/cases/${encodeURIComponent(id)}`),
  decide: (id: string, findingId: string, status: 'APPROVED' | 'REJECTED') => request<Case>(`/cases/${encodeURIComponent(id)}/findings/${encodeURIComponent(findingId)}/decision`, { method: 'POST', body: JSON.stringify({ status }) }),
  analyze: (id: string) => request<Case>(`/cases/${encodeURIComponent(id)}/analysis`, { method: 'POST' }),
  generate: (item: Case) => request<Case>(`/cases/${encodeURIComponent(item.id)}/report`, { method: 'POST', body: JSON.stringify({ approvedFindingIds: approvedFindingIds(item.findings) }) }),
  save: (id: string, report: Pick<Report, 'findings' | 'impression'>) => request<Case>(`/cases/${encodeURIComponent(id)}/report`, { method: 'PATCH', body: JSON.stringify(report) }),
  finalize: (id: string) => request<Case>(`/cases/${encodeURIComponent(id)}/report/finalize`, { method: 'POST' }),
  model: () => request<ModelMetadata>('/model'),
  validation: () => request<ValidationMetrics>('/validation'),
  llmHealth: () => request<Record<string, unknown>>('/system/llm/health'),
  readiness: (executeModel = false) => request<Record<string, unknown>>(`/system/readiness?execute_model=${executeModel}`),
  reportJob: (caseId: string, body: unknown) => request<{ job_id: string; status: string }>(`/cases/${encodeURIComponent(caseId)}/report-jobs`, { method: 'POST', body: JSON.stringify(body) }),
  reportJobStatus: (caseId: string, jobId: string) => request<Record<string, unknown>>(`/cases/${encodeURIComponent(caseId)}/report-jobs/${encodeURIComponent(jobId)}`),
  auditVerify: (caseId: string) => request<Record<string, unknown>>(`/v1/audit/${encodeURIComponent(caseId)}/verify`),
  integrationResult: (caseId: string) => request<Case>(`/integration/cases/${encodeURIComponent(caseId)}/result`),
  sourceImageUrl: (caseId: string, imageId: string, params = '') => `${base || ''}/cases/${encodeURIComponent(caseId)}/source-images/${encodeURIComponent(imageId)}${params}`,
}
<<<<<<< Updated upstream
export function uploadStudy(caseId: string, files: File[], onProgress: (value: number) => void): Promise<Case> {
=======
export function uploadStudy(files: File[], onProgress: (value: number) => void, patient: {name:string;age:number;gender:string}): Promise<Case> {
>>>>>>> Stashed changes
  return new Promise((resolve, reject) => {
    if (!base) return reject(new Error('Connect the KNEURA API before uploading a study.'))
    const xhr = new XMLHttpRequest()
    xhr.open('POST', `${base}/cases/${encodeURIComponent(caseId)}/study`)
    xhr.withCredentials = true
    const data = new FormData()
    files.forEach(file => data.append('files', file))
    data.append('patient_name', patient.name)
    data.append('patient_age', String(patient.age))
    data.append('patient_gender', patient.gender)
    xhr.upload.onprogress = event => { if (event.lengthComputable) onProgress(Math.round(event.loaded / event.total * 100)) }
    xhr.onerror = () => reject(new Error('The upload was interrupted. Please try again.'))
    xhr.onload = () => {
      if (xhr.status < 200 || xhr.status >= 300) {
        let message = `The study could not be uploaded (${xhr.status}).`
        try { const problem = JSON.parse(xhr.responseText); if (typeof problem.detail === 'string') message = problem.detail } catch { /* Keep HTTP error. */ }
        return reject(new Error(message))
      }
      try { resolve(JSON.parse(xhr.responseText) as Case) } catch { reject(new Error('The server returned an invalid study response.')) }
    }
    xhr.send(data)
  })
}

