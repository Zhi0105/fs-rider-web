import React, { useEffect, useState } from "react"
import { PageTemplates } from "./Templates/PageTemplates"
import { DropDown } from "@_components/Forms/Select"
import { Controller, useForm } from "react-hook-form";
import Lottie from "lottie-react"
import img from '@_assets/image.json'
import { getGeoLocationCoding } from "@_api/location/geoCoding";
import { LocationInterface } from "@_types/Location/interface";

interface PODInterface {
  pod_id?: number
}

export const Landing = () => {
  const {
    handleSubmit,
    control,
    formState : { errors }
  } = useForm<PODInterface>({
      defaultValues: {
        pod_id: 0
      } 
  })
  const [ location, setLocation ] = useState<LocationInterface>()
  const onSubmit = (data: PODInterface): void => {
    console.log(data)
  }

  const getLocation = () => {
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          let payload = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }

          const geoLocationAddress = getGeoLocationCoding(payload)
          geoLocationAddress && setLocation({
            ...payload, address: geoLocationAddress
          })
        },
        (error) => {
          console.log('Error getting location', error)
        })
    } else {
      console.log("Geolocation is not suported by this browser")
    }
  }


  useEffect(() => {
    location && console.log(location)
  }, [location])


  return (
    <PageTemplates>
      <div className="landing_main min-h-screen pb-4">
        <section className="form-container flex flex-col justify-center items-center">
          
          <div className="order_number w-4/5 tex-xl text-[#2E426C] font-bold text-center mt-5 shadow-lg bg-white rounded-lg p-4">
            FS-1120240221100010
          </div>

          <div className="image_preview mt-5 w-4/5 rounded-lg bg-[#F3F3F3]">
          <Lottie animationData={img} className="p-4" />
          </div>

          <div className="mt-5 w-4/5 bg-white rounded-lg shadow-lg p-4">
            <button 
                onClick={() => getLocation()}
                type="button" 
                className="w-full text-white bg-[#555A6E] flex justify-center items-center gap-4 cursor-pointer p-2 rounded-lg mb-5"
              >
                {/* <BiLogIn width={50} height={50} /> */}
                Proof of Delivery
            </button>

            <form onSubmit={handleSubmit((data) => onSubmit(data))}>
              <Controller 
                control={control}
                render={({ field: { onChange, value } }) => (
                  <DropDown
                    value={value}
                    onChange={(e) => {
                      onChange(e.target.value)
                    }}
                    className={`
                      h-full w-full border-2 border-black p-2 text-center rounded-lg mb-5 outline-none appearance-none`
                    }
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
                )}
                name="pod_id"
              />

              <button 
                  // onClick={handleSubmit((data) => onSubmit(data))}
                  type="submit" 
                  className="w-full text-white bg-[#4E80EE] flex justify-center items-center gap-4 cursor-pointer p-2 rounded-lg"
                >
                  {/* <BiLogIn width={50} height={50} /> */}
                  Submit
              </button>
            </form>
          </div>
        </section> 
      </div>
    </PageTemplates>
  )
}