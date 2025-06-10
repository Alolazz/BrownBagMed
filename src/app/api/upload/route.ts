import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import prisma from '@/app/models/patient';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export async function POST(request: NextRequest) {
  // Ensure all responses return valid JSON
  try {
    const data = await request.formData();
    const files: File[] = data.getAll('files') as File[];
    const healthInfo = data.get('healthInfo') as string;

    // Add validation for files and healthInfo
    if (!files || files.length === 0 || !healthInfo) {
      return NextResponse.json({ error: 'Missing file or health information' }, { status: 400 });
    }

    // Generate unique patient ID using UUID
    const patientId = `patient_${uuidv4()}`;

    // Upload files to Vercel Blob storage
    const savedFiles: string[] = [];
    const fileUrls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExtension = file.name.split('.').pop() || '';
      const fileName = `medication_${i + 1}.${fileExtension}`;
      const blob = await put(`${patientId}/${fileName}`, file, { access: 'public' });
      savedFiles.push(fileName);
      fileUrls.push(blob.url);
    }

    // Parse health info
    const parsedHealth = healthInfo ? JSON.parse(healthInfo) : {};

    // Insert Patient into Prisma DB
    try {
      await prisma.patient.create({
        data: {
          id: patientId.replace('patient_', ''),
          folderName: patientId,
          dateOfBirth: parsedHealth.dateOfBirth || null,
          gender: parsedHealth.gender || null,
          conditions: Array.isArray(parsedHealth.medicalConditions) ? parsedHealth.medicalConditions.join(', ') : parsedHealth.medicalConditions || null,
          allergies: parsedHealth.knownAllergies || null,
          comments: parsedHealth.additionalComments || null,
        }
      });
    } catch (dbError) {
      console.error('Database insertion error:', dbError);
      return NextResponse.json({ error: 'Failed to save patient data' }, { status: 500 });
    }

    // Generate PDF summary of healthInfo (still in memory, not saved to disk)
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
    // Optionally, upload the PDF summary to Vercel Blob as well
    const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
    const pdfUpload = await put(`${patientId}/report_info.pdf`, pdfBlob, { access: 'public' });

    return NextResponse.json({
      success: true,
      link: `/uploads/${patientId.replace('patient_', '')}`,
      patientId: patientId.replace('patient_', ''),
      files: savedFiles,
      fileUrls,
      pdfUrl: pdfUpload.url
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error occurred' }, { status: 500 });
  }
}
