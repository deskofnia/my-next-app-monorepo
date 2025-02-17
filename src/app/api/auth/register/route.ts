import { createErrorResponse, hashPassword } from "@/lib/utils";
import {
  RegisterUserInput,
  RegisterUserSchema,
} from "@/lib/validations/user.schema";
import { User } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as RegisterUserInput;
    const data = RegisterUserSchema.parse(body);

    const { email, password, name } = data;

    console.log("signup payload data=====>>>>>", data);

    // Check if user already exists
    const existingUser = await User.findOne({ email }).lean().exec();

    console.log("existingUser===>>>", existingUser);
    if (existingUser) {
      return createErrorResponse("User already exists", 409);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    await User.create({ email, password: hashedPassword, name });

    const json_response = {
      message: "signed up successfully",
      success: true,
      data: {},
    };
    return NextResponse.json(json_response);
  } catch (error: any) {
    console.log("signup error===>>", error);
    if (error instanceof ZodError) {
      return createErrorResponse(error.message, 400);
    }

    return createErrorResponse(error.message, 500);
  }
}
