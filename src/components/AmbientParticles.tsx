import { useEffect, useRef } from 'react'

/**
 * Ambient particle field — optimised for scroll performance:
 * - Pauses rendering entirely when canvas is off-screen (IntersectionObserver)
 * - Pauses when tab hidden
 * - Reduces particle count on mobile
 * - Uses a single rAF loop with batched draw calls
 * - Cuts DPR to 1.5 on mobile for fill-rate savings
 * - No per-frame allocations
 */
export default function AmbientParticles() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const isMobile = window.innerWidth < 768
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = 0
    let h = 0
    let dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2)

    type Particle = { x: number; y: number; vx: number; vy: number; r: number; a: number }
    let particles: Particle[] = []
    let mx = -9999
    let my = -9999
    let raf = 0
    let running = false
    let visible = true

    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const count = Math.min(Math.floor((w * h) / (isMobile ? 50000 : 25000)), isMobile ? 24 : 50)
      particles = []
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          r: Math.random() * 1.6 + 0.4,
          a: Math.random() * 0.5 + 0.1,
        })
      }
    }

    const render = () => {
      if (!running || !visible) return
      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'lighter'

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy

        // wrap edges
        if (p.x < 0) p.x = w
        else if (p.x > w) p.x = 0
        if (p.y < 0) p.y = h
        else if (p.y > h) p.y = 0

        // mouse repulsion
        const dx = p.x - mx
        const dy = p.y - my
        const dist2 = dx * dx + dy * dy
        if (dist2 < 14400) {
          const dist = Math.sqrt(dist2)
          const force = (120 - dist) / 120 * 0.8
          p.x += (dx / dist) * force
          p.y += (dy / dist) * force
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(212, 181, 118, ${p.a})`
        ctx.fill()
      }

      // draw connections — only nearby pairs, skip far ones
      ctx.globalCompositeOperation = 'source-over'
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i]
          const b = particles[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist2 = dx * dx + dy * dy
          if (dist2 < 10000) {
            const op = (1 - dist2 / 10000) * 0.15
            ctx.strokeStyle = `rgba(212, 181, 118, ${op})`
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }

      raf = requestAnimationFrame(render)
    }

    const start = () => {
      if (running || reduced) return
      running = true
      raf = requestAnimationFrame(render)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
    }

    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY }
    const onTouch = (e: TouchEvent) => {
      if (e.touches[0]) { mx = e.touches[0].clientX; my = e.touches[0].clientY }
    }
    const onVis = () => { if (document.hidden) stop(); else if (visible) start() }

    // IntersectionObserver — pause when canvas scrolls off-screen
    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0].isIntersecting
        if (visible && !document.hidden) start()
        else stop()
      },
      { threshold: 0 },
    )
    io.observe(canvas)

    resize()
    window.addEventListener('resize', resize, { passive: true })
    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('touchmove', onTouch, { passive: true })
    document.addEventListener('visibilitychange', onVis)

    if (!reduced) start()

    return () => {
      stop()
      io.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('touchmove', onTouch)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  return <canvas ref={ref} className="ambient-particles" aria-hidden="true" />
}
