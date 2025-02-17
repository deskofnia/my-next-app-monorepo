import connectDB from "@/lib/connect-db";
import { createErrorResponse, stringToObjectId } from "@/lib/utils";
import { User } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get("X-USER-ID");

    if (!userId) {
      return createErrorResponse(
        "You are not logged in, please provide token to gain access",
        401
      );
    }

    await connectDB();

    const parsedId = stringToObjectId(userId);

    const user = await User.findById(parsedId).lean().exec();

    console.log("user===>>>", user);

    const json_response = {
      success: true,
      data: user,
    };
    return NextResponse.json(json_response);
  } catch (error: any) {
    if (error instanceof ZodError) {
      return createErrorResponse(error.message, 400);
    }

    return createErrorResponse(error.message, 500);
  }
}
