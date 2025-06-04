import { NextRequest } from 'next/server'
import path from 'path'
import fs from 'fs/promises'
import { createReadStream } from 'fs'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const patientId = searchParams.get('patientId')
  const filename = searchParams.get('filename')
  if (!patientId || !filename) {
    return new Response('Missing patientId or filename', { status: 400 })
  }
  const filePath = path.join(process.cwd(), 'uploads', `patient_${patientId}`, filename)
  try {
    await fs.access(filePath)
    const stream = createReadStream(filePath)
    return new Response(stream as unknown as ReadableStream, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    })
  } catch {
    return new Response('File not found', { status: 404 })
  }
}
