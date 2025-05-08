import {DataObject} from "../../../datastructures/DataObject.js";
import {DataEntity} from "../../../datastructures/DataEntity.js";

export class ApiParamsDTO extends DataObject
{}

export default abstract class ApiActionParams<TParamsDTO extends ApiParamsDTO> extends DataEntity<TParamsDTO>
{
    public abstract validate(): Promise<void> | void;
}