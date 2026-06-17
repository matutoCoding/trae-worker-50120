/// <reference types="@tarojs/taro" />

declare module '*.png'
declare module '*.gif'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.svg'
declare module '*.css'
declare module '*.scss'
declare module '*.less'
declare module '*.module.scss' {
  const classes: { [key: string]: string }
  export default classes
}

declare function defineAppConfig(config: any): any
declare function definePageConfig(config: any): any

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any
  }
}

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string
    TARO_ENV: string
  }
}
