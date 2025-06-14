import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/models/patient';

/**
 * API route to record a patient's payment plan selection
 * This is called when a healthcare professional assigns a plan or a patient selects one
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const data = await request.json();
    const { patientId, planType, planName, planPrice } = data;
    
    if (!patientId || !planType) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields' 
      }, { status: 400 });
    }
    
    // Validate plan type
    if (!['basic', 'standard', 'premium'].includes(planType)) {
      return NextResponse.json({ 
        success: false, 
        error: `Invalid plan type: ${planType}. Must be one of: basic, standard, premium` 
      }, { status: 400 });
    }
    
    // Find the patient
    const patient = await prisma.patient.findUnique({
      where: { id: patientId }
    });
    
    if (!patient) {
      return NextResponse.json({ 
        success: false, 
        error: 'Patient not found' 
      }, { status: 404 });
    }
    
    // Check if payment is already confirmed
    if (patient.paymentConfirmed) {
      return NextResponse.json({ 
        success: false, 
        alreadyPaid: true,
        error: 'Payment already confirmed' 
      }, { status: 200 });
    }
    
    // Record the plan selection
    await prisma.patient.update({
      where: { id: patientId },
      data: {
        requiredPlanType: planType
      }
    });
    
    return NextResponse.json({
      success: true,
      message: `Plan ${planType} selected for patient ${patientId}`
    });
    
  } catch (error) {
    console.error('Error recording payment plan:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
