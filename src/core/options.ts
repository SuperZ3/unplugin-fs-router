import path from "path";
import {
	DefaultReactExtensions,
	DefaultVueExtensions,
	PkgType,
	PkgTypes,
} from "../constants";
import { Options, UserOptions } from "../types";
import { isArrray } from "../utils";
import { existsSync, readFileSync } from "fs";

export const DefaultOptions: Options = {
	root: process.cwd(),
	rootPaths: ["src/pages"],
	extensions: DefaultReactExtensions,
	exclude: [],
	pkgType: PkgType.react,
};

// Scan package.json to verify project is React、Vue...
function resolvePkgType(
	userPkgType: PkgType.react | PkgType.vue | undefined,
	root: string
): PkgType {
	if (userPkgType) return userPkgType;

	const pkgJSONPath = path.resolve(root, "package.json");
	if (existsSync(pkgJSONPath)) {
		const pkgJSON = readFileSync(pkgJSONPath, { encoding: "utf-8" });
		const pkgContent = JSON.parse(pkgJSON);
		const dependencies = pkgContent?.dependencies ?? {};
		const devDependencies = pkgContent?.devDependencies ?? {};
		const peerDependencies = pkgContent?.peerDependencies ?? {};
		for (let t of PkgTypes.values()) {
			if (t in dependencies || t in devDependencies || t in peerDependencies) {
				return t;
			}
		}
	}
	return PkgType.react;
}

function mergerootPaths(path: undefined | string | string[]): string[] {
	if (path === undefined) {
		return DefaultOptions.rootPaths;
	}
	return isArrray(path) ? path : [path];
}

function resolveExtensions(
	pkgType: PkgType.react | PkgType.vue,
	extensions: string[] | undefined
): string[] {
	if (extensions !== undefined) {
		return extensions;
	}
	if (pkgType === PkgType.react) {
		return DefaultReactExtensions;
	} else if (pkgType === PkgType.vue) {
		return DefaultVueExtensions;
	}
	return DefaultOptions.extensions
}

export function getContextOptions(
	userOptions: UserOptions | undefined = {}
): Options {
	const root = userOptions?.root ?? DefaultOptions.root;
	const rootPaths = mergerootPaths(userOptions?.rootPaths);
	const pkgType = resolvePkgType(userOptions?.pkgType, root);
	const extensions = resolveExtensions(pkgType, userOptions?.extensions);
	return {
		...DefaultOptions,
		...userOptions,
		extensions,
		rootPaths,
		pkgType,
	};
}
