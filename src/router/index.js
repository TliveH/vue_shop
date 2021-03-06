import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import('../components/login/Login')
  },
  {
    path: '/home',
    component: () => import('../components/home/Home'),
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: () => import('../components/welcome/Welcome')
      },
      {
        path: '/users',
        component: () => import('../components/user/Users')
      },
      {
        path: '/rights',
        component: () => import('../components/power/Rights')
      },
      {
        path: '/roles',
        component: () => import('../components/power/Roles')
      },
      {
        path: '/categories',
        component: () => import('../components/goods/Cate')
      },
      {
        path: '/params',
        component:()=>import('../components/goods/Params')
      },
      {
        path: '/goods',
        component:()=>import('../components/goods/Goods')
      },
      {
        path: '/goods/addGoods',
        component:()=>import('../components/goods/AddGoods')
      },
      {
        path: '/orders',
        component:()=>import('../components/order/Order')
      },
      {
        path: '/reports',
        component:()=>import('../components/report/Report')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})
//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next();
  //获取token
  const tokenStr = window.sessionStorage.getItem('token')
  //没有token强制跳转到login
  if (!tokenStr) return next('/login')
  // document.title='系统--'+to.meta.title
  next()
})

export default router
