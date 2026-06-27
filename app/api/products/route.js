import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { protect } from "@/lib/auth";

// GET /api/products?category=burgers → جلب كل المنتجات (مفتوح، فيه فلترة category)
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const filter = category ? { category } : {};
    const products = await Product.find(filter);
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// POST /api/products → إضافة منتج (محمي - أدمن فقط)، بيدعم insertMany لو الداتا array
export async function POST(request) {
  const { error } = await protect(request);
  if (error) return NextResponse.json({ message: error }, { status: 401 });

  try {
    await connectDB();
    const data = await request.json();
    const products = Array.isArray(data)
      ? await Product.insertMany(data)
      : await Product.create(data);
    return NextResponse.json(products, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
