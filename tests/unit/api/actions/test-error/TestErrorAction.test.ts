import {testServices} from "../../../_services";
import TestErrorAction from "../../../../../src/api/actions/test-error/TestErrorAction";
import CronologyError from "../../../../../src/lib/error/CronologyError";

it("Runs the action with default parameters", async () => {
    const action = testServices.resolve(TestErrorAction);

    try
    {
        await action.execute(null);
        expect(true).toBe(false);
    }
    catch (error: unknown)
    {
        expect(error).toBeInstanceOf(CronologyError);
        expect((error as CronologyError).message).toMatch(/[tT]eszt error/);
    }
});