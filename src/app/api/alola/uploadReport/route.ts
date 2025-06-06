import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('report') as File | null;
  const patientId = formData.get('patientId') as string | null;

  if (!file || !patientId) {
    return NextResponse.json({ error: 'Missing file or patientId' }, { status: 400 });
  }

  try {
    await put(`patient_${patientId}/report.pdf`, file, { access: 'public' });
    // Redirect to /uploads/{patientId} on success
    return Response.redirect(`/uploads/${patientId}`, 303);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to upload report', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
