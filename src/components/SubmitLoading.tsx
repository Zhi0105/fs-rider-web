import React from 'react'

export const SubmitLoading = () => {
  return (
    <div className='flex flex-col w-full min-h-screen justify-center items-center'>
      <div className="border-gray-300 h-20 w-20 animate-spin rounded-full border-8 border-t-blue-600" />
      <h1 className='text-[#2E426C] font-bold text-xl'>Processing</h1>
      <h1 className='text-[#2E426C] text-base font-bold'>Please wait</h1>
      <h1 className='font-bold text-[#2E426C]'>don't refresh or forcely close the page.</h1>
    </div>
  )
}
