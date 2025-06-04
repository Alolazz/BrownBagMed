import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { writeFile } from 'fs/promises';
import fs from 'fs/promises';

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
  const patientDir = path.join(process.cwd(), 'uploads', `patient_${patientId}`);
  try {
    await fs.mkdir(patientDir, { recursive: true });
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = path.join(patientDir, 'report.pdf');
    await writeFile(filePath, buffer);
    // List files after upload
    const files = await fs.readdir(patientDir);
    const filtered = files.filter(f => f !== 'info.json');
    return NextResponse.json({ message: 'Report uploaded', files: filtered });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to upload report' }, { status: 500 });
  }
}
