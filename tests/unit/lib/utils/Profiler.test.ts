import {beforeEach, expect, test} from "@jest/globals";
import Profiler from "../../../../src/lib/utils/Profiler";
import {type} from "os";

beforeEach(() => {
    Profiler.reset();
});

test("profiler", async () => {
    const checks = [
        200,
        5,
        80,
        750,
        1300,
    ];
    const maxDistance = 30;
    let totalWait = 0;
    let lastSegmentLength = 0;
    const now = Profiler.now();

    expect(Profiler.get()).toBe(-1);
    Profiler.start();
    expect(Profiler.mark()).toBe(0);

    await Profiler.wait();
    lastSegmentLength = Profiler.mark();
    expect(lastSegmentLength).toBeLessThanOrEqual(checks[0] + maxDistance);
    totalWait += lastSegmentLength;

    for (let i = 1; i < checks.length; i++)
    {
        const currentWaitLength = checks[i];
        await Profiler.wait(currentWaitLength);
        lastSegmentLength = Profiler.mark();
        expect(lastSegmentLength).toBeLessThanOrEqual(currentWaitLength + maxDistance);
        totalWait += lastSegmentLength;
    }

    expect(
        totalWait - checks.reduce((total, current) => total + current)
    ).toBeLessThanOrEqual(
        checks.length * maxDistance
    );

    Profiler.reset();
    expect(Profiler.get()).toBe(-1);

    await Profiler.wait();
    Profiler.start();
    expect(Profiler.get()).toBe(0);

    expect(typeof now).toBe("number");
    expect(now).toBeGreaterThan(0);
});