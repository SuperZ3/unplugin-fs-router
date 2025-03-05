import path from "path";
import { VIRTUAL_ID_PREFIX } from "./constants";
import { Options } from "./types";
import { existsSync } from "fs";

export function isArrray(arg: any) {
	return Array.isArray(arg);
}

export function genVirtualId(id: string) {
	return VIRTUAL_ID_PREFIX + id;
}

export function getVirtualId(id: string) {
	return id.substring(VIRTUAL_ID_PREFIX.length);
}

export function warn(
	msg: string,
	type: "warn" | "error" | "debug" = "warn"
): void {
	console[type](`⚠️  [unplugin-fs-routes]: ${msg}`);
}

export function routesOutputDir(opt: Options, rootPath: string) {
	const pageDir = path.dirname(rootPath);
	let output = path.resolve(opt.root, pageDir);
	if (existsSync(output)) {
		return output;
	}
	return opt.root;
}

export function isString(str: any) {
	return typeof str === "string";
}
