import { GeneralSettings } from "@_api/general/generalSettings"
import React from "react"

export const Landing = () => {
  const {data} = GeneralSettings();
  return (
    <div className="landing_main">
      {/* Test fetch data */}
      <h1>{data?.site_name}</h1> 
      <h2>{data?.company_name}</h2>
      <p>Hello from homepage</p>
    </div>
  )
}