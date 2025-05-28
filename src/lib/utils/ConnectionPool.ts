export interface IDisconnectable
{
    disconnect(): Promise<void>
}

export default class ConnectionPool
{
    protected connections: Set<IDisconnectable> = new Set<IDisconnectable>();

    public add(connection: IDisconnectable)
    {
        if (this.connections.has(connection))
        {
            return;
        }

        this.connections.add(connection);
    }

    public async release(): Promise<void>
    {
        const promises = [];
        for (let connection of this.connections)
        {
            promises.push(connection.disconnect());
        }

        await Promise.all(promises);
    }
}