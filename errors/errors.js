class AppError {
    constructor(msg) {
        this.message = msg;
    }

    toString() {
        return this.message;
    }

    getStatusCode() {
        return 500;
    }
}

class ValidationError extends AppError {
    constructor(msg) {
        super(msg)
    }

    getStatusCode() {
        return 400;
    }
}

class AuthenticationError extends AppError {
    constructor(msg) {
        super(msg)
    }

    getStatusCode() {
        return 403;
    }
}

class NotFoundError extends AppError {
    constructor(msg) {
        super(msg);
    }

    getStatusCode() {
        return 404;
    }
}

exports.AppError = AppError;
exports.ValidationError = ValidationError;
exports.AuthenticationError = AuthenticationError;
exports.NotFoundError = NotFoundError;