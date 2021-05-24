import * as ts from 'typescript'

const scriptRegex = /<script.*>([\s\S]*)<\/script>/

export function createHost(options: ts.CompilerOptions): ts.CompilerHost {
  const host = ts.createCompilerHost(options)
  host.fileExists = (filename: string): boolean => {
    // remove the .ts extension that TS will try to append when resolving
    const actualFilename = filename.replace('.vue.ts', '.vue')
    return ts.sys.fileExists(actualFilename)
  }
  host.readFile = (filename: string): string | undefined => {
    // remove the .ts extension we have to append
    const actualFilename = filename.replace('.vue.ts', '.vue')
    const contents = ts.sys.readFile(actualFilename)
    if (!contents) return
    const match = scriptRegex.exec(contents)
    if (!match) return contents
    return match[1]
  }
  host.resolveModuleNames = (
    moduleNames: string[],
    containingFile: string
  ): (ts.ResolvedModule | undefined)[] => {
    const resolvedModules: (ts.ResolvedModule | undefined)[] = []
    for (const moduleName of moduleNames) {
      const result = ts.resolveModuleName(moduleName, containingFile, options, {
        fileExists: host.fileExists,
        readFile: host.readFile,
      })
      if (result.resolvedModule) {
        resolvedModules.push(result.resolvedModule)
      } else {
        // could not resolve, likely an image or css file or similar
        // we can just ignore it as it won't provide anything worth checking
        resolvedModules.push(undefined)
      }
    }
    return resolvedModules
  }
  return host
}
