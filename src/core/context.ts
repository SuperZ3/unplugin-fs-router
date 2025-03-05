import path from "path";
import { existsSync } from "fs";
import { warn } from "../utils";
import fg from "fast-glob";
import genCode from "./genCode";
import { Options, RoutesMap, WatcherMap } from "../types";
import { watch } from "chokidar";
import { RouteTree } from "./routeTree";

interface FolderInfo {
	root: string;
	cwd: string;
	filePattern: string;
	exclude: string[];
}

class Context {
	options: Options;
	routesMap: RoutesMap;
	watcherMap: WatcherMap;
	constructor(options: Options) {
		this.options = options;
		this.routesMap = new Map();
		this.watcherMap = new Map();
	}

	async start() {
		const { root, rootPaths, exclude } = this.options;

		const entries = rootPaths.filter((rootPath: string) => {
			const entry = path.join(root, rootPath);
			if (!existsSync(entry)) {
				warn(`Root path ${entry} not exist, will be ignored`);
				return false;
			}
			return entry;
		});

		if (entries.length === 0) {
			warn(`No avaliable rootPaths here!!!`);
			return;
		}

		await Promise.all(
			entries
				.map((entryPath) => this.resolveFolder(entryPath))
				.map(async (folderInfo) => {
					this.routesMap.set(folderInfo.cwd, new RouteTree(folderInfo.cwd, this.options));

					this.watcherMap.set(folderInfo.cwd, this.setupWatch(folderInfo));

					return fg(folderInfo.filePattern, {
						ignore: exclude,
						onlyFiles: true,
						cwd: folderInfo.cwd,
					}).then((filePathes) => {
						return Promise.all(
							filePathes.map((filePath) => {
								// console.log(filePath)
								this.addPage(folderInfo.cwd, filePath)
							})
						);
					})
					// .then(() => {
					// 	const tree = this.routesMap.get(folderInfo.cwd)
					// 	tree?.logTree()
					// })
				})
		);
	}

	setupWatch(folderInfo: FolderInfo) {
		const watcher = watch(".", {
			cwd: folderInfo.cwd,
			ignored: (filePath, stats) => {
				// we don't care dir change or file doesn't match filePattern
				if(stats?.isDirectory() || !folderInfo.exclude.includes(path.extname(filePath))) {
					return true;
				}
				return false;
			},
		});

		watcher.on("add", (path) => {
			console.log(`Add ${path}`);
			this.addPage(folderInfo.cwd, path);
		});
		// watcher.on("change", (path) => {
		// 	console.log(`Change ${path}`);
		// 	this.updatePage(folderInfo.cwd, path);
		// });
		watcher.on("unlink", (path) => {
			console.log(`Unlink ${path}`);
			this.removePage(folderInfo.cwd, path);
		});
		return watcher;
	}

	resolveFolder(entryPath: string): FolderInfo {
		return {
			cwd: entryPath,
			root: this.options.root,
			filePattern: `**/*{${this.options.extensions}}`,
			exclude: this.options.exclude
		};
	}

	genRoutes() {
		return genCode(this.options, this.routesMap);
	}

	stopWatch() {
		this.watcherMap.forEach((watcher) => {
			watcher.close();
		});
	}

	async addPage(rootPath: string, filePath: string) {
		const rootTree = this.routesMap.get(rootPath);
		if (rootTree === undefined) {
			warn(`Can't add page ${filePath}, check if ${rootPath} exists`)
			return
		}
		rootTree.addFile(filePath);
	}

	// updatePage(rootPath: string, filePath: string) {
	// 	const rootTree = this.routesMap.get(rootPath);
	// 	if (rootTree === undefined) {
	// 		warn(`Can't update page ${filePath}, check if ${rootPath} exists`)
	// 		return
	// 	}

	// 	rootTree.resolveFilePath(filePath)
	// }

	removePage(rootPath: string, filePath: string) {
		const rootTree = this.routesMap.get(rootPath);
		if (rootTree === undefined) {
			warn(`Can't remove page ${filePath}, check if ${rootPath} exists`)
			return
		}
		rootTree.removeFile(filePath)
	}

	logTree(rootPath: string) {
		this.routesMap.get(rootPath)?.logTree();
	}
}

export default Context;
