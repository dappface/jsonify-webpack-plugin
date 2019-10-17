import { compilation, Compiler, Plugin } from 'webpack'

export class JsonifyWebpackPlugin implements Plugin {
  private static validateOptions(fileNames: string[]): void {
    if (!(fileNames instanceof Array)) {
      throw new Error('JsonWebpackPlugin: File names must be string array')
    }

    if (fileNames.length === 0) {
      throw new Error('JsonWebpackPlugin: Provide at least one file name')
    }

    fileNames.forEach((opt): void => {
      if (typeof opt !== 'string') {
        throw new Error('JsonWebpackPlugin: File name must be a string')
      }
    })
  }

  private fileNames: string[]

  private outputFilename = 'index.json'

  constructor(fileNames: string[]) {
    JsonifyWebpackPlugin.validateOptions(fileNames)

    this.fileNames = fileNames
  }

  public apply(compiler: Compiler): void {
    compiler.hooks.emit.tap('JsonifyWebpackPlugin', (comp): void => {
      const data = this.createJson(comp)
      const dataStr = JSON.stringify(data)

      if (Object.keys(data).length === 0) {
        return
      }

      comp.assets[this.outputFilename] = {
        source: (): string => dataStr,
        size: (): number => dataStr.length
      }
    })
  }

  private createJson(
    comp: compilation.Compilation
  ): { [fileName: string]: string } {
    return this.fileNames.reduce((prev, fileName): {
      [filename: string]: string
    } => {
      const asset = comp.assets[fileName]

      return typeof asset === 'undefined'
        ? prev
        : {
            ...prev,
            [fileName]: asset.source()
          }
    }, {})
  }
}
