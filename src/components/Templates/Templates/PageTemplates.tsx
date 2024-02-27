import React, { useState, useEffect } from 'react'
import { NoPage } from '../NoPage'
import { Header } from '@_components/Header'

export const PageTemplates = ({ children }: { children: React.ReactNode }) => {
  const [ screenWidth, setScreenWidth ] = useState<number | undefined>(window.innerWidth)

  const updateScreenWidth = () => {
    setScreenWidth(window.innerWidth)
  }

  useEffect(() => {
    window.addEventListener('resize', updateScreenWidth);  
    return () => {
      window.removeEventListener('resize', updateScreenWidth);
    };
  }, []);

  return (
    <div className='min-h-screen min-w-screen page_template_main bg-gray-200'>
      { screenWidth && screenWidth <= 768 ? (
        <div>
          <Header />
          {children}
        </div>
      ): <NoPage /> }
    </div>
  )
}
