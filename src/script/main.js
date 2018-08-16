import Vue from 'vue'
import VueRouter from 'vue-router'
var VueResource = require('vue-resource')
import Element from 'element-ui'
import Wish from './pages/Wish.vue'
import Home from './pages/Home.vue'
import Navigation from './pages/Header.vue'
import Category from './pages/Category.vue'
import ProductDetail from './pages/ProductDetail.vue'
import Merchant from './pages/Merchant.vue'
import MerchantList from './pages/MerchantList.vue'
import watchedProduct from './pages/watchedProduct.vue'
import watchedMerchant from './pages/watchedMerchant.vue'
import login from './pages/Login.vue'
import register from './pages/Register.vue'
import userCenter from './pages/userCenter.vue'
import changePassword from './pages/changePassword.vue'
import findPassword from './pages/findPassword.vue'
import Industry from './pages/Industry.vue'

import '../css/base.css'

// 社区贡献了一个插件 vue-resource，提供一种容易的方式与 RESTful APIs 配合。
Vue.use(VueResource)
Vue.use(Element)

// 1. Use plugin.
// This installs <router-view> and <router-link>,
// and injects $router and $route to all router-enabled child components
Vue.use(VueRouter)

// 2. Define route components
// const Foo = { template: '<div>foo</div>' }
// const Bar = { template: '<div>bar</div>' }

// 3. Create the router
const router = new VueRouter({
    // mode: 'history',
    base: __dirname,
    routes: [
        { path: '/', component: Wish },
        { path: '/wish', component: Wish },
        { path: '/home', component: Home },
        { path: '/home/:type', component: Home },
        { path: '/category', component: Category },
        { path: '/productdetail/:pid', component: ProductDetail },
        { path: '/merchant/:pid', component: Merchant },
        { path: '/merchant-list/:type', component: MerchantList },
        { path: '/watchedProduct', component: watchedProduct },
        { path: '/watchedMerchant', component: watchedMerchant },
        { path: '/login', component: login },
        { path: '/register', component: register },
        { path: '/userCenter', component: userCenter },
        { path: '/changePassword', component: changePassword },
        { path: '/findPassword', component: findPassword },
        { path: '/industry', component: Industry },
    ]
})

// 4. Create and mount root instance.
// Make sure to inject the router.
// Route components will be rendered inside <router-view>.
new Vue({
    router,
    components: {
        "v-header": Navigation
    },
    template: `
    <div id="app" class="clearfix">
    <v-header></v-header>
    <div class="main">
      <keep-alive>
        <router-view class="view"></router-view>
      </keep-alive>
    </div>
    </div>
  `
}).$mount('#app')


//
// /* eslint-disable no-new */
// new Vue({
//   el: '#app',
//   template: '<App/>',
//   components: { App }
// });
