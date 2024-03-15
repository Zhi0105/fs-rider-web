import React, { useState, useEffect } from 'react'
import { NoPage } from '../NoPage'
import { Header } from '@_components/Header'
import { Loader } from '@_components/Loader'
import { Footer } from '@_components/Footer'
import { NextSeo } from 'next-seo';

export const PageTemplates = ({ children }: { children: React.ReactNode }) => {
  const [ screenWidth, setScreenWidth ] = useState<number | undefined>()

  useEffect(() => {
    function handleResize() {
      setScreenWidth(window.innerWidth);
    }

    // Initial call to set initial window width
    handleResize();

    // Add event listener to update width on resize
    window.addEventListener('resize', handleResize);

    // Remove event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty dependency array to run only once on mount

  if(!screenWidth) {
    return (
      <div className='min-h-screen min-w-screen page_template_main bg-gray-200'>
        <Loader />
      </div>
    )
  }

  return (
    <div className='min-h-screen min-w-screen page_template_main bg-gray-200'>
      { screenWidth && screenWidth <= 768 ? (
        <div>
          <Header />
          {children}
        </div>
      ): (
        <div>
          <Header />
          <NoPage />
          <Footer />
        </div>
      )}
    </div>
  )
}
