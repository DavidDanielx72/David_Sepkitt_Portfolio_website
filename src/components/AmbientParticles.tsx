import { useEffect, useRef } from 'react'

type Particle = {
  x: number; y: number; vx: number; vy: number; r: number
  baseO: number; tw: number; twSpeed: number
  phase: number; fade: number; fadeSpeed: number
}

export default function AmbientParticles() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true })
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches
    let w = window.innerWidth
    let h = window.innerHeight
    let dpr = Math.min(window.devicePixelRatio || 1, isTouch ? 1.5 : 2)

    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      dpr = Math.min(window.devicePixelRatio || 1, isTouch ? 1.5 : 2)
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    const density = isTouch ? 56000 : 22000
    const cap = isTouch ? 28 : 72
    const count = Math.min(Math.floor((w * h) / density), cap)
    const particles: Particle[] = []
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.16,
        vy: (Math.random() - 0.5) * 0.16,
        r: Math.random() * 1.8 + 0.5,
        baseO: Math.random() * 0.45 + 0.25,
        tw: Math.random() * Math.PI * 2,
        twSpeed: Math.random() * 0.02 + 0.008,
        phase: Math.random() * Math.PI * 2,
        fade: Math.random(),
        fadeSpeed: Math.random() * 0.003 + 0.001,
      })
    }

    let mx = w / 2
    let my = h / 2
    let cx = mx
    let cy = my
    let raf = 0
    let running = true

    const onMouseMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY }
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) { mx = e.touches[0].clientX; my = e.touches[0].clientY }
    }

    let resizeTimer = 0
    const debouncedResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(resize, 150)
    }

    const render = () => {
      if (!running) return
      cx += (mx - cx) * 0.05
      cy += (my - cy) * 0.05
      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'lighter'

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        p.tw += p.twSpeed
        p.fade += p.fadeSpeed
        if (p.fade > 1) { p.fade = 1; p.fadeSpeed *= -1 }
        if (p.fade < 0.2) { p.fade = 0.2; p.fadeSpeed *= -1 }
        if (p.x < -20) p.x = w + 20
        if (p.x > w + 20) p.x = -20
        if (p.y < -20) p.y = h + 20
        if (p.y > h + 20) p.y = -20

        const dx = p.x - cx
        const dy = p.y - cy
        const dist2 = dx * dx + dy * dy
        const proximity = dist2 < 50000 ? (1 - dist2 / 50000) * 0.6 : 0
        const twinkle = (Math.sin(p.tw) + 1) / 2
        const opacity = p.baseO * (0.35 + twinkle * 0.65) * p.fade + proximity * 0.3
        const radius = p.r + proximity * 1.8

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius * 6)
        grad.addColorStop(0, `rgba(232, 201, 138, ${opacity * 0.5})`)
        grad.addColorStop(0.3, `rgba(212, 181, 118, ${opacity * 0.22})`)
        grad.addColorStop(1, 'rgba(212, 181, 118, 0)')
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(p.x, p.y, radius * 6, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = `rgba(244, 224, 184, ${opacity * 0.85})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2)
        ctx.fill()
      }

      raf = requestAnimationFrame(render)
    }

    const onVis = () => {
      if (document.hidden) { running = false; cancelAnimationFrame(raf) }
      else if (!reduced && !running) { running = true; raf = requestAnimationFrame(render) }
    }

    if (!reduced) {
      raf = requestAnimationFrame(render)
    } else {
      for (const p of particles) {
        ctx.fillStyle = `rgba(212, 181, 118, ${p.baseO * 0.5})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    if (!isTouch) {
      window.addEventListener('mousemove', onMouseMove, { passive: true })
    }
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('resize', debouncedResize)
    document.addEventListener('visibilitychange', onVis)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      clearTimeout(resizeTimer)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('resize', debouncedResize)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  return <canvas ref={ref} className="ambient-particles" aria-hidden="true" />
}
