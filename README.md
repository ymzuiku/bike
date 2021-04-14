# airt

> Fast start typescript node.js project

Use cluster auto fork code at file save;

## Install

```sh
yarn add airt typescript tslib -D
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
yarn dev
```

Build release

```sh
yarn build
```

## static dir

airt copy `static/` to `dir`;

## Set out dir and static dir

```sh
out="build" static="public" yarn dev
```
