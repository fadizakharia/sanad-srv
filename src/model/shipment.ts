import { Schema, model, SchemaTypes, Document, Model } from "mongoose";
import { shipmentTypes, TShipment_type } from "../constants/shipment-types";
import { statusTypes, TStatusType } from "../constants/status-types";
import locationSchema, { ILocation } from "./location";
import { IUser } from "./user";

export interface IShipmentAttr {
  from: ILocation;
  to: ILocation;
  route: ILocation;
  from_addr: string;
  to_addr: string;
  delivery_date?: Date | string;
  pickup_date: Date | string;
  shipment_size: string;
  cosignee_name: string;
  phone_no: number;
  driver: IUser | string;
  driver_requests: Array<IUser> | Array<string>;
  shipment_type: TShipment_type;
  status: TStatusType;
  host: IUser | string;
  image: string;
  additional_info?: string;
  date_type: "day" | "date-time";
  shipment_image: string;
}
export interface IShipment extends Document {
  delivery_date: Date | string;
  pickup_date: Date | string;
  shipment_size: string;
  cosignee_name: string;
  from_addr: string;
  to_addr: string;
  phone_no: number;
  driver: IUser | string;
  driver_requests: Array<IUser> | Array<string>;
  shipment_type: TShipment_type;
  status: TStatusType;
  host: IUser | string;
  image: string;
  additional_info: string;
  from: ILocation;
  to: ILocation;
  route: ILocation;
  date_type: "day" | "date-time";
  shipment_image: string;
}
interface IShipmentModel extends Model<IShipment> {
  build(attrs: IShipmentAttr): IShipment;
}

const shipmentSchema = new Schema<IShipment>(
  {
    from: locationSchema,
    to: locationSchema,
    route: locationSchema,
    from_addr: { type: SchemaTypes.String },
    to_addr: { type: SchemaTypes.String },
    delivery_date: { type: SchemaTypes.Date, required: false },
    pickup_date: { type: SchemaTypes.Date, required: true },
    shipment_type: { type: SchemaTypes.String, enum: shipmentTypes },
    phone_no: { type: SchemaTypes.Number, required: true },
    driver: { type: SchemaTypes.ObjectId, ref: "user" },
    host: { type: SchemaTypes.ObjectId, ref: "user" },
    cosignee_name: { type: SchemaTypes.String, required: true },
    driver_requests: [{ type: SchemaTypes.ObjectId, ref: "user" }],
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
shipmentSchema.virtual("expired").get(function () {
  if (this.status !== "fulfilled") {
    return;
  } else {
    return;
  }
});
export default model<IShipment, IShipmentModel>("shipment", shipmentSchema);
