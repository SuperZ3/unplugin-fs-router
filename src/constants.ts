import { SegementType } from "./types";

export const MODULE_PATH = "unplugin-fs-router/routes";

export const VIRTUAL_ID_PREFIX = "\0";

export const VIRTUAL_ID = VIRTUAL_ID_PREFIX + MODULE_PATH

export enum PkgType {
    react = 'react',
    vue = 'vue'
}

export const PkgTypes = [PkgType.react, PkgType.vue];

export const SegmentTypeRexp = {
    [SegementType.Base]: /^([a-zA-Z0-9_-]+[a-zA-Z0-9_\-\.]*[a-zA-Z0-9_-]+)$/,
    [SegementType.Dynamic]: /^\[([a-zA-Z0-9_-]+)\]$/,
    [SegementType.Children]: /^([a-zA-Z0-9_-]+)\/$/,
    [SegementType.Group]: /^(\([a-zA-Z0-9_-]+\))$/,
    [SegementType.CatchAll]: /^\[\.{3}([a-zA-Z0-9_-]+)\]$/,
};

export const DefaultExportRexp = /export\sdefault\s(class\s|function\s|const\s)?([a-zA-Z0-9_-]+)\s/

export const DefaultReactExtensions = [".js", ".jsx", ".ts", ".tsx"]

export const DefaultVueExtensions = [".js", ".ts", ".vue"]

export const RootTreeNodeKey = "$_ROOT_TREE_NODE_KEY_$"