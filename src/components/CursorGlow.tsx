import { useEffect, useRef } from 'react'

export default function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    let tx = window.innerWidth / 2
    let ty = window.innerHeight / 2
    let cx = tx
    let cy = ty

    const onMouseMove = (e: MouseEvent) => {
      tx = e.clientX
      ty = e.clientY
    }
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches[0]) { tx = e.touches[0].clientX; ty = e.touches[0].clientY; el.style.opacity = '1' }
    }
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) { tx = e.touches[0].clientX; ty = e.touches[0].clientY; el.style.opacity = '1' }
    }
    const onTouchEnd = () => { el.style.opacity = '0' }
    const onMouseLeave = () => { el.style.opacity = '0' }
    const onMouseEnter = () => { el.style.opacity = '1' }

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
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    document.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('mouseenter', onMouseEnter)

    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
      document.removeEventListener('mouseleave', onMouseLeave)
      document.removeEventListener('mouseenter', onMouseEnter)
    }
  }, [])

  return <div ref={ref} className="cursor-glow" aria-hidden="true" style={{ opacity: 1 }} />
}
