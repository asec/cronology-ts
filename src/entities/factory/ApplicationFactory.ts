import BeanFactory from "../../lib/factory/BeanFactory.js";
import Application from "../Application.js";
import ServiceContainer from "../../lib/service/ServiceContainer.js";
import ApplicationRepository from "../repository/ApplicationRepository.js";
import ApplicationValidator from "../../validation/ApplicationValidator.js";

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