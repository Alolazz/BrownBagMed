import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import prisma from '@/app/models/patient';

/**
 * API route handler for medication uploads
 * Stores files in Vercel Blob Storage and metadata in Prisma DB
 */
export async function POST(request: Request) {
  try {
    // Extract patient ID from headers
    const patientId = request.headers.get('X-Patient-ID');
    if (!patientId) {
      return NextResponse.json({ error: 'Missing Patient ID' }, { status: 400 });
    }

    // Parse form data
    const formData = await request.formData();
    const files = formData.getAll('files');
    
    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    // Get patient metadata from JSON string
    const healthInfoJson = formData.get('healthInfo');
    if (!healthInfoJson || typeof healthInfoJson !== 'string') {
      return NextResponse.json({ error: 'Missing patient health information' }, { status: 400 });
    }

    // Parse health information
    const healthInfo = JSON.parse(healthInfoJson);

    // Store files in Vercel Blob Storage
    const fileUrls: string[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i] as File;
      const fileName = `medication_${i + 1}_${Date.now()}.${file.name.split('.').pop()}`;
      
      // Upload to Vercel Blob with patientId as folder
      const blob = await put(`${patientId}/${fileName}`, file, { 
        access: 'public',
        addRandomSuffix: false 
      });
      
      fileUrls.push(blob.url);
    }

    // Save patient data in Prisma database
    await prisma.patient.create({
      data: {
        id: patientId,
        folderName: patientId,
        dateOfBirth: healthInfo.dateOfBirth || null,
        gender: healthInfo.gender || null,
        conditions: healthInfo.medicalConditions ? JSON.stringify(healthInfo.medicalConditions) : null,
        allergies: healthInfo.knownAllergies || null,
        comments: healthInfo.additionalComments || null,
        uploadedAt: new Date(),
      },
    });

    // Return success response with URLs and patient data
    return NextResponse.json({ 
      success: true,
      message: 'Files uploaded successfully',
      patientId,
      fileUrls,
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }, { status: 500 });
  }
}
