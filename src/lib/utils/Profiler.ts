class Profiler
{
    protected static sequences: number[] = [];

    public static start()
    {
        const now = this.now();
        this.reset();
        this.sequences.push(now);
    }

    public static reset()
    {
        this.sequences = [];
    }

    public static now(): number
    {
        return (new Date()).getTime();
    }

    public static mark(): number
    {
        if (!this.sequences.length)
        {
            this.start();
            return -1;
        }

        const timeDiff = this.#getTimeSince();
        this.sequences.push(this.now());
        return timeDiff;
    }

    static #getTimeSince(sinceFirstOne: boolean = false): number
    {
        const now = this.now();
        const prev = this.sequences[sinceFirstOne ? 0 : this.sequences.length - 1];

        return now - prev;
    }

    public static get(showTotal: boolean = false): number
    {
        if (!this.sequences.length)
        {
            return -1;
        }

        return this.#getTimeSince(showTotal);
    }

    public static async wait(ms: number = 200)
    {
        await new Promise(resolve => setTimeout(resolve, ms));

        return true;
    }
}

export default Profiler;