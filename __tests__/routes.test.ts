import path from 'node:path'
import { genRoutes, genRoutePaths, genRoutesWithCompPath, genCode } from '../src'

const examplesPath = path.resolve('./examples/src/pages')

it('getRoutePaths output as expected', () => {
    expect(genRoutePaths(examplesPath)).toMatchInlineSnapshot(`
[
  "/Users/neo/Desktop/Avatar/vroutes/examples/src/pages/404.tsx",
  "/Users/neo/Desktop/Avatar/vroutes/examples/src/pages/Login.tsx",
  "/Users/neo/Desktop/Avatar/vroutes/examples/src/pages/_layout.tsx",
  "/Users/neo/Desktop/Avatar/vroutes/examples/src/pages/index.tsx",
  "/Users/neo/Desktop/Avatar/vroutes/examples/src/pages/[blog]/index.tsx",
  "/Users/neo/Desktop/Avatar/vroutes/examples/src/pages/subignore/sub.tsx",
  "/Users/neo/Desktop/Avatar/vroutes/examples/src/pages/[blog]/auth/[authName].tsx",
  "/Users/neo/Desktop/Avatar/vroutes/examples/src/pages/[blog]/content/backend.tsx",
  "/Users/neo/Desktop/Avatar/vroutes/examples/src/pages/[blog]/content/index.tsx",
  "/Users/neo/Desktop/Avatar/vroutes/examples/src/pages/[blog]/examples/[...example].tsx",
  "/Users/neo/Desktop/Avatar/vroutes/examples/src/pages/[blog]/post/index.tsx",
  "/Users/neo/Desktop/Avatar/vroutes/examples/src/pages/[blog]/content/front/Vue.tsx",
  "/Users/neo/Desktop/Avatar/vroutes/examples/src/pages/[blog]/content/front/_layout.tsx",
  "/Users/neo/Desktop/Avatar/vroutes/examples/src/pages/[blog]/content/front/index.tsx",
  "/Users/neo/Desktop/Avatar/vroutes/examples/src/pages/[blog]/content/front/React/index.tsx",
]
`)
})

it('genRoutesWithCompPath output as expected', () => {
    const routePaths = genRoutePaths(examplesPath)
    expect(genRoutesWithCompPath(routePaths)).toMatchInlineSnapshot(`
[
  {
    "children": [
      {
        "componentContent": {
          "action": false,
          "catch": false,
          "default": "Index",
          "loader": false,
          "pending": false,
        },
        "componentPath": "/Users/neo/Desktop/Avatar/vroutes/examples/src/pages/Login.tsx",
        "path": "/Login",
      },
      {
        "componentContent": {
          "action": false,
          "catch": true,
          "default": "App",
          "loader": false,
          "pending": true,
        },
        "componentPath": "/Users/neo/Desktop/Avatar/vroutes/examples/src/pages/index.tsx",
        "path": "/",
      },
      {
        "children": [
          {
            "children": [
              {
                "componentContent": {
                  "action": false,
                  "catch": true,
                  "default": "Auth",
                  "loader": true,
                  "pending": false,
                },
                "componentPath": "/Users/neo/Desktop/Avatar/vroutes/examples/src/pages/[blog]/auth/[authName].tsx",
                "path": ":authName",
              },
            ],
            "path": "auth",
          },
          {
            "children": [
              {
                "componentContent": {
                  "action": false,
                  "catch": false,
                  "default": "Index",
                  "loader": false,
                  "pending": false,
                },
                "componentPath": "/Users/neo/Desktop/Avatar/vroutes/examples/src/pages/[blog]/content/backend.tsx",
                "path": "backend",
              },
              {
                "children": [
                  {
                    "children": [
                      {
                        "componentContent": {
                          "action": false,
                          "catch": false,
                          "default": "Index",
                          "loader": false,
                          "pending": false,
                        },
                        "componentPath": "/Users/neo/Desktop/Avatar/vroutes/examples/src/pages/[blog]/content/front/Vue.tsx",
                        "path": "Vue",
                      },
                      {
                        "componentContent": {
                          "action": false,
                          "catch": false,
                          "default": "Index",
                          "loader": false,
                          "pending": false,
                        },
                        "componentPath": "/Users/neo/Desktop/Avatar/vroutes/examples/src/pages/[blog]/content/front/React/index.tsx",
                        "path": "React",
                      },
                    ],
                    "componentContent": {
                      "action": false,
                      "catch": false,
                      "default": "Index",
                      "loader": false,
                      "pending": false,
                    },
                    "componentPath": "/Users/neo/Desktop/Avatar/vroutes/examples/src/pages/[blog]/content/front/index.tsx",
                    "path": "front",
                  },
                ],
                "componentContent": {
                  "action": false,
                  "catch": false,
                  "default": "Index",
                  "loader": false,
                  "pending": false,
                },
                "componentPath": "/Users/neo/Desktop/Avatar/vroutes/examples/src/pages/[blog]/content/front/_layout.tsx",
              },
            ],
            "componentContent": {
              "action": false,
              "catch": false,
              "default": "Index",
              "loader": false,
              "pending": false,
            },
            "componentPath": "/Users/neo/Desktop/Avatar/vroutes/examples/src/pages/[blog]/content/index.tsx",
            "path": "content",
          },
          {
            "children": [
              {
                "componentContent": {
                  "action": false,
                  "catch": false,
                  "default": "Examples",
                  "loader": false,
                  "pending": false,
                },
                "componentPath": "/Users/neo/Desktop/Avatar/vroutes/examples/src/pages/[blog]/examples/[...example].tsx",
                "path": "*",
              },
            ],
            "path": "examples",
          },
          {
            "componentContent": {
              "action": false,
              "catch": false,
              "default": "Post",
              "loader": false,
              "pending": true,
            },
            "componentPath": "/Users/neo/Desktop/Avatar/vroutes/examples/src/pages/[blog]/post/index.tsx",
            "path": "post",
          },
        ],
        "componentContent": {
          "action": false,
          "catch": false,
          "default": "Blog",
          "loader": false,
          "pending": false,
        },
        "componentPath": "/Users/neo/Desktop/Avatar/vroutes/examples/src/pages/[blog]/index.tsx",
        "path": "/:blog",
      },
      {
        "children": [
          {
            "componentContent": {
              "action": false,
              "catch": false,
              "default": "Index",
              "loader": false,
              "pending": false,
            },
            "componentPath": "/Users/neo/Desktop/Avatar/vroutes/examples/src/pages/subignore/sub.tsx",
            "path": "sub",
          },
        ],
        "componentContent": {
          "action": false,
          "catch": false,
          "default": "Index",
          "loader": false,
          "pending": false,
        },
        "componentPath": "/Users/neo/Desktop/Avatar/vroutes/examples/src/pages/subignore/sub.tsx",
        "path": "/subignore",
      },
    ],
    "componentContent": {
      "action": false,
      "catch": false,
      "default": "Index",
      "loader": false,
      "pending": false,
    },
    "componentPath": "/Users/neo/Desktop/Avatar/vroutes/examples/src/pages/_layout.tsx",
  },
  {
    "componentContent": {
      "action": false,
      "catch": false,
      "default": "Index",
      "loader": false,
      "pending": false,
    },
    "componentPath": "/Users/neo/Desktop/Avatar/vroutes/examples/src/pages/404.tsx",
    "path": "*",
  },
]
`)
})

it('genCode output as expected', () => {
    const routePaths = genRoutePaths(examplesPath)
    const routesLike = genRoutesWithCompPath(routePaths)
    expect(genCode(routesLike)).toMatchInlineSnapshot()
})

it('generateRoutes match snapshot', () => {
    expect(genRoutes(examplesPath)).toMatchInlineSnapshot(`
"
    import React from 'react';
    import __pages_import_0__  from '/Users/neo/Desktop/Avatar/vroutes/examples/./src/pages/_layout.tsx';
import __pages_import_1__  from '/Users/neo/Desktop/Avatar/vroutes/examples/./src/pages/Login.tsx';
import __pages_import_2__ , {Pending as __pages_import_2___Pending,Catch as __pages_import_2___Catch} from '/Users/neo/Desktop/Avatar/vroutes/examples/./src/pages/index.tsx';
import __pages_import_3__  from '/Users/neo/Desktop/Avatar/vroutes/examples/./src/pages/[blog]/index.tsx';
import __pages_import_4__ , {Loader as __pages_import_4___Loader,Catch as __pages_import_4___Catch} from '/Users/neo/Desktop/Avatar/vroutes/examples/./src/pages/[blog]/auth/[authName].tsx';
import __pages_import_5__  from '/Users/neo/Desktop/Avatar/vroutes/examples/./src/pages/[blog]/content/index.tsx';
import __pages_import_6__  from '/Users/neo/Desktop/Avatar/vroutes/examples/./src/pages/[blog]/content/backend.tsx';
import __pages_import_7__  from '/Users/neo/Desktop/Avatar/vroutes/examples/./src/pages/[blog]/content/front/_layout.tsx';
import __pages_import_8__  from '/Users/neo/Desktop/Avatar/vroutes/examples/./src/pages/[blog]/content/front/index.tsx';
import __pages_import_9__  from '/Users/neo/Desktop/Avatar/vroutes/examples/./src/pages/[blog]/content/front/Vue.tsx';
import __pages_import_10__  from '/Users/neo/Desktop/Avatar/vroutes/examples/./src/pages/[blog]/content/front/React/index.tsx';
import __pages_import_11__  from '/Users/neo/Desktop/Avatar/vroutes/examples/./src/pages/[blog]/examples/[...example].tsx';
import __pages_import_12__ , {Pending as __pages_import_12___Pending} from '/Users/neo/Desktop/Avatar/vroutes/examples/./src/pages/[blog]/post/index.tsx';
import __pages_import_13__  from '/Users/neo/Desktop/Avatar/vroutes/examples/./src/pages/subignore/sub.tsx';
import __pages_import_14__  from '/Users/neo/Desktop/Avatar/vroutes/examples/./src/pages/subignore/sub.tsx';

import __pages_import_15__  from '/Users/neo/Desktop/Avatar/vroutes/examples/./src/pages/404.tsx';

    export const Routes = [
  {
    "element": React.createElement(__pages_import_0__),
    "children": [
      {
        "path": "/Login",
        "element": React.createElement(__pages_import_1__)
      },
      {
        "path": "/",
        "element": React.createElement(React.Suspense, {fallback: React.createElement(__pages_import_2___Pending), children: [React.createElement(__pages_import_2__, {key: __pages_import_2__})]}),
        "errorElement": React.createElement(__pages_import_2___Catch)
      },
      {
        "path": "/:blog",
        "element": React.createElement(__pages_import_3__),
        "children": [
          {
            "path": "auth",
            "children": [
              {
                "path": ":authName",
                "element": React.createElement(__pages_import_4__),
                "loader": __pages_import_4___Loader,
                "errorElement": React.createElement(__pages_import_4___Catch)
              }
            ]
          },
          {
            "path": "content",
            "element": React.createElement(__pages_import_5__),
            "children": [
              {
                "path": "backend",
                "element": React.createElement(__pages_import_6__)
              },
              {
                "element": React.createElement(__pages_import_7__),
                "children": [
                  {
                    "path": "front",
                    "element": React.createElement(__pages_import_8__),
                    "children": [
                      {
                        "path": "Vue",
                        "element": React.createElement(__pages_import_9__)
                      },
                      {
                        "path": "React",
                        "element": React.createElement(__pages_import_10__)
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            "path": "examples",
            "children": [
              {
                "path": "*",
                "element": React.createElement(__pages_import_11__)
              }
            ]
          },
          {
            "path": "post",
            "element": React.createElement(React.Suspense, {fallback: React.createElement(__pages_import_12___Pending), children: [React.createElement(__pages_import_12__, {key: __pages_import_12__})]})
          }
        ]
      },
      {
        "path": "/subignore",
        "element": React.createElement(__pages_import_13__),
        "children": [
          {
            "path": "sub",
            "element": React.createElement(__pages_import_14__)
          }
        ]
      }
    ]
  },
  {
    "path": "*",
    "element": React.createElement(__pages_import_15__)
  }
];
  "
`)
})