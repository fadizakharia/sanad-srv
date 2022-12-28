import mongoose from "mongoose";

export interface ILocation {
  type?: "Point";
  coordinates: Array<number>;
}
const locationSchema = new mongoose.Schema({
  type: {
    type: String,
    default: "Point",
  },
  coordinates: {
    type: [Number],
  },
});

export default locationSchema;
