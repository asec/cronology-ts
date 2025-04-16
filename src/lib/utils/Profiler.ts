export default class Profiler
{
    protected sequences: number[] = [];

    public constructor()
    {
        this.start();
    }

    public start()
    {
        const now = this.now();
        this.reset();
        this.sequences.push(now);
    }

    public reset()
    {
        this.sequences = [];
    }

    public now(): number
    {
        return (new Date()).getTime();
    }

    public mark(): number
    {
        if (!this.sequences.length)
        {
            this.start();
            return -1;
        }

        const timeDiff = this.getTimeSince();
        this.sequences.push(this.now());
        return timeDiff;
    }

    private getTimeSince(sinceFirstOne: boolean = false): number
    {
        const now = this.now();
        const prev = this.sequences[sinceFirstOne ? 0 : this.sequences.length - 1];

        return now - prev;
    }

    public get(showTotal: boolean = false): number
    {
        if (!this.sequences.length)
        {
            return -1;
        }

        return this.getTimeSince(showTotal);
    }

    public async wait(ms: number = 200)
    {
        await new Promise(resolve => setTimeout(resolve, ms));

        return true;
    }
}