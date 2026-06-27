import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import Admin from "@/models/Admin";
import { generateToken } from "@/lib/auth";

export async function POST(request) {
  await connectDB();
  const { email, password } = await request.json();

  const exists = await Admin.findOne({ email });
  if (exists) {
    return NextResponse.json({ message: "الإيميل موجود بالفعل" }, { status: 400 });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ email, password: hashedPassword });
    return NextResponse.json({ token: generateToken(admin._id) }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
