import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs/promises'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import prisma from '@/app/models/patient'

export async function POST(request: NextRequest) {
  try {
    const { patientId } = await request.json()
    if (!patientId) {
      return NextResponse.json({ error: 'Missing patientId' }, { status: 400 })
    }
    // Load patient from Prisma
    const patient = await prisma.patient.findUnique({ where: { id: patientId } })
    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 })
    }
    // List files in uploads dir
    const patientDir = path.join(process.cwd(), 'uploads', `patient_${patientId}`)
    let files: string[] = []
    try {
      files = (await fs.readdir(patientDir)).filter(f => f !== 'info.json')
    } catch {
      return NextResponse.json({ error: 'No files found for patient' }, { status: 404 })
    }
    // Create PDF
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([595, 842]) // A4
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    let y = 800
    page.drawText('Patient Summary', { x: 50, y, size: 24, font, color: rgb(0,0,0.7) })
    y -= 40
    page.drawText(`Patient ID: ${patient.id}`, { x: 50, y, size: 14, font, color: rgb(0,0,0) })
    y -= 20
    page.drawText(`Date of Birth: ${formatDateGerman(patient.dateOfBirth)}`, { x: 50, y, size: 14, font, color: rgb(0,0,0) })
    y -= 20
    page.drawText(`Conditions: ${patient.conditions || '-'}`, { x: 50, y, size: 14, font, color: rgb(0,0,0) })
    y -= 20
    page.drawText(`Allergies: ${patient.allergies || '-'}`, { x: 50, y, size: 14, font, color: rgb(0,0,0) })
    y -= 20
    page.drawText(`Comments: ${patient.comments || '-'}`, { x: 50, y, size: 14, font, color: rgb(0,0,0) })
    y -= 30
    page.drawText('Uploaded Files:', { x: 50, y, size: 16, font, color: rgb(0,0,0.7) })
    y -= 20
    files.forEach((filename) => {
      if (y < 60) return // avoid overflow
      page.drawText(`- ${filename}`, { x: 70, y, size: 12, font, color: rgb(0,0,0) })
      y -= 16
    })
    const pdfBytes = await pdfDoc.save()
    const pdfPath = path.join(patientDir, 'summary.pdf')
    await fs.writeFile(pdfPath, pdfBytes)
    return NextResponse.json({
      message: 'PDF generated',
      download: `/uploads/patient_${patientId}/summary.pdf`
    })
  } catch (error) {
    console.error('PDF generation error:', error)
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 })
  }
}

// Helper to format ISO date to DD.MM.YYYY
function formatDateGerman(dateStr?: string|null) {
  if (!dateStr) return '-';
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString('de-DE')
}
