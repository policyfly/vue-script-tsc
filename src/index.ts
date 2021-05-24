import { promises as fs } from 'fs'
import { resolve } from 'path'
import * as ts from 'typescript'

import { Options, parseArgs } from './args'
import { createHost } from './host'

async function getVueFiles(
  path: string,
  files: string[] = []
): Promise<string[]> {
  const entries = await fs.readdir(path)

  for (const file of entries) {
    const filePath = resolve(path, file)
    const stat = await fs.stat(filePath)
    if (stat.isDirectory()) {
      await getVueFiles(filePath, files)
    } else if (file.endsWith('.vue')) {
      files.push(filePath)
    }
  }

  return files
}

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
  if (parsedOpts.tsbuildinfo)
    config.compilerOptions.tsBuildInfoFile = parsedOpts.tsbuildinfo
  const { fileNames, options } = ts.parseJsonConfigFileContent(
    config,
    ts.sys,
    parsedOpts.root
  )

  const host = createHost(options)
  const files = await getVueFiles(parsedOpts.src)
  // .vue is not a supported extension, so we fake it
  // this is removed later during resolution
  const rootNames = fileNames.concat(files.map((f) => f + '.ts'))
  const program = ts.createProgram({ options, rootNames, host })
  const emitResult = program.emit()

  const allDiagnostics = ts
    .getPreEmitDiagnostics(program)
    .concat(emitResult.diagnostics)

  allDiagnostics.forEach((diagnostic) => {
    if (diagnostic.file) {
      const { line, character } = ts.getLineAndCharacterOfPosition(
        diagnostic.file,
        diagnostic.start as number
      )
      const message = ts.flattenDiagnosticMessageText(
        diagnostic.messageText,
        '\n'
      )
      console.log(
        `${diagnostic.file.fileName.replace('.vue.ts', '.vue')} (${line + 1},${
          character + 1
        }): ${message}`
      )
    } else {
      console.log(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'))
    }
  })

  if (emitResult.emitSkipped) {
    throw new Error('Type Check returned errors')
  }
}
