import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

export async function POST (request: NextRequest) {
  try {
    const data = await request.formData()
    const files: File[] = data.getAll('files') as File[]
    const healthInfo = data.get('healthInfo') as string

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files received' }, { status: 400 })
    }

    // Generate unique patient ID using UUID
    const patientId = `patient_${uuidv4()}`

    // Create patient folder
    const uploadsDir = path.join(process.cwd(), 'uploads')
    const patientDir = path.join(uploadsDir, patientId)

    await mkdir(patientDir, { recursive: true })

    // Save files
    const savedFiles = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const fileExtension = path.extname(file.name)
      const fileName = `medication_${i + 1}${fileExtension}`
      const filePath = path.join(patientDir, fileName)

      await writeFile(filePath, buffer)
      savedFiles.push(fileName)
    }

    // Save patient info (including health info if provided)
    const patientInfo = {
      patientId,
      uploadDate: new Date().toISOString(),
      files: savedFiles,
      healthInfo: healthInfo ? JSON.parse(healthInfo) : null
    }

    const infoPath = path.join(patientDir, 'info.json')
    await writeFile(infoPath, JSON.stringify(patientInfo, null, 2))

    return NextResponse.json({
      message: 'Files uploaded successfully',
      patientId,
      files: savedFiles
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
