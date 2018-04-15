import {createApp} from './app'
const { app, router, store } = createApp()
// 把store中的state 替换成 window.__INITIAL_STATE__ 中的数据
if (window.__INITIAL_STATE__) {
    store.replaceState(window.__INITIAL_STATE__)
}
/**
 *
 *客户端代码是在路由解析完成的时候将app挂载到#app标签下
 * */
router.onReady(() => {
    app.$mount('#app')
})

// service worker

if ('https:' === location.protocal && navigator.serviceWorker) {
    navigator.serviceWorker.register('/service-worker.js')
}