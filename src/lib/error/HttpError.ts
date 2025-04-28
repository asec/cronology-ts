import {HttpStatus} from "../api/Http.js";
import CronologyError from "./CronologyError.js";

export default class HttpError extends CronologyError
{
    public constructor(
        message?: string,
        public status: HttpStatus = HttpStatus.Error
    )
    {
        super(message);
    }
}