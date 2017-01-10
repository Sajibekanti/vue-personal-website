import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import { sync } from 'vuex-router-sync'
import VueTouch from 'vue-touch'
import VueAnimatedList from 'vue-animated-list'
import zepto from 'webpack-zepto'
import fastclick from 'fastclick'

import store from 'store'
import routerMap from './route-config.js'
import filters from './filters'


import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'

Vue.config.devtools = true;

Vue.use(Vuex)
Vue.use(VueRouter)
Vue.use(VueTouch)
Vue.use(VueAnimatedList)

import { Swipe, SwipeItem } from 'mint-ui';

import { Search } from 'mint-ui';

import { Popup } from 'mint-ui';

Vue.component(Popup.name, Popup);

Vue.component(Search.name, Search);

Vue.component(Swipe.name, Swipe);
Vue.component(SwipeItem.name, SwipeItem);

const router = new VueRouter({
    hashbang:true,
    saveScrollPosition: true
})

routerMap(router)

sync(store, router)

filters(Vue)

fastclick.attach(document.body)

const App = Vue.extend(require('./app.vue'))

router.start(App, 'body')


window.router = router
window.Vue = Vue
window.$ = zepto