import { Schema, model, SchemaTypes } from "mongoose";
import { IUser } from "./user";

export interface IVerfication {
  user: string | IUser;
  id_front: string;
  id_back: string;
  driving_license_front: string;
  driving_license_back: string;
  id_verified: boolean;
  driving_verified: boolean;
}

export const verificationSchema = new Schema<IVerfication, IVerfication>({
  user: { type: SchemaTypes.ObjectId, ref: "user" },
  id_front: { type: SchemaTypes.String },
  id_back: { type: SchemaTypes.String },
  driving_license_front: { type: SchemaTypes.String },
  driving_license_back: { type: SchemaTypes.String },
  id_verified: { type: SchemaTypes.Boolean },
  driving_verified: { type: SchemaTypes.Boolean },
});

export default model<IVerfication>("verification", verificationSchema);
