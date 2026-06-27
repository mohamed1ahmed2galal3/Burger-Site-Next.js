import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import Admin from "@/models/Admin";

export function generateToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

// نفس فكرة middleware/auth.js (protect) بس بصيغة دالة تستخدم في Route Handlers
// بترجع { admin } لو التوكن صحيح، أو { error } لو غلط
export async function protect(request) {
  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.split(" ")[1];

  if (!token) {
    return { error: "التوكن غلط أو منتهي" };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await connectDB();
    const admin = await Admin.findById(decoded.id).select("-password");
    if (!admin) {
      return { error: "مش مصرح" };
    }
    return { admin };
  } catch {
    return { error: "التوكن غلط أو منتهي" };
  }
}
