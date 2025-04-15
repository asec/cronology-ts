import Api from "../lib/api/Api";
import {HttpMethod} from "../lib/api/Http";
import PingAction from "./actions/ping/PingAction";
import WaitAction from "./actions/wait/WaitAction";
import WaitActionParams from "./actions/wait/params/WaitActionParams";

const {GET} = HttpMethod;

Api.addRoute(GET, "/", PingAction);
Api.addRoute(GET, "/wait", WaitAction, WaitActionParams);