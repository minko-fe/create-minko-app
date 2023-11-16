export const ENV = {
  development: 'development',
  test: 'test',
  production: 'production',
}

export function isDev() {
  return process.env.NEXT_PUBLIC_ENV_VARIABLE === ENV.development
}

export function isTest() {
  return process.env.NEXT_PUBLIC_ENV_VARIABLE === ENV.test
}

export function isProd() {
  return process.env.NEXT_PUBLIC_ENV_VARIABLE === ENV.production
}

export function getEnv() {
  return process.env.NEXT_PUBLIC_ENV_VARIABLE
}

export function isNodeDev() {
  return process.env.NODE_ENV === ENV.development
}

export function isNodeTest() {
  return process.env.NODE_ENV === ENV.test
}

export function isNodeProd() {
  return process.env.NODE_ENV === ENV.production
}

export function isSSR() {
  return typeof window === 'undefined'
}
