import { resolve } from 'path'
import { Options, parseArgs } from '../src/args'

const cwd = resolve(__dirname, '..')

describe('args', () => {
  describe('parseArgs', () => {
    test('uses default values', () => {
      expect(parseArgs({})).toEqual({
        root: cwd,
        tsconfig: 'tsconfig.json',
      })
    })

    test('uses provided values', () => {
      const options: Required<Options> = {
        root: '/tmp',
        tsconfig: 'tsconfig.app.json',
      }
      expect(parseArgs(options)).toEqual({
        root: resolve(cwd, options.root),
        tsconfig: 'tsconfig.app.json',
      })
    })
  })
})
