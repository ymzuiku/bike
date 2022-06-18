
<h1 style="font-size:64px; font-weight:700"><span style="font-size:84px">🚲</span> Bike: Fast start typescript NodeJs project</h1>

<img src="bike.svg" alt="bike">

# bike

Easy build nodejs code to safe deploy to other service.

## argv

- `--watch`
- `--dev`
- `--browser`
- `--build`
- `--crypto`
- `--byte`
- `--crypto-byte`

## Watch

Build code to nodejs in one file.

```sh
bike src/index.ts dist/index.js --watch
```

## Build

Build code to nodejs in one file.

```sh
bike src/index.ts dist/index.js --build
```

## Develop

Build code to nodejs, hot reload in your coding code.

`--dev` =  `--watch` + `--build`

```sh
bike src/index.ts dist/index.js --dev
```

## Browser

Build code to browser, need out a dir

```sh
bike src/index.ts dist --browser
```


## Build to crypto

Build code to nodejs and crypto your source code.

```sh
bike src/index.ts dist/index.js --crypto
```

## Build to bytecode

Build code to v8 bytecode.

```sh
bike src/index.ts dist/index.js --byte
```


## Build to crypto + bytecode

Build code to nodejs, crypto and build v8 bytecode.

```sh
bike src/index.ts dist/index.js --crypto-byte
```