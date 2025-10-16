// 全局类型声明文件
declare module 'vue' {
  import { App, Component } from '@vue/runtime-core'
  export * from '@vue/runtime-core'
  export const createApp: (rootComponent: Component) => App
}

declare module 'element-plus' {
  export const ElMessage: any
  export const ElMessageBox: any
  export const ElButton: any
  export const ElInput: any
  export const ElForm: any
  export const ElFormItem: any
  export const ElCard: any
  export const ElTable: any
  export const ElTableColumn: any
  export const ElEmpty: any
  export const ElIcon: any
  export const ElTag: any
  export const ElPagination: any
  export const ElLoading: any
  export const ElDialog: any
  export const ElSelect: any
  export const ElOption: any
  export const ElDatePicker: any
  export const ElSwitch: any
  export const ElCheckbox: any
  export const ElRadio: any
  export const ElRadioGroup: any
  export const ElUpload: any
  export const ElProgress: any
  export const ElTooltip: any
  export const ElPopover: any
  export const ElDropdown: any
  export const ElDropdownMenu: any
  export const ElDropdownItem: any
  export const ElMenu: any
  export const ElMenuItem: any
  export const ElSubmenu: any
  export const ElBreadcrumb: any
  export const ElBreadcrumbItem: any
  export const ElTabs: any
  export const ElTabPane: any
  export const ElAlert: any
  export const ElNotification: any
  export const ElDrawer: any
  export const ElCollapse: any
  export const ElCollapseItem: any
  export const ElTimeline: any
  export const ElTimelineItem: any
  export const ElLink: any
  export const ElDivider: any
  export const ElImage: any
  export const ElAvatar: any
  export const ElRate: any
  export const ElSlider: any
  export const ElSteps: any
  export const ElStep: any
  export const ElCarousel: any
  export const ElCarouselItem: any
  export const ElColorPicker: any
  export const ElTransfer: any
  export const ElContainer: any
  export const ElHeader: any
  export const ElAside: any
  export const ElMain: any
  export const ElFooter: any
  export const ElRow: any
  export const ElCol: any
  export const ElSpace: any
  export const ElScrollbar: any
  export const ElConfigProvider: any
  export const ElAffix: any
  export const ElAnchor: any
  export const ElAnchorLink: any
  export const ElBackTop: any
}

declare module 'axios' {
  export interface AxiosRequestConfig {
    url?: string
    method?: string
    baseURL?: string
    transformRequest?: any
    transformResponse?: any
    headers?: any
    params?: any
    paramsSerializer?: any
    data?: any
    timeout?: number
    timeoutErrorMessage?: string
    withCredentials?: boolean
    adapter?: any
    auth?: any
    responseType?: string
    responseEncoding?: string
    xsrfCookieName?: string
    xsrfHeaderName?: string
    onUploadProgress?: any
    onDownloadProgress?: any
    maxContentLength?: number
    validateStatus?: any
    maxBodyLength?: number
    maxRedirects?: number
    socketPath?: string
    httpAgent?: any
    httpsAgent?: any
    proxy?: any
    cancelToken?: any
    decompress?: boolean
    transitional?: any
    signal?: any
    insecureHTTPParser?: boolean
  }

  export interface AxiosResponse<T = any> {
    data: T
    status: number
    statusText: string
    headers: any
    config: AxiosRequestConfig
    request?: any
  }

  export interface AxiosError<T = any> extends Error {
    config: AxiosRequestConfig
    code?: string
    request?: any
    response?: AxiosResponse<T>
    isAxiosError: boolean
    toJSON: () => object
  }

  export interface AxiosInstance {
    (config: AxiosRequestConfig): Promise<AxiosResponse>
    (url: string, config?: AxiosRequestConfig): Promise<AxiosResponse>
    defaults: AxiosRequestConfig
    interceptors: {
      request: any
      response: any
    }
    getUri(config?: AxiosRequestConfig): string
    request<T = any, R = AxiosResponse<T>>(config: AxiosRequestConfig): Promise<R>
    get<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R>
    delete<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R>
    head<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R>
    options<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R>
    post<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R>
    put<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R>
    patch<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R>
  }

  export interface AxiosStatic extends AxiosInstance {
    create(config?: AxiosRequestConfig): AxiosInstance
    Cancel: any
    CancelToken: any
    isCancel(value: any): boolean
    all<T>(values: Array<T | Promise<T>>): Promise<T[]>
    spread<T, R>(callback: (...args: T[]) => R): (array: T[]) => R
    isAxiosError(payload: any): payload is AxiosError
  }

  const axios: AxiosStatic
  export default axios
}

declare module 'vue-router' {
  export const createRouter: any
  export const createWebHistory: any
  export const useRouter: any
  export const useRoute: any
  export const RouterView: any
  export const RouterLink: any
}

declare module 'pinia' {
  export const createPinia: any
  export const defineStore: any
  export const storeToRefs: any
  export const acceptHMRUpdate: any
}

// 全局类型扩展
declare global {
  interface Window {
    // 可以在这里添加全局 window 对象的类型扩展
  }
}

export {}