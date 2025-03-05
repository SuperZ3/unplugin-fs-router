import path from "path";
import { RootTreeNodeKey, SegmentTypeRexp } from "../constants";
import { SegementType, TreeNodeType, TreeNodeValue } from "../types";

export default class TreeNode {
	parent: TreeNode | null;
	children?: TreeNode[];
	nodeValue: TreeNodeValue;
	nodeType: string;

	constructor(parent: TreeNode | null, filePath: string) {
		this.parent = parent;
		this.nodeType = TreeNodeType.Basic;
		this.nodeValue = this.genTreeNodeValue(parent, filePath);
	}

	// generate TreeNodeValue
	genTreeNodeValue(
		parent: TreeNode | null, 
		filePath: string
	): TreeNodeValue {
		let { nodeType, parsedSegment } = TreeNode.ParseSegment(filePath);
		if (parent === null) {
			this.nodeType = TreeNodeType.Root;
			parsedSegment = "";
		}
		return {
			routePath: this.getNodeRoutePath(parent, parsedSegment),
			filePath: this.getNodeFilePath(parent, filePath),
			// this based on already filter disavailable file
			exportName: "",
		};
	}

	static ParseSegment(filePath: string) {
		let nodeType = TreeNodeType.Basic;
		let parsedSegment = "";
		const segment = path.parse(filePath).name;
		if ((parsedSegment = TreeNode.isBasicSegment(segment))) {
			nodeType = TreeNodeType.Basic;
		} else if ((parsedSegment = TreeNode.isDynamicSegment(segment))) {
			nodeType = TreeNodeType.Dynamic;
		} else if ((parsedSegment = TreeNode.isCatchAllSegment(segment))) {
			nodeType = TreeNodeType.CatchAll;
		} else if ((parsedSegment = TreeNode.isGroupSegment(segment))) {
			nodeType = TreeNodeType.Group;
			parsedSegment = ""
		}

		return {
			nodeType,
			parsedSegment,
		};
	}

	getNodeRoutePath(parent: TreeNode | null, segment: string): string {
		return TreeNode.GetNodeRoutePath(parent, segment);
	}

	static GetNodeRoutePath(parent: TreeNode | null, segment: string): string {
		// root node
		if (parent === null) {
			return RootTreeNodeKey;
		}
		let prefix = "/";
		if (!TreeNode.isRoot(parent)) {
			prefix = ""
		}
		if (segment.startsWith("index")) {
			segment = "";
		}
		
		return prefix + segment;
	}

	getNodeFilePath(parent: TreeNode | null, filePath: string): string {
		if (parent === null || TreeNode.isRoot(parent!)) {
			return filePath;
		}
		return path.resolve(parent!.nodeValue.filePath, filePath);
	}

	static isRoot(node: TreeNode | null): boolean {
		return node !== null && node.parent === null;
	}

	appendChild(node: TreeNode) {
		if (!this.children) {
			this.children = [];
		}
		this.children.push(node);
	}

	removeChild(node: TreeNode) {
		if (!this.children) {
			return;
		}
		const index = this.children.indexOf(node);
		if (index > -1) {
			this.children.splice(index, 1);
		}
	}

	static isBasicSegment(segment: string): string {
		const arr = SegmentTypeRexp[SegementType.Base].exec(segment);
		return arr ? segment : "";
	}

	static isDynamicSegment(segment: string): string {
		const arr = SegmentTypeRexp[SegementType.Dynamic].exec(segment);
		return arr ? ":" + arr[1] : "";
	}

	static isCatchAllSegment(segment: string): string {
		const arr = SegmentTypeRexp[SegementType.CatchAll].exec(segment);
		return arr ? "*" : "";
	}

	static isGroupSegment(segment: string): string {
		const arr = SegmentTypeRexp[SegementType.CatchAll].exec(segment);
		return arr ? segment : "";
	}

	static isChildrenSegment(segment: string): boolean {
		return SegmentTypeRexp[SegementType.Children].test(segment);
	}
}
