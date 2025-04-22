import BeanFactory from "../../lib/factory/BeanFactory";
import Application from "../Application";
import ServiceContainer from "../../lib/service/ServiceContainer";
import ApplicationRepository from "../repository/ApplicationRepository";
import ValidationError from "../../lib/error/ValidationError";
import ApplicationValidator from "../../validation/ApplicationValidator";

export default class ApplicationFactory extends BeanFactory<Application>
{
    public constructor(
        services: ServiceContainer
    )
    {
        super(Application, ApplicationRepository, services);
    }

    public validator(entity: Application): ApplicationValidator
    {
        return new ApplicationValidator(
            entity,
            this.repository()
        );
    }
}