interface ChallengeCardProps {
  id: string
  title: string
  description: string
  progress: number
  total: number
  carbonSaved: number
  difficulty: 'easy' | 'medium' | 'hard'
  participants: number
}

export default function ChallengeCard({ 
  title, 
  description, 
  progress, 
  total, 
  carbonSaved,
  difficulty,
  participants,
}: ChallengeCardProps) {
  const percentage = Math.round((progress / total) * 100)
  const isComplete = progress >= total
  const isStarted = progress > 0

  const difficultyConfig = {
    easy: { label: 'Easy', color: 'bg-green-100 text-green-700' },
    medium: { label: 'Medium', color: 'bg-yellow-100 text-yellow-700' },
    hard: { label: 'Hard', color: 'bg-red-100 text-red-700' },
  }

  return (
    <div className={`bg-white rounded-xl p-5 shadow-sm border transition-all hover:shadow-md ${
      isComplete ? 'border-eco-200 bg-eco-50/30' : 'border-gray-100'
    }`}>
      {/* header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-800">{title}</h3>
            {isComplete && (
              <svg className="w-5 h-5 text-eco-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${difficultyConfig[difficulty].color}`}>
          {difficultyConfig[difficulty].label}
        </span>
      </div>

      {/* progress section */}
      <div className="mt-4">
        <div className="flex justify-between items-center text-sm mb-2">
          <span className="text-gray-600">
            {isComplete ? 'Completed!' : `${progress} of ${total} days`}
          </span>
          <span className="font-medium text-eco-600">
            {carbonSaved > 0 ? `${carbonSaved} kg saved` : 'Start to save CO2'}
          </span>
        </div>
        
        {/* progress bar */}
        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-700 ease-out ${
              isComplete ? 'bg-eco-500' : 'bg-eco-400'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        
        {/* percentage label */}
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-gray-400">
            {participants.toLocaleString()} participants
          </span>
          <span className="text-xs font-medium text-gray-500">{percentage}%</span>
        </div>
      </div>

      {/* action button */}
      <div className="mt-4 flex gap-2">
        {isComplete ? (
          <button className="flex-1 py-2.5 rounded-lg text-sm font-medium bg-eco-100 text-eco-700 flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
            </svg>
            Share Achievement
          </button>
        ) : isStarted ? (
          <>
            <button className="flex-1 py-2.5 rounded-lg text-sm font-medium bg-eco-500 text-white hover:bg-eco-600 transition-colors">
              Log Today
            </button>
            <button className="px-4 py-2.5 rounded-lg text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
              Details
            </button>
          </>
        ) : (
          <button className="flex-1 py-2.5 rounded-lg text-sm font-medium bg-gray-800 text-white hover:bg-gray-900 transition-colors">
            Start Challenge
          </button>
        )}
      </div>
    </div>
  )
}
