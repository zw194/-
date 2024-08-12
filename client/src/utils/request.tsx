import axios, { AxiosError, AxiosInstance, AxiosResponse} from 'axios';


// 定义基本返回数据类型
export interface ApiResponse<T> {
  code: number
  msg: string
  data :{
    data: T
  } 
}

const http: AxiosInstance = axios.create({
  baseURL: '/',
  timeout: 3000,
});

// 请求拦截器
http.interceptors.request.use(
  (config) => {
  	// ...
    return config
  },
  (error: AxiosError) => {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 响应拦截器
http.interceptors.response.use(
  (response: AxiosResponse) => {
    // ...
    return response
  },
  (error: AxiosError) => {
    // 对响应错误做些什么
    return Promise.reject(error)
  }
)
export default http

