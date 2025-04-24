import Bean, {BeanContents} from "../datastructures/Bean.js";

export type EntityKeyType = string|number;

export class EntityProps<TBean extends Bean<BeanContents>> extends BeanContents
{
    public _id?: EntityKeyType = null;
    public data: TBean = undefined;
}

export default class Entity<TBean extends Bean<BeanContents>> extends Bean<EntityProps<TBean>>
{
    public constructor(object: TBean)
    {
        super(EntityProps<TBean>, {
            data: object
        });
    }
}