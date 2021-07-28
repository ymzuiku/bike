# bike

> Fast start typescript node.js project

Use cluster auto fork code at file save;

## Install

```sh
yarn add bike -D
```

add package.json

```json
{
  "scripts": {
    "dev": "bike -w",
    "build": "bike"
  }
}
```

## Use

Run Dev Server:

```sh
yarn dev
```

Build release

```sh
yarn build
```

## CLI Options / Configuration

Use `bike --help`:

```
Options:
      --help                Show help                 [boolean]
      --version             Show version number       [boolean]
  -o, --out                 Build dist path
                                     [string] [default: "dist"]
  -p, --public              Auto copy public's files to out
                                   [string] [default: "public"]
  -s, --src                 Source dir[string] [default: "src"]
  -e, --entry               Main typescript file
                             [string] [default: "src/index.ts"]
  -m, --sourcemap           Esbuild use sourcemap
                                      [boolean] [default: true]
  -t, --test                Is use test
                                     [boolean] [default: false]
      --start               Start server after on build
                                     [boolean] [default: false]
      --platform            Esbuild platform
                                     [string] [default: "node"]
  -w, --watch               Watch dir on change reload
                                     [boolean] [default: false]
      --clear               On reload auto clear
                                      [boolean] [default: true]
  -r, --reporter            (bike-tdd) c8 reporter, pick in
                            :[text, html]              [string]
      --match               (bike-tdd) test files RegExp string
                [string] [default: "(.test|.spec|_test|_spec)"]
      --rematch             (bike-tdd) auto rematch all test
                            files on watch
                                     [boolean] [default: false]
      --c8-include, --c8-i  (bike-tdd) c8 include all files
                                     [boolean] [default: false]
      --c8-config           (bike-tdd) c8 path to JSON
                            configuration file
                                         [string] [default: ""]
      --c8-exclude          (bike-tdd) c8 exclude all files
                                     [boolean] [default: false]
      --skip-full           (bike-tdd) c8 skip full in text
                            that ignore in html       [boolean]
```

## keepDependencies

bike 默认会排除依赖的编译, 若有确定需要编译的依赖对象, 如 link 的本地资源，请配置 package.keepDependencies 属性，如

package.json:

```json
{
  "bike": {
    "keepDependencies": {
      "clino": 1,
      "clino-client": 1
    }
  }
}
```

此时 bike 会编译 clino 库到 dist 中

## copyFiles

bike 默认会拷贝以下文件到 dist 中

```
.env
package-lock.json
pnpm-lock.yaml
yarn.lock
```

若需要增加其他文件，可以配置 package.json 的 copyFiles 属性：

package.json:

```json
{
  "bike": {
    "copyFiles": [".env.local", ".env.test"]
  }
}
```
