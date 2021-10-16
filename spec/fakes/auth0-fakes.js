class PreUserRegistrationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'PreUserRegistrationError';
    }
}

class UnauthorizedError extends Error {
    constructor(message) {
        super(message);
        this.name = 'UnauthorizedError';
    }
}

class WrongUsernameOrPasswordError extends Error {
    constructor(email, message) {
        super(message);
        this.email = email;
        this.name = 'WrongUsernameOrPasswordError';
    }
}

class ValidationError extends Error {
    constructor(errorKey, message) {
        super(message);
        this.errorKey = errorKey;
        this.name = 'ValidationError';
    }
}

module.exports = { PreUserRegistrationError, UnauthorizedError, ValidationError, WrongUsernameOrPasswordError };