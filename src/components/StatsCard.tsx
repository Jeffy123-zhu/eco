interface StatsCardProps {
  title: string
  value: string | number
  unit?: string
  subtitle?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  icon?: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'gradient'
}

export default function StatsCard({
  title,
  value,
  unit,
  subtitle,
  trend,
  icon,
  variant = 'default',
}: StatsCardProps) {
  const variants = {
    default: 'bg-white border-gray-100',
    success: 'bg-eco-50 border-eco-100',
    warning: 'bg-orange-50 border-orange-100',
    gradient: 'bg-gradient-to-br from-eco-500 to-eco-600 text-white border-transparent',
  }

  const isGradient = variant === 'gradient'

  return (
    <div className={`rounded-xl p-5 shadow-sm border ${variants[variant]}`}>
      <div className="flex items-center justify-between">
        <p className={`text-sm ${isGradient ? 'text-eco-100' : 'text-gray-500'}`}>
          {title}
        </p>
        {icon && (
          <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            isGradient ? 'bg-white/20' : 'bg-gray-100'
          }`}>
            {icon}
          </span>
        )}
      </div>
      
      <p className={`text-2xl font-bold mt-2 ${isGradient ? '' : 'text-gray-800'}`}>
        {value}
        {unit && <span className="text-sm font-normal ml-1">{unit}</span>}
      </p>
      
      {(subtitle || trend) && (
        <div className="mt-1 flex items-center gap-2">
          {trend && (
            <span className={`text-xs flex items-center gap-0.5 ${
              trend.isPositive ? 'text-eco-600' : 'text-red-500'
            }`}>
              <svg className={`w-3 h-3 ${trend.isPositive ? '' : 'rotate-180'}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              {Math.abs(trend.value)}%
            </span>
          )}
          {subtitle && (
            <span className={`text-xs ${isGradient ? 'text-eco-100' : 'text-gray-400'}`}>
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
