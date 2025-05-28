import {DataFields, DataObject} from "../lib/datastructures/DataObject.js";
import Entity from "../lib/entities/Entity.js";
import RsaKeypair from "../lib/utils/RsaKeypair.js";
import CronologyError from "../lib/error/CronologyError.js";
import {Uuid} from "../lib/utils/Uuid.js";
import ServiceContainer from "../lib/service/ServiceContainer.js";

export class ApplicationData extends DataObject
{
    public uuid: string;
    public name: string;
    public ip: string[] = [];
}

export default class Application extends Entity<ApplicationData>
{
    protected rsa: RsaKeypair;
    protected uuidGenerator: Uuid;

    public constructor(data: ApplicationData)
    {
        super(data);
    }

    public inject(services: ServiceContainer)
    {
        super.inject(services);

        if (this.data("uuid") === null || this.data("uuid") === undefined)
        {
            this.generateUuid();
        }
    }

    public bind(data: Partial<{ dataObj: Partial<DataFields<ApplicationData>> } & DataFields<this>> & {
        dataObj?: Partial<DataFields<ApplicationData>>
    }) {
        super.bind(data);

        if (this.uuidGenerator !== undefined && (this.data("uuid") === null || this.data("uuid") === undefined))
        {
            this.generateUuid();
        }
    }

    public generateUuid()
    {
        if (this.uuidGenerator === undefined)
        {
            this.uuidGenerator = this.services().resolve("uuid");
        }

        this.setData("uuid", this.uuidGenerator());
    }

    public async generateKeys(forced: boolean = false): Promise<void>
    {
        if (this.rsa === undefined)
        {
            this.rsa = this.services().resolve("rsaKeypair");
        }

        this.rsa.setName(this.data("uuid"));
        if (!forced && await this.rsa.exists())
        {
            throw new CronologyError(
                `Can't regenerate rsa keys. They already exists for application:` +
                `'${this.data("name")} (${this.data("uuid")})'`
            );
        }

        await this.rsa.generate();
    }

    public async keys(): Promise<string[]>
    {
        if (this.rsa === undefined)
        {
            this.rsa = this.services().resolve("rsaKeypair");
        }

        this.rsa.setName(this.data("uuid"));
        if (!await this.rsa.exists())
        {
            return [];
        }

        return this.rsa.keys();
    }

    public addIp(ip: string)
    {
        const ips = this.data("ip") ?? [];
        if (ips.indexOf(ip) > -1)
        {
            return;
        }

        ips.push(ip);
    }

    public removeIp(ip: string)
    {
        const ips = this.data("ip") ?? [];
        const index = ips.indexOf(ip);
        if (index === -1)
        {
            return;
        }

        ips.splice(index, 1);
    }

    public async cleanup(): Promise<void>
    {
        if (this.rsa === undefined)
        {
            this.rsa = this.services().resolve("rsaKeypair");
        }

        this.rsa.setName(this.data("uuid"));
        await this.rsa.delete();
    }
}