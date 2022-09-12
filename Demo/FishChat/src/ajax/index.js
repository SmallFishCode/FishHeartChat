import axios from "axios";

axios.defaults.baseURL = process.env.NODE_ENV == 'development' ? '//localhost:3000/api': '//112.124.32.18:98/api'
axios.defaults.withCredentials = true
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers['Authorization'] = localStorage.getItem('token') || null
axios.defaults.headers.post['Content-Type'] = 'application/json'

axios.interceptors.response.use(res => {
  if (typeof res.data !== 'object') {
    console.log('服务端异常')
    return Promise.reject(res)
  }
  if (res.data.code != 200) {
    if (res.data.msg) alert(res.data.msg)
    if (res.data.code == 401) {
      // 返回登录页面
    }
    return Promise.reject(res.data)
  }

  return res.data
})

export default axios