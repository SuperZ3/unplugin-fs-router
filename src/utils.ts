import fs from 'node:fs'
import path from 'node:path'
import { RouteObject } from 'react-router-dom'

export type CompPath = {
    path?: string,
    componentPath?: string,
    componentContent?: CompContent,
    children?: CompPath[]
}

export type CompContent = {
    default: string | undefined,
    loader: boolean,
    action: boolean,
    catch: boolean,
    pending: boolean,
}

export const ContentRexp = {
    default: /export\sdefault\s(const\s|function\s)?([a-zA-Z0-9_]*)\b/,
    loader: /export\s(const\s|function\s)?Loader\b/,
    action: /export\s(const\s|function\s)?Action\b/,
    catch: /export\s(const\s|function\s)?Catch\b/,
    pending: /export\s(const\s|function\s)?Pending\b/
}

export const replacement: {[key: string]: [RegExp, string]} = {
    param: [/\[([^\]]+)\]/g, ':$1'],
    slash: [/^index$|\./g, '/'],
    all: [/\[\.{3}\w+\]/g, '*'],
    route: [/^(.*\/)?src\/pages\/|\.(jsx|tsx)$/g, ''],
}

export const test404 = (path: string) => /404\.(jsx|tsx)$/.test(path)

export const ROUTE_IMPORT_NAME = '__pages_import_$1__'
let importFlag = 0

export function getRoute(compPath: string): CompPath {
    return {
        componentPath: compPath,
        componentContent: getCompContent(compPath)
    }
}
  
export function getCompContent(compPath: string) {
    const result: CompContent = {
        default: undefined,
        loader: false,
        action: false,
        catch: false,
        pending: false,
    } 
    const compStat = fs.statSync(compPath)
    if (compStat.isFile()) {
        const content = fs.readFileSync(path.resolve(compPath), {encoding: 'utf-8'})
        result.default = ContentRexp.default.exec(content)?.[2]
        result.loader = ContentRexp.loader.test(content)
        result.action = ContentRexp.action.test(content)
        result.catch = ContentRexp.catch.test(content)
        result.pending = ContentRexp.pending.test(content)
    }
    return result
}

export function getRouteStr(route: CompPath) {
    let importStr = ''
    const routeObj: RouteObject = {}
    const {path, componentContent, componentPath, children} = route
    routeObj.path = path
    if (componentContent && componentPath) {
        const {loader, action, pending, catch: CompCatch} = componentContent
        const eleName = ROUTE_IMPORT_NAME.replace('$1', String(importFlag++))
        const helpers: string[] = []
        routeObj.element = `React.createElement(${eleName})`

        if (loader) {
            helpers.push(`Loader as ${eleName}_Loader`)
            routeObj.loader = `${eleName}_Loader` as any
        }

        if (action) {
            helpers.push(`Action as ${eleName}_Action`)
            routeObj.action = () => new Promise((resolve) => resolve(action))
        }

        if (pending) {
            helpers.push(`Pending as ${eleName}_Pending`)
            routeObj.element = `React.createElement(React.Suspense, {fallback: React.createElement(${eleName}_Pending), children: [React.createElement(${eleName}, {key: ${eleName}})]})`
        }

        if (CompCatch) {
            helpers.push(`Catch as ${eleName}_Catch`)
            routeObj.errorElement = `React.createElement(${eleName}_Catch)`
        }

        importStr += `import ${eleName} ${helpers.length > 0 ? `, {${helpers.join(',')}}` : ''} from '${componentPath.replace("src/pages", './src/pages')}';\r\n`
    }

    if (children && children.length > 0) {
        routeObj.children = []
        children.forEach((child) => {
            const {importStr: childStr, route: childRoute} = getRouteStr(child)
            importStr += `${childStr}`
            routeObj.children?.push(childRoute)
        })
    }

    return {
        importStr,
        route: routeObj
    }
}
