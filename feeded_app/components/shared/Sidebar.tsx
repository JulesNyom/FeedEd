'use client'

import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { SidebarNav } from "./SidebarNav"
import   AdvertisementCard   from "./Guide/GuideCard"
import { motion } from "framer-motion"

export function Sidebar() {
  return (
    <motion.div 
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="hidden border-r bg-background md:block overflow-hidden"
    >
      <div className="flex min-h-screen flex-col gap-2">
        <div className="flex lg:h-[70px] h-[70px] items-center border-b px-6">
          <Link href="/" className="flex-shrink-0 transition-transform hover:scale-105">
            <Image
              src="/assets/images/feeded.png"
              alt="Logo"
              width={150}
              height={75}
              priority
              className="object-contain"
            />
          </Link>
          <Button 
            variant="outline" 
            size="icon" 
            className="ml-auto h-9 w-9 rounded-full transition-all duration-200 hover:bg-primary hover:text-primary-foreground"
          >
            <Bell className="h-5 w-5" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </div>
        <div className="flex-1 overflow-auto">
          <SidebarNav />
        </div>
        <motion.div 
          className="mt-auto p-4"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <AdvertisementCard />
        </motion.div>
      </div>
    </motion.div>
  )
}