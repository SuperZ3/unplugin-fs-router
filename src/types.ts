import { type FSWatcher } from "chokidar";
import { PkgType } from "./constants";
import { RouteTree } from "./core/routeTree";

// TODO: Options should be nested and allow user custom option prop
export interface Options {
	root: string;
	rootPaths: string[];
	extensions: string[];
	exclude: string[];
	pkgType: PkgType.react | PkgType.vue;
}

export interface UserOptions extends Partial<Options> {
	extensions?: string[];
	exclude?: string[];
	pkgType?: PkgType.react | PkgType.vue;
}

export enum TreeOperation {
	Insert = "Insert",
	Update = "Update",
	Remove = "Remove"
}

export enum SegementType {
    Base = "Base",
    Children = "Children",
    Dynamic = "Dynamic",
    CatchAll = "CatchAll",
    Group = "Group",
}

export type RoutesMap = Map<string, RouteTree>

export type WatcherMap = Map<string, FSWatcher>

export type GenCode = {
	(options: Options, routeEntries: RoutesMap): void;
};

export enum TreeNodeType {
	Basic = "Basic",
	Group = "Group",
	Dynamic = "Dynamic",
	CatchAll = "CatchAll",
	Root = "Root",
}

export type TreeNodeValueKeys = keyof TreeNodeValue;

export interface TreeNodeValue {
	routePath: string;
	exportName: string;
	filePath: string;
}


