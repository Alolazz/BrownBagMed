import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { v4 as uuidv4 } from 'uuid'
import prisma from '@/app/models/patient'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import path from 'path';

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
    const savedFiles: string[] = []
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

    // Parse health info
    const parsedHealth = healthInfo ? JSON.parse(healthInfo) : {}

    // Insert Patient into Prisma DB
    await prisma.patient.create({
      data: {
        id: patientId.replace('patient_', ''),
        folderName: patientId,
        dateOfBirth: parsedHealth.dateOfBirth || null,
        gender: parsedHealth.gender || null,
        conditions: Array.isArray(parsedHealth.medicalConditions) ? parsedHealth.medicalConditions.join(', ') : parsedHealth.medicalConditions || null,
        allergies: parsedHealth.knownAllergies || null,
        comments: parsedHealth.additionalComments || null,
        // uploadedAt, reportReady, paid use defaults
      }
    })

    // Save patient info JSON for legacy/filesystem use
    const infoJson = {
      patientId,
      uploadDate: new Date().toISOString(),
      files: savedFiles,
      healthInfo: parsedHealth
    }
    const infoPath = path.join(patientDir, 'info.json')
    await writeFile(infoPath, JSON.stringify(infoJson, null, 2))

    // Generate PDF summary of healthInfo
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); // A4
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    let y = 800;
    page.drawText('Patient Health Info Summary', { x: 50, y, size: 20, font, color: rgb(0,0,0) });
    y -= 40;
    page.drawText(`Date of Birth: ${parsedHealth.dateOfBirth || '-'}`, { x: 50, y, size: 14, font, color: rgb(0,0,0) });
    y -= 20;
    page.drawText(`Gender: ${parsedHealth.gender || '-'}`, { x: 50, y, size: 14, font, color: rgb(0,0,0) });
    y -= 20;
    page.drawText(`Medical Conditions: ${(Array.isArray(parsedHealth.medicalConditions) ? parsedHealth.medicalConditions.join(', ') : parsedHealth.medicalConditions || '-')}`, { x: 50, y, size: 14, font, color: rgb(0,0,0) });
    y -= 20;
    page.drawText(`Known Allergies: ${parsedHealth.knownAllergies || '-'}`, { x: 50, y, size: 14, font, color: rgb(0,0,0) });
    y -= 20;
    page.drawText(`Additional Comments: ${parsedHealth.additionalComments || '-'}`, { x: 50, y, size: 14, font, color: rgb(0,0,0) });
    const pdfBytes = await pdfDoc.save();
    const pdfPath = path.join(patientDir, 'report_info.pdf');
    await writeFile(pdfPath, pdfBytes);

    return NextResponse.json({
      message: 'Files uploaded successfully',
      patientId,
      files: savedFiles
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed', details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}
