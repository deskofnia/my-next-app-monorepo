import connectDB from "@/lib/connect-db";
import { signJWT } from "@/lib/token";
import { comparePassword, createErrorResponse } from "@/lib/utils";
import { LoginUserInput, LoginUserSchema } from "@/lib/validations/user.schema";
import { User } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = (await req.json()) as LoginUserInput;
    const data = LoginUserSchema.parse(body);

    const { email, password } = data;

    // Check if user exists
    const existingUser = await User.findOne({ email }).exec();
    if (!existingUser) {
      return createErrorResponse("user not found", 404);
    }

    const checkPassword = await comparePassword(
      password,
      existingUser.password
    );

    if (!checkPassword) {
      return createErrorResponse("invalid credentials", 401);
    }

    const token = await signJWT({ sub: existingUser.id }, { exp: "1h" });

    const tokenMaxAge = 3600;
    const cookieOptions = {
      name: "token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV !== "development",
      maxAge: tokenMaxAge,
    };

    const json_response = {
      success: true,
      message: "logged in successfully",
      data: {
        user: {
          id: existingUser._id,
          email: existingUser.email,
        },
        token,
      },
    };

    const response = NextResponse.json(json_response);

    await Promise.all([
      response.cookies.set(cookieOptions),
      response.cookies.set({
        name: "logged-in",
        value: "true",
        maxAge: tokenMaxAge,
      }),
    ]);
    return response;
  } catch (error: any) {
    console.log("login error===>>", error);
    if (error instanceof ZodError) {
      return createErrorResponse(error.message, 400);
    }

    return createErrorResponse(error.message, 500);
  }
}
