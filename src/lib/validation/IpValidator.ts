import IValidator from "./IValidator.js";
import * as net from "net";
import ValidationError from "../error/ValidationError.js";

export default class IpValidator implements IValidator
{
    public constructor(
        protected ip: string
    )
    {}

    public async validate()
    {
        if (!net.isIP(this.ip))
        {
            throw new ValidationError(`Invalid IP address: '${this.ip}'`);
        }
    }
}