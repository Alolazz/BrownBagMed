export { getServerSideProps } from '../../utils/requireAdminAuth'


import { useEffect, useState } from 'react'

export default function AdminDashboard() {
  const [patients, setPatients] = useState<string[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [reportFile, setReportFile] = useState<File | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/patients')
      .then(res => res.json())
      .then(data => setPatients(data.patients))
  }, [])

  const handleUploadReport = async () => {
    if (!selected || !reportFile) return

    const formData = new FormData()
    formData.append('report', reportFile)

    const res = await fetch(`/api/admin/upload-report?patientId=${selected}`, {
      method: 'POST',
      body: formData
    })

    const data = await res.json()
    setMessage(data.message)
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Admin Dashboard</h1>
      <ul>
        {patients.map(p => (
          <li key={p} onClick={() => setSelected(p)} style={{ cursor: 'pointer' }}>
            {p}
          </li>
        ))}
      </ul>

      {selected && (
        <div>
          <h3>Upload Report for {selected}</h3>
          <input
            type="file"
            accept="application/pdf"
            onChange={e => setReportFile(e.target.files?.[0] || null)}
          />
          <button onClick={handleUploadReport}>Upload Report</button>
          {message && <p>{message}</p>}
        </div>
      )}
    </div>
  )
}
