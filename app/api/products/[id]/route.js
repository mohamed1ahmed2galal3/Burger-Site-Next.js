import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { protect } from "@/lib/auth";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const product = await Product.findById(params.id);
    if (!product) return NextResponse.json({ message: "المنتج مش موجود" }, { status: 404 });
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { error } = await protect(request);
  if (error) return NextResponse.json({ message: error }, { status: 401 });

  try {
    await connectDB();
    const body = await request.json();
    const product = await Product.findByIdAndUpdate(params.id, body, { new: true });
    if (!product) return NextResponse.json({ message: "المنتج مش موجود" }, { status: 404 });
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { error } = await protect(request);
  if (error) return NextResponse.json({ message: error }, { status: 401 });

  try {
    await connectDB();
    const product = await Product.findByIdAndDelete(params.id);
    if (!product) return NextResponse.json({ message: "المنتج مش موجود" }, { status: 404 });
    return NextResponse.json({ message: "تم حذف المنتج" });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
