export class InternalServerError extends Error {
  constructor({ cause }) {
    super("Unexpected server error", {
      cause,
    });
    this.name = "InternalServerError";
    this.action = "Contact system admin";
    this.statusCode = 500;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}
