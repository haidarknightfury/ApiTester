import axios from 'axios';
import { LoadedRequestModel, requests } from './request-model';
import { Response } from './response-model';

const fs = require('fs').promises;
const https = require('https');
const path = require('path');
const ObjectsToCsv = require('objects-to-csv');
const dotenv = require('dotenv').config();


const axiosInstance = axios.create();

axiosInstance.interceptors.request.use((config) => {
    config.headers['request-startTime'] = new Date().getTime();
    return config;
})

axiosInstance.interceptors.response.use((response) => {
    const currentTime = new Date().getTime();
    const startTime = response.config.headers['request-startTime'];
    response.headers['request-duration'] = currentTime - startTime;
    return response;
})



async function getLoadedRequestModel(requestModel) {
    let rawdata = await fs.readFile(path.resolve(__dirname, 'resources', requestModel.fileName));
    const loadedRequestModel = new LoadedRequestModel(requestModel.url, requestModel.requestName, JSON.stringify(JSON.parse(rawdata)));
    return loadedRequestModel;
}

function getOptions(loadedRequestModel) {
    const agent = new https.Agent({ rejectUnauthorized: false });
    return {
        headers: {
            'Content-Type': 'application',
            'Method': loadedRequestModel.requestName,
            'Channel': 'indl'
        },
        timeout: process.env.timeout,
        httpsAgent: agent
    };
}

async function request(requestModel) {
    const loadedRequestModel = await getLoadedRequestModel(requestModel);
    try {
        const { data, statusText, headers } = await axiosInstance.post(loadedRequestModel.url, loadedRequestModel.requestBody, getOptions(loadedRequestModel));
        requestModel.assertions?.forEach((assert)=> assert(data));
        return new Response(requestModel.url, requestModel.requestName, statusText, requestModel.returnCodeProvider(data) , headers['request-duration']);
    } catch (error) {
        console.error(`error in making request to ${requestModel.requestName} with error ${error.message}`);
        return new Response(requestModel.url, requestModel.requestName, error.code, "-1", "-1");
    }   
    
}


async function performRequests() {
    const requestPromises = requests.map(req => request(req));
    const responses = await Promise.all(requestPromises);
    console.table(responses);
    const csv = new ObjectsToCsv(responses);
    await csv.toDisk('./test.csv');
}

performRequests();



