import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI, { Loading } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'

Vue.use(ElementUI)
axios.defaults.baseURL = 'http://localhost:8080/'
Vue.prototype.$http = axios
let loadingResult = null
axios.interceptors.request.use(config => {
  loadingResult = Loading.service({ fullscreen: true })
  return config
})
axios.interceptors.response.use(response => {
  loadingResult.close()
  return response
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
