import { NextResponse, NextRequest } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    // Only keep minimal info, do not store permanently unless required
    const { patientId, dob, question } = data;
    if (!patientId || !dob || !question) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    // Store in a per-patient file, but do not keep indefinitely
    const dir = path.join(process.cwd(), 'uploads', patientId);
    await fs.mkdir(dir, { recursive: true });
    const file = path.join(dir, 'follow_ups.json');
    let arr = [];
    try {
      const existing = await fs.readFile(file, 'utf8');
      arr = JSON.parse(existing);
    } catch (error) {
      // If file doesn't exist or parse fails, start with empty array
      if (error && typeof error === 'object' && 'code' in error && (error as any).code !== 'ENOENT') {
        console.error(error);
      }
    }
    arr.push({ dob, question, date: new Date().toISOString() });
    await fs.writeFile(file, JSON.stringify(arr, null, 2));
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
