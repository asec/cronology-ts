import Application, {ApplicationData} from "../Application.js";
import ServiceContainer from "../../lib/service/ServiceContainer.js";
import Factory from "../../lib/entities/Factory.js";

export default class ApplicationFactory extends Factory<Application>
{
    public constructor(services: ServiceContainer)
    {
        super(services);

        this.entityConstructor = Application;
        this.dataObjectConstructor = ApplicationData;
    }
}