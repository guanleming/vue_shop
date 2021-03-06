import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home.vue'
import Login from '../components/Login.vue'
import welcome from '../components/welcome.vue'
import Users from '../components/users/users.vue'
import Rights from '@/components/power/Rights'
import Roles from '@/components/power/Roles'
import Cate from '@/components/goods/Cata.vue'
import Params from '@/components/goods/params.vue'
import List from '@/components/goods/List.vue'
import Add from '@/components/goods/Add.vue'
import Order from '@/components/order/Order.vue'
import Report from '@/components/repport/Report.vue'


Vue.use(VueRouter)

const routes = [{
        //路由重定向 使打开根目录调到Login
        path: "/",
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/home',
        name: 'Home',
        component: Home,
        redirect: '/welcome',
        children: [{
            path: '/welcome',
            name: 'welcome',
            component: welcome
        }, {
            path: '/users',
            component: Users
        }, {
            path: '/Rights',
            component: Rights
        }, {
            path: '/Roles',
            component: Roles
        }, {
            path: '/categories',
            component: Cate
        }, {
            path: '/params',
            component: Params
        }, {
            path: '/goods',
            component: List
        }, {
            path: '/goods/add',
            component: Add
        }, {
            path: '/orders',
            component: Order
        }, {
            path: '/reports',
            component: Report
        }]
    },

]

const router = new VueRouter({
    routes
})

//挂载路由导航守卫 
router.beforeEach((to, from, next) => {
    // to 将要访问的路径
    // from 代表从哪个路径跳转而来
    // next 是一个函数 表示放行
    // next() 放行 next('/login') 强制跳转
    if (to.path === '/login') return next();
    // 获取token
    const tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) return next('/login')
    next()
})

export default router