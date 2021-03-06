import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 引入全局样式
import './assets/css/global.css'
// 导入element ui
import Element from 'element-ui'
// 导入element ui样式
import '../node_modules/element-ui/lib/theme-chalk/index.css'
// 导入字体样式
import './assets/fonts/iconfont.css'
// 导入axios
import axios from 'axios'
// <-------------------------------------------------------------------------------->

// 注册element ui
Vue.use(Element)
// 挂载axios
Vue.prototype.$http = axios
// 配置基准地址
axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'
// 设置请求拦截器  把token挂载到请求头中
axios.interceptors.request.use(config => {
  // console.log(config);
// Do something before request is sent
// 把token加到请求头中
config.headers.Authorization = window.sessionStorage.getItem('token')
return config;
},error => {
// Do something with request error
return Promise.reject(error);
});

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
