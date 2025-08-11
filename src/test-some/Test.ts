import {TestSomething} from "./TestSomething";

export class Test extends TestSomething
{
    public hello(): string
    {
        this.name = "Test2";
        return super.hello();
    }

    public foo(): number
    {
        return 5;
    }
}