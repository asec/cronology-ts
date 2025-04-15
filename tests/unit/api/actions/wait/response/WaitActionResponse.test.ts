import {test} from "@jest/globals";
import WaitActionResponse, {
    WaitActionResponseContent
} from "../../../../../../src/api/actions/wait/response/WaitActionResponse";
import {expectEmptyResponse, expectResponseToEqual} from "../../../../_utils/api-response";
import {HttpStatus} from "../../../../../../src/lib/api/Http";

test("Data", () => {
    const waitResponseProps: WaitActionResponseContent = {
        success: true,
        waited: 10
    };

    let response = new WaitActionResponse();
    expectEmptyResponse(response);

    response = new WaitActionResponse(waitResponseProps);
    expectResponseToEqual(response, waitResponseProps);

    response = new WaitActionResponse(waitResponseProps, HttpStatus.Error);
    expectResponseToEqual(response, waitResponseProps, HttpStatus.Error);
});