declare namespace NodeJS {
  export interface ProcessEnv {
    readonly NEXT_PUBLIC_API_URL: string
    readonly NEXT_PUBLIC_ENV_VARIABLE: string
    readonly NEXT_PUBLIC_BASEURL: string
  }
}
