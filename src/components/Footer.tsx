import { GeneralSettings } from '@_api/general/generalSettings'
import React from 'react'

export const Footer = () => {
  const {data}=GeneralSettings();
  const updatedYear = data ? new Date(data.updated_at).getFullYear() : null;
  return (
    <footer className="bg-[#2E426C] text-gray-300 py-2 bottom-0 w-full">
      <div className="container mx-auto flex justify-center items-center">
        <p className="text-sm">
          © {updatedYear || 'Year'} {data?.company_name}
        </p>
      </div>
  </footer>
  )
}
