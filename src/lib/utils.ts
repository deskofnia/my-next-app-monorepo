import mongoose from "mongoose";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export function stringToObjectId(id: string): mongoose.Types.ObjectId | null {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return new mongoose.Types.ObjectId(id);
  } else {
    return null;
  }
}

export function createErrorResponse(
  message: string,
  statusCode: number
): NextResponse {
  const errorResponse = {
    message,
    success: false,
  };

  return new NextResponse(JSON.stringify(errorResponse), {
    status: statusCode,
    headers: { "Content-Type": "application/json" },
  });
}


// Hash password
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Compare password
export async function comparePassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}
