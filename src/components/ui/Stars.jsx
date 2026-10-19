import { Star } from 'lucide-react'

export default function Stars({ value = 5, size = 16, className = '' }) {
  return (
    <span className={`inline-flex gap-0.5 text-star ${className}`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={size} fill={i <= value ? 'currentColor' : 'none'}
          className={i <= value ? '' : 'text-border-strong'} />
      ))}
    </span>
  )
}
