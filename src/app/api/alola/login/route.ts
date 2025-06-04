import { NextRequest, NextResponse } from "next/server";

const EMAIL = "aly@alola";
const PASSWORD = "Alola@123";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (email === EMAIL && password === PASSWORD) {
    const res = NextResponse.json({ success: true });
    res.cookies.set("alola_auth", "true", {
      httpOnly: true,
      maxAge: 60 * 60 * 8, // 8 hours
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production", // OK: process.env usage is correct
    });
    return res;
  }
  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
}
