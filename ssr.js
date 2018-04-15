const path = require('path')
const fs = require('fs')
const koa = require('koa')
const koaRouer = require('koa-router')
const bodyparser = require('koa-bodyparser')
const { createBundleRenderer } = require('vue-server-renderer')
const resolve = file => path.resolve(__dirname, file)
const router = new koaRouer()
const staticFiles = require('koa-static')
const LRU = require('lru-cache')
const template = fs.readFileSync(resolve('./index.template.html'), 'utf8')
const app = new koa()
app.use(bodyparser())
app.use(staticFiles(path.resolve(__dirname, './dist')))
// const isProd = process.env.NODE_ENV === 'production'
function createRenderer(bundle, options) {
    return createBundleRenderer(
        bundle,
        Object.assign(options, {
            template,
            cache: LRU({
                max: 1000,
                maxAge: 1000 * 60 * 15
            }),
            baseDir: resolve('./dist'),
            // 默认情况下，对于每次渲染，bundle renderer 将创建一个新的 V8 上下文并重新执行整个 bundle。
            runInNewContext: false
        }))
}

const bundle = require('./dist/vue-ssr-server-bundle.json')
const clientManifest = require('./dist/vue-ssr-client-manifest.json')
let renderer
renderer = createRenderer(bundle, {
    clientManifest
})

const renderData = (ctx, renderer) => {
    const context = {
        url: ctx.url
    }
    return new Promise((resolve, reject) => {
        renderer.renderToString(context, (err, html) => {
            if (err) {
                reject(err)
            }
            resolve(html)
        })
    })
}
let id = 2
let items = { 1: {title: "item1", content: "item1 content"}}
router.get('/api/items/:id', async (ctx, next) => {
    // res.json(items[ctx.params.id] || {})
    ctx.body = items[ctx.params.id] || {}
})
router.get('/api/items', async (ctx, next) => {
    ctx.status = 200
    ctx.success = true
    ctx.body = items
})
router.post('/api/items', async (ctx, next) => {
    ctx.status = 200
    ctx.success = true
    items[id] = ctx.request.body
    console.log(id, items[id++])
    ctx.body = {id, item: items[id++]}
})

router.get('*', async (ctx, next) => {
    // 提示webpack还在工作
    if (!renderer) {
        ctx.type = 'html'
        return ctx.body = 'waiting for compilation... refresh in a moment.';
    }
    // const s = Date.now()
    let html, status
    try {
        html = await renderData(ctx, renderer)
    } catch (e) {
        if (e.code === 404) {
            status = 404
            html = '404 | Not Found'
        }else{
            status = 500
            html = '500 | Internal Server Error'
            console.error(`error during render : ${ctx.url}`)
        }
    }
    ctx.status = status ? status : ctx.status
    ctx.body = html
})
app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, '127.0.0.1', () => {
    console.log('程序正在运行...')
})