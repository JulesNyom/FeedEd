"use client"

import { useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react'

export default function ErrorPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'visible'
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 animate-fade-in">
            Oups ! Quelque chose s&lsquo;est mal passé
          </h1>
          <p className="text-xl text-gray-600 animate-fade-in animation-delay-200">
            Nous rencontrons des difficultés techniques. Veuillez réessayer dans quelques instants.
          </p>
        </div>
        
        <div className="relative w-64 h-64 mx-auto animate-float">
          <div className="absolute inset-0 bg-blue-200 rounded-full opacity-50 animate-pulse"></div>
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="50" cy="50" r="40" stroke="#3B82F6" strokeWidth="4" />
            <path
              d="M30 50L45 65L70 40"
              stroke="#3B82F6"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-draw-check"
            />
          </svg>
        </div>
        
        <button
          onClick={handleRefresh}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out animate-fade-in animation-delay-400"
          disabled={isLoading}
        >
          {isLoading ? (
            <RefreshCw className="animate-spin h-5 w-5 mr-3" />
          ) : (
            <RefreshCw className="h-5 w-5 mr-3" />
          )}
          Rafraîchir la page
        </button>
      </div>
      
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-blue-500 rounded-full opacity-10 animate-float"
            style={{
              width: `${Math.random() * 20 + 10}px`,
              height: `${Math.random() * 20 + 10}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`,
            }}
          ></div>
        ))}
      </div>
      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        @keyframes draw-check {
          from { stroke-dasharray: 0 100; }
          to { stroke-dasharray: 100 100; }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-pulse { animation: pulse 3s ease-in-out infinite; }
        .animate-draw-check { animation: draw-check 2s ease-out forwards; }
        .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-400 { animation-delay: 0.4s; }
      `}</style>
    </div>
  )
}