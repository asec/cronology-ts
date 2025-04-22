import BeanFactory from "../../lib/factory/BeanFactory";
import Application from "../Application";
import ServiceContainer from "../../lib/service/ServiceContainer";
import ApplicationRepository from "../repository/ApplicationRepository";

export default class ApplicationFactory extends BeanFactory<Application>
{
    public constructor(
        services: ServiceContainer
    )
    {
        super(Application, ApplicationRepository, services);
    }
}