[![CircleCI][circleci-svg]][circleci-link]
[![codecov][codecov-svg]][codecov-link]

<div align="center">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200"
      src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
  <div>
    <img width="100" height="100" title="Webpack Plugin" src="http://michael-ciniawsky.github.io/postcss-load-plugins/logo.svg">
  </div>
  <h1>Jsonify Webpack Plugin</h1>
  <p>Plugin that creates JSON file with file name and stringified code</p>
</div>

<h2 align="center">Install</h2>

```bash
  npm i -D jsonify-webpack-plugin
```

<h2 align="center">Usage</h2>

**webpack.config.js**
```js
const JsonifyWebpackConfig = require('jsonify-webpack-plugin')
const path = require('path')

module.exports = {
  entry: 'index.js',
  output: {
    path: path.resolve(__dirname + 'dist'),
    filename: 'bundle.js'
  },
  plugins: [
    new JsonifyWebpackPlugin(['bundle.js'])
  ]
}
```

This will generate a file `dist/index.json` containing the following

```json
{
  "bundle.js": "/******/ (function(modules) {..."
}
```

<h2 align="center">Motivation</h2>
<p>
I had situation once that I need to import bundled JavaScript code in React Native for injecting into WebView. The WebView component takes stringified JS code through injectedJavaScript prop.
</p>
<p>
Metro bundler doesn't support importing .js file as a raw string so that I needed to convert a bundle.js file into either .json or .txt format.
</p>

[codecov-svg]: https://codecov.io/gh/dappface/jsonify-webpac-plugin/branch/master/graph/badge.svg
[codecov-link]: https://codecov.io/gh/dappface/jsonify-webpack-plugin
[circleci-svg]: https://circleci.com/gh/dappface/jsonify-webpack-plugin.svg?style=svg
[circleci-link]: https://circleci.com/gh/dappface/jsonify-webpack-plugin
