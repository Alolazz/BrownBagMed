import { put } from '@vercel/blob';

export async function POST(req: Request) {
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

    const { url } = await put(`uploads/${patientId}/${file.name}`, file, {
      access: 'public',
    });

    return Response.json(
      { success: true, patientId, fileUrl: url },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Upload error',
      },
      { status: 500 }
    );
  }
}
