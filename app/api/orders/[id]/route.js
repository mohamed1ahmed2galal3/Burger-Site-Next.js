import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { protect } from "@/lib/auth";

// GET /api/orders/:id → تتبع أوردر (مفتوح)
export async function GET(request, { params }) {
  try {
    await connectDB();
    const order = await Order.findById(params.id);
    if (!order) return NextResponse.json({ message: "الأوردر مش موجود" }, { status: 404 });
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// PATCH /api/orders/:id → تحديث حالة الأوردر (محمي - أدمن فقط)
export async function PATCH(request, { params }) {
  const { error } = await protect(request);
  if (error) return NextResponse.json({ message: error }, { status: 401 });

  try {
    await connectDB();
    const body = await request.json();
    const order = await Order.findByIdAndUpdate(
      params.id,
      { status: body.status },
      { new: true }
    );
    if (!order) return NextResponse.json({ message: "الأوردر مش موجود" }, { status: 404 });
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
