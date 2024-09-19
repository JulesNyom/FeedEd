import { SignUp } from '@/components/shared/authentication/SignUp'
import { Button } from "@/components/ui/button"
import Link from 'next/link'

export default function EnhancedSignUpPage() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
        <SignUp />
      </div>
  )
}