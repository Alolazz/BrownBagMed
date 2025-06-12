import { put } from '@vercel/blob';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const patientId = formData.get('patientId')?.toString();

    if (!file || !patientId) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing file or patientId' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    try {
      // Use the same folder structure as the main upload API - patientId as the prefix
      const { url } = await put(`${patientId}/report_${Date.now()}_${file.name}`, file, {
        access: 'public',
      });

      return new Response(
        JSON.stringify({ success: true, patientId, fileUrl: url }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (uploadError) {
      console.error('Blob upload error:', uploadError);
      return new Response(
        JSON.stringify({
          success: false,
          error: uploadError instanceof Error ? uploadError.message : 'Blob upload failed',
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Unexpected server error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unexpected server error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
