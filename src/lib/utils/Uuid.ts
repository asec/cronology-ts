import {v4 as uuidv4} from "uuid";

export type Uuid = () => string;

export default function uuid(): string
{
    return uuidv4();
}