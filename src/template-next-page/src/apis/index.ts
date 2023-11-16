import { requestClient } from '@/service/request-client'

// 示例
export async function someApi() {
  try {
    // 客户端请求
    const res = await requestClient.get({
      url: 'some-url',
    })
    if (res.success) {
      return res.result
    }
  } catch {
    return null
  }
}
