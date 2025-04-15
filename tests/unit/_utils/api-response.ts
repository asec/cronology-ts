import ApiResponse, {ApiResponseContent} from "../../../src/lib/api/action/response/ApiResponse";
import {expectBeanToEqual, expectEmptyBean} from "./bean";
import {expect} from "@jest/globals";
import {HttpStatus} from "../../../src/lib/api/Http";

export function expectEmptyResponse<TResponseContent extends ApiResponseContent>(r: ApiResponse<TResponseContent>) {
    expectEmptyBean(r);
    expect(r.status).toBe(HttpStatus.Ok);
}

export function expectResponseToEqual<
    TResponseContent extends ApiResponseContent
>(
    r: ApiResponse<TResponseContent>,
    contents: TResponseContent,
    status: HttpStatus = HttpStatus.Ok
) {
    expectBeanToEqual(r, contents);
    expect(r.status).toBe(status);
}