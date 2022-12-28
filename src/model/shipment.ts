import { Schema, model, SchemaTypes, Document } from "mongoose";
import { shipmentTypes, TShipment_type } from "../constants/shipment-types";
import { statusTypes, TStatusType } from "../constants/status-types";
import locationSchema, { ILocation } from "./location";
import { IUser } from "./user";

export interface IShipment extends Document {
  delivery_date: Date | string;
  pickup_date: Date | string;
  shipment_size: string;
  cosignee_name: string;
  phone_number: number;
  address: string;
  driver: IUser;
  shipment_type: TShipment_type;
  status: TStatusType;
  host: IUser | string;
  image: string;
  additional_info: string;
  from: ILocation;
  to: ILocation;
  date_type: "day" | "date-time";
  shipment_image: string;
}

const shipmentSchema = new Schema<IShipment>(
  {
    from: locationSchema,
    to: locationSchema,
    delivery_date: { type: SchemaTypes.Date, required: true },
    pickup_date: { type: SchemaTypes.Date, required: true },
    shipment_type: { type: SchemaTypes.String, enum: shipmentTypes },
    phone_number: { type: SchemaTypes.Number, required: true },
    address: { type: SchemaTypes.String, required: true },
    driver: { type: SchemaTypes.ObjectId, ref: "user" },
    host: { type: SchemaTypes.ObjectId, ref: "user" },
    status: {
      type: SchemaTypes.String,
      enum: statusTypes,
      default: "parked",
    },
    image: { type: SchemaTypes.String },
    additional_info: { type: SchemaTypes.String },
    date_type: { type: SchemaTypes.String, enum: ["date", "date-time"] },
  },
  { timestamps: true }
);
shipmentSchema.virtual("cosignee_name").get(function () {
  return (this as any).first_name + " " + (this as any).last_name;
});
shipmentSchema.virtual("expired").get(function () {
  if (this.status !== "fulfilled") {
    return;
  } else {
    return;
  }
});
export default model<IShipment>("shipment", shipmentSchema);
