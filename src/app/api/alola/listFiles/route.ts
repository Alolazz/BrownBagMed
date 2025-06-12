import { NextRequest, NextResponse } from 'next/server';
import { list } from '@vercel/blob';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');
    
    if (!patientId) {
      return NextResponse.json({ error: 'Missing patientId' }, { status: 400 });
    }
    
    // List all blobs with the patientId prefix
    const { blobs } = await list({ prefix: `${patientId}/` });
    
    if (!blobs || blobs.length === 0) {
      return NextResponse.json({ files: [], urls: [] });
    }
    
    // Format the response with file names and URLs
    const fileData = blobs.map(blob => ({
      name: blob.pathname.split('/').pop() || 'Unnamed file',
      url: blob.url,
      uploadedAt: blob.uploadedAt
    }));
    
    return NextResponse.json({ 
      files: fileData.map(file => file.name),
      urls: fileData.map(file => file.url),
      fileData: fileData
    });
    
  } catch (error) {
    console.error('Error listing files:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Could not list files' 
    }, { status: 500 });
  }
}
