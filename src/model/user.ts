import { model, Schema, SchemaTypes } from "mongoose";
import { hash, argon2id } from "argon2";

import { Strategies, TStrategies } from "../constants";
import { IVerfication } from "./verification-documents";
import locationSchema, { ILocation } from "./location";
export interface IUser extends Document {
  id: string;
  first_name: string;
  last_name: string;
  phone_no: number;
  password: string;
  email: string;
  physical_address: string;
  auth_strategies: Array<TStrategies>;
  bio?: string;
  is_registered: boolean;
  coords: ILocation;
  profile_picture?: string;
  verification?: string | IVerfication;
  chat_token: string;
}
export type StrategyTypes = "";
const usersSchema = new Schema<IUser>(
  {
    first_name: { type: SchemaTypes.String, required: true },
    last_name: { type: SchemaTypes.String, required: true },
    phone_no: { type: SchemaTypes.Number, unique: true },
    password: { type: SchemaTypes.String },
    email: { type: SchemaTypes.String, unique: true, required: true },
    physical_address: { type: SchemaTypes.String },
    auth_strategies: [{ type: SchemaTypes.String, enum: Strategies }],
    bio: [{ type: SchemaTypes.String, required: false }],
    is_registered: [{ type: SchemaTypes.Boolean, default: false }],
    profile_picture: { type: SchemaTypes.String, required: false },
    verification: { type: SchemaTypes.ObjectId, ref: "verification" },
    coords: locationSchema,
    chat_token: { type: SchemaTypes.String },
  },
  {
    timestamps: true,
    toObject: {
      transform: function (_, ret) {
        ret.id = ret._id;

        delete ret.__v;
        delete ret.auth_strategies;
      },
    },
  }
);
usersSchema.pre("save", async function (next) {
  try {
    const hashedPassword = await hash(this.password, { type: argon2id });
    this.set("password", hashedPassword);
    next();
  } catch (err) {
    next(new Error(err.message));
  }
});

const usersModel = model<IUser>("user", usersSchema);
export default usersModel;
