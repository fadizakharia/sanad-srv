import * as yup from "yup";

export const signupValidation = yup.object().shape({
  first_name: yup.string(),
  last_name: yup.string(),
  phone_no: yup.number(),
  password: yup.string(),
  email: yup.string(),
  physical_address: yup.string(),
  auth_strategies: yup.string().oneOf(["local"]),
  bio: yup.string(),
  is_registered: yup.boolean(),
});
