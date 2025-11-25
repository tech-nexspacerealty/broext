'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'

export const useStart = () => {
  const [isStarting, setIsStarting] = useState(false)
  const router = useRouter()
  const start = () => {
      console.log('>><>>>>>>>>>>>>>>>>> ');
    setIsStarting(true)

    
    setTimeout(() => router.push('/extract'), 500)
  }
  return { isStarting, start }
}

export const Start1 = ({ isStarting, start }: any) => (
  <button
    onClick={start}
    disabled={isStarting}
    className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-lg shadow-lg hover:shadow-blue-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {isStarting ? 'Starting...' : 'Get Started'}
    <ArrowRight className="ml-2 w-5 h-5" />
  </button>
)

export const Start2 = ({ isStarting, start }: any) => (
  <div className="mt-10 text-center">
    <button
      onClick={start}
      disabled={isStarting}
      className="inline-flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-blue-500/50 transition-all duration-200 disabled:opacity-50"
    >
      {isStarting ? 'Starting...' : 'Start Extracting Now'}
      <ArrowRight className="ml-2 w-5 h-5" />
    </button>
  </div>
)
