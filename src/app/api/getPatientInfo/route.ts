import { NextResponse } from 'next/server';
import prisma from '@/app/models/patient';
import { list } from '@vercel/blob';

/**
 * API route handler for retrieving patient information
 * This endpoint fetches patient data from Prisma DB and uploaded files from Vercel Blob Storage
 */
export async function GET(request: Request) {
  try {
    // Get the patient ID from the URL params
    const url = new URL(request.url);
    const patientId = url.searchParams.get('patientId');

    if (!patientId) {
      return NextResponse.json({ error: 'Missing patient ID' }, { status: 400 });
    }

    // Find the patient in the database
    const patient = await prisma.patient.findUnique({
      where: {
        id: patientId,
      },
    });

    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    // Parse conditions if they exist
    let conditions: string[] = [];
    if (patient.conditions) {
      try {
        conditions = JSON.parse(patient.conditions);
      } catch (e) {
        console.error('Error parsing conditions:', e);
      }
    }

    // Get uploaded files from Vercel Blob Storage
    interface UploadedFile {
      name: string;
      url: string;
      uploadedAt: Date;
    }
    
    let uploadedFiles: UploadedFile[] = [];
    try {
      // List all blobs with the patientId prefix
      const { blobs } = await list({ prefix: `${patientId}/` });
      
      // Format file information
      uploadedFiles = blobs.map(blob => ({
        name: blob.pathname.split('/').pop() || 'Unnamed file',
        url: blob.url,
        uploadedAt: blob.uploadedAt
      }));
    } catch (error) {
      console.error('Error fetching files from blob storage:', error);
    }

    // Return the patient information and files
    return NextResponse.json({
      success: true,
      patientInfo: {
        name: "Patient", // Generic name since we don't collect actual names
        age: patient.dateOfBirth ? calculateAge(patient.dateOfBirth) : null,
        conditions: conditions || []
      },
      uploadedFiles: uploadedFiles,
      patient: {
        id: patient.id,
        dateOfBirth: patient.dateOfBirth,
        gender: patient.gender,
        conditions: conditions,
        allergies: patient.allergies,
        comments: patient.comments,
        uploadedAt: patient.uploadedAt,
      },
    });

    /**
     * Helper function to calculate age from date of birth
     * @param dateOfBirth Format: DD.MM.YYYY
     */
    function calculateAge(dateOfBirth: string): number | null {
      try {
        // Parse DD.MM.YYYY format
        const parts = dateOfBirth.split('.');
        if (parts.length !== 3) return null;
        
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed in JavaScript Date
        const year = parseInt(parts[2], 10);
        
        const birthDate = new Date(year, month, day);
        const today = new Date();
        
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        
        return age;
      } catch (error) {
        console.error('Error calculating age:', error);
        return null;
      }
    }
  } catch (error) {
    console.error('Error fetching patient info:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }, { status: 500 });
  }
}
