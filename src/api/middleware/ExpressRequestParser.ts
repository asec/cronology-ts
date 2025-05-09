import ApiAction, {Middleware} from "../../lib/api/action/ApiAction.js";
import express from "express";
import {ApiResponseDTO} from "../../lib/api/action/response/ApiResponse.js";
import {ApiParamsDTO} from "../../lib/api/action/params/ApiActionParams.js";

export type ExpressRequestParser = Middleware<express.Request, ApiAction<ApiResponseDTO, ApiParamsDTO>>;