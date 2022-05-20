import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios'
const axios = Axios.create({
  //baseURL:'http://8.130.104.234/cultural-relic',
  //baseURL:'http://127.0.0.1:8000/cultural-relic',
  baseURL:'http://8.130.106.125/cultural-relic',
})
//axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.interceptors.request.use(
  config => {
      config.headers['token'] = localStorage.getItem('token') // 让每个请求携带自定义token 请根据实际情况自行修改
      return config;
  },
  error => {
      // 请求错误处理
      return Promise.reject(error);
  }
)
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  if(response.data.code == "401") {
    alert("登录超时，请重新登录")
    window.location.href="login"
  }
  return response;
  }, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});
  
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loginDataPost(obj){
      const url = `/admin/login`
      return axios.post(url, obj)
    },
    logoutDataGet() {
      const url = `/admin/logout`
      return axios.get(url)
    },
    adminUserDataGet() {
      const url = `/admin/info`
      return axios.get(url)
    },
    AllUserDataGet() {
      const url = `/admin/user/info`
      return axios.get(url)
    },
    adminUserDataPatch(obj) {
      const url = `/admin/user/info`
      return axios.patch(url, obj)
    },
    relicPageDataGet(page, size) {
      const url = `/admin/relic/page?page=${page}&size=${size}`
      return axios.get(url)
    },
    relicDataPost(obj) {
      const url = `/admin/relic`
      return axios.post(url, obj)
    },
    relicDataPatch(obj) {
      const url = `/admin/relic`
      return axios.patch(url, obj)
    },
    relicDataDelete(ids) {
      const url = `/admin/relic/${ids}`
      return axios.delete(url)
    },
    commentDataGet() {
      const url = `/admin/comment`
      return axios.get(url)
    },
    commentDataDelete(ids) {
      const url = `/admin/comment/${ids}`
      return axios.delete(url)
    },
    backupFilesDataGet() {
      const url = `/admin/backup/files`
      return axios.get(url)
    },
    backupDataGet() {
      const url = `/admin/backup`
      return axios.get(url)
    },
    recoverDataPut(name) {
      const url = `/admin/recover/${name}`
      return axios.put(url)
    },
    operationLogDataGet() {
      const url = `/admin/operation/log`
      return axios.get(url)
    },
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
