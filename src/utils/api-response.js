class ApiResponse{
    constructor(statusCode, data, message = "Success"){
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode<400; //statusCode above 400 is considered as error from server side
    }
}

export {ApiResponse};