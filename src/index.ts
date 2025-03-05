import { createUnplugin, UnpluginFactory } from "unplugin";
import { getContextOptions } from "./core/options";
import { MODULE_PATH, VIRTUAL_ID } from "./constants";
import { genVirtualId, getVirtualId } from "./utils";
import Context from "./core/context";
import { Options } from "./types";

const unpluginFactory: UnpluginFactory<Options | undefined> = (
	options
) => {
	const opt = getContextOptions(options);
    const ctx = new Context(opt)
	return {
		name: "unplugin-fs-router",
		enforce: "pre",
		buildStart() {
            ctx.start()
        },
        resolveId(id) {
            if (id === MODULE_PATH) {
                return genVirtualId(id)
            }
            return
        },
        load(id) {
            const virtualId = getVirtualId(id)
            
            if (virtualId === MODULE_PATH) {
                return ctx.genRoutes()
            }

            return null
        },
        buildEnd() {
            ctx.stopWatch()
        },
	};
};

export default createUnplugin(unpluginFactory);
