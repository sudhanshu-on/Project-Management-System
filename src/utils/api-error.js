class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong",
        error = [],
        stack = "",
    ) {
        super(message); //only thing that parent class Error takes as parameter;
        this.statusCode = statusCode;
        this.message = message;
        this.error = error;
        this.success = false;
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export {ApiError};