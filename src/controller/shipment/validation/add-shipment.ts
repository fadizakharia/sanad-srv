import * as yup from "yup";
import { shipmentTypes } from "../../../constants/shipment-types";

const locationSchema = yup.object().shape({
  longitude: yup.number(),
  latitude: yup.number(),
});
export default yup.object().shape({
  location: locationSchema,
  shipment_date: yup.string(),
  shipment_type: yup.string().oneOf(shipmentTypes),
  phone_number: yup.number(),
  address: yup.string(),
  driver_id: yup.string(),
});
