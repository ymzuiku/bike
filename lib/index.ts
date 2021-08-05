/* c8 ignore start */
import sourceMapSupport from "source-map-support";
import { getConfig, Conf } from "./getConfig";
import { bike } from "./bike";
import { test } from "./test";

sourceMapSupport.install();

export type { Conf };
export { getConfig, bike, test };
