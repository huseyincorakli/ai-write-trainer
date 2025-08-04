import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const WorkspaceHeader = ({fileName}:{fileName:string}) => {
  
  return (
    <div className='p-4 flex justify-between shadow-md'>
      <Link href={'/dashboard'}>
      <Image  src={'/logo.svg'} alt='logo' width={140} height={100}/>
      </Link>
      <h2 className='text-2xl font-bold'>{fileName.replace('.pdf','').toLocaleUpperCase()}</h2>
      <UserButton/>
    </div>
  )
}

export default WorkspaceHeader
