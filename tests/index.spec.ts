import { join } from 'path'
import { tsc } from '../src'

const fixturesDir = join('tests', 'fixtures')

describe('index', () => {
  let consoleSpy: jest.SpyInstance
  beforeAll(() => {
    consoleSpy = jest.spyOn(console, 'log').mockReturnValue()
  })
  beforeEach(() => {
    consoleSpy.mockClear()
  })
  afterAll(() => {
    consoleSpy.mockRestore()
  })

  describe('tsc', () => {
    test('succeeds if no errors', async () => {
      try {
        await tsc({
          root: fixturesDir,
          src: join(fixturesDir, 'src-clean'),
          tsconfig: 'tsconfig.clean.json',
        })
      } catch (err) {
        expect(consoleSpy).not.toBeCalled()
      }
    })

    test('throws errors in vue files', async () => {
      try {
        await tsc({
          root: fixturesDir,
          src: join(fixturesDir, 'src-error-vue'),
          tsconfig: 'tsconfig.error-vue.json',
        })
        expect('Should not have passed').toBeFalsy()
      } catch (err) {
        expect(err.message).toBe('Type Check returned errors, see above')
        expect(consoleSpy).toBeCalledTimes(1)
        expect(consoleSpy.mock.calls[0][1]).toContain(
          "App.vue (14,7): Type 'string' is not assignable to type 'number'."
        )
      }
    })

    test('throws errors in imported files', async () => {
      try {
        await tsc({
          root: fixturesDir,
          src: join(fixturesDir, 'src-error-ts'),
          tsconfig: 'tsconfig.error-ts.json',
        })
        expect('Should not have passed').toBeFalsy()
      } catch (err) {
        expect(err.message).toBe('Type Check returned errors, see above')
        expect(consoleSpy).toBeCalledTimes(1)
        expect(consoleSpy.mock.calls[0][1]).toContain(
          "messages.ts (1,14): Type 'string' is not assignable to type 'number'."
        )
      }
    })

    test('respects exclude option', async () => {
      try {
        await tsc({
          root: fixturesDir,
          src: join(fixturesDir, 'src-ignore'),
          tsconfig: 'tsconfig.ignore.exclude.json',
        })
      } catch (err) {
        expect(consoleSpy).not.toBeCalled()
      }
    })

    test('respects files option', async () => {
      try {
        await tsc({
          root: fixturesDir,
          src: join(fixturesDir, 'src-ignore'),
          tsconfig: 'tsconfig.ignore.files.json',
        })
      } catch (err) {
        expect(consoleSpy).not.toBeCalled()
      }
    })

    test('respects include option', async () => {
      try {
        await tsc({
          root: fixturesDir,
          src: join(fixturesDir, 'src-ignore'),
          tsconfig: 'tsconfig.ignore.include.json',
        })
      } catch (err) {
        expect(consoleSpy).not.toBeCalled()
      }
    })
  })
})
