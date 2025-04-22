import IValidator from "./IValidator";
import * as net from "net";
import ValidationError from "../error/ValidationError";

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