import Repository from "../../lib/entities/Repository";
import Application from "../Application";

export default class ApplicationRepository extends Repository<Application>
{
    protected initialise(): void
    {
        this.beanClass = Application;
    }
}