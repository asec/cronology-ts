import {ServiceRegistrar} from "./index.js";
import Cli from "../lib/cli/Cli.js";
import PackageInfo from "../lib/utils/PackageInfo.js";

const registerServicesCliBasics: ServiceRegistrar = (services, interfaces) => {
    const {IProgram} = interfaces;

    services.register(Cli, () => {
        return new Cli(
            services.resolve(IProgram),
            services.resolve(PackageInfo)
        );
    });
};

export default registerServicesCliBasics;