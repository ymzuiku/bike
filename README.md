**Fast start typescript full stack (NodeJs/Native Browser JS) project**

<h1 style="font-size:64px; font-weight:700"><span style="font-size:84px">🚲</span> Bike</h1>

<img src="bike.svg" alt="bike">



Bike only helps you prepare the front and back end typescript and test development environment, and will not add any functions presumptuously.

## Install

Install bike in global

```bash
npm i -g bike
```

## Simple Example

### Build Browser library

```bash
bike lib --browser --out=cjs
```

### Only Run Nodejs project

```bash
# Make project and files
mkdir your-project
cd your-project
mkdir src
touch src/index.ts
touch src/index_test.ts
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

Run Dev Server:

```bash
bike src --watch=src
```

Build release

```bash
bike src
```

Run test

```bash
bike src --watch=src --test
```

View test cover, need install c8

```bash
npm i -g c8
bike src --reporter=text
```


## Full stack example

Create project:

```bash
mkdir full-stack
npm i --save-dev bike
npm i --save fastify

mkdir app
touch app/index.ts

mkdir client
touch client/index.ts
touch client/index.css

mkdir public
touch public/index.html
```

Edited some codes:

app/index.ts:

```ts
import fastify from "fastify";

const app = fastify();

app.get("/v1/hello", async () => {
  return { msg: "world" };
});

app.listen(5000, () => {
  console.log("Server listen: http://localhost:5000");
});
```

client/index.css:

```css
body {
  padding: 0px;
  margin: 0px;
}
```

client/index.ts:

```ts
import "./index.css";

export const App = () => {
  const div = document.createElement("div");
  div.textContent = "loading...";

  fetch("/v1/hello")
    .then((v) => v.text())
    .then((v) => {
      div.textContent = v;
    });

  return div;
};

document.body.append(App());
```

public/index.html:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <script type="module" src="../client/index.ts"></script>
  </body>
</html>
```

Ok, start your work:

```bash
bike app --html=public/index.html -w --proxy=/v1::http://localhost:5000
# or build release
bike app --html=public/index.html
# or hot test
bike app,client -w --test
```

## Use bundle depend

Bundle all dependencies in `bundle.js`

```bash
bike app --depend
```

If you need keep some dependencies in node_modules:

Keep `sequelize` not bundle, example from package.json:

```json
{
  "noBundleDependencies": ["mysql2"]
}
```



## Use CLI Options

Use `bike --help`:

```
Options:
      --help          Show help                                        [boolean]
      --version       Show version number                              [boolean]
      --argv          Backup all argv                                    [array]
      --log-config    Log cli config at run           [boolean] [default: false]
      --browser       Use build browser types                          [boolean]
  -h, --html          Use base html When type is browser                [string]
      --html-out      Build client out dir, server default dist/client  [string]
      --out           Build out dir, server default dist/server, test default
                      dist/test                                         [string]
      --outfile       Build out dir index name    [string] [default: "index.js"]
      --static        Auto copy static's files to out
                                                    [string] [default: "static"]
      --public        Auto copy public's files to html-out
                                                    [string] [default: "public"]
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
                      es2018                        [string] [default: "es2018"]
      --splitting     Esbuild splitting                                [boolean]
      --format        Esbuild format                                    [string]
      --sourcemap     Esbuild use sourcemap                            [boolean]
  -t, --test          Is use test                     [boolean] [default: false]
      --all           Always test all case, ignore .bike.test.yaml
                                                      [boolean] [default: false]
  -f, --focus         Use RegExp focus some test                        [string]
      --start         Start server after on build     [boolean] [default: false]
      --platform      Esbuild platform                [string] [default: "node"]
  -w, --watch         Watch some dir on change reload, example: '-w=server
                      -w=pkg'                              [array] [default: []]
      --clear         On reload auto clear             [boolean] [default: true]
      --gzip          (only-browser) gzip watch is false, else is true [boolean]
      --host          (only-browser) browser serve host
                                                 [string] [default: "127.0.0.1"]
      --port          (only-browser) browser serve port[number] [default: 13000]
      --path-prefix   (only-browser) public file path prefix
                                                         [string] [default: "/"]
      --url-prefix    (only-browser) html file url prefix[string] [default: "/"]
      --proxy         (only-browser) Example:
                      '--proxy=/v1::http://127.0.0.1:5000' is proxy /v1 to
                      http://127.0.0.1:5000/v1                           [array]
  -r, --reporter      (only-test) c8 reporter, pick in :[text, html]    [string]
      --test-include  (only-test) test files include RegExp string
                                 [string] [default: "(.test|.spec|_test|_spec)"]
      --rematch       (only-test) auto rematch all test files on watch
                                                      [boolean] [default: false]
  -n, --c8-include    (only-test) c8 include all files                   [array]
  -x, --c8-exclude    (only-test) c8 exclude all files                   [array]
      --c8-all        (only-test) c8 all files         [boolean] [default: true]
      --c8-config     (only-test) c8 path to JSON configuration file    [string]
      --c8-skip-full  (only-test) c8 skip full in text that ignore in html
                                                                       [boolean]
```
