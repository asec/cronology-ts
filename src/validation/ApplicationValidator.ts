import IValidator from "../lib/validation/IValidator";
import Application from "../entities/Application";
import ValidationError from "../lib/error/ValidationError";
import IpValidator from "../lib/validation/IpValidator";
import Repository from "../lib/entities/Repository";

export default class ApplicationValidator implements IValidator
{
    public constructor(
        protected value: Application,
        protected repository: Repository<Application>
    )
    {}

    public async validateName()
    {
        const name = this.value.get("name");
        const regex = /^[a-z0-9_-]{3,}$/;
        const match = regex.exec(name);
        const repo = this.repository;

        if (match === null)
        {
            throw new ValidationError(
                "Invalid argument: 'app-name'. Must be unique, must only contain lowercase letters, " +
                "numbers and the following symbols: '-', '_'. Must be at least 3 characters long."
            );
        }

        if ((await repo.getByKey("name", name)).size > 0)
        {
            throw new ValidationError(
                "Invalid argument: 'app-name'. Must be unique."
            );
        }
    }

    public async validateIp(ip: string|null)
    {
        const values = ip !== null ? [ip] : this.value.get("ip");

        for (let i = 0; i < values.length; i++)
        {
            const validator = new IpValidator(values[i]);
            await validator.validate();
        }
    }

    public async validate()
    {
        await this.validateName();
    }
}