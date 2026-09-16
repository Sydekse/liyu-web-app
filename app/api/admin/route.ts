import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { adminCookieOptions } from "@/lib/auth";
import Admin, { IAdmin } from "@/lib/models/admin";

const secret = process.env.JWT_SECRET;

export async function POST(req: Request) {
  try {
    const { userName, password } = await req.json();

    if (
      !userName ||
      !password ||
      typeof userName !== "string" ||
      typeof password !== "string"
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing inputs" },
        { status: 400 },
      );
    }

    await connectDB();

    const admin: IAdmin | null = await Admin.findOne({ userName });

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Admin not found" },
        { status: 404 },
      );
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 },
      );
    }
    const token = jwt.sign(
      {
        id: admin._id,
        userName: admin.userName,
      },
      secret as string,
      { expiresIn: "5hr" },
    );
    const response = NextResponse.json(
      { success: true, message: "Login successful", token },
      { status: 200 },
    );
    response.cookies.set("admin-token", token, adminCookieOptions(60 * 60 * 5));
    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in admin login:", error.message);
    } else {
      console.error("unknown error has happened", error);
    }

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
