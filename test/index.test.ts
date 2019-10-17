import { readFileSync } from 'fs'
import path from 'path'
import rimraf from 'rimraf'
import webpack from 'webpack'
import { JsonifyWebpackPlugin } from '../src'

const baseConfig: webpack.Configuration = {
  mode: 'development',
  entry: {
    hello: path.resolve(__dirname, 'hello'),
    bye: path.resolve(__dirname, 'bye')
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    library: '[name]',
    libraryTarget: 'umd'
  },
  plugins: [new JsonifyWebpackPlugin(['hello.js', 'bye.js'])],
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: 'ts-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.ts']
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createPluginFactory(option?: any): () => void {
  return (): void => {
    new JsonifyWebpackPlugin(option)
  }
}

function readFileFactory(pathStr: string): () => void {
  return (): void => {
    readFileSync(path.resolve(__dirname, pathStr), 'utf-8')
  }
}

describe('JsonifyWebpackPlugin', (): void => {
  beforeEach((): void => {
    rimraf.sync(path.resolve(__dirname, 'dist'))
  })

  it('creates json file', (done): void => {
    webpack([baseConfig], (error, stats): void => {
      expect(error).toBeFalsy()
      expect(stats.hasErrors()).toBeFalsy()
      expect(stats.hasWarnings()).toBeFalsy()

      const dataStr = readFileSync(
        path.resolve(__dirname, 'dist/index.json'),
        'utf-8'
      )
      const data: { [method: string]: string } = JSON.parse(dataStr)
      const helloFileStr = readFileSync(
        path.resolve(__dirname, 'dist/hello.js'),
        'utf-8'
      )
      const byeFileStr = readFileSync(
        path.resolve(__dirname, 'dist/bye.js'),
        'utf-8'
      )

      expect(data['hello.js']).toBe(helloFileStr)
      expect(data['bye.js']).toBe(byeFileStr)

      done()
    })
  })

  it('ignores file names that are not exist', (done): void => {
    const config = {
      ...baseConfig,
      plugins: [new JsonifyWebpackPlugin(['random', 'filename', 'hello.js'])]
    }

    webpack([config], (error, stats): void => {
      expect(error).toBeFalsy()
      expect(stats.hasErrors()).toBeFalsy()
      expect(stats.hasWarnings()).toBeFalsy()

      const dataStr = readFileSync(
        path.resolve(__dirname, 'dist/index.json'),
        'utf-8'
      )
      const data: { [method: string]: string } = JSON.parse(dataStr)
      expect(Object.keys(data)).toEqual(['hello.js'])

      done()
    })
  })

  it('does not create json file if none of the provided file names match', (done): void => {
    const config = {
      ...baseConfig,
      plugins: [new JsonifyWebpackPlugin(['random', 'filename'])]
    }

    webpack([config], (error, stats): void => {
      expect(error).toBeFalsy()
      expect(stats.hasErrors()).toBeFalsy()
      expect(stats.hasWarnings()).toBeFalsy()
      expect(readFileFactory('dist/index.json')).toThrow()

      done()
    })
  })

  describe('validation', (): void => {
    it('throws error without string file names', (): void => {
      expect(createPluginFactory()).toThrow(
        new Error('JsonWebpackPlugin: File names must be string array')
      )

      expect(createPluginFactory('')).toThrow(
        new Error('JsonWebpackPlugin: File names must be string array')
      )

      expect(createPluginFactory({})).toThrow(
        new Error('JsonWebpackPlugin: File names must be string array')
      )

      expect(createPluginFactory([])).toThrow(
        new Error('JsonWebpackPlugin: Provide at least one file name')
      )
    })

    it('throws error without string file names', (): void => {
      expect(createPluginFactory(['', 0])).toThrow(
        new Error('JsonWebpackPlugin: File name must be a string')
      )

      expect(createPluginFactory(['', []])).toThrow(
        new Error('JsonWebpackPlugin: File name must be a string')
      )

      expect(createPluginFactory(['', {}])).toThrow(
        new Error('JsonWebpackPlugin: File name must be a string')
      )
    })
  })
})
