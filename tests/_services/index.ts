import {createServices, ServiceBindingsFull} from "../../src/services";
import AppConfig from "../../src/config/AppConfig";
import {EnvType} from "../../src/lib/config/Config";
import RsaKeypair_test from "../_mock/utils/RsaKeypair";
import ServiceContainer from "../../src/lib/service/ServiceContainer";
import TestFile from "../_mock/TestFile";
import * as path from "path";
import TestFileFactory from "../_mock/TestFileFactory";

export type ServiceBindingsTestFull = ServiceBindingsFull & {
    testFile: (fileName: string, uuid?: string) => TestFile,
    "factory.testFile": () => TestFileFactory,
    rsaKeystore: () => (keys: string[]) => string[]
}

export function createTestServices(): ServiceContainer<ServiceBindingsTestFull>
{
    const services: ServiceContainer<ServiceBindingsTestFull> = createServices();

    services.register("config", (envPath?: string) => {
        const config = new AppConfig(envPath);
        config.setEnvironment(EnvType.Test);

        return config;
    }, true);

    services.register("rsaKeypair", () => {
        const config = services.resolve("config");

        return new RsaKeypair_test(
            () => config.get("CONF_CRYPTO_APPKEYS")
        );
    });

    services.register("rsaKeystore", () => {
        return RsaKeypair_test.keyValues;
    });

    services.register("testFile", (fileName: string, uuid?: string) => {
        return new TestFile(
            services.resolve("uuid"),
            path.resolve("./tests/_files"),
            fileName,
            uuid
        );
    });

    services.register("factory.testFile", () => {
        return new TestFileFactory(
            services.resolve("uuid"),
            services.resolve("services")
        );
    });

    return services;
}

const testServices = createTestServices();

export {testServices};