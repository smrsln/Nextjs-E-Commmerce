import { Document, model, Schema } from "mongoose";

export interface UserDocument extends Document {
  _id: string;
  email: string;
  phone?: string;
  image?: string;
  password: string;
  name: string;
  role: string;
  googleId?: string;
  facebookId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<UserDocument>({
  _id: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    minlength: 5,
    maxlength: 255,
    lowercase: true,
    trim: true,
    sparse: true,
    match: [
      /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
      "Please fill a valid email address",
    ],
  },
  phone: {
    type: String,
    unique: true,
    minlength: 10,
    maxlength: 10,
    trim: true,
    sparse: true,
    match: [/^[0-9]+$/, "Please fill a valid phone number"],
  },
  image: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024,
    trim: true,
    select: false,
    match: [
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/,
      "Please fill a valid password",
    ],
  },
  name: {
    type: String,
    minlength: 3,
    maxlength: 255,
    match: [/^[a-zA-Z]+$/, "Please fill a valid name"],
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin", "moderator", "subscriber", "blocked", "deleted"],
  },
  googleId: { type: String, unique: true, sparse: true, trim: true },
  facebookId: { type: String, unique: true, sparse: true, trim: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    timestamps: true,
  },
});

export const UserModel = model<UserDocument>("User", UserSchema);
