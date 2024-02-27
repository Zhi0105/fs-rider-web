import React from "react"
// import { GeneralSettings } from "@_api/general/generalSettings"
import { PageTemplates } from "./Templates/PageTemplates"
import Lottie from "lottie-react"
import img from '@_assets/image.json'
import { DropDown } from "@_components/Forms/Select"

export const Landing = () => {
  return (
    <PageTemplates>
      <div className="landing_main min-h-screen">
        <section className="form-container flex flex-col justify-center items-center">
          
          <div className="order_number w-4/5 tex-xl text-[#2E426C] font-bold text-center mt-5 shadow-lg bg-white rounded-lg p-4">
            FS-1120240221100010
          </div>

          <div className="image_preview mt-5 w-4/5 rounded-lg bg-[#F3F3F3]">
          <Lottie animationData={img} className="p-4" />
          </div>

          <div className="mt-5 w-4/5 bg-white rounded-lg shadow-lg p-4">
            <button 
                // onClick={handleSubmit((data) => onSubmit(data))}
                type="button" 
                className="w-full text-white bg-[#555A6E] flex justify-center items-center gap-4 cursor-pointer p-2 rounded-lg mb-5"
              >
                {/* <BiLogIn width={50} height={50} /> */}
                Proof of Delivery
            </button>

            <DropDown
              // value={value}
              // onChange={(e) => {
              //   onChange(e.target.value)
              // }}
              ariaPlaceHolder="Status of Delivery"
              required={true}
              data={[
                {
                  id: 1,
                  title: "Delivered"
                },
                {
                  id: 2,
                  title: "Failed Delivery"
                },

              ]}
            />

            <button 
                // onClick={handleSubmit((data) => onSubmit(data))}
                type="button" 
                className="w-full text-white bg-[#BBC9E6] flex justify-center items-center gap-4 cursor-pointer p-2 rounded-lg"
              >
                {/* <BiLogIn width={50} height={50} /> */}
                Submit
            </button>
          </div>
        </section> 
      </div>
    </PageTemplates>
  )
}