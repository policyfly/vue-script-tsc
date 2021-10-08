import * as ts from 'typescript'

import { Options, parseArgs } from './args'
import { createHost } from './host'
import { COLORS } from './utils'

const vueFileRegex = /\.vue$/
const preScriptRegex = /^([\s\S]*)<script/

export async function tsc(opts: Options): Promise<void> {
  const parsedOpts = parseArgs(opts)

  const configFile = ts.findConfigFile(
    parsedOpts.root,
    ts.sys.fileExists,
    parsedOpts.tsconfig
  )
  if (!configFile)
    throw new Error(
      `tsconfig.json not found, looked for ${parsedOpts.tsconfig} in ${parsedOpts.root}`
    )
  const { config } = ts.readConfigFile(configFile, ts.sys.readFile)
  const { fileNames, options } = ts.parseJsonConfigFileContent(
    config,
    ts.sys,
    parsedOpts.root,
    undefined,
    undefined,
    undefined,
    [
      {
        extension: '.vue',
        isMixedContent: true,
        // will ensure this will always be included
        scriptKind: ts.ScriptKind.Deferred,
      },
    ]
  )

  const host = createHost(options)
  // .vue is not a supported extension, so we fake it
  // this is removed later during resolution
  const rootNames = fileNames.map((f) => f.replace(vueFileRegex, '.vue.ts'))
  const program = ts.createProgram({ options, rootNames, host })
  const emitResult = program.emit()

  const allDiagnostics = ts
    .getPreEmitDiagnostics(program)
    .concat(emitResult.diagnostics)

  allDiagnostics.forEach((diagnostic) => {
    if (diagnostic.file) {
      const positions = ts.getLineAndCharacterOfPosition(
        diagnostic.file,
        diagnostic.start as number
      )
      const message = ts.flattenDiagnosticMessageText(
        diagnostic.messageText,
        '\n'
      )
      const filename = diagnostic.file.fileName.replace('.vue.ts', '.vue')
      let line = positions.line + 1
      // on .vue files, add lines from before the script tag so line count matches
      if (vueFileRegex.test(filename)) {
        const originalFile = ts.sys.readFile(filename)
        if (originalFile) {
          const match = preScriptRegex.exec(originalFile)
          if (match) {
            line += match[1].split('\n').length - 1
          }
        }
      }
      console.log(
        COLORS.ERROR,
        `${filename} (${line},${positions.character + 1}): ${message}`
      )
    } else {
      console.log(
        COLORS.ERROR,
        ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')
      )
    }
  })

  if (allDiagnostics.length) {
    throw new Error('Type Check returned errors, see above')
  }
}
