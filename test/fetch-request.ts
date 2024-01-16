import {Openapi3RequestConfig} from "../src/types";


const baseUrl = 'http://127.0.0.1:8080';
export type RequestOption = Omit<RequestInit, 'body'>;

export function request<Response>(config: Openapi3RequestConfig, {
    headers: _headers = {},
    ...option
}: RequestOption = {}) {
    const {
        url,
        method,
        params = {},
        headers = {},
        data,
        responseType,
        withCredentials = false
    } = config;
    const urlData = new URL(url, baseUrl);
    urlData.searchParams
    let body
    switch (headers['content-type']) {
        case 'multipart/form-data': {
            body = new FormData();
            Object.keys(data).forEach(key => {
                body.append(key, data[key]);
            });
            break;
        }
        case 'application/json': {
            body = JSON.stringify(data);
            break;
        }
        default: {
            // application/x-www-form-urlencoded 或其它格式
            body = new URLSearchParams(Object.entries(data)).toString();
            break;
        }
    }
    Object.keys(params ?? {}).forEach(key => {
        urlData.searchParams.append(key, params[key]);
    });
    return fetch(urlData, {
        method,
        headers: {...headers, ..._headers},
        body,
        ...option,
        credentials: withCredentials ? 'include' : undefined,
    }).then(res => {
        if (responseType === 'json') {
            return res.json() as Response
        }
        if (responseType === 'blob') {
            return res.blob() as Response;
        }
        if (responseType === 'arraybuffer') {
            return res.arrayBuffer() as Response;
        }
        return res.text() as Response;
    })
}
