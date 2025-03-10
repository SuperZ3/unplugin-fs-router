# File System Based Routing

[English](https://github.com/SuperZ3/unplugin-fs-router/README_EN.md) | [中文](https://github.com/SuperZ3/unplugin-fs-router/README.md)

## Installation

```bash
npm install -D unplugin-fs-router
npm install react-router
```

## Usage

### Vite

```js
// vite config
import Pages from "unplugin-fs-router";

export default {
	plugins: [
		// ...
		Pages(),
	],
};
```

### Webpack

```js
// webpack.config.js
module.exports = {
	/* ... */
	plugins: [
		require("unplugin-fs-router/webpack")({
			/* options */
		}),
	],
};
```

## Configuration

By default, the plugin traverses the files under `src/pages` and generates the corresponding routes.

```ts
interface Options {
	root: string;
	rootPaths: string[];
	extensions: string[];
	exclude: string[];
	pkgType: PkgType.react | PkgType.vue;
}
```

- root: Root path, default is `process.cwd()`
- rootPaths: Folders to be used as routes, default is `src/pages`
- extensions: Route page extensions, default is `[".js", ".jsx", ".ts", ".tsx"]`
- exclude: Files or paths to exclude
- pkgType: React or Vue project, if ignored, it will be determined based on the dependencies in the root `package.json`

## Basic Routes

`const fileExt = /\.(vue|(j|t)sx)$/`

Files ending with `fileExt` indicate that the current file is an accessible route. Routes ending with `folderName/index.fileExt` indicate that the current directory is an accessible route:

| Directory Structure | Route   |
| ------------------- | ------- |
| `root/user.tsx`     | `/user` |
| `root/index.tsx`    | `/`     |

Note that if there is no `index.tsx` in a folder, the route corresponding to that folder is not accessible.

### Nested Routes

Nested directory structures will generate multi-level routes:

```typescript
src/pages/
├── blogs/
│   └── index.tsx
├── users/
│   └── index.tsx
├── users.tsx
└── index.tsx
```

This will generate the following route table:

```json
[
	{
		"path": "/",
		"component": "/src/pages/index.tsx"
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
		"component": "/src/pages/blogs/index.tsx"
	}
]
```

| Directory Structure |  Route   |
| :-----------------: | :------: |
|  `root/index.tsx`   |   `/`    |
|  `root/users.tsx`   | `/users` |
|  `root/blogs.tsx`   | `/blogs` |

### Dynamic Routes

Using `[fileName|folderName]` will create dynamic routes.

|       Directory Structure        |       Route       |
| :------------------------------: | :---------------: |
|      `root/blog/[slug].tsx`      |   `/blog/:slug`   |
| `root/blog/[username]/index.tsx` | `/blog/:username` |
|    `root/posts/[...all].tsx`     |    `/posts/*`     |

### Catch-all Routes

Defined using square brackets and three dots.

`src/pages/[...all].tsx` -> `/*`

## Usage

### 1. Add files to automatically update routes

```javascript
// vite.config.tsx
import pages from '@avatar/pages'

export default defineConfig({
    plugins: [react(), pages()],
})

// app, entry point
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
