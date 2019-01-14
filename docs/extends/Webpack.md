# Webpeck

* `yarn add @ddot/ddot-plugin-webpack -D`

## run

```js
$ yarn ddot dev  // to development project
$ yarn ddot build  // to build project
```

## guide

### html template

Create a new `src/pages/document.ejs`, if this file exists, it will be used as the default template

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link rel="icon" href="/favicon.png" type="image/x-icon">
  <title><%= htmlWebpackPlugin.options.title %></title>
</head>
<body>
  <div id="root"></div>
</body>
</html>
```

## options

```ts
export default {
  plugins: [
    [
      'webpack',{...},
    ],
  ],
};

```

#### title
modify `document.title` for  [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin)

such as:

```js

title: 'DDot App',

```

#### outFileName

Configure the build `outFileName`

such as:

```js

outFileName: 'assets/[name].[contenthash]',

```

#### outputPath

Configure the build [outputPath](https://webpack.js.org/configuration/output/#output-path) 

such as:

```js

outputPath: './dist',

```

#### chainWebpack
Extend or modify the webpack configuration via the API of `[webpack-chain](https://github.com/neutrinojs/webpack-chain)` obj

such as:

```js
chainWebpack(config) {
  config
    .entry('index')
    .add('./src/index')
    .end();
},
```

#### tsImportOption

add [options](https://github.com/Brooooooklyn/ts-import-plugin#options) for `ts-import-plugin`

such as:
```js
tsImportOption: [
  {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  },
],
```

#### proxy

Configure the [proxy](https://github.com/chimurai/http-proxy-middleware) property ,If you want to proxy requests to other servers,

* `key` map to `context`
* other property can auto to proxy property

such as:

```js
  proxy: {
    '/todos/1': {
       target: 'http://jsonplaceholder.typicode.com/',
    },
  },
```

#### alias

Configure the resolve.alias property of webpack.

such as:

```js
alias: {
  config: require('path').join(__dirname, './src/config'),
},
```

#### define

Passed to the code via the webP's DefinePlugin , the value is automatically handled by `JSON.stringify`. 

such as:

```js
define: {
  "process.env.TEST": 1,
},
```

#### lessLoaderOptions

Additional configuration items for [less-loader](https://github.com/webpack-contrib/less-loader).