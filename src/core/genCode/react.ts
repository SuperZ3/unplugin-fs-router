import { writeFileSync } from "fs";
import { GenCode } from "../../types";
import { routesOutputDir } from "../../utils";
import path from "path";
import TreeNode from "../treeNode";

interface ImportsMap {
	name: string;
	path: string;
}

const genCode: GenCode = (options, entries) => {
	let content = "export default const Routes = [];";

	entries.entries().forEach(([rootPath, fileTree]) => {
		if (fileTree.rootNode === null) {
			return;
		}
		const outputDir = routesOutputDir(options, rootPath);
		const importsMap: ImportsMap[] = [];
		const routes = walk(fileTree.rootNode, importsMap, 0);
		const imports = getImports(path.join(options.root, rootPath), importsMap);
		content = `import React, { createElement } from 'react';\n${imports.join(
			";\n"
		)}\r\n\r\nconst Routes = ${routes}\r\nexport default Routes;`;
	});
	return content;
};

export default genCode;

function walk(tree: TreeNode, imports: ImportsMap[], indent: number): string {
	// virtual head node
	if (tree.parent === null) {
		return `[\n${sortChildren(tree.children)
			?.map((child) => walk(child, imports, indent + 1))
			.join(",\n")}\n]`;
	}

	const squareStart = " ".repeat(indent * 2);
	const propStart = " ".repeat((indent + 1) * 2);
	if (tree.nodeValue.exportName) {
		imports.push({
			name: tree.nodeValue.exportName,
			path: tree.nodeValue.filePath,
		});
	}

	// TODO: routeNode props, name
	const routeNode = `${squareStart}{\n${propStart}path: "${tree.nodeValue.routePath}",\n${
		tree.nodeValue.exportName
			? `${propStart}element: createElement(${tree.nodeValue.exportName}),\n`
			: ""
	}${
		tree?.children && tree.children?.length > 0
			? `${propStart}children: [\n${sortChildren(tree.children)
					.map((child) => walk(child, imports, indent + 2))
					.join(",\n")}\n${propStart}],\n`
			: ""
	}${squareStart}}`;

	return routeNode;
}

function getImports(outputDir: string, importsMap: ImportsMap[]): string[] {
	return importsMap.map((item) => {
		const output = path.relative(outputDir, item.path);
		return `import ${item.name} from "${item.path}"`;
	});
}

function writeRoutes(output: string, routes: string, imports: string[]) {
	const content = `${imports.join(
		";\n"
	)}\r\n\r\nconst Routes = ${routes}\r\nexport default Routes;`;
	writeFileSync(output + "/routes.jsx", content);
	return content;
}

function sortChildren(children: TreeNode[] | undefined): TreeNode[] {
	if (children === undefined) {
		return []
	}
	// put * at last, put "" at first
	const catchAllRouteIdx = children.findIndex(child => /\/?\*/.test(child.nodeValue.routePath))
	const firstRouteIdx = children.findIndex(child => /^\"\"$/.test(child.nodeValue.routePath))
	if (catchAllRouteIdx > -1 && catchAllRouteIdx !== children.length - 1) {
		[children[catchAllRouteIdx], children[children.length - 1]] = [children[children.length - 1], children[catchAllRouteIdx]]
	}
	if (firstRouteIdx > -1 && firstRouteIdx !== 0) {
		[children[0], children[firstRouteIdx]] = [children[firstRouteIdx], children[0]]
	}
	return children
}
