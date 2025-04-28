import Bean, {BeanContents, BeanProps} from "../lib/datastructures/Bean.js";
import {v4 as uuidv4} from "uuid";
import RsaKeypair from "../lib/utils/RsaKeypair.js";
import ServiceContainer from "../lib/service/ServiceContainer.js";
import CronologyError from "../lib/error/CronologyError.js";

export class ApplicationProps extends BeanContents
{
    public uuid?: string = undefined;
    public name: string = undefined;
    public ip?: string[] = [];
}

export default class Application extends Bean<ApplicationProps>
{
    protected rsa: RsaKeypair;

    public constructor(props?: ApplicationProps)
    {
        super(ApplicationProps, props);

        if (this.get("uuid") === undefined)
        {
            this.generateUuid();
        }
    }

    public inject(services: ServiceContainer)
    {
        super.inject(services);

        this.rsa = this.services.resolve(RsaKeypair);
    }

    public generateUuid(): void
    {
        this.set("uuid", uuidv4())
    }

    public async generateKeys(forced: boolean = false): Promise<void>
    {
        this.rsa.setName(this.get("uuid"));
        if (!forced && await this.rsa.exists())
        {
            throw new CronologyError(
                `Can't regenerate rsa keys. They already exists for application:` +
                `'${this.get("name")} (${this.get("uuid")})'`
            );
        }

        await this.rsa.generate();
    }

    public async keys(): Promise<string[]>
    {
        this.rsa.setName(this.get("uuid"));
        if (!await this.rsa.exists())
        {
            return [];
        }

        return this.rsa.keys();
    }

    public addIp(ip: string)
    {
        const ips = this.get("ip") ?? [];
        if (ips.indexOf(ip) > -1)
        {
            return;
        }

        ips.push(ip);
    }

    public removeIp(ip: string)
    {
        const ips = this.get("ip") ?? [];
        ips.splice(ips.indexOf(ip), 1);
    }
}