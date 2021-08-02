# bike

> Fast start typescript node.js project

Use cluster auto fork code at file save;

## Install

```bash
npm install --save-dev bike
```

## Simple Example

### Create project

```bash
# Make project and files
mkdir your-project
cd your-project
mkdir src
touch src/index.ts

# Install bike
npm install --save-dev bike
```

Add some code in src/index.ts

```ts
console.log("Hello bike");
```

### Run and test

Run Dev Server:

```bash
npx bike --watch
```

Build release

```bash
npx bike
```

Run test

```bash
npx bike --watch --test
```

View test cover

```bash
npx bike --reporter=text
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
      --outfile       Build out dir index name    [string] [default: "index.js"]
      --public        Auto copy public's files to out
                                                    [string] [default: "public"]
      --entry         Main typescript file, default: ${src}/index.ts    [string]
      --base          Pick in [nodejs, browser, aoife]
                                                    [string] [default: "nodejs"]
      --spawn         Use child_process.spawn replace cluster.fork
                                                      [boolean] [default: false]
      --copy          Copy other file to dist                            [array]
      --minify        Esbuild minify                                   [boolean]
      --bundle        Esbuild bundle                   [boolean] [default: true]
      --depend        Esbuild bundle dependencies     [boolean] [default: false]
  -e, --external      Esbuild external                                   [array]
      --define        Esbuild define                                    [string]
      --target        Esbuild target                   [string] [default: "es6"]
      --splitting     Esbuild splitting                                [boolean]
      --format        Esbuild format                                    [string]
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
  -r, --reporter      (only-test) c8 reporter, pick in :[text, html]    [string]
      --match         (only-test) test files RegExp string
                                 [string] [default: "(.test|.spec|_test|_spec)"]
      --rematch       (only-test) auto rematch all test files on watch
                                                      [boolean] [default: false]
      --c8-include    (only-test) c8 include all files[boolean] [default: false]
      --c8-config     (only-test) c8 path to JSON configuration file
                                                          [string] [default: ""]
      --c8-exclude    (only-test) c8 exclude all files[boolean] [default: false]
      --skip-full     (only-test) c8 skip full in text that ignore in html
                                                                       [boolean]
```
