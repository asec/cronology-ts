import {HttpStatus} from "../../Http.js";
import {DataObject} from "../../../datastructures/DataObject.js";
import {DataEntity} from "../../../datastructures/DataEntity.js";

export class ApiResponseDTO extends DataObject
{
    public success: boolean = true;
}

export default class ApiResponse<TResponseDTO extends ApiResponseDTO> extends DataEntity<TResponseDTO>
{
    public status: HttpStatus = HttpStatus.Ok;
}