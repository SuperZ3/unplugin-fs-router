import { PkgType } from "../../constants";
import type { GenCode } from "../../types";
import genReactCode from "./react";
import genVueCode from "./vue";

const genCode: GenCode = (options, routeEntries) => {
	if (options.pkgType === PkgType.react) {
		return genReactCode(options, routeEntries);
	} else {
		return genVueCode(options, routeEntries);
	}
};

export default genCode;
