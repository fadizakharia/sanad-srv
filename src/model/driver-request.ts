import { Document, model, Schema, SchemaTypes } from "mongoose";
import { IShipment } from "./shipment";
import { IUser } from "./user";
interface IDriverRequest extends Document {
  driver: IUser;
  status: "accepted" | "rejected";
  shipment: IShipment;
}

const driverRequestSchema = new Schema<IDriverRequest>({
  driver: { type: SchemaTypes.ObjectId, ref: "user" },
  status: { type: SchemaTypes.String, enum: ["accepted", "rejected"] },
  shipment: { type: SchemaTypes.ObjectId, ref: "shipment" },
});

export default model<IDriverRequest>("driver", driverRequestSchema);
