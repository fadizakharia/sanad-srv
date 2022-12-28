export interface localLoginDTO {
  username: string;
  password: string;
}

export interface localSignupDTO {
  first_name: string;
  last_name: string;
  phone_no: number;
  username: string;
  password: string;
  email: string;
  physical_address: string;
  registered: boolean;
}
