import { useEffect, useRef } from 'react'

export default function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.display = 'none'
      return
    }

    let raf = 0
    let tx = window.innerWidth / 2
    let ty = window.innerHeight / 2
    let cx = tx
    let cy = ty
    let idleTimer = 0

    const stopLoop = () => {
      cancelAnimationFrame(raf)
      raf = 0
    }

    const loop = () => {
      const dx = tx - cx
      const dy = ty - cy
      cx += dx * 0.14
      cy += dy * 0.14
      el.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`
      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
        stopLoop()
        return
      }
      raf = requestAnimationFrame(loop)
    }

    const startLoop = () => {
      if (raf) return
      clearTimeout(idleTimer)
      raf = requestAnimationFrame(loop)
    }

    const onMouseMove = (e: MouseEvent) => {
      tx = e.clientX
      ty = e.clientY
      startLoop()
    }
    const onTouchEnd = () => { el.style.opacity = '0' }
    const onMouseLeave = () => { el.style.opacity = '0'; stopLoop() }
    const onMouseEnter = () => { el.style.opacity = '1' }

    const onVis = () => {
      if (document.hidden) stopLoop()
    }

    document.addEventListener('visibilitychange', onVis)
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    document.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('mouseenter', onMouseEnter)

    return () => {
      stopLoop()
      clearTimeout(idleTimer)
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('touchend', onTouchEnd)
      document.removeEventListener('mouseleave', onMouseLeave)
      document.removeEventListener('mouseenter', onMouseEnter)
    }
  }, [])

  return <div ref={ref} className="cursor-glow" aria-hidden="true" style={{ opacity: 1 }} />
}
