import { readFile, rm } from 'fs/promises'
import { join, resolve } from 'path'
import { tsc } from '../src'

const fixturesDir = join('tests', 'fixtures')

describe('index', () => {
  // Setup
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

  /**
   * Assertions for checking the `src-error-ts` directory.
   */
  function errorTSExpectations(err: Error) {
    expect(err.message).toBe('Type Check returned errors, see above')
    expect(consoleSpy).toBeCalledTimes(1)
    expect(consoleSpy.mock.calls[0][1]).toContain(
      "/tests/fixtures/src-error-ts/messages.ts (1,14): Type 'string' is not assignable to type 'number'."
    )
  }

  /**
   * @param buildInfo The path to the `.tsbuildinfo` file.
   * @param strings Asserts each of the provided strings appears in the buildInfo file.
   */
  async function checkBuildFile(buildInfo: string, strings: string[]) {
    const buildFile = await readFile(buildInfo, 'utf-8')
    for (const str of strings) {
      expect(buildFile).toContain(str)
    }
  }

  // Tests
  describe('tsc', () => {
    test('succeeds if no errors', async () => {
      expect.assertions(1)
      try {
        await tsc({
          root: fixturesDir,
          tsconfig: 'tsconfig.clean.json',
        })
        expect(consoleSpy).not.toBeCalled()
      } catch (err) {
        expect(consoleSpy).not.toBeCalled()
      }
    })

    test('throws errors in vue files', async () => {
      expect.hasAssertions()
      try {
        await tsc({
          root: fixturesDir,
          tsconfig: 'tsconfig.error-vue.json',
        })
        expect('Should not have passed').toBeFalsy()
      } catch (err) {
        expect(err.message).toBe('Type Check returned errors, see above')
        expect(consoleSpy).toBeCalledTimes(1)
        expect(consoleSpy.mock.calls[0][1]).toContain(
          "/tests/fixtures/src-error-vue/App.vue (14,7): Type 'string' is not assignable to type 'number'."
        )
      }
    })

    test('throws errors in imported files', async () => {
      expect.hasAssertions()
      try {
        await tsc({
          root: fixturesDir,
          tsconfig: 'tsconfig.error-ts.json',
        })
        expect('Should not have passed').toBeFalsy()
      } catch (err) {
        errorTSExpectations(err)
      }
    })

    test('respects exclude option', async () => {
      expect.assertions(1)
      try {
        await tsc({
          root: fixturesDir,
          tsconfig: 'tsconfig.ignore.exclude.json',
        })
        expect(consoleSpy).not.toBeCalled()
      } catch (err) {
        expect(consoleSpy).not.toBeCalled()
      }
    })

    test('respects files option', async () => {
      expect.assertions(1)
      try {
        await tsc({
          root: fixturesDir,
          tsconfig: 'tsconfig.ignore.files.json',
        })
        expect(consoleSpy).not.toBeCalled()
      } catch (err) {
        expect(consoleSpy).not.toBeCalled()
      }
    })

    test('respects include option', async () => {
      expect.assertions(1)
      try {
        await tsc({
          root: fixturesDir,
          tsconfig: 'tsconfig.ignore.include.json',
        })
        expect(consoleSpy).not.toBeCalled()
      } catch (err) {
        expect(consoleSpy).not.toBeCalled()
      }
    })

    test('performs incremental builds (clean)', async () => {
      expect.hasAssertions()
      function runTSC() {
        return tsc({
          root: fixturesDir,
          tsconfig: 'tsconfig.clean.incremental.json',
        })
      }
      const buildInfo = resolve(fixturesDir, 'clean.tsbuildinfo')
      await rm(buildInfo, { force: true })
      try {
        await runTSC()
        await checkBuildFile(buildInfo, ['app.vue', 'other.vue', 'messages.ts'])

        // check that the build info file is able to be read, this should take much less time
        try {
          await runTSC()
        } catch (err) {
          expect(consoleSpy).not.toBeCalled()
        }
      } catch (err) {
        expect(consoleSpy).not.toBeCalled()
      }
    }, 20000)

    test('performs incremental builds (error)', async () => {
      expect.hasAssertions()
      function runTSC() {
        return tsc({
          root: fixturesDir,
          tsconfig: 'tsconfig.error-ts.incremental.json',
        })
      }
      const buildInfo = resolve(fixturesDir, 'error-ts.tsbuildinfo')
      await rm(buildInfo, { force: true })
      try {
        await runTSC()
        expect('Should not have passed').toBeFalsy()
      } catch (err) {
        errorTSExpectations(err)
        await checkBuildFile(buildInfo, ['app.vue', 'messages.ts'])

        // check that the build info file is able to be read, this should take much less time
        try {
          consoleSpy.mockClear()
          await runTSC()
          expect('Should not have passed').toBeFalsy()
        } catch (err) {
          errorTSExpectations(err)
        }
      }
    }, 20000)
  })
})
