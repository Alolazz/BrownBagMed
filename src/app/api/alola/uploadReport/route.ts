import { put } from '@vercel/blob';

export async function POST(req: Request) {
  // Validate the `put` function and improve error handling
  try {
    const formData = await req.formData();
    const file = formData.get('report') as File;
    const patientId = formData.get('patientId')?.toString();

    if (!file || !patientId) {
      return Response.json(
        { success: false, error: 'Missing file or patientId' },
        { status: 400 }
      );
    }

    try {
      const { url } = await put(`uploads/${patientId}/${file.name}`, file, {
        access: 'public',
      });

      return Response.json(
        { success: true, patientId, fileUrl: url },
        { status: 200 }
      );
    } catch (uploadError) {
      console.error('Blob upload error:', uploadError);
      return Response.json(
        {
          success: false,
          error:
            uploadError instanceof Error
              ? uploadError.message
              : 'Blob upload failed',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Unexpected server error:', error);
    return Response.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Unexpected server error',
      },
      { status: 500 }
    );
  }
}
