import Vue from 'vue'
import Router from 'vue-router'
import Index from '../components/Index'
import List from '../components/List'
import Item from '../components/Item'
Vue.use(Router)

// const createListView = name => () => import('../views/CreateListView').then(m => m.createListView(name))

export function createRouter () {
    return new Router({
        mode: 'history',
        scrollBehavior: () => ({y: 0}),
        routes: [
            { path: '/', component: Index  },
            { path: '/list', component: List },
            { path: '/item/:id', component: Item }
        ]
    })
}