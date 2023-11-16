;(function () {
  if (typeof window === 'undefined' || typeof document === 'undefined') return

  const script = document.createElement('script')
  script.src = 'https://unpkg.com/vconsole@latest/dist/vconsole.min.js'

  document.body.append(script)

  script.addEventListener('load', () => {
    new (window as any).VConsole()
  })
})()
