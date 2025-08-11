export class TestSomething
{
    public constructor(protected name: string = "TestSomething") {}

    public hello(): string
    {
        return `Hello2 ${this.name}!`;
    }
}