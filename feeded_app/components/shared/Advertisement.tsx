import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '../ui/button'

const Advertisement = () => {
  return (
    <div className="w-full my-5 rounded-3xl bg-gradient-to-b from-indigo via-mediumpurple to-pink flex flex-col items-center justify-center py-1 px-0,5 space-y-1">
      <Link href="/" className="w-36">
      <Image
      src="/assets/images/survey.png"
      width={512}  // Increased width
      height={152}  // Increased height
      alt="Feeded logo"
    />
      </Link>
      <div className='space-y-1'>
      <p className='text-white font-normal text-sm'>Plus de formations ?</p>
      <p className='text-white font-thin text-xs'>Devenez premium.</p>
      <Link href="/" passHref>
        <Button variant="link" className="inline-flex items-center mt-2 mb-4 px-4 py-2 text-white font-semibold">
          Par ici
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </Link>
      </div>
    </div>
  )
}

export default Advertisement