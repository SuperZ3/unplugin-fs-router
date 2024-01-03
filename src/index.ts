import { type Plugin } from 'vite';
import path from 'node:path'
import fg from 'fast-glob';
import { CompPath, getRoute, getRouteStr, replacement, test404 } from './utils';
import { RouteObject } from 'react-router-dom';

// TODO: 生成文件，添加声明周期 hook
export default function routes(): Plugin {
  const routesId = '~page-routes'
  const resolveRoutesId = '\0' + 'virtual:avatar-page-routes'
  const root = 'src/pages'

  return {
    name: '@avatar/page-routes',
    enforce: 'pre',
    configureServer(server) {
      const listener = (file = '') => {
        return (file.includes(path.normalize(root)) ? genRoutes(root) : null)
      }
      server.watcher.on('add', listener)
      server.watcher.on('change', listener)
      server.watcher.on('unlink', listener)
    },
    resolveId(id) {
      if (id === routesId) {
        return resolveRoutesId
      }
      return null
    },
    load(id) {
      if (id === resolveRoutesId) {
        return genRoutes(root)
      }
      return null
    },
  }
}

// 生成路由表
export function genRoutes(rootPath: string) {
  const routePaths = genRoutePaths(rootPath)
  if (routePaths.length > 0) {
      const prementRoutes = genRoutesWithCompPath(routePaths)
      const code = genCode(prementRoutes)
      // console.log(code)
      return code
  }
  return `const Routes = []; export default Routes`
}

// 获取所有页面路由地址
export function genRoutePaths(rootPath: string, workPath = process.cwd()) {
  const routePattern = `${rootPath}/**/*.{jsx,tsx}`
  const excludeRoutePattern = `${rootPath}/**/_!(layout).*|${rootPath}/_**/*`
  const files = fg.sync(routePattern, {
      ignore: [excludeRoutePattern],
      onlyFiles: true,
      cwd: workPath
  })
  return files
}

// 预处理，生成具有路由层级的对象
export function genRoutesWithCompPath(routePaths: string[]) {
  let result: CompPath[] = []
  const exclude404 = routePaths.filter((path) => !test404(path))
  
  exclude404.forEach((routePath) => {
      const processRoute = routePath
          .replace(...replacement.all)
          .replace(...replacement.param)
          .replace(...replacement.route)
          
      if (processRoute) {
          const routePathArr = processRoute.split("/")
          const routePathLen = routePathArr.length
          routePathArr.reduce((parent, segment, index) => {
              const isRoot = index === 0
              const isLeaf = index === routePathLen - 1
              const isLayout = segment === '_layout'
              const isIndex = segment === 'index'

              if (isRoot && !isLayout) {
                  const path = `/${isIndex ? '' : segment}`
                  const layout = result.length > 0 && result.find((route) => route?.path === undefined)
                  const target = layout && layout?.children ? layout.children : result
                  let rootRoute = target?.find((route) => route.path === path)
                  
                  if (rootRoute === undefined) {
                      rootRoute = isLeaf ? getRoute(routePath) : {}
                      rootRoute.path = path
                      target.push(rootRoute)
                  }
                  return rootRoute
              }

              if (isIndex) {
                  const route = getRoute(routePath)
                  parent.componentContent = route.componentContent
                  parent.componentPath = route.componentPath
                  return parent
              }

              if (!isLayout) {
                  const layout = parent?.children?.find((child) => child.path === undefined)
                  if (layout?.children?.find((route) => route.path === segment)) {
                    parent = layout
                  }
                  if (!parent?.children) {
                    parent.children = []
                  }
                  let target = parent.children.find((child) => child.path === segment)
                  if (!target) {
                      target = {path: segment}
                      if (isLeaf) {
                          const route = getRoute(routePath)
                          target = {
                              ...target,
                              ...route
                          }
                      }
                      parent.children.push(target)
                  }
                  return target
              }

              const route: CompPath = getRoute(routePath)
              if (isLayout) {
                  if (isRoot) {
                      const preResult = [...result]
                      route.children = preResult
                      result = [route]
                      return route
                  }
                  const oldParent = {...parent}
                  delete parent.path
                  parent.componentContent = route.componentContent
                  parent.componentPath = route.componentPath
                  parent.children = [oldParent]
              }
              return route
          }, {} as CompPath)
      }
  })
  
  const notFoundPath = routePaths.reverse().find((path) => test404(path))
  if (notFoundPath) {
      const route = getRoute(notFoundPath)
      route.path = '*'
      result.push(route)
  }
  console.log(JSON.stringify(result, null, 2))
  return result
}

// 生成代码
export function genCode(routeContent: CompPath[]): string {
  let result = 'const Routes = [];export default Routes'

  const imports: string[] = []
  const routes: RouteObject[] = []
  routeContent.forEach((rootRoute: CompPath) => {
      const {importStr, route} = getRouteStr(rootRoute)
      imports.push(importStr)
      routes.push(route)
  })
  const strRoutes = JSON.stringify(routes, undefined, 2)
      .replace(/"(element|loader|errorElement|catch)":\s"(.*)"/g, `"$1": $2`)

  result = `
    import React from 'react';
    ${imports.join("\r\n")}
    const Routes = ${strRoutes};
    export default Routes;
  `
  return result
}
