import { BaseRequestModel } from './request-model';

export class Response extends BaseRequestModel {

    constructor(url, requestName, status, applicationStatus, time) {
        super(url, requestName);
        this.status = status;
        this.applicationStatus = applicationStatus;
        this.time = time;
    }
}