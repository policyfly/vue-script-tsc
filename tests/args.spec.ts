import { resolve } from 'path'
import { Options, parseArgs } from '../src/args'

const cwd = resolve(__dirname, '..')

describe('args', () => {
  describe('parseArgs', () => {
    test('uses default values', () => {
      expect(parseArgs({})).toEqual({
        root: cwd,
        src: resolve(cwd, 'src'),
        tsconfig: 'tsconfig.json',
        tsbuildinfo: '',
      })
    })

    test('uses provided values', () => {
      const options: Required<Options> = {
        root: '/tmp',
        src: 'app',
        tsconfig: 'tsconfig.app.json',
        tsbuildinfo: 'test.tsbuildinfo',
      }
      expect(parseArgs(options)).toEqual({
        root: resolve(cwd, options.root),
        src: resolve(cwd, options.src),
        tsconfig: 'tsconfig.app.json',
        tsbuildinfo: resolve(cwd, options.tsbuildinfo),
      })
    })
  })
})
