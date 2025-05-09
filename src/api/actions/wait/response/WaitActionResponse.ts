import {ApiResponseDTO} from "../../../../lib/api/action/response/ApiResponse.js";

export default class WaitActionResponseDTO extends ApiResponseDTO
{
    public waited: number = null;
}