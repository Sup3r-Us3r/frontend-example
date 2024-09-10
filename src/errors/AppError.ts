class AppError extends Error {
  public readonly errorMessage: string;
  public readonly statusCode: number;

  constructor(errorMessage: string, statusCode = 400) {
    super(errorMessage);

    this.errorMessage = errorMessage;
    this.statusCode = statusCode;
  }
}

export { AppError };
