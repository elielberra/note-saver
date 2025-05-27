import log from "loglevel";
import { isProductionEnv } from "../lib/utils";

if (isProductionEnv()) {
  log.setLevel("silent");
} else {
  log.setLevel("debug");
}

export default log;
