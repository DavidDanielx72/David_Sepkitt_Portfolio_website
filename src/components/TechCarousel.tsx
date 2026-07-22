import { carouselTech } from '../data/portfolio'

export default function TechCarousel() {
  const items = [...carouselTech, ...carouselTech]
  return (
    <div className="tech-carousel" aria-label="Tools and technologies I use">
      <div className="tech-track">
        {items.map((t, i) => (
          <span className="tech-pill" key={i}>
            <span className="tech-group">{t.group}</span>
            {t.label}
          </span>
        ))}
      </div>
    </div>
  )
}
