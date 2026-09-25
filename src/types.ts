export type Role = 'radiologist' | 'orthopedist' | 'patient'
export interface User { id: string; name: string; role: Role }
export type CaseStatus = 'RECEIVED' | 'PROCESSING' | 'AI_READY' | 'REVIEWING' | 'DRAFT' | 'FINAL'
export interface Study { id: string; patientName: string; patientId: string; description: string; date: string; laterality?: string }
export interface Image { id: string; instanceNumber: number; url: string }
export interface Series { id: string; name: string; sequence: string; images: Image[] }
export interface Evidence { seriesId: string; seriesName: string; windowNumber: number; sliceStart: number; sliceEnd: number; mriImageUrl: string; gradCamImageUrl?: string }
export interface RadiologistDecision { status: 'APPROVED' | 'REJECTED'; userName: string; timestamp: string }
export interface Finding { id: string; name: string; probability: number; status: 'PENDING' | 'APPROVED' | 'REJECTED'; evidence?: Evidence; decision?: RadiologistDecision; patientExplanation?: string }
export interface Report { id: string; status: 'DRAFT' | 'FINAL'; findings: string; impression: string; updatedAt: string; approvedBy?: string; approvedAt?: string; statements: { id: string; text: string; findingIds: string[] }[] }
export interface AuditEvent { id: string; timestamp: string; action: string; actor: string }
export interface PatientInformation { patientName: string; patientAge: number; patientGender: 'Female' | 'Male' | 'Other' | 'Prefer not to say' }
export interface Patient { name?: string; age?: number | null; gender?: string | null; patient_id?: string }
export interface Case { patient?: Patient; id: string; study: Study; status: CaseStatus; updatedAt: string; series: Series[]; findings: Finding[]; report?: Report; audit: AuditEvent[] }
export interface ModelMetadata { architecture: string; version: string; checkpoint: string; outputs: number; input: string; limitations: string }
export interface ValidationMetrics { studies: number; windows: number; series: number; macroAuroc: number; evaluatedAt: string }
export const canonicalFindings = ['ACL', 'MCL', 'Medial Meniscus', 'Lateral Meniscus', 'Medial OA', 'Lateral OA', 'Patellofemoral OA', 'Effusion', 'Synovitis', "Baker’s cyst", 'Contusion', 'Fracture']
