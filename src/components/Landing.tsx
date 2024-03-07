import React, { useEffect, useState } from "react";
import { PageTemplates } from "./Templates/PageTemplates";
import { DropDown } from "@_components/Forms/Select";
import { Controller, useForm } from "react-hook-form";
import Lottie from "lottie-react";
import img from "@_assets/image.json";
import { getGeoLocationCoding } from "@_api/location/geoCoding";
import { useRouter, useSearchParams  } from "next/navigation";
import { useOrderStore } from "@_store/order";
import { useLocationStore } from "@_store/location";
import Image from "next/image";
import { Watermark } from "./Watermark";

interface PODInterface {
  pod_id?: number,
  order?: any
}

export const Landing = () => {
  const [selectedStatus, setSelectedStatus] = useState<number | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment" | null>(
    null
  );
  const router = useRouter();
  const searchParams = useSearchParams()
  const [ params ] = useState(searchParams.get('q'))
  const { order, setOrder } = useOrderStore((state) => ({
    order: state.order,
    setOrder: state.setOrder,
  }));
    const { location, setLocation } = useLocationStore((state) => ({
      location: state.location,
      setLocation: state.setLocation,
  }));
  

  useEffect(() => {
    // Retrieve photo from localStorage
    const storedPhoto = localStorage.getItem("capturedPhoto");
    const storedFacingMode = localStorage.getItem("facingMode");
    setPhoto(storedPhoto);
    setFacingMode(storedFacingMode === "user" ? "user" : "environment");
  }, []);


  const {
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PODInterface>({
    defaultValues: {
      pod_id: 0,
      order: params ? params : order ? order: ""
    },
  });
  const onSubmit = (data: PODInterface): void => {
    console.log(data);
    // Clear local storage or total reset
    localStorage.removeItem("capturedPhoto");
    localStorage.removeItem("facingMode");
    setPhoto(null);
    setValue("order", "")
    setOrder("")
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          let payload = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };

          const geoLocationAddress = getGeoLocationCoding(payload);
            geoLocationAddress.then(res => {
             if(res) {
              setLocation({
                ...payload,
                address: [ ...res ],
              });
              setOrder(watch("order"))
            }
          }).catch(err => console.log("@GLA:", err))
          router.push("/camera"); 
        },
        (error) => {
          console.log("Error getting location", error);
        }
      );
    } else {
      console.log("Geolocation is not suported by this browser");
    }
  };

  return (
    <PageTemplates>
      <div className="landing_main min-h-screen pb-4">
        <form className="form-container flex flex-col justify-center items-center" onSubmit={handleSubmit((data) => onSubmit(data))}>
          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <input 
                className="order_number w-4/5 tex-xl text-[#2E426C] font-bold text-center mt-5 shadow-lg bg-white rounded-lg p-4 outline-none"
                type="text"
                value={value}
                onChange={onChange}
                placeholder="Order number"
              />         
            )}
            name="order"
          />
          {errors.order && (
            <p className="text-sm text-red-400 indent-2 pt-2">order number is required*</p>
          )}  
          
          <div className="image_preview mt-5 w-4/5 rounded-lg bg-[#F3F3F3]">
            {photo ? (
              <Watermark 
                file={photo}
                facingMode={facingMode}
                location={location}
              />
            ) : (
              <Lottie animationData={img} className="p-4" />
            )}
          </div>

          <div className="mt-5 w-4/5 bg-white rounded-lg shadow-lg p-4">

          <button
            onClick={() => {
              getLocation();
              // router.push("/camera"); 
            }}
            type="button"
            className="w-full text-white bg-[#555A6E] flex justify-center items-center gap-4 cursor-pointer p-2 rounded-lg mb-5"
          >
            {/* <BiLogIn width={50} height={50} /> */}
            Proof of Delivery
          </button>

            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <DropDown
                  value={value}
                  onChange={(e) => {
                    onChange(e.target.value);
                    setSelectedStatus(parseInt(e.target.value, 10));
                  }}
                  className={`
                    h-full w-full border-2 p-2 text-center rounded-lg mb-5 outline-none appearance-none
                    ${
                      selectedStatus === 1
                        ? "text-[#295E48] bg-[#D9F9E6] border-[#D9F9E6]"
                        : ""
                    }
                    ${
                      selectedStatus === 2
                        ? "text-[#8C2822] bg-[#F9E3E2] border-[#F9E3E2]"
                        : ""
                    }
                  `}
                  ariaPlaceHolder="Status of Delivery"
                  required={true}
                  data={[
                    {
                      id: 1,
                      title: "Delivered",
                    },
                    {
                      id: 2,
                      title: "Failed Delivery",
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
        </div>
        </form>
      </div>
    </PageTemplates>
  );
};
