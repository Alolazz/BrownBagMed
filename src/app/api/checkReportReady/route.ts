import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs/promises'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const patientId = searchParams.get('patientId')
  if (!patientId) {
    return NextResponse.json({ exists: false, error: 'Missing patientId' }, { status: 400 })
  }
  const filePath = path.join(process.cwd(), 'uploads', patientId, 'report.pdf')
  try {
    await fs.access(filePath)
    return NextResponse.json({ exists: true })
  } catch {
    return NextResponse.json({ exists: false })
  }
}
