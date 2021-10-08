import { resolve } from 'path'

export interface Options {
  /**
   * The directory to be treated as the root (normally where your `tsconfig.json` file exists).
   */
  root?: string
  /**
   * The path to the `tsconfig.json` file.
   */
  tsconfig?: string
}

export function parseArgs(opts: Options): Required<Options> {
  const cwd = process.cwd()
  const root = opts.root ? resolve(cwd, opts.root) : cwd
  const tsconfig = opts.tsconfig || 'tsconfig.json'

  return {
    root,
    tsconfig,
  }
}
