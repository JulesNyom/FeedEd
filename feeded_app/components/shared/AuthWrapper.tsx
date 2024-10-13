"use client"

import React, { useEffect } from 'react'
import { useAuth } from '@/context/AuthContext' // Adjust this import path as needed
import PageDeChargement from '../../app/loading'

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, loading } = useAuth()

  useEffect(() => {
    if (!loading && !currentUser) {
      window.location.href = '/login' // Redirect to login if not authenticated
    }
  }, [currentUser, loading])

  if (loading) {
    return <div>
        <PageDeChargement />
    </div> // Or a more sophisticated loading component
  }

  if (!currentUser) {
    return null // This will never actually render because the redirect will happen
  }

  return <>{children}</>
}

export default AuthWrapper