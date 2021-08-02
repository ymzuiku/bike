# bike

> Fast start typescript node.js project

Use cluster auto fork code at file save;

## Install

```bash
npm install --save-dev bike
```

## Simple Example

add package.json

```json
{
  "scripts": {
    "dev": "bike -w",
    "test": "bike -w --test",
    "cover": "bike -r=html",
    "build": "bike"
  }
}
```

Run Dev Server:

```bash
npm run dev
```

Build release

```bash
npm run build
```

Run test

```bash
npm run test
```

View Cover

```bash
npm run cover
```

## Use CLI Options

Use `bike --help`:

```
Options:
      --help          Show help                                        [boolean]
      --version       Show version number                              [boolean]
      --show-config   Log cli config at run           [boolean] [default: false]
      --src           Source dir                       [string] [default: "src"]
      --out           Build out dir, server default dist, test default dist-test
                                                                        [string]
      --public        Auto copy public's files to out
                                                    [string] [default: "public"]
      --entry         Main typescript file, default: ${src}/index.ts    [string]
      --base          Pick in [nodejs, browser, aoife]
                                                    [string] [default: "nodejs"]
      --spawn         Use child_process.spawn replace cluster.fork
                                                      [boolean] [default: false]
      --copy          Copy other file to dist                            [array]
      --minify        Esbuild minify                                   [boolean]
      --bundle        Esbuild bundle               [boolean] [default: true]
      --depend        Esbuild bundle dependencies [boolean] [default: false]
  -e, --external      Esbuild external                                   [array]
      --define        Esbuild define                                    [string]
      --target        Esbuild target                   [string] [default: "es6"]
      --splitting     Esbuild splitting                                [boolean]
      --format        Esbuild format                   [string] [default: "esm"]
      --sourcemap     Esbuild use sourcemap                            [boolean]
      --jsx-factory   Esbuild jsx-factory                               [string]
      --jsx-fragment  Esbuild jsx-fragment                              [string]
  -t, --test          Is use test                     [boolean] [default: false]
      --all           Always test all case, ignore .bike.test.yaml
                                                      [boolean] [default: false]
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
