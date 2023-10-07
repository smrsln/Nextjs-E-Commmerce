import mongoose, { Document, Model, Schema } from "mongoose";

interface Session extends Document {
  userId: string;
  expires: Date;
}

const sessionSchema = new Schema<Session>({
  userId: { type: String, required: true },
  expires: { type: Date, required: true },
});

export const SessionModel: Model<Session> = mongoose.model<Session>(
  "Session",
  sessionSchema
);
