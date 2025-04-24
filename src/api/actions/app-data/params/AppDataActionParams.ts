import ApiActionParams from "../../../../lib/api/action/params/ApiActionParams.js";
import {BeanContents, BeanProps} from "../../../../lib/datastructures/Bean.js";
import Application from "../../../../entities/Application.js";
import ValidationError from "../../../../lib/error/ValidationError.js";
import ApplicationFactory from "../../../../entities/factory/ApplicationFactory.js";
import HttpError from "../../../../lib/error/HttpError.js";
import {HttpStatus} from "../../../../lib/api/Http.js";

interface AppDataActionParamsContentRaw extends BeanProps
{
    uuid: string
    app?: Application
}

export class AppDataActionParamsContent extends BeanContents
{
    uuid: string = ""
    app?: Application = null
}

export default class AppDataActionParams extends ApiActionParams<AppDataActionParamsContent>
{
    public constructor(
        protected factory: ApplicationFactory,
        props?: AppDataActionParamsContent
    )
    {
        super(AppDataActionParamsContent, props);
    }

    public bind(props: AppDataActionParamsContentRaw): void
    {
        this.set("uuid", String(props.uuid));
        this.set("app", null);
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

        const app = [...result.values()][0];
        this.set("app", app);
    }

}