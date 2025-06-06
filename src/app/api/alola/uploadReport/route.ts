import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const patientId = searchParams.get('patientId');
  if (!patientId) {
    return NextResponse.json({ error: 'Missing patientId' }, { status: 400 });
  }
  const formData = await request.formData();
  const file = formData.get('report') as File;
  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }
  try {
    // Upload the PDF to Vercel Blob storage
    const blob = await put(`patient_${patientId}/report.pdf`, file, { access: 'public' });
    return NextResponse.json({ success: true, link: `/uploads/${patientId}`, url: blob.url });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to upload report' }, { status: 500 });
  }
}
