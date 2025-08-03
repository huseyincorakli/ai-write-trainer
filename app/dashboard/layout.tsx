import React from 'react'
import Sidebar from './_components/Sidebar';
import Header from './_components/Header';

const DashboardLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div >
        <div className='md:w-64 h-screen fixed'>
            <Sidebar/>
        </div>
        <div className='md:ml-64'>
           <Header/>
           <div>
             {children}
           </div>
        </div>
    </div>
  )
}

export default DashboardLayout
