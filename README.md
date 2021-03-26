# air-dev

Use cluster auto fork code at file save;

## Install

```sh
yarn add air-dev -D
```

add package.json

```json
{
  "scripts": {
    "dev": "air-dev src",
    "build": "air-dev src --build"
  }
}
```

## Use

Run Dev Server:

```sh
$ yarn dev
```

Build release

```sh
$ yarn build
```

## Public dir

air-dev copy `public/` to `dir`;
