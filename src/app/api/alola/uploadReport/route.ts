import { put } from '@vercel/blob';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('report') as File;
  const patientId = formData.get('patientId')?.toString();

  if (!file || !patientId) {
    return new Response('Missing file or patientId', { status: 400 });
  }

  await put(`uploads/${patientId}/${file.name}`, file, { access: 'public' });

  return Response.redirect(`/uploads/${patientId}`, 302);
}
