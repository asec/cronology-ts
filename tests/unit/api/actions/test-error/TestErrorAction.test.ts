import {testServices} from "../../../../_services";
import CronologyError from "../../../../../src/lib/error/CronologyError";

it("Runs the action with default parameters", async () => {
    const action = testServices.resolve("api.action.testError");

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