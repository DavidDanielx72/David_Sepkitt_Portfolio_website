import { useEffect, useRef } from 'react'

export default function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0
    let tx = window.innerWidth / 2
    let ty = window.innerHeight / 2
    let cx = tx
    let cy = ty

    const onMove = (e: MouseEvent) => { tx = e.clientX; ty = e.clientY }
    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0]
      if (t) { tx = t.clientX; ty = t.clientY; el.style.opacity = '1' }
    }
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0]
      if (t) { tx = t.clientX; ty = t.clientY; el.style.opacity = '1' }
    }
    const onTouchEnd = () => { el.style.opacity = '0' }
    const onLeave = () => { el.style.opacity = '0' }
    const onEnter = () => { el.style.opacity = '1' }

    const loop = () => {
      cx += (tx - cx) * 0.14
      cy += (ty - cy) * 0.14
      el.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    const onVis = () => {
      if (document.hidden) cancelAnimationFrame(raf)
      else raf = requestAnimationFrame(loop)
    }
    document.addEventListener('visibilitychange', onVis)

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  return <div ref={ref} className="cursor-glow" aria-hidden style={{ opacity: 1 }} />
}
