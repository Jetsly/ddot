# Webpeck

## run

```js
$ yarn ddot dev  // to development project
$ yarn ddot build  // to build project
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

#### proxy

Configure the [proxy](https://github.com/fastify/fastify-http-proxy) property ,If you want to proxy requests to other servers,

* `key` map to `path`
* `key` map to `prefix`
* `target` map to `upstream`
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
