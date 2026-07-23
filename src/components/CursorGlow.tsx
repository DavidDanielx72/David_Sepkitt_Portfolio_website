import { useEffect, useRef } from 'react'

/**
 * Cursor glow — follows mouse (desktop) and touch (mobile).
 * Uses rAF loop with early-exit when position hasn't changed,
 * pauses when tab hidden, disabled on reduced-motion.
 * transform-only animation (no layout thrash).
 */
export default function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let tx = window.innerWidth / 2
    let ty = window.innerHeight / 2
    let cx = tx
    let cy = ty
    let raf = 0
    let active = false

    const onMove = (x: number, y: number) => {
      tx = x
      ty = y
      el.style.opacity = '1'
      if (!active) {
        active = true
        raf = requestAnimationFrame(loop)
      }
    }

    const onMouseMove = (e: MouseEvent) => onMove(e.clientX, e.clientY)
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches[0]) onMove(e.touches[0].clientX, e.touches[0].clientY)
    }
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        // prevent scroll interference — passive listener, just track
        onMove(e.touches[0].clientX, e.touches[0].clientY)
      }
    }
    const onTouchEnd = () => { el.style.opacity = '0' }
    const onLeave = () => { el.style.opacity = '0'; active = false; cancelAnimationFrame(raf) }
    const onEnter = () => { el.style.opacity = '1' }

    const loop = () => {
      cx += (tx - cx) * 0.15
      cy += (ty - cy) * 0.15
      // skip DOM write if movement < 0.5px — saves reflow
      if (Math.abs(tx - cx) > 0.3 || Math.abs(ty - cy) > 0.3) {
        el.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`
        raf = requestAnimationFrame(loop)
      } else {
        el.style.transform = `translate3d(${tx}px, ${ty}px, 0) translate(-50%, -50%)`
        active = false
      }
    }

    const onVis = () => {
      if (document.hidden) { cancelAnimationFrame(raf); active = false }
      else if (!active) { active = true; raf = requestAnimationFrame(loop) }
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)
    document.addEventListener('visibilitychange', onVis)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  return <div ref={ref} className="cursor-glow" aria-hidden="true" />
}
