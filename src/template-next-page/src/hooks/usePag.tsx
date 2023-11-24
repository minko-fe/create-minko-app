import { useDocumentVisibility, useEffectOnce } from '@minko-fe/react-hook'

type PagItem = { id: string; name: string; className?: string; repeat?: number }

type PagProps = {
  onPlay?: () => void
  onInit: (f: (item: PagItem) => Promise<void>) => void
}

export default function usePag(props: PagProps) {
  const { onPlay, onInit } = props

  const docVisible = useDocumentVisibility()

  async function fetchPag(pagItem: PagItem) {
    try {
      const PAG = window.libpag._PAG || (await window.libpag.PAGInit())
      window.libpag._PAG = PAG
      const { name, className, repeat, id } = pagItem
      const buffer = await fetch(`/pag/${name}.pag`).then((response) => response.arrayBuffer())
      const pagFile = await PAG.PAGFile.load(buffer)
      const canvas = document.getElementById(id) as HTMLCanvasElement
      if (canvas) {
        canvas.className = className || ''
      }
      if (!canvas) return
      const pagView = await PAG.PAGView.init(pagFile, canvas)
      pagView.setRepeatCount(repeat ?? 1)

      if (docVisible === 'hidden') return
      await pagView.play()
      onPlay?.()
    } catch {}
  }

  function injectPagScript() {
    const pagScript = document.createElement('script')
    pagScript.src = '/pag/libpag.js'
    pagScript.async = true
    pagScript.onload = () => {
      window.libpag.PAGInit().then(() => {
        onInit?.(fetchPag)
      })
    }
    document.body.appendChild(pagScript)
  }

  useEffectOnce(() => {
    injectPagScript()
  }, [])
}
