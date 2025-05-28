import ValidationError from "../error/ValidationError.js";
import path from "path";
import fs from "fs";
import crypto from "crypto";

export default class RsaKeypair
{
    protected path: string;

    public constructor(
        protected pathGenerator: () => string,
        protected name?: string
    )
    {}

    public setName(name: string): void
    {
        this.name = name;
    }

    protected initialise(): void
    {
        this.path = this.pathGenerator();
    }

    protected validate(): void
    {
        this.initialise();
        if (!this.name)
        {
            throw new ValidationError(`You need to set a name for the keypair in '${this.constructor.name}'`);
        }
    }

    public async exists(): Promise<boolean>
    {
        this.validate();
        const keys = this.keys();

        try
        {
            await fs.promises.access(keys[0], fs.promises.constants.R_OK);
            await fs.promises.access(keys[1], fs.promises.constants.R_OK);

            return true;
        }
        catch (e)
        {
            return false;
        }
    }

    public keys(): string[]
    {
        this.validate();
        return [
            path.resolve(this.path + "/" + this.name + "-private.pem"),
            path.resolve(this.path + "/" + this.name + "-public.pem")
        ];
    }

    public async generate(): Promise<void>
    {
        this.validate();
        const keyPath = path.resolve(this.path);
        const keys = this.keys();

        try
        {
            await fs.promises.mkdir(keyPath, {
                recursive: true
            });
        }
        catch (e)
        {}

        const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
            modulusLength: 2048
        });

        fs.writeFileSync(keys[0], privateKey.export({
            type: "pkcs8",
            format: "pem",
        }));

        fs.writeFileSync(keys[1], publicKey.export({
            type: "spki",
            format: "pem",
        }));
    }

    public async delete(): Promise<void>
    {
        await Promise.all(this.keys().map(file => fs.promises.rm(file)));
    }
}