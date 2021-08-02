# bike

> Fast start typescript node.js project

Use cluster auto fork code at file save;

## Install

```sh
npm install --save-dev bike
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

## First Start

Run Dev Server:

```sh
yarn dev
```

Build release

```sh
yarn build
```

## Use CLI Options

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
      --lib           If lib is true, not compiler dependencies
                                                      [boolean] [default: false]
  -b, --base          Pick in nodejs, browser, aoife[string] [default: "nodejs"]
  -m, --minify        Esbuild minify                                   [boolean]
      --copy          copy file to dist                                  [array]
  -e, --external      Esbuild external                                   [array]
      --define        Esbuild define                                    [string]
      --target        Esbuild target                   [string] [default: "es6"]
      --splitting     Esbuild splitting               [boolean] [default: false]
      --format        Esbuild format                                    [string]
      --sourcemap     Esbuild use sourcemap                            [boolean]
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
