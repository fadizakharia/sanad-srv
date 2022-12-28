import { validationError } from "./ErrorType";

class CustomError extends Error {
  status: number;
  message: string;
  private validationErrors: Array<validationError>;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.message = message;
  }
  getValidationErrors() {
    return this.validationErrors;
  }
  setValidationErrors(...validationErrors: Array<validationError>) {
    this.validationErrors = [...this.validationErrors, ...validationErrors];
  }
}

export { CustomError };
