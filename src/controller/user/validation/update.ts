import * as yup from "yup";
export const updateUserValidationSchema = yup.object().shape({
  bio: yup.string(),
  first_name: yup.string(),
  last_name: yup.string(),
  coordinates: yup.object().shape({
    longitude: yup.number(),
    latitude: yup.number(),
  }),
  physical_address: yup.string().when("coordinates", {
    is: (field: any) => field,
    then: yup.string().required("physical address is required"),
  }),
  phone_no: yup.number(),
});
