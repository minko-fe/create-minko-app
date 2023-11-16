import { last } from '@minko-fe/lodash-pro'
import { useEffect } from 'react'

type PagItem = { name: string; className?: string; repeat?: number }

type PagProps = {
  onPlay?: () => void
  onInit: (f: (item: PagItem) => Promise<void>) => void
}

export default function usePag(props: PagProps) {
  const { onPlay, onInit } = props

  async function fetchPag(pagItem: PagItem) {
    try {
      const PAG = window.libpag._PAG || (await window.libpag.PAGInit())
      window.libpag._PAG = PAG
      const { name, className, repeat } = pagItem
      const buffer = await fetch(`/pag/${name}.pag`).then((response) => response.arrayBuffer())
      const pagFile = await PAG.PAGFile.load(buffer)
      const dom = last(name.split('/'))
      const canvas = document.getElementById(dom) as HTMLCanvasElement
      if (canvas) {
        canvas.className = className || ''
      }
      if (!canvas) return
      const pagView = await PAG.PAGView.init(pagFile, canvas)
      pagView.setRepeatCount(repeat ?? 1)
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

  useEffect(() => {
    injectPagScript()
  }, [])
}
