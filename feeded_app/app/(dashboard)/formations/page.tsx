import { TrainingCard } from '@/components/shared/TrainingCard'
import { TrainingTable } from '@/components/shared/TrainingTable'
import React from 'react'

const page = () => {
  return (
    <>
    <div className='m-10'>
    <TrainingTable/>
    </div>
    <div>
      <TrainingCard/>
    </div>
    </>
  )
}

export default page