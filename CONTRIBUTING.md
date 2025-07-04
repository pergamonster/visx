# Contributing

Contributions welcome! Please follow the [code of conduct](./CODE_OF_CONDUCT.md).

## Overview

[Yarn workspaces](https://yarnpkg.com/lang/en/docs/workspaces/) are used to manage dependencies and
build config across packages in the umbrella `visx` monorepo, and
[lerna](https://github.com/lerna/lerna/) is used to manage versioning.

## Project structure

```
visx/
  lerna.json
  package.json
  packages/
    visx-package-1/
      src/
      test/
      build/
      package.json
      ...
    visx-package-2/
      ...
    ...
```

## Local development

Run the following to setup your local dev environment:

```sh
# Install `yarn`, alternatives at https://yarnpkg.com/en/docs/install
curl -o- -L https://yarnpkg.com/install.sh | bash

# Clone or fork `visx`
git clone git@github.com:airbnb/visx.git # or your fork
cd visx

# install dependencies, and have `yarn` symlink within-`visx` dependencies
yarn

# build packages and generate types for local development
yarn build
```

#### Rebuild specific package(s)

Upon modification of a single `package` you can run the following to rebuild it. Note that you can
specify multiple packages to build this way, and optionally append `--watch` to continuously watch
for changes.

```sh
# build the specified package(s) as cjs + esm versions
# example `PKG=@visx/axis yarn babel:pkg`
PKG=@visx/{package[,package]} yarn babel:pkg

# generate d.ts(definition files) the specified package(s)
# and rebuild any other packages the specified package(s) depend on
# example `PKG=@visx/axis yarn type:pkg`
PKG=@visx/{package[,package]} yarn type:pkg
```

from the `visx` monorepo root to re-build the package with your changes.

#### Running demo pages

You can use the local [`next.js`](https://nextjs.org) dev server within `packages/visx-demo` to view
and iterate on your changes in the gallery. From the `packages/visx-demo` folder run `yarn dev` to
start the next server which (if correctly sym-linked) will also watch for changes you make to other
packages (upon re-building them, see above section).
