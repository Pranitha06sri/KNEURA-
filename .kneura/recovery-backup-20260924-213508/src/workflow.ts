import type { Finding } from './types'

const names = ['ACL', 'MCL', 'Medial Meniscus', 'Lateral Meniscus', 'Medial OA', 'Lateral OA', 'Patellofemoral OA', 'Effusion', 'Synovitis', "Baker's cyst", 'Contusion', 'Fracture']
const normalize = (name: string) => name.replaceAll('’', "'").toLowerCase()
export function reviewComplete(findings: Finding[]): boolean {
  return findings.length === 12 && new Set(findings.map(f => f.id)).size === 12 && names.every(name => findings.some(f => normalize(f.name) === normalize(name))) && findings.every(f => f.status === 'APPROVED' || f.status === 'REJECTED')
}
export function approvedFindingIds(findings: Finding[]): string[] {
  if (!reviewComplete(findings)) throw new Error('All 12 canonical findings must be reviewed before report generation.')
  return findings.filter(f => f.status === 'APPROVED').map(f => f.id)
}
