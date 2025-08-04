"use client"
import React, { useState } from 'react'
import Sidebar from './_components/Sidebar';
import Header from './_components/Header';

const DashboardLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="relative">
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-amber-400 bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}
      
      <div className={`
        fixed top-0 left-0 z-50 h-screen w-64 transform transition-transform duration-300 ease-in-out
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:z-30
      `}>
        <Sidebar />
      </div>

      <div className="md:ml-64 min-h-screen">
        <div className="relative">
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md border hover:bg-gray-50 transition-colors"
            aria-label="Toggle mobile menu"
          >
            <svg 
              className="w-6 h-6 text-gray-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              {isMobileSidebarOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          
          <div className="pl-16 md:pl-0">
            <Header />
          </div>
        </div>
        
        <div className="p-4 md:p-6">
          {children}
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout