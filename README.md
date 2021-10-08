# Vue Script TSC

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Semantic Release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

⚡️ A lightning fast TypeScript type checker for Vue SFC Script tags ⚡️

## Features

- Type Checks the `<script>` tags of `.vue` files + any related `.ts` files
- Can be run in a CLI without requiring a build tool (such as webpack)
- Uses your local TypeScript version
- Respects files/include/exclude as specified in your `tsconfig.json`
- Simple, lightweight & fast

## Prerequisites

- Node ^12.0.0
- TypeScript ^3.0.0

## Usage

To get started, install `vue-script-tsc`.

```bash
yarn add -D vue-script-tsc
```

### CLI

You can run `vue-script-tsc` as a script, for example in package.json or on the command line.

```json
// package.json
"scripts": {
  "tsc": "yarn vue-script-tsc --root ."
}
```

```bash
# Command line
yarn vue-script-tsc --root .
```

### Programmatic

You can call `vue-script-tsc` within your own script.

```ts
const { tsc } = require('vue-script-tsc');

tsc({
  root: process.cwd()
})
  .then(() => {
    console.log('Type Check Complete')
  })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
```

### Arguments

You can specify some arguments with either usage. For CLI arguments prepend with a `--`, for example `--root src`. For programmatic pass an options object with these as keys.

| Option        | Default           | Description                                                                                           |
| ------------- | ----------------- | ----------------------------------------------------------------------------------------------------- |
| `root`        | Current Directory | The relative path to the directory to be treated as the root (where your `tsconfig.json` file exists) |
| `tsconfig`    | `tsconfig.json`   | The name of your `tsconfig.json` file (*)                                                             |

(*) It is recommended you use a dedicated `tsconfig.json` for `vue-script-tsc`. If you use incremental builds you should specify a different `compilerOptions.tsBuildInfoFile`.

## Comparisons

### [vue-tsc](https://github.com/johnsoncodehk/vue-tsc)

- Can also type check the Template within SFCs
- Only supports Vue3
- Currently does not provide an option to skip Template type checking

### Webpack (vue-cli)

- Only checks whilst running a development server or after a build
- Requires compiling the entire app before type checking
- Does not type check the Template (same as vue-script-tsc)
- On a real life project took >240s compared to vue-script-tsc which took ~30s

## Technical Details

Type checking SFC (`.vue`) files, especially in Vue2, can be a painful process. The main problem is that the SFC layout means that it has to be preprocessed into TypeScript first, including converting the Template into a render function that can be type checked.

However the bulk of the logic is in the `<script>` tag, which in itself is just TypeScript. So if we ignore everything else except that then the only preprocessing we need is to remove everything except what is in that tag. This is essentially how `vue-script-tsc` works. We create a custom compiler host which extracts only the `<script>` tag from `.vue` files.

The only other caveat is that TypeScript will refuse to check a file that does not have an extension it recognises. So we trick it into processing them by appending `.ts` whenever referring to a `.vue` file, which we then remove when actually trying to access the file.

## License

Please see [LICENSE](./LICENSE).
