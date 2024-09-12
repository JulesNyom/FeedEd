"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, CheckCircle, PenTool, Users } from "lucide-react"

export default function HeroSection () {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle email submission here
    console.log('Email submitted:', email)
  }

  return (
    <div className="bg-gradient-to-b rounded-3xl from-primary/10 to-background">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          <div>
            <Badge className="mb-4">New Feature</Badge>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
              Create Surveys That{' '}
              <span className="text-primary">Get Results</span>
            </h1>
            <p className="mt-6 text-xl text-gray-500 max-w-3xl">
              Design, distribute, and analyze surveys with ease. Our powerful platform helps you gather insights and make data-driven decisions.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <form onSubmit={handleSubmit} className="flex-1 sm:max-w-md">
                <div className="flex w-full max-w-sm items-center space-x-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Button type="submit">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            </div>
            <div className="mt-8 flex items-center gap-x-4 text-sm text-gray-500">
              <div className="flex items-center gap-x-1">
                <CheckCircle className="h-4 w-4 text-primary" />
                Free 14-day trial
              </div>
              <div className="flex items-center gap-x-1">
                <CheckCircle className="h-4 w-4 text-primary" />
                No credit card required
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary opacity-10 rounded-2xl blur-2xl"></div>
            <img
              src="/placeholder.svg?height=600&width=800"
              alt="Survey creation interface"
              className="relative rounded-2xl shadow-2xl"
            />
            <div className="absolute -bottom-8 -left-8 bg-background p-4 rounded-lg shadow-lg flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <PenTool className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Easy to Use</p>
                <p className="text-sm text-gray-500">Intuitive drag-and-drop interface</p>
              </div>
            </div>
            <div className="absolute -top-8 -right-8 bg-background p-4 rounded-lg shadow-lg flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">1M+ Users</p>
                <p className="text-sm text-gray-500">Join our growing community</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}