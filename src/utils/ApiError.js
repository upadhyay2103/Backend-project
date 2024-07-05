class ApiError extends Error{
    constructor(
        statusCode,
        message="Something went wrong",
        errors=[],
        stack=""
    ){
        super(message)
        this.statusCode=statusCode
        this.data=null
        this.message=message
        this.errors=errors

        if(stack)
        {
            this.stack=stack
        }
        else
        {
            Error.captureStackTrace(this,this.constructor)
        }
    }
}

export {ApiError}




// class ApiError extends Error {
// This line declares a new class called ApiError.
// The extends Error part means ApiError is a subclass of the built-in Error class, inheriting its properties and methods.
// By extending Error, ApiError can be used anywhere a standard error might be used, but with additional functionality.
// Constructor Definition

// constructor(
//     statusCode,
//     message="Something went wrong",
//     errors=[],
//     stack=""
// ) {
// The constructor function is a special method for creating and initializing an object created with the class.
// It takes four parameters:
// statusCode: Required parameter representing the HTTP status code associated with this error.
// message: Optional parameter with a default value of "Something went wrong", representing the error message.
// errors: Optional parameter with a default value of an empty array, which can hold additional error details.
// stack: Optional parameter with a default value of an empty string, representing the stack trace of the error.
// Calling the Parent Constructor

// javascript
// Copy code
// super(message)
// super(message) calls the constructor of the parent class (Error), passing the message parameter to it.
// This initializes the message property of the Error class with the provided message.
// Setting Instance Properties

// javascript
// Copy code
// this.statusCode = statusCode
// this.data = null
// this.message = message
// this.errors = errors
// this.statusCode = statusCode: Sets the statusCode property on the ApiError instance to the provided statusCode value.
// this.data = null: Initializes a data property with null. This property can be used later to store additional data related to the error.
// this.message = message: Sets the message property on the ApiError instance to the provided message value. While the Error class already has a message property, this explicitly sets it again.
// this.errors = errors: Sets the errors property on the ApiError instance to the provided errors array.
// Handling the Stack Trace

// javascript
// Copy code
// if (stack) {
//     this.stack = stack
// } else {
//     Error.captureStackTrace(this, this.constructor)
// }
// if (stack): Checks if a stack trace string is provided.
// this.stack = stack: If a stack trace is provided, it sets the stack property on the ApiError instance to this value.
// else: If no stack trace is provided:
// Error.captureStackTrace(this, this.constructor): Captures the current stack trace and assigns it to the stack property of the ApiError instance. This method omits the constructor (this.constructor) from the stack trace for clarity.
// Exporting the Class

// javascript
// Copy code
// export { ApiError }
// This line exports the ApiError class so it can be imported and used in other modules.
// The export keyword is part of the ES6 module system, which allows you to share code between different files.
// Purpose
// The purpose of this ApiError class is to create a structured way to handle errors in an API backend. It enhances the standard Error class by adding properties like statusCode, errors, and optionally data. This makes it easier to handle errors consistently, provide meaningful HTTP responses, and include additional error details and stack traces for debugging.