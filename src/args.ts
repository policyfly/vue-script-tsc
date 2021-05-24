import { resolve } from 'path'

export interface Options {
  /**
   * The directory to be treated as the root (normally where your `tsconfig.json` file exists).
   */
  root?: string
  /**
   * The path to the src directory containing your vue files.
   */
  src?: string
  /**
   * The path to the `tsconfig.json` file.
   */
  tsconfig?: string
  /**
   * If using `incremental` builds, where to store the tsbuildinfo file.
   */
  tsbuildinfo?: string
}

export function parseArgs(opts: Options): Required<Options> {
  const cwd = resolve(__dirname)
  const root = opts.root ? resolve(cwd, opts.root) : cwd
  const src = opts.src ? resolve(cwd, opts.src) : resolve(cwd, 'src')
  const tsconfig = opts.tsconfig || 'tsconfig.json'
  const tsbuildinfo = opts.tsbuildinfo ? resolve(cwd, opts.tsbuildinfo) : ''

  return {
    root,
    src,
    tsconfig,
    tsbuildinfo,
  }
}
