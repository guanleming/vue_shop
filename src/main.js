import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

//导入全局样式表
import './assets/css/global.css'

//让每个vue组件都可以通过this直接访问$http从而去发起axios请求
import axios from 'axios'
// 配置全局请求的根路径
axios.defaults.baseURL = 'http://192.168.1.6:8888/api/private/v1/'
axios.interceptors.request.use(config => {
    // console.log(config);
    config.headers.Authorization = window.sessionStorage.getItem('token')
        //在最后必须return config
    return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')