interface CliErrorSpyInstances
{
    exitSpy: jest.SpyInstance,
    errorSpy: jest.SpyInstance
}

interface CliSuccessSpyInstances
{
    logSpy: jest.SpyInstance
}

export function spyOnCliError(showOutput: boolean = false): CliErrorSpyInstances
{
    const exitSpy = jest.spyOn(process, "exit").mockImplementation((errorCode: unknown) => {
        throw new Error(`process.exit ${errorCode}`);
    });
    const errorSpy = jest.spyOn(process.stderr, "write");
    if (!showOutput)
    {
        errorSpy.mockImplementation();
    }

    return {
        exitSpy,
        errorSpy
    };
}

export function spyOnCliSuccess(showOutput: boolean = false): CliSuccessSpyInstances
{
    const logSpy = jest.spyOn(console, "log");
    if (!showOutput)
    {
        logSpy.mockImplementation();
    }

    return {
        logSpy
    };
}