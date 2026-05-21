interface LogoProps {
  className?: string
  iconOnly?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const heights = { sm: 'h-7', md: 'h-9', lg: 'h-12' }

export function Logo({ className = '', size = 'md' }: LogoProps) {
  return (
    <img
      src="/logo.png"
      alt="IE Pescados"
      className={`${heights[size]} w-auto object-contain ${className}`}
    />
  )
}
