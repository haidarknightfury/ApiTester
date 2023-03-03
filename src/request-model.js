const dotenv = require('dotenv').config();

export const CUSTOMER_URL = process.env.CUSTOMER_URL;
export const VISITOR_URL = process.env.VISITOR_URL
export const USER_URL = process.env.USER_URL
export const LOAN_URL = process.env.LOAN_URL
export const FACILITY_URL = process.env.FACILITY_URL
export const ACCOUNT_URL = process.env.ACCOUNT_URL


// Return code provider
const ReturnCodeProvider = (response) => { return response.ResponseStatus.ReturnCode; }
const GetLimitIDResponseCodeProvider =(response) => { return response.StatusCode; }


// Post Request Runner
const ConsoleOutput = (response) => { console.log(JSON.stringify(response)); }
const ResponseCodeAssertion = (response) => {  console.assert(response.ResponseStatus.ReturnCode === "0", "response code is not valid") }


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
    new RequestModel(CUSTOMER_URL, 'GET_CUSTOMER_INFO_V15', `GetCustomerInfoV15Req.json`, [ResponseCodeAssertion]),
    new RequestModel(VISITOR_URL, 'GET_STAFF_DETAILS_V1', `GetStaffDetailsV1Req.json`),
    new RequestModel(USER_URL, 'GET_USER_INFO_V2', `GetUserInfoV2.json`, [ConsoleOutput, ResponseCodeAssertion]),
    new RequestModel(CUSTOMER_URL, 'GET_FINANCIAL_SUMMARY_V6', `GetFinancialSummaryV6.json`),
    new RequestModel(LOAN_URL, 'GET_COLLATERAL_ASSET_DETAILS_V1', `GetCollateralAssetDetailsV1.json`),
    new RequestModel(LOAN_URL, 'GET_CONTRACT_INFO_V2', `GetContractInfoV2.json`),
    new RequestModel(LOAN_URL, 'GET_INTEREST_RATE_V1', `GetInterestRateV1.json`),
    new RequestModel(FACILITY_URL, 'GET_FOS_REQUEST_LIST_V2', `GetFosRequestListV2.json`),
    new RequestModel(FACILITY_URL, 'GET_NEXTLIMITID_V1', `GetNextLimitIdV1.json`, null, GetLimitIDResponseCodeProvider),
    new RequestModel(FACILITY_URL, 'GET_RISK_GROUP_INFO_V1', `GetRiskGroupInfoV1.json`),
    new RequestModel(FACILITY_URL, 'GET_CREDIT_SCORING_V2', `GetCreditScoringV2.json`),
    new RequestModel(ACCOUNT_URL, 'GET_ACCT_INFO_V8', `GetAccountInfoV8.json`),
]


