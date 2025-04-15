import {expect, test} from "@jest/globals";
import ApiResponse, {ApiResponseContent} from "../../../../../../src/lib/api/action/response/ApiResponse";
import {expectEmptyResponse, expectResponseToEqual} from "../../../../_utils/api-response";
import {HttpStatus} from "../../../../../../src/lib/api/Http";

test("Data", () => {
    const resultPropsSuccess: ApiResponseContent = {
        success: true
    };
    const resultPropsFailure: ApiResponseContent = {
        success: false
    };

    let result = new ApiResponse(ApiResponseContent);
    expectEmptyResponse(result);

    expect(result.get("success")).toBeUndefined();

    result = new ApiResponse(ApiResponseContent, resultPropsSuccess);
    expectResponseToEqual(result, resultPropsSuccess, HttpStatus.Ok);

    result = new ApiResponse(ApiResponseContent, resultPropsFailure, HttpStatus.Error);
    expectResponseToEqual(result, resultPropsFailure, HttpStatus.Error);

    expect(result.set("success", true)).toBe(true);
    expectResponseToEqual(result, resultPropsSuccess, HttpStatus.Error);

    result.status = HttpStatus.NotFound;
    expectResponseToEqual(result, resultPropsSuccess, HttpStatus.NotFound);

    expect(result.setAll(resultPropsFailure)).toBe(true);
    expectResponseToEqual(result, resultPropsFailure, HttpStatus.NotFound);

    expect(result.get("success")).toBe(false);
});