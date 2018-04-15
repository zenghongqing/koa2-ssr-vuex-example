const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const baseWebpackConfig = require('./webpack.base.conf')
const SWPrecachePlugin = require('sw-precache-webpack-plugin')
const config = require('./config')
// sw filter srcDir
const srcDir = path.resolve(__dirname, '../').replace(/\\/g, "\/")
prefixMulti = {}
prefixMulti[srcDir] = ''
module.exports = merge(baseWebpackConfig, {
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: true
      }
    }),
    // 重要信息：这将 webpack 运行时分离到一个引导 chunk 中，
    // 以便可以在之后正确注入异步 chunk。
    // 这也为你的 应用程序/vendor 代码提供了更好的缓存。
    new webpack.optimize.CommonsChunkPlugin({
      name: "manifest",
      minChunks: Infinity
    }),
    // 此插件在输出目录中
    // 生成 `vue-ssr-client-manifest.json`。
    new VueSSRClientPlugin(),
    new SWPrecachePlugin({
        cacheId: 'vue-zh',
        filename: 'service-worker.js',
        dontCacheBustUrlsMatching: /../,
        staticFileGlobsIgnorePatterns: [/index\.html$/, /\.map$/]
    })
  ]
})
