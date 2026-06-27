import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import Admin from "@/models/Admin";
import { generateToken } from "@/lib/auth";

export async function POST(request) {
  await connectDB();
  const { email, password } = await request.json();

  const admin = await Admin.findOne({ email });
  if (!admin) {
    return NextResponse.json({ message: "بيانات غلط" }, { status: 401 });
  }

  try {
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return NextResponse.json({ message: "بيانات غلط" }, { status: 401 });
    }
    return NextResponse.json({ token: generateToken(admin._id) });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
