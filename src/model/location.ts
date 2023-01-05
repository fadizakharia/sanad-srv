import mongoose from "mongoose";

export interface ILocation {
  type?: "Point";
  coordinates: Array<number>;
  multi_coordinates: Array<Array<number>>;
}
const locationSchema = new mongoose.Schema({
  type: {
    type: mongoose.SchemaTypes.String,
    default: "Point",
  },
  coordinates: {
    type: Array<Number>,
    required: false,
  },
  multi_coordinates: {
    type: Array<Array<Number>>,
    required: false,
  },
});

export default locationSchema;
