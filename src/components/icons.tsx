// Shared inline SVG icons — no icon libraries

interface IconProps {
  className?: string
}

export const SearchIcon = ({ className = 'h-4 w-4' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" strokeLinecap="round" />
  </svg>
)

export const CopyIcon = ({ className = 'h-3.5 w-3.5' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15V5a2 2 0 0 1 2-2h10" strokeLinecap="round" />
  </svg>
)

export const CheckIcon = ({ className = 'h-3.5 w-3.5' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="m4 12 5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const ShareIcon = ({ className = 'h-3.5 w-3.5' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="6" r="3" />
    <circle cx="18" cy="18" r="3" />
    <path d="m8.7 10.7 6.6-3.4M8.7 13.3l6.6 3.4" />
  </svg>
)

export const WhatsAppIcon = ({ className = 'h-4 w-4' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.2 14.2c-.2.6-1.2 1.2-1.7 1.2-.5.1-1 .2-3.4-.7-2.8-1.2-4.6-4-4.8-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.4l.9 2.1c.1.2.1.4 0 .6l-.4.6-.5.5c-.2.2-.3.4-.1.7.2.3.8 1.4 1.8 2.2 1.2 1.1 2.3 1.5 2.6 1.6.3.1.5.1.7-.1l1-1.2c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.6.4 0 .1 0 .8-.1 1.5Z" />
  </svg>
)

export const ShirtIcon = ({ className = 'h-12 w-12' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M16 3 12 5 8 3 3 7l2.5 3L7 9v12h10V9l1.5 1L21 7l-5-4Z" strokeLinejoin="round" />
  </svg>
)

export const CloseIcon = ({ className = 'h-4 w-4' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
  </svg>
)

export const PhoneIcon = ({ className = 'h-4 w-4' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path
      d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const MapPinIcon = ({ className = 'h-4 w-4' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" strokeLinejoin="round" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

export const ClockIcon = ({ className = 'h-4 w-4' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 3" strokeLinecap="round" />
  </svg>
)

export const StoreIcon = ({ className = 'h-10 w-10' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M3 9 4.5 3h15L21 9M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0M5 11.5V21h14v-9.5M9 21v-6h6v6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const QrIcon = ({ className = 'h-5 w-5' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <path d="M14 14h3v3h-3zM20 14h1M14 20h1M20 20h1M17 20v1" strokeLinecap="round" />
  </svg>
)
