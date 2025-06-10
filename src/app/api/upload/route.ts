import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import prisma from '@/app/models/patient';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const files: File[] = data.getAll('files') as File[];
    const healthInfo = data.get('healthInfo') as string;

    if (!files || files.length === 0 || !healthInfo) {
      return NextResponse.json({ error: 'Missing file or health information' }, { status: 400 });
    }

    const patientId = `patient_${uuidv4()}`;
    const parsedHealth = healthInfo ? JSON.parse(healthInfo) : {};

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
        },
      });
    } catch (dbError) {
      console.error('Database insertion error:', dbError);
      return NextResponse.json({ error: 'Failed to save patient data' }, { status: 500 });
    }

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

    return NextResponse.json({
      success: true,
      patientId: patientId.replace('patient_', ''),
      files: savedFiles,
      fileUrls,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error occurred' }, { status: 500 });
  }
}
