export class InternalServerError extends Error {
  constructor({ cause, statusCode }) {
    super("Internal server error", {
      cause,
    });
    this.name = "InternalServerError";
    this.action = "Contact system admin";
    this.statusCode = statusCode || 500;
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

export class ServiceError extends Error {
  constructor({ cause, message }) {
    super(message || "Service unavailable.", {
      cause,
    });
    this.name = "ServiceUnavailableError";
    this.action = "Check service status.";
    this.statusCode = 503;
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
export class ValidationError extends Error {
  constructor({ cause, message, action }) {
    super(message || "Validation error.", {
      cause,
    });
    this.name = "ValidationError";
    this.action = action || "Validation error. Try again.";
    this.statusCode = 400;
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

export class NotFoundError extends Error {
  constructor({ cause, message, action }) {
    super(message || "Resource not found.", {
      cause,
    });
    this.name = "NotFoundError";
    this.action = action || "Resource not found. Try again.";
    this.statusCode = 404;
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

export class MethodNotAllowedError extends Error {
  constructor() {
    super("HTTP method not allowed");
    this.name = "MethodNotAllowedError";
    this.action = "Verify used request method";
    this.statusCode = 405;
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
