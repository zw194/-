import { AxiosRequestConfig } from "axios"
import   http,{ ApiResponse } from "./request"

// 封装的get请求
function get<T>(url: string, params?: {}): Promise<ApiResponse<T>> {
  return http.get(url, { params })
}

// post请求
function post<T>(url: string, data?: {}, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return http.post(url, data, { ...config })
}

// delete
function del<T>(url: string, params?: {}): Promise<ApiResponse<T>> {
    console.log(params, url)
    return http.delete(url, { params })
}

// put请求
function put<T>(url: string, data?: {}, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return http.put(url, data, { ...config })
}
export  { get, post, del, put }

