# bike

Easy build nodejs code to safe deploy to other service.

<img src="bike.svg" alt="bike">

## argv

- `--watch`
- `--dev`
- `--build`
- `--crypto`
- `--byte`
- `--crypto-byte`
- `--browser`

## Develop

Build code to nodejs, hot reload in your coding code.

`--dev` = `--watch` + `--build`

```sh
bike src/index.ts dist/index.js --dev
```

## Build

Build code to nodejs in one file.

```sh
bike src/index.ts dist/index.js --build
```

## Only watch

Build code to nodejs in one file.

```sh
bike src/index.ts dist/index.js --watch
```

## Build to crypto

Build code to nodejs and crypto your source code.

```sh
bike src/index.ts dist/index.js --crypto
```

## Build to bytecode

Build code to v8 bytecode.

```sh
# project need install bytenode
npm install --save-dev bytenode
bike src/index.ts dist/index.js --byte
```

## Build to crypto + bytecode

Build code to nodejs, crypto and build v8 bytecode.

```sh
# project need install bytenode
npm install --save-dev bytenode
bike src/index.ts dist/index.js --crypto-byte
```

## Browser

Build code to browser, need out a dir, builwatch and build split code.

```sh
bike src/index.ts dist --browser
```

## Kill port on run

Run dev and kill 5000 port last time.

```sh
bike src/index.ts dist/index.js --dev 5000
```

## Use args

Other args after `--`:

```sh
bike src/index.ts dist/index.js --dev 5000 node -- --experimental-fetch
```
