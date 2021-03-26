# airt

Use cluster auto fork code at file save;

## Install

```sh
yarn add airt -D
```

add package.json

```json
{
  "scripts": {
    "dev": "airt src",
    "build": "airt src --build"
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

airt copy `public/` to `dir`;
