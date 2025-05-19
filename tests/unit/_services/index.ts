import {createServices} from "../../../src/services";
import AppConfig from "../../../src/config/AppConfig";
import {EnvType} from "../../../src/lib/config/Config";
import RsaKeypair from "../../../src/lib/utils/RsaKeypair";
import RsaKeypair_test from "../_mock/utils/RsaKeypair";
import ServiceContainer from "../../../src/lib/service/ServiceContainer";

export function createTestServices(): ServiceContainer
{
    const services = createServices();

    services.register(AppConfig, () => {
        const config = new AppConfig();
        config.setEnvironment(EnvType.Test);

        return config;
    }, true);

    services.register(RsaKeypair, () => {
        const config = services.resolve(AppConfig);

        return new RsaKeypair_test(
            () => config.get("CONF_CRYPTO_APPKEYS")
        );
    });

    return services;
}

const testServices = createTestServices();

export {testServices};