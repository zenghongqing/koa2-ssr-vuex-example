## koa2-ssr-vuex-example
*服务端渲染：在服务端直接拿数据解析渲染，直接生成html片段返回给前端。然后前端可以通过解析后台返回的html片段到前端页面。*<br>
*服务端解决的问题：*<br>
（1）、seo问题，有利于搜索引擎蜘蛛抓取网站内容，利于网站的收录和排名。
（2）、首屏加载过慢问题，例如现在成熟的SPA项目中，打开首页需要加载很多资源，通过服务端渲染可以加速首屏渲染。
### SSR的实现原理
*客户端请求服务器，服务器通过请求地址url获得匹配的组件，在调用匹配到的组件返回Promise(官方是preFetch方法)将需要的数据获取到，一般是vuex通过axios获得。最后通过*<br>
```
    <script>window.__initial_state=data</script>
```
将其写入网页，最后将服务端渲染好的网页返回回去。<br>
接下来客户端会将vuex将写入的initial_state替换为当前的全局状态树，再用这个状态树去检查服务端渲染好的数据有没有问题。遇到没被服务端渲染的组件，再去发异步请求拿数据。<br>
vue2使用了虚拟DOM, 因此对浏览器环境和服务端环境要分开渲染, 要创建两个对应的入口文件。<br>
浏览器入口文件client-entry.js<br>
实例化Vue对象，替换store来跟服务端匹配, 使用$mount直接挂载<br>
服务端入口文件server-entry.js<br>
entry-server.js通过webpack中的vue-server-renderer/server-plugin打包成一个json供服务端vue-server-renderer的createRenderer读取，主要起到每一次SSR服务端请求重新createApp以及匹配路由提前取数据渲染的作用。<br>
node服务端使用上面打包生成的json文件创建了一个 renderer 对象，然后调用其 renderToString 方法并传入包含请求路径的对象作为参数来进行渲染，最后将渲染好的数据即 html 返回.<br>


