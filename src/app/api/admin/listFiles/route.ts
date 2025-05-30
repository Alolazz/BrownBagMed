import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs/promises'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const patientId = searchParams.get('patientId')
  if (!patientId) {
    return NextResponse.json({ error: 'Missing patientId' }, { status: 400 })
  }
  const patientDir = path.join(process.cwd(), 'uploads', `patient_${patientId}`)
  try {
    const files = await fs.readdir(patientDir)
    // Exclude info.json from the list
    const filtered = files.filter(f => f !== 'info.json')
    return NextResponse.json({ files: filtered })
  } catch (e) {
    return NextResponse.json({ error: 'Could not list files' }, { status: 404 })
  }
}
