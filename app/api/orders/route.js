import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { protect } from "@/lib/auth";

// POST /api/orders → إنشاء أوردر جديد (مفتوح)
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const order = await Order.create(body);
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// GET /api/orders → جلب كل الأوردرات (محمي - أدمن فقط)
export async function GET(request) {
  const { error } = await protect(request);
  if (error) return NextResponse.json({ message: error }, { status: 401 });

  try {
    await connectDB();
    const orders = await Order.find().sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
