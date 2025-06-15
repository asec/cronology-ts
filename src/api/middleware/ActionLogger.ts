import ActionMiddleware, {ActionMiddlewareNextFunction} from "../../lib/api/action/ActionMiddleware.js";
import ApiAction from "../../lib/api/action/ApiAction.js";
import {ApiResponseDTO} from "../../lib/api/action/response/ApiResponse.js";
import {ApiParamsDTO} from "../../lib/api/action/params/ApiActionParams.js";
import ILogger from "../../lib/logger/ILogger.js";
import {Uuid} from "../../lib/utils/Uuid.js";
import {ExpressContext} from "./ExpressRequestParser.js";
import {CliContext} from "../../cli/middleware/CliParamsParser.js";
import ServiceContainer from "../../lib/service/ServiceContainer.js";
import {ServiceBindingsFull} from "../../services/index.js";
import CronologyError from "../../lib/error/CronologyError.js";

export default class ActionLogger extends ActionMiddleware<Record<string, any>, ApiAction<ApiResponseDTO, ApiParamsDTO>>
{
    public constructor(
        protected services: ServiceContainer<ServiceBindingsFull>,
        protected uuidGenerator: Uuid
    )
    {
        super();
    }

    protected async do(
        action: ApiAction<ApiResponseDTO,ApiParamsDTO>,
        context: Record<string, any>,
        next: ActionMiddlewareNextFunction
    )
    {
        const actionId = this.uuidGenerator();
        let logger: ILogger = null;

        let contextName: string = "[unknown]";
        if (context instanceof ExpressContext)
        {
            logger = this.services.resolve("logger.api");
            contextName = context.constructor.name;
        }
        else if (context instanceof CliContext)
        {
            logger = this.services.resolve("logger.cli");
            contextName = context.constructor.name;
        }
        else if (context === undefined || context === null)
        {
            logger = this.services.resolve("logger", "test");
            contextName = "[test]";
        }

        if (logger === null)
        {
            throw new CronologyError(`Logger not defined for context: ${contextName}`);
        }

        await logger.info(`Entering action: ${action.constructor.name}`, {actionId, context: contextName});
        const result = await next();
        await logger.info(`Finished action: ${action.constructor.name}`, {actionId, result});

        return result;
    }

    protected async validate(action: ApiAction<ApiResponseDTO, ApiParamsDTO>, context: Record<string, any>): Promise<void>
    {
        return null;
    }

}