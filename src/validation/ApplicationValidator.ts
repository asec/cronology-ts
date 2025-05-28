import IValidator from "../lib/validation/IValidator.js";
import Application from "../entities/Application.js";
import ValidationError from "../lib/error/ValidationError.js";
import IpValidator from "../lib/validation/IpValidator.js";
import Repository from "../lib/entities/Repository.js";

export default class ApplicationValidator implements IValidator
{
    public constructor(
        protected value: Application,
        protected repository: Repository<Application>
    )
    {}

    public async validateName()
    {
        const name = this.value.data("name");
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

        let [_, existingApp] = await repo.getOneByKey("name", name);
        if (existingApp !== null)
        {
            throw new ValidationError(
                "Invalid argument: 'app-name'. Must be unique."
            );
        }
    }

    public async validateIp(ip: string|null)
    {
        const values = ip !== null ? [ip] : this.value.data("ip");

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