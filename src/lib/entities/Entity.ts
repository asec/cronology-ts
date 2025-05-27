import {DataObject} from "../datastructures/DataObject.js";
import {DataEntity} from "../datastructures/DataEntity.js";
import ServiceContainer from "../service/ServiceContainer.js";
import CronologyError from "../error/CronologyError.js";

export default abstract class Entity<TData extends DataObject> extends DataEntity<TData>
{
    private _services: ServiceContainer;

    public inject(services: ServiceContainer): void
    {
        this._services = services;
    }

    protected services(): ServiceContainer
    {
        if (this._services === undefined)
        {
            throw new CronologyError(
                `There is no service container bound to this entity: '${this.constructor.name}'. ` +
                `You can inject one with the 'inject' method.`
            );
        }

        return this._services;
    }

    public async cleanup(): Promise<void>
    {}
}