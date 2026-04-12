import { useId } from "react"

export function InstagramBrandMark({ className = "h-10 w-10" }) {
  const gradientId = useId().replace(/:/g, "")

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden="true">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FEDA77" />
            <stop offset="26%" stopColor="#F58529" />
            <stop offset="52%" stopColor="#DD2A7B" />
            <stop offset="76%" stopColor="#8134AF" />
            <stop offset="100%" stopColor="#515BD4" />
          </linearGradient>
        </defs>
        <rect x="4" y="4" width="56" height="56" rx="18" fill={`url(#${gradientId})`} />
        <rect x="17" y="17" width="30" height="30" rx="10" fill="none" stroke="white" strokeWidth="4" />
        <circle cx="32" cy="32" r="8.5" fill="none" stroke="white" strokeWidth="4" />
        <circle cx="43.5" cy="20.5" r="3.5" fill="white" />
      </svg>
    </div>
  )
}
