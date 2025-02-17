import mongoose from "mongoose";

// Define the schema options
const userSchemaOptions = {
  timestamps: true,
  collection: "users",
};

const ROLES = ["user", "admin"];

// Define the Todo schema
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: false,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ROLES,
      default: ROLES[0],
    },
  },
  userSchemaOptions
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export { User, userSchema };
