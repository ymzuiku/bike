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
touch src/index_test.ts

# Install bike
npm install --save-dev bike
```

Add some code in src/index.ts

```ts
console.log("Hello bike");
```

Add some test code in src/index_test.ts

```ts
import { test } from "bike/test";

test.it("index test", (so) => {
  so.deepEqual(21, 23);
});
```

### Run and test

Run Dev Server:

```bash
npx bike src --watch
```

Build release

```bash
npx bike src
```

Run test

```bash
npx bike src --watch --test
```

View test cover, need install c8

```bash
npm i -g c8
npx bike src --reporter=text
```

## Use CLI Options

Use `bike --help`:

```
Options:
      --help          Show help                                        [boolean]
      --version       Show version number                              [boolean]
      --argv          Backup all argv                                    [array]
      --log-config    Log cli config at run           [boolean] [default: false]
      --html          Use base html When type is browser
                                                [string] [default: "index.html"]
      --html-text     Use html-text replace html          [string] [default: ""]
      --out           Build out dir, server default dist, test default dist-test
                                                                        [string]
      --outfile       Build out dir index name    [string] [default: "index.js"]
      --static        Auto copy static's files to out
                                                    [string] [default: "static"]
      --entry         Main typescript file, default: ${source}/index.ts [string]
      --spawn         Use child_process.spawn replace cluster.fork
                                                      [boolean] [default: false]
      --copy          Copy other file to dist                            [array]
  -m, --minify        Esbuild minify                                   [boolean]
      --bundle        Esbuild bundle                   [boolean] [default: true]
      --depend        Esbuild bundle dependencies                      [boolean]
  -e, --external      Esbuild external                                   [array]
      --define        Esbuild define                                    [string]
      --target        Esbuild target, browser default: es6, nodejs default:
                      esnext                                            [string]
      --splitting     Esbuild splitting                                [boolean]
      --format        Esbuild format                                    [string]
      --sourcemap     Esbuild use sourcemap                            [boolean]
  -t, --test          Is use test                     [boolean] [default: false]
      --all           Always test all case, ignore .bike.test.yaml
                                                      [boolean] [default: false]
  -f, --focus         Use RegExp focus some test                        [string]
      --start         Start server after on build     [boolean] [default: false]
      --platform      Esbuild platform                [string] [default: "node"]
  -w, --watch         Watch dir on change reload      [boolean] [default: false]
      --clear         On reload auto clear             [boolean] [default: true]
      --gzip          (only-browser) gzip watch is false, else is true [boolean]
      --host          (only-browser) browser serve host
                                                 [string] [default: "127.0.0.1"]
      --port          (only-browser) browser serve port [number] [default: 3300]
      --path-prefix   (only-browser) public file path prefix
                                                         [string] [default: "/"]
      --proxy         (only-browser) Example: '/bike|http://127.0.0.1:5000' is
                      proxy /bike to http://127.0.0.1:5000/bike          [array]
  -r, --reporter      (only-test) c8 reporter, pick in :[text, html]    [string]
      --match         (only-test) test files RegExp string
                                 [string] [default: "(.test|.spec|_test|_spec)"]
      --rematch       (only-test) auto rematch all test files on watch
                                                      [boolean] [default: false]
  -n, --c8-include    (only-test) c8 include all files                   [array]
  -x, --c8-exclude    (only-test) c8 exclude all files                   [array]
      --c8-config     (only-test) c8 path to JSON configuration file    [string]
      --c8-skip-full  (only-test) c8 skip full in text that ignore in html
                                                                       [boolean]
```
