import { approvedFindingIds } from './workflow'
import type { Case, ModelMetadata, Report, Role, User, ValidationMetrics } from './types'

const base = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '')
export const configured = Boolean(base)
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  if (!base) throw new Error('Connect the KNEURA API to access this feature.')
  const response = await fetch(`${base}${path}`, { credentials: 'include', ...options, headers: { ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }), ...options.headers } })
  if (!response.ok) throw new Error(response.status === 401 ? 'Your session has expired. Please sign in again.' : response.status === 403 ? 'Your account does not have permission for this action.' : `The request could not be completed (${response.status}). Please try again.`)
  if (response.status === 204) return undefined as T
  if (!response.headers.get('content-type')?.includes('application/json')) throw new Error('The API returned an unexpected response. Check the API connection.')
  return response.json() as Promise<T>
}
export const api = {
  session: () => request<User>('/auth/me'),
  login: (email: string, password: string, role: Role) => request<User>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password, role }) }),
  logout: () => request<void>('/auth/logout', { method: 'POST' }),
  cases: () => request<Case[]>('/cases'),
  case: (id: string) => request<Case>(`/cases/${encodeURIComponent(id)}`),
  decide: (id: string, findingId: string, status: 'APPROVED' | 'REJECTED') => request<Case>(`/cases/${encodeURIComponent(id)}/findings/${encodeURIComponent(findingId)}/decision`, { method: 'POST', body: JSON.stringify({ status }) }),
  analyze: (id: string) => request<Case>(`/cases/${encodeURIComponent(id)}/analysis`, { method: 'POST' }),
  generate: (item: Case) => request<Case>(`/cases/${encodeURIComponent(item.id)}/report`, { method: 'POST', body: JSON.stringify({ approvedFindingIds: approvedFindingIds(item.findings) }) }),
  save: (id: string, report: Pick<Report, 'findings' | 'impression'>) => request<Case>(`/cases/${encodeURIComponent(id)}/report`, { method: 'PATCH', body: JSON.stringify(report) }),
  finalize: (id: string) => request<Case>(`/cases/${encodeURIComponent(id)}/report/finalize`, { method: 'POST' }),
  model: () => request<ModelMetadata>('/model'),
  validation: () => request<ValidationMetrics>('/validation'),
}
export function uploadStudy(files: File[], onProgress: (value: number) => void): Promise<Case> {
  return new Promise((resolve, reject) => {
    if (!base) return reject(new Error('Connect the KNEURA API before uploading a study.'))
    const xhr = new XMLHttpRequest()
    xhr.open('POST', `${base}/cases`)
    xhr.withCredentials = true
    const data = new FormData()
    files.forEach(file => data.append('files', file))
    xhr.upload.onprogress = event => { if (event.lengthComputable) onProgress(Math.round(event.loaded / event.total * 100)) }
    xhr.onerror = () => reject(new Error('The upload was interrupted. Please try again.'))
    xhr.onload = () => {
      if (xhr.status < 200 || xhr.status >= 300) return reject(new Error(`The study could not be uploaded (${xhr.status}).`))
      try { resolve(JSON.parse(xhr.responseText) as Case) } catch { reject(new Error('The server returned an invalid study response.')) }
    }
    xhr.send(data)
  })
}

