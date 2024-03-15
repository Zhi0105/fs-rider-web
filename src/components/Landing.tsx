import React, { useEffect, useState, useContext, useCallback } from "react";
import { PageTemplates } from "./Templates/PageTemplates";
import { DropDown } from "@_components/Forms/Select";
import { Controller, useForm } from "react-hook-form";
import Lottie from "lottie-react";
import img from "@_assets/image.json";
import { getGeoLocationCoding } from "@_api/location/geoCoding";
import { useRouter, useSearchParams  } from "next/navigation";
import { useOrderStore } from "@_store/order";
import { useLocationStore } from "@_store/location";
import { useWaterMarkStore } from "@_store/watermark";
import { Watermark } from "./Watermark";
import { RTOContext } from "@_providers/context/RTOContext";
import { toast } from "react-toastify"
interface PODInterface {
  pod_id?: string | number,
  order?: any,
  reason: string
}

export const Landing = () => {
  const { handleRTO, RTODevLoading, RTOFSLoading, RTOTHLoading, RTOVNLoading } = useContext(RTOContext)
  const [selectedStatus, setSelectedStatus] = useState<string | number>();
  const [photo, setPhoto] = useState<number | any>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment" | null>(null);
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
  const { watermark } = useWaterMarkStore((state) => ({ watermark: state.watermark }));
  


  useEffect(() => {
    // Retrieve photo from localStorage
    const storedPhoto = sessionStorage.getItem("capturedPhoto");
    const storedFacingMode = sessionStorage.getItem("facingMode");
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
      order: params ? params : order ? order: "",
      reason: ""
    },
  });

  const resetData = () => {
    // Clear local storage or total reset
    localStorage.removeItem("capturedPhoto");
    localStorage.removeItem("facingMode");
    setPhoto(null);
    setValue("order", "")
    setValue("pod_id", "")
    setValue("reason", "")
    setOrder("")
  }



  const onSubmit = (data: PODInterface): void => {
    let is_delivered = data.pod_id == 1 ? Number(data.pod_id) : 0
    let payload;

      if(!is_delivered) {
        payload = {
          order_name: data.order,
          is_delivered,
          reason: data.reason
        }
        handleRTO(payload, resetData)
      } else {
          payload = {
            order_name: data.order,
            proof_of_delivery: watermark,
            is_delivered
        }
        photo ? handleRTO(payload, resetData)  : toast("Please attached proof of delivery", { type: "warning" }) 
      }
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

  const loadingCallback = useCallback(() => {
    if(RTODevLoading || RTOFSLoading || RTOTHLoading || RTOVNLoading) {
      return true
    }
     else {
      return false
     }
  }, [RTODevLoading, RTOFSLoading, RTOTHLoading, RTOVNLoading])

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
                order={order}
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
                      is_delivered: true
                    },
                    {
                      id: 2,
                      title: "Failed Delivery",
                      is_delivered: false
                    },
                  ]}
                />
              )}
              name="pod_id"
            />

            {selectedStatus === 2 && (
              <div>
                <Controller
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { onChange, value } }) => (
                    <textarea 
                    onChange={onChange}
                    value={value}
                    className="block p-2.5 min-h-[120px] w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 mb-4" 
                    placeholder="Reason for failed delivery..." 
                  />       
                  )}
                  name="reason"
                />
                {errors.reason && (
                  <p className="text-sm text-red-400 indent-2">failed delivery reason is required*</p>
                )}  
              </div>
            )}

            <button
              disabled={loadingCallback()}
              type="submit"
              className="w-full text-white bg-[#4E80EE] flex justify-center items-center gap-4 cursor-pointer p-2 rounded-lg mt-2"
            >
              {RTODevLoading || RTOFSLoading || RTOTHLoading || RTOVNLoading ? "Please wait..." : "Submit" }
              
            </button>
        </div>
        </form>
      </div>
    </PageTemplates>
  );
};
