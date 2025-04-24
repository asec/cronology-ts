import {HttpStatus} from "../api/Http";
import CronologyError from "./CronologyError";

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