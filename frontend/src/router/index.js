import Vue from 'vue'
import VueRouter from 'vue-router'
import login from "../views/login"
import register from "../views/register"
import index from "../views/index"
import home from "../views/home"
import backup from "../views/backup"
import log from "../views/log"
import comment from "../views/comment"
import basePage from "../components/basePage"
import notFound from "../views/notFound"
import user from "../views/user"
import relic from "../views/relic"


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: "/login",
    
  },
  {
    path: '/login',
    name: "login",
    component: login,
  },
  {
    path: '/register',
    name: "register",
    component: register,
  },
  {
    path: '/',
    component: basePage,
    children: [
      /*{
        path: 'index',
        name: "index",
        component: index,
      },*/
      {
        path: 'home',
        name: "home",
        component: home,
      },
      {
        path: 'backup',
        name: "backup",
        component: backup,
      },
      {
        path: 'log',
        name: "log",
        component: log,
      },
      {
        path: 'comment',
        name: "comment",
        component: comment,
      },
      {
        path: 'user',
        name: "user",
        component: user,
      },
      {
        path: 'relic',
        name: "relic",
        component: relic,
      },
    ]
  },
  {
    path: '*',
    component: notFound,
  },

]

const router = new VueRouter({
  mode: 'history',
  routes
})


router.beforeEach((to, from, next) => {
  //const tokenTimeout = localStorage.getItem('tokenTimeout'); //获取本地存储的登陆信息
  //if (to.name == 'login' || to.name == 'register' || (tokenTimeout != null && tokenTimeout > new Date().getTime())) {
    const token = localStorage.getItem('token');
    if (to.name == 'login' || to.name == 'register' || token != null) {
    next()
  } else { 
    next({ name: 'login' })
    alert("请先登录")
  }
});




export default router
