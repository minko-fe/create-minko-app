import { useRouter } from 'next/router'
import queryString from 'query-string'

function useNextUrl() {
  const router = useRouter()

  function setUrl(urlObject: Record<string, any>) {
    const currentURL = new URL(window.location.href)
    Object.keys(urlObject).forEach((param) => {
      currentURL.searchParams.set(param, urlObject[param])
    })
    router.replace(currentURL.href)
  }

  return [router.query as Record<string, string>, setUrl, queryString.stringify(router.query)] as const
}

export { useNextUrl }
