import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import prisma from '@/app/models/patient';

export async function POST(request: Request) {
  const patientId = request.headers.get('X-Patient-ID');
  if (!patientId) {
    return NextResponse.json({ error: 'Missing Patient ID' }, { status: 400 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('medications');
    if (!file) {
      throw new Error('No file uploaded');
    }

    await put(`${patientId}/medications`, file, { access: 'public' });

    // Removed blobUrl field and adjusted logic
    await prisma.patient.create({
      data: {
        id: patientId,
        folderName: patientId,
        uploadedAt: new Date(),
      },
    });

    return NextResponse.json({ message: 'File uploaded successfully' });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error occurred' }, { status: 500 });
  }
}
