# 简易版文件路由

base on react-router-dom

`const FileExt = /\.(jsx|tsx)$/`

## Conventions

一个 *.(FileExt) 结尾的文件，默认导出一个 React.Component，定义了一个路由：`pages/about.tsx` -> `/about`

### NotFound

- `pages/**/404.tsx` -> `*`

### Index routes

文件夹下带有 index.(FileExt) 的文件夹，会自动被当成路由

- `pages/index.tsx` -> `/`
- `pages/blog/index.tsx` -> `/blog`

### Nested routes

嵌套文件夹会生成嵌套路由

- `pages/blog/first-post.tsx` -> `/blog/first-post`
- `pages/dashboard/settings/username.tsx` -> `/dashboard/settings/username`

### Dynamic routes

用 `[fileName|folderName]` 创建动态路由, 用 `useRouter` 获取动态路由的值

- `pages/blog/[slug].tsx` -> `/blog/:slug`
- `pages/blog/[username]/index.tsx` -> `/blog/:username`
- `src/pages/posts/[...all].tsx` -> `/posts/*`

### Layout

用 `folderName/_layout.tsx` 创建相应层级的 layout，`<Outlet />` 会作为 children 插槽，注入子路由组件

* 注意：`_layout.tsx` 与 `index.tsx` 是同级的并且不会生成路由，你不能同时定义它们，`index.tsx` 优先级高于 `_layout.tsx`

### Ignored routes

- `_[fileName|folderName]` 会被忽略，不会作为路由

### Component、Loader、Action、Error

- Component 需要作为默认导出 `export default Component() {...}`
- Loader 函数是可选导出 `export const Loader = () => {...}`
- Action 函数是可选导出 `export const Action = () => {...}`
- Error 错误处理组件 `export const Catch = () => {...}`

以上导出会定义如下 route

```javascript
<Route
  path="/"
  loader={Loader}
  action={Action}
  element={<Comopnent />}
  errorElement={<Catch />}
/>
```

## 使用方式

### 一、添加文件自动更新路由

```javascript
// vite.config.tsx
import pages from '@avatar/pages'

export default defineConfig({
  plugins: [react(), pages()],
})

// app，entry point
import { createBrowserRouter } from "react-router-dom";
import { routes } from '@avatar/routes'

function App() {
    return (
        <Suspense fallback={<p>Loading...</p>}>
          {useRoutes(routes)}
        </Suspense>
    )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App>
  </React.StrictMode>,
)
```

### 二、自定义

由文件生成的路由，无法完全发挥 react-router 的能力

所以，可以将生成的路由写入 `routes.config.tsx`，此时可以添加其它 react-router 功能

```javascript
// vite.config.tsx
import pages from '@avatar/pages'

export default defineConfig({
  plugins: [react(), pages({watchConfig: true})],
})
```

- 修改 `routes.config.tsx` 中的路由，会修改/添加/删除相应文件