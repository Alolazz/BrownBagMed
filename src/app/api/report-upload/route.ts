import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("report") as File;
  const patientId = formData.get("patientId");

  if (!file || !patientId) {
    return NextResponse.json({ error: "Missing file or patient ID" }, { status: 400 });
  }

  const filename = `reports/${patientId}/${file.name}`;
  const { url } = await put(filename, file, { access: "public" });

  return NextResponse.json({ url });
}
