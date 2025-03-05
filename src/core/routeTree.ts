import { warn } from "console";
import TreeNode from "./treeNode";
import {
	Options,
	TreeNodeType,
	TreeNodeValue,
	TreeNodeValueKeys,
} from "../types";
import path from "path";
import { existsSync, statSync } from "fs";
import { isString } from "../utils";

export class RouteTree {
	rootNode: TreeNode | null;
	routesMap: Map<string, TreeNode>;
	options: Options;
	rootPath: string;
	exportName: string
	constructor(filePath: string, options: Options) {
		this.options = options;
		this.rootPath = filePath;
		this.rootNode = new TreeNode(null, filePath);
		this.routesMap = new Map().set(filePath, this.rootNode);
		this.exportName = "Index"
	}

	addFile(filePath: string) {
		if (this.rootNode === null) {
			warn(`Entry ${this.rootPath} is non accessable!!!`);
			return;
		}

		const segments = filePath.split(path.sep);
		if (segments.length <= 0) {
			warn(`File ${filePath} is invalid`);
			return;
		}
		let lastNode: TreeNode = this.rootNode;
		let segmentPath = "";
		// TODO: maybe change to dfs?
		segments.map(async (segment) => {
			segmentPath = this.segmentAbsolutePath(segmentPath, segment);
			if (existsSync(segmentPath)) {
				const stats = statSync(segmentPath);
				if (stats.isDirectory()) {
					const { nodeType, parsedSegment } = TreeNode.ParseSegment(segment);

					// Group route
					if (nodeType === TreeNodeType.Group) {
						return;
					}

					const segmentRoute = TreeNode.GetNodeRoutePath(
						lastNode,
						parsedSegment
					);
					let segmentNode = this.routesMap.get(segmentRoute);
					if (!segmentNode) {
						segmentNode = new TreeNode(lastNode, segmentPath);
						lastNode.appendChild(segmentNode);
						this.routesMap.set(segmentRoute, segmentNode);
					}

					lastNode = segmentNode;
				} else if (stats.isFile()) {
					// Index route
					if (segment.startsWith("index")) {
						// TODO: it seems can combine with under logic
						const segmentNode = new TreeNode(lastNode, segmentPath);
						segmentNode.nodeValue.exportName = this.genExportName()
						lastNode.appendChild(segmentNode);
						this.routesMap.set(segmentNode.nodeValue.routePath, segmentNode);
					} else {
						// Leaf route: Dynamic、CatchAll、Base
						const { nodeType, parsedSegment } = TreeNode.ParseSegment(segment);
						const segmentRoute = TreeNode.GetNodeRoutePath(
							lastNode,
							parsedSegment
						);
						const segmentRouteNode = this.routesMap.get(segmentRoute);
						const segmentNode = new TreeNode(lastNode, segmentPath);
						segmentNode.nodeValue.exportName = this.genExportName()
						if (!segmentRouteNode) {
							lastNode.appendChild(segmentNode);
							this.routesMap.set(segmentNode.nodeValue.routePath, segmentNode);
						} else {
							lastNode.nodeValue.routePath = segmentNode.nodeValue.routePath;
							lastNode.nodeValue.filePath = segmentNode.nodeValue.filePath;
							lastNode.nodeValue.exportName = segmentNode.nodeValue.exportName
						}
					}
				}
			}
		});
	}

	genExportName() {
		const nameArr = this.exportName.split("_")
		const suffix = parseInt(nameArr?.[1]) || 0
		const name = nameArr[0]
		const exportName = name + "_" + suffix
		this.exportName = name + "_" + (suffix + 1)
		return exportName
	}

	segmentAbsolutePath(...relativePath: string[]) {
		return path.resolve(this.rootPath, ...relativePath);
	}

	updateFile(filePath: string, newNodeValue: Partial<TreeNodeValue>) {
		const target = this.getFile(filePath);
		if (!target) {
			warn(`File ${filePath} not found`);
			return;
		}
		Object.keys(newNodeValue).map((key) => {
			if (key in target.nodeValue) {
				(target.nodeValue as any)[key] =
					newNodeValue[key as keyof TreeNodeValue];
			}
		});
	}

	removeFile(filePath: string) {
		const target = this.getFile(filePath);
		if (!target) {
			warn(`File ${filePath} not found`);
			return;
		}

		if (TreeNode.isRoot(target)) {
			this.routesMap = new Map;
			this.rootNode = null;
			return;
		}

		const segments = filePath.split(path.sep);
		if (segments.length <= 0) {
			warn(`File ${filePath} is invalid`);
			return;
		}

		// delete all children
		const stack = [target];
		while (stack.length > 0) {
			const node = stack.pop();
			if (node) {
				stack.push(...node.children!);
				this.routesMap.delete(node.nodeValue.routePath);
			}
		}
		const parent = target.parent;
		if (parent) {
			parent.removeChild(target);
		}
	}

	getFile(filePath: string) {
		return this.routesMap.get(filePath);
	}

	logTree() {
		if (this.rootNode !== null) {
			console.log(
				printTree(this.rootNode, 0, "routePath", "filePath", "exportName")
			);
		}
	}

	isFileSegment(segmentPath: string) {
		const extname = path.extname(segmentPath);
		return extname !== "" && this.options.extensions.includes(extname);
	}
}

function printTree(
	tree: TreeNode,
	depth = 0,
	...props: Partial<keyof TreeNodeValue>[]
): string {
	const indent = "  ".repeat(depth * 2);

	const propStr = Object.entries(tree.nodeValue || {})
		.filter(
			([key]) =>
				props.length === 0 || props.includes(key as keyof TreeNodeValue)
		)
		.map(([key, value]) => `${indent}  ${key}: ${isString(value) ? `"${value}"` : value}`)
		.join(",\n");

	// 生成子节点字符串
	const childrenStr = tree.children
		?.map((child) => printTree(child, depth + 1, ...props))
		.join(",\n");

	return `${indent}{\n${propStr}${
		childrenStr ? `,\n${indent}  children: [\n${childrenStr}\n  ${indent}]` : ""
	}\n${indent}}`;
}
