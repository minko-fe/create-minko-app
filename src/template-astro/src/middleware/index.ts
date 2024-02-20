export const onRequest = async (_: any, next: any) => {
  const response = await next()
  const html = await response.text()
  response.headers.set('Cache-Control', 'no-store')
  return new Response(html, {
    status: 200,
    headers: response.headers,
  })
}
