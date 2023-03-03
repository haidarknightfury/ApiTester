const dotenv = require('dotenv').config();

export const TEST_URL = process.env.TEST_URL;


// Return code provider
const ReturnCodeProvider = (response) => { return response.json.message.name; }
const GetLimitIDResponseCodeProvider = (response) => { return response.StatusCode; }


// Post Request Runner
const ConsoleOutput = (response) => { console.log(JSON.stringify(response)); }
const ResponseCodeAssertion = (response) => { console.assert(response.json.message.name === "haidar", "response is not valid") }


export class BaseRequestModel {
    constructor(url, requestName) {
        this.url = url;
        this.requestName = requestName;
    }
}

export class RequestModel extends BaseRequestModel {

    constructor(url, requestName, fileName, assertions = null, returnCodeProvider = ReturnCodeProvider) {
        super(url, requestName);
        this.fileName = fileName;
        this.assertions = assertions;
        this.returnCodeProvider = returnCodeProvider;
    }
}

export class LoadedRequestModel extends BaseRequestModel {

    constructor(url, requestName, requestBody) {
        super(url, requestName);
        this.requestBody = requestBody;
    }
}


export const requests = [
    new RequestModel(TEST_URL, 'TEST', `message.json`, [ConsoleOutput, ResponseCodeAssertion]),
]