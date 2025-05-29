const handlePayment = async () => {
  const res = await fetch('/api/payment/create-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ patientId })
  })
  const data = await res.json()
  window.location.href = data.url
}
