export function Field({ label, required, hint, children }) {
  return (
    <label className="block">
      <span className="label">{label}{required && <span className="text-green"> *</span>}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  )
}

export function Spinner({ className = '' }) {
  return (
    <span className={`inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white ${className}`} />
  )
}
