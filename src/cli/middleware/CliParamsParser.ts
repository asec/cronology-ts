import ApiAction, {Middleware} from "../../lib/api/action/ApiAction.js";
import {ApiResponseDTO} from "../../lib/api/action/response/ApiResponse.js";
import {ApiParamsDTO} from "../../lib/api/action/params/ApiActionParams.js";

export type CliParamsParser = Middleware<unknown[], ApiAction<ApiResponseDTO, ApiParamsDTO>>