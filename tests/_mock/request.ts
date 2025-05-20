import {Body, createRequest, MockRequest, Params, Query, RequestMethod, Headers} from "node-mocks-http";
import {Request} from "express";

export function mockRequest<TRequest extends Request>(
    method: RequestMethod,
    endpoint: string,
    ip: string,
    query: Query = {},
    body: Body = {},
    params: Params = {},
    headers: Headers = {}
): MockRequest<TRequest>
{
    headers = headers || {};
    headers["Crnlg-Mock"] = "true";

    return createRequest<TRequest>({
        method,
        url: `https://localhost:7331${endpoint}`,
        ip,
        query,
        body,
        params,
        headers
    });
}