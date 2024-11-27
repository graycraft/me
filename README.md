# Graycraft

Client and server logic of the [graycraft.me](https://graycraft.me) website.

## Requirements

Bash ^5.0.0:

```bash
$ bash --version
  GNU bash, version 5.1.16(1)-release
```

Node.js 22.11.0:

```bash
$ node -v
  v22.11.0
```

NPM 10.9.0:

```bash
$ npm -v
  10.9.0
```

## Setup

### Debian / Ubuntu

```bash
$ sudo apt-get install build-essential libcairo2-dev libgif-dev libjpeg-dev libpango1.0-dev librsvg2-dev
```

<https://www.npmjs.com/package/canvas>

### Git

Clone the Git repository:

```bash
$ git clone <gh|https|ssh>graycraft/me.git
```

### Node.js

Use appropriate Node.js version:

```bash
$ nvm use
```

### NPM

Install modules for usage:

```bash
$ npm i --production
```

Install modules for development:

```bash
$ npm i
```

### Environment

Optionally `NODE_NO_WARNINGS` can be exported from `.env` file to silence process warnings regarding experimental features.

This command also enables `--experimental-vm-modules` option for running [Jest with ESM](https://jestjs.io/docs/ecmascript-modules):

```bash
$ export $(cat .env.production | xargs)
```

## Usage

Run production server script:

```bash
$ npm start
```
