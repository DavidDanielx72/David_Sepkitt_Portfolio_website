import { useEffect, useRef } from 'react'

type P = {
  x: number; y: number; vx: number; vy: number
  r: number; baseO: number; tw: number; twSpeed: number
  phase: number; fade: number; fadeSpeed: number
}

export default function AmbientParticles() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let w = window.innerWidth
    let h = window.innerHeight
    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    const count = Math.min(Math.floor((w * h) / 22000), 72)
    const particles: P[] = []
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
    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY }
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0]
      if (t) { mx = t.clientX; my = t.clientY }
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('touchmove', onTouch, { passive: true })
    window.addEventListener('resize', resize)

    let raf = 0
    const render = () => {
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
        const d2 = dx * dx + dy * dy
        const boost = d2 < 50000 ? (1 - d2 / 50000) * 0.6 : 0

        const tw = (Math.sin(p.tw) + 1) / 2
        const alpha = p.baseO * (0.35 + tw * 0.65) * p.fade + boost * 0.3
        const r = p.r + boost * 1.8

        // outer glow
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 6)
        glow.addColorStop(0, `rgba(232, 201, 138, ${alpha * 0.5})`)
        glow.addColorStop(0.3, `rgba(212, 181, 118, ${alpha * 0.22})`)
        glow.addColorStop(1, 'rgba(212, 181, 118, 0)')
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(p.x, p.y, r * 6, 0, Math.PI * 2)
        ctx.fill()

        // core
        ctx.fillStyle = `rgba(244, 224, 184, ${alpha * 0.85})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
        ctx.fill()
      }
      raf = requestAnimationFrame(render)
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

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('touchmove', onTouch)
    }
  }, [])

  return <canvas ref={ref} className="ambient-particles" aria-hidden />
}
