import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import path from 'path'
import { Configuration } from 'webpack'
import pkg from './package.json'

const config: Configuration = {
  mode: 'production',
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    library: pkg.name,
    libraryTarget: 'umd',
    // temporary fix for 'window is not defined' error
    // details: https://github.com/webpack/webpack/issues/6642#issuecomment-371087342
    globalObject: 'this'
  },
  plugins: [new CleanWebpackPlugin()],
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

export default config
