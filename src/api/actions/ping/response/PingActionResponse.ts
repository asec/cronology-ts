import {ApiResponseDTO} from "../../../../lib/api/action/response/ApiResponse.js";

export default class PingActionResponseDTO extends ApiResponseDTO
{
    public version: string = null;
}