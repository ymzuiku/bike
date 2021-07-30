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
      --help          Show help                                        [boolean]
      --version       Show version number                              [boolean]
  -s, --src           Source dir                       [string] [default: "src"]
  -o, --out           Build out dir                   [string] [default: "dist"]
  -p, --public        Auto copy public's files to out
                                                    [string] [default: "public"]
      --entry         Main typescript file, default: ${src}/index.ts    [string]
      --keep          Don't compiler dependencies     [boolean] [default: false]
  -b, --base          Pick in nodejs, browser, aoife[string] [default: "nodejs"]
  -m, --minify        Esbuild minify                  [boolean] [default: false]
      --copy          copy file to dist                                  [array]
  -e, --external      Esbuild external                                   [array]
      --define        Esbuild define                                    [string]
      --target        Esbuild target                   [string] [default: "es6"]
      --splitting     Esbuild splitting               [boolean] [default: false]
      --format        Esbuild format                                    [string]
      --sourcemap     Esbuild use sourcemap            [boolean] [default: true]
      --jsx-factory   Esbuild jsx-factory                               [string]
      --jsx-fragment  Esbuild jsx-fragment                              [string]
  -t, --test          Is use test                     [boolean] [default: false]
      --start         Start server after on build     [boolean] [default: false]
      --platform      Esbuild platform                [string] [default: "node"]
  -w, --watch         Watch dir on change reload      [boolean] [default: false]
      --clear         On reload auto clear             [boolean] [default: true]
  -r, --reporter      (bike-tdd) c8 reporter, pick in :[text, html]     [string]
      --match         (bike-tdd) test files RegExp string
                                 [string] [default: "(.test|.spec|_test|_spec)"]
      --rematch       (bike-tdd) auto rematch all test files on watch
                                                      [boolean] [default: false]
      --c8-include    (bike-tdd) c8 include all files [boolean] [default: false]
      --c8-config     (bike-tdd) c8 path to JSON configuration file
                                                          [string] [default: ""]
      --c8-exclude    (bike-tdd) c8 exclude all files [boolean] [default: false]
      --skip-full     (bike-tdd) c8 skip full in text that ignore in html
                                                                       [boolean]
```

## Copy Files

bike 默认会拷贝 .env 文件到 dist 中，若要添加其他文件，可以添加 --copy 参数:

```
bike --copy=package.json --copy=README.md
```

若需要增加其他文件，可以配置 package.json 的 copy 属性：

package.json:

```json
{
  "bike": {
    "copy": [".env.local", ".env.test"]
  }
}
```

## keep Dependencies

bike 在非 watch 环境，会将所有依赖编译到一个 index.js 中，方便生产环境不需要安装依赖，若希望如此，可以添加 --keep 参数，表示不编译依赖，并且使用 --copy 拷贝依赖所需文件到编译目录：

```
bike --keep --copy=package.json --copy=yarn.lock
```
