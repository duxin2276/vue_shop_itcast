import Vue from 'vue'
// 导入路由
import VueRouter from 'vue-router'
// 导入登录页面组件
import Login from '../components/Login'
// 导入首页页面组件
import Home from '../components/Home'

// 注册路由
Vue.use(VueRouter)

// 配置路由
const routes = [
  {path: '/', redirect: '/login'},
  {path: '/login', component: Login},
  {path: '/home', component: Home}
]

// 创建路由实例
const router = new VueRouter({
  routes
})
// 挂载路由导航守卫
router.beforeEach((to, from, next)=> {
  // to 要跳转的路径
  // from  从什么路径跳转过来
  // next()  表示放行  next('/')  表示强制跳转
  if (to.path === '/login') next()
  // 从sessionStorage中取出token
  const tokenStr = window.sessionStorage.getItem('token')
  // 如果不存在token强制跳转到登录页
  if (!tokenStr) next('/login')
  // 直接放行
  next()
})
export default router
