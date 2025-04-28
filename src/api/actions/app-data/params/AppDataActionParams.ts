import ApiActionParams from "../../../../lib/api/action/params/ApiActionParams.js";
import {BeanContents} from "../../../../lib/datastructures/Bean.js";
import Application from "../../../../entities/Application.js";
import ValidationError from "../../../../lib/error/ValidationError.js";
import ApplicationFactory from "../../../../entities/factory/ApplicationFactory.js";
import HttpError from "../../../../lib/error/HttpError.js";
import {HttpStatus} from "../../../../lib/api/Http.js";

export class AppDataActionParamsContent extends BeanContents
{
    uuid: string = ""
}

export default class AppDataActionParams extends ApiActionParams<AppDataActionParamsContent>
{
    protected app: Application = null;

    public constructor(
        protected factory: ApplicationFactory,
        props?: AppDataActionParamsContent
    )
    {
        super(AppDataActionParamsContent, props);
    }

    public bind(props: AppDataActionParamsContent): void
    {
        this.set("uuid", String(props.uuid));
        this.app = null;
    }

    public getApp(): Application
    {
        return this.app;
    }

    public async validate(): Promise<void>
    {
        const uuid = this.get("uuid");

        if (!uuid || !uuid.trim())
        {
            throw new ValidationError("Invalid parameter: 'uuid'. Needs to be a valid application uuid.");
        }

        const result = await this.factory.repository().getByKey("uuid", uuid);
        if (result.size !== 1)
        {
            throw new HttpError(`The application does not exists: '${uuid}'`, HttpStatus.NotFound);
        }

        this.app = [...result.values()][0];
    }

}