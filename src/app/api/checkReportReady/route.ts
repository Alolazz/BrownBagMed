import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/models/patient';

/**
 * API route to check if a report is ready for a specific patient
 * Uses the reportReady field in the database instead of checking the filesystem
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get('patientId');
    
    if (!patientId) {
      return NextResponse.json({ exists: false, error: 'Missing patientId' }, { status: 400 });
    }
    
    // Check database for report status
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      select: { reportReady: true }
    });
    
    if (!patient) {
      return NextResponse.json({ exists: false, error: 'Patient not found' }, { status: 404 });
    }
    
    // Return report status
    return NextResponse.json({ exists: patient.reportReady });
    
  } catch (error) {
    console.error('Error checking report status:', error);
    return NextResponse.json({ exists: false, error: 'Server error' }, { status: 500 });
  }
}
