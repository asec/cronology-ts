import {testServices} from "../../../_services";
import BadResponseAction from "../../../../../src/api/actions/bad-response/BadResponseAction";
import {HttpStatus} from "../../../../../src/lib/api/Http";
import ApiResponse from "../../../../../src/lib/api/action/response/ApiResponse";
import ApiErrorResponse from "../../../../../src/lib/api/action/response/ApiErrorResponse";

it("Runs the action with default parameters", async () => {
    const action = testServices.resolve(BadResponseAction);
    const response = await action.execute(null);

    expect(response).toBeInstanceOf(ApiResponse);
    expect(response).toBeInstanceOf(ApiErrorResponse);
    expect(response.status).toBe(HttpStatus.Unprocessable);
    expect(response.data("success")).toBe(false);
    expect((response as ApiErrorResponse).data("error")).toMatch(/invalid response/);
});