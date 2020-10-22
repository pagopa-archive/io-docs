# IO Docs

This repository contains documentation for the IO project:

https://pagopa.github.io/io-docs

This website is built using [Docusaurus 2](https://v2.docusaurus.io/),
a modern static website generator.

## Installation

```console
yarn install
```

## Local Development

```console
yarn start
```

This command starts a local development server and open up a browser window. Most changes are reflected live without having to restart the server.

## Build

```console
yarn build
```

This command generates static content into the `build` directory.

## Deployment

The website is built and deployed to GH-Pages for every change to the main branch using
a [GitHub action](./github/documentation.yml).
