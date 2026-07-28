import { useEffect, useRef } from 'react'

type Particle = {
  x: number; y: number; vx: number; vy: number; r: number
  baseO: number; tw: number; twSpeed: number
  hue: number; fade: number; fadeSpeed: number
}

const GOLD_R = 244, GOLD_G = 224, GOLD_B = 184
const GOLD_GLOW_R = 245, GOLD_GLOW_G = 210, GOLD_GLOW_B = 140

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

    const density = isTouch ? 52000 : 19000
    const cap = isTouch ? 34 : 82
    const count = Math.min(Math.floor((w * h) / density), cap)
    const particles: Particle[] = []
    for (let i = 0; i < count; i++) {
      const hue = Math.random()
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: Math.random() * 2 + 0.5,
        baseO: Math.random() * 0.5 + 0.3,
        tw: Math.random() * Math.PI * 2,
        twSpeed: Math.random() * 0.025 + 0.01,
        hue,
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
        const proximity = dist2 < 70000 ? (1 - dist2 / 70000) * 0.8 : 0
        const twinkle = (Math.sin(p.tw) + 1) / 2
        const opacity = Math.min(p.baseO * (0.4 + twinkle * 0.6) * p.fade + proximity * 0.45, 1)
        const radius = p.r + proximity * 2.4
        const glowR = Math.max(radius * 7, 1)

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR)
        if (p.hue < 0.22) {
          grad.addColorStop(0, `rgba(142,245,214,${opacity * 0.55})`)
          grad.addColorStop(0.3, `rgba(110,231,199,${opacity * 0.24})`)
          grad.addColorStop(1, 'rgba(110,231,199,0)')
        } else {
          grad.addColorStop(0, `rgba(${GOLD_GLOW_R},${GOLD_GLOW_G},${GOLD_GLOW_B},${opacity * 0.58})`)
          grad.addColorStop(0.3, `rgba(${GOLD_R},${GOLD_G},${GOLD_B},${opacity * 0.26})`)
          grad.addColorStop(1, 'rgba(212,181,118,0)')
        }
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2)
        ctx.fill()

        const coreColor = p.hue < 0.22
          ? `rgba(168,250,228,${opacity * 0.9})`
          : `rgba(${GOLD_R},${GOLD_G},${GOLD_B},${opacity * 0.92})`
        ctx.fillStyle = coreColor
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
        ctx.fillStyle = `rgba(212,181,118,${p.baseO * 0.5})`
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
