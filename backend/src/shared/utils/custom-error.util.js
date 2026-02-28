class CustomError extends Error {
  constructor(message = "Internal Server Error", statusCode = 500) {
    super(message);
    this.customMessage = message;
    this.statusCode = statusCode;
    this.name = "CustomError";

    Error.captureStackTrace(this, this.constructor);
  }
}

export default CustomError;