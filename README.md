# Graycraft

Client and server logic of the [graycraft.me](https://graycraft.me) website.

## Prerequisites

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

### Linux

Debian 8+ or Ubuntu 20+:

```bash
$ lsb_release -a
  No LSB modules are available.
  Distributor ID:	Debian
  Description:	Debian GNU/Linux 11 (bullseye)
  Release:	11
  Codename:	bullseye
```

Bash ^5.0.0:

```bash
$ bash --version
  GNU bash, version 5.1.16(1)-release
```

This environment is **recommended for contributions and bugreports**.

### MacOS

### Windows

## Setup

### Git

Clone the Git repository and change the current directory:

```bash
$ git clone <gh|https|ssh>graycraft/me
$ cd me
```

### Node.js

Use appropriate Node.js version:

```bash
$ nvm use
```

### NPM

Install modules for production usage:

```bash
$ npm i --production
```

or install modules for development:

```bash
$ npm i
```

## Usage

Run production server:

```bash
$ npm start
```

or development server (in watch mode):

```bash
$ npm run node:watch
```
