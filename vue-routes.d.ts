declare module 'unplugin-fs-router/routes' {
  import type { RouteObject } from 'vue-router'

  const Routes: RouteObject[]
  export default Routes
}

declare module 'virtual:unplugin-fs-router' {
  import type { RouteObject } from 'vue-router'

  const Routes: RouteObject[]
  export default Routes
}
