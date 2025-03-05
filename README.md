基于文件系统的路由

插件默认遍历 `src/pages` 下的文件并生成对应的路由

## 基础路由

`const fileExt = /\.(vue|(j|t)sx)$/`

以 `fileExt` 结尾的文件表示当前文件是一个可访问的路由，以 `folderName/index.fileExt` 结尾的路由表示当前目录是一个可访问的路由：

```markdown
| 目录结构 | 路由 |
| :---: | :---: |
| `root/user.tsx` | `/user` |
| `root/index.tsx` | `/` |
```

注意，如果一个文件夹下没有 `index.tsx` 那么该文件夹对应的路由是不可访问的

### 多级路由

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

```markdown
| 目录结构 | 路由 |
| :---: | :---: |
| `root/index.tsx` | `/` |
| `root/users.tsx` | `/users` |
| `root/blogs.tsx` | `/blogs` |
```

由于 `users` 文件夹和 `users.tsx` 对应相同路由，他们会被替换，应该避免这种情况出现

### 动态路由

用 `[fileName|folderName]` 会创建动态路由

```markdown
| 目录结构 | 路由 |
| :---: | :---: |
| `root/blog/[slug].tsx` | `/blog/:slug` |
| `root/blog/[username]/index.tsx` | `/blog/:username` |
| `root/posts/[...all].tsx` | `//posts/*` |
```

### catch-all routes
### optional catch-all routes
### parallel routes
### intercepting routes

### NotFound

- `pages/**/404.tsx` -> `*`

### Ignored routes

- `_[fileName|folderName]` 会被忽略，不会作为路由

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