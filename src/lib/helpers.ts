import toast from "react-hot-toast";

type EnvVariableKey = "JWT_SECRET_KEY" | "JWT_EXPIRES_IN";

export function getEnvVariable(key: EnvVariableKey): string {
  const value = process.env[key];

  if (!value || value.length === 0) {
    console.error(`The environment variable ${key} is not set.`);
    throw new Error(`The environment variable ${key} is not set.`);
  }

  return value;
}

export function handleApiError(error: Error): void {
  try {
    let errorData;
    try {
      errorData = JSON.parse(error.message);
    } catch (parseError) {
      toast.error(error.message);
      return;
    }

    if (
      typeof errorData === "object" &&
      errorData !== null &&
      "fieldErrors" in errorData
    ) {
      const fieldErrors = errorData.fieldErrors as Record<string, string[]>;
      Object.keys(fieldErrors)?.forEach((fieldName) => {
        const validationMessages = fieldErrors[fieldName];
        if (validationMessages.length > 0) {
          const firstValidationMessage = validationMessages[0];
          toast.error(firstValidationMessage);
        }
      });
    }
  } catch (error) {
    // console.log("Original error message:", error);
    error && typeof error === "string" && toast.error(error);
  }
}
