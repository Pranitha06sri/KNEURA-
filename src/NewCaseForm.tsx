import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { api } from './api'
import { ErrorState } from './components'
import type { Case, PatientInformation } from './types'
import { validatePatient } from './patient'

export function NewCaseForm({ onComplete, onCancel, onBusy }: {
  onComplete: (item: Case) => void; onCancel: () => void; onBusy: (busy: boolean) => void
}) {
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const submitting = useRef(false)
  const submissionKey = useRef(crypto.randomUUID())
  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (submitting.current) return
    const invalid = validatePatient(name, age, gender)
    setErrors(invalid); setError('')
    if (Object.keys(invalid).length) return
    submitting.current = true; setBusy(true); onBusy(true)
    try {
      const patient: PatientInformation = { patientName: name.trim(), patientAge: Number(age), patientGender: gender as PatientInformation['patientGender'] }
      const item = await api.createCase(patient, submissionKey.current)
      onComplete(item)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create case. Please try again.')
    } finally {
      submitting.current = false; setBusy(false); onBusy(false)
    }
  }
  return <form className="patient-form" noValidate onSubmit={submit} aria-busy={busy}>
    <p className="modal-description">Enter patient information to begin. You can upload the MRI study after creating the case.</p>
    <fieldset disabled={busy}>
      <legend className="eyebrow">Patient information</legend>
      <label htmlFor="patient-name">Patient Name *</label>
      <input data-initial-focus id="patient-name" value={name} onChange={e => setName(e.target.value)} placeholder="Enter patient's full name" required aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'patient-name-error' : undefined}/>
      {errors.name && <p id="patient-name-error" className="field-error" role="alert">{errors.name}</p>}
      <div className="patient-form-row"><div>
        <label htmlFor="patient-age">Age *</label>
        <input id="patient-age" type="number" min="0" max="120" step="1" required value={age} onChange={e => setAge(e.target.value)} aria-invalid={Boolean(errors.age)} aria-describedby={errors.age ? 'patient-age-error' : undefined}/>
        {errors.age && <p id="patient-age-error" className="field-error" role="alert">{errors.age}</p>}
      </div><div>
        <label htmlFor="patient-gender">Gender *</label>
        <select id="patient-gender" required value={gender} onChange={e => setGender(e.target.value)} aria-invalid={Boolean(errors.gender)} aria-describedby={errors.gender ? 'patient-gender-error' : undefined}>
          <option value="">Select gender</option>
          {['Female', 'Male', 'Other', 'Prefer not to say'].map(value => <option key={value}>{value}</option>)}
        </select>
        {errors.gender && <p id="patient-gender-error" className="field-error" role="alert">{errors.gender}</p>}
      </div></div>
    </fieldset>
    {error && <ErrorState message={error}/>}
    <div className="modal-actions"><button className="button" type="button" disabled={busy} onClick={onCancel}>Cancel</button><button className="button primary" type="submit" disabled={busy}>{busy ? 'Creating Case…' : 'Create Case'}</button></div>
  </form>
}
