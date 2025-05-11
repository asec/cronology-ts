import services from "../../../src/services";
import AppConfig from "../../../src/config/AppConfig";
import {EnvType} from "../../../src/lib/config/Config";

services.register(AppConfig, () => {
    const config = new AppConfig();
    config.setEnvironment(EnvType.Test);

    return config;
}, true);

export {services as testServices};