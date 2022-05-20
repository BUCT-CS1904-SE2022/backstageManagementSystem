import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import echarts from 'echarts'


Vue.use(antd)

Vue.config.productionTip = false
Vue.prototype.$echarts = echarts

router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next();
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
