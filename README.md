# 基于文件系统的路由

[English](https://github.com/SuperZ3/unplugin-fs-router/blob/master/READE_EN.md) | [中文](https://github.com/SuperZ3/unplugin-fs-router/blob/master/READEME.md)

## 下载

```bash
npm install -D unplugin-fs-router
npm install react-router
```

## 使用

### Vite

```js
// vite config
import Pages from 'unplugin-fs-router'

export default {
  plugins: [
    // ...
    Pages(),
  ]
}
```

### Webpack

```js
// webpack.config.js
module.exports = {
  /* ... */
  plugins: [
    require('unplugin-fs-router/webpack')({
      /* options */
    }),
  ],
}
```

## 配置

插件默认遍历 `src/pages` 下的文件并生成对应的路由

```ts
interface Options {
	root: string;
	rootPaths: string[];
	extensions: string[];
	exclude: string[];
	pkgType: PkgType.react | PkgType.vue;
}
```

- root: 根路径，默认是`process.cwd()`
- rootPaths: 作为路由的文件夹，默认是`src/pages`
- extensions: 路由页面扩展名，默认是`[".js", ".jsx", ".ts", ".tsx"]`
- exclude: 需要排除的文件或路径
- pkgType: react 项目或 vue 项目，忽略的话会根据根目录`package.json`的依赖确定

## 基础路由

`const fileExt = /\.(vue|(j|t)sx)$/`

以 `fileExt` 结尾的文件表示当前文件是一个可访问的路由，以 `folderName/index.fileExt` 结尾的路由表示当前目录是一个可访问的路由：

| 目录结构 | 路由 |
| --- | --- |
| `root/user.tsx` | `/user` |
| `root/index.tsx` | `/` |

注意，如果一个文件夹下没有 `index.tsx` 那么该文件夹对应的路由是不可访问的

### 嵌套路由

嵌套目录结构会生成多级路由：

```typescript
src/pages/
├── blogs/
│   └── index.tsx
├── users/
│   └── index.tsx
├── users.tsx
└── index.tsx
```

会生成如下点路由表: 

```json
[
  {
    "path": "/",
    "component": "/src/pages/index.tsx",
  },
  {
    "path": "/users",
    "component": "/src/pages/users.tsx",
    "children": [
      {
        "path": "",
        "component": "/src/pages/users/index.tsx"
      }
    ]
  },
  {
    "path": "/blogs",
    "component": "/src/pages/users/idnex.tsx"
  }
]
```

| 目录结构 | 路由 |
| :---: | :---: |
| `root/index.tsx` | `/` |
| `root/users.tsx` | `/users` |
| `root/blogs.tsx` | `/blogs` |

### 动态路由

用 `[fileName|folderName]` 会创建动态路由

| 目录结构 | 路由 |
| :---: | :---: |
| `root/blog/[slug].tsx` | `/blog/:slug` |
| `root/blog/[username]/index.tsx` | `/blog/:username` |
| `root/posts/[...all].tsx` | `/posts/*` |

### Catch-all routes

使用方括号和三个点定义

`src/pages/[...all].tsx` -> `/*`

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
import { routes } from 'unplugin-fs-router/routes'

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
