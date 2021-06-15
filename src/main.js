import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import element from 'element-ui'


//导入全局样式表
import './assets/css/global.css'
//导入element-ui样式表
import 'element-ui/lib/theme-chalk/index.css'
//导入字体图标
import './assets/img/fonts/iconfont.css'

Vue.config.productionTip = false

Vue.use(element)


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
