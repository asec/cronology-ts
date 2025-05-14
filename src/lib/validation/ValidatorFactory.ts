import IValidator from "./IValidator.js";
import CronologyError from "../error/CronologyError.js";
import ApplicationValidator from "../../validation/ApplicationValidator.js";
import Application from "../../entities/Application.js";

type ValidatorCreator = (...args: any[]) => IValidator;

interface ValidatorTypes
{
    [key: string]: IValidator

    application: ApplicationValidator
}

interface ValidatorArguments
{
    [key: keyof ValidatorTypes]: [...any[]]

    application: [app: Application]
}

export default class ValidatorFactory
{
    private bindings: Map<keyof ValidatorTypes, ValidatorCreator>;

    public constructor()
    {
        this.bindings = new Map<keyof ValidatorTypes, ValidatorCreator>();
    }

    public register<Key extends keyof ValidatorTypes>(key: Key, factory: (...args: ValidatorArguments[Key]) => ValidatorTypes[Key])
    {
        this.bindings.set(key, factory);
    }

    public create<Key extends keyof ValidatorTypes>(key: Key, ...args: ValidatorArguments[Key]): ValidatorTypes[Key]
    {
        if (!this.bindings.has(key))
        {
            throw new CronologyError(`Can't create validator. Key '${key}' is not bound.`);
        }

        return this.bindings.get(key)(...args);
    }
}