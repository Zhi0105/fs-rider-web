import React, { useEffect, useState, useContext, useCallback } from "react";
import Image from "next/image"
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
import { SubmitLoading } from "./SubmitLoading";
import { PODCheck, PODCheckTH, PODCheckVN } from "@_api/pod/checkPOD";
import EXIF from 'exif-js'

interface PODInterface {
  pod_id?: string | number,
  order?: any,
  reason: string
}

export const Landing = () => {
  const { handleRTO, RTODevLoading, RTOFSLoading, RTOTHLoading, RTOVNLoading } = useContext(RTOContext)
  const [PODC, setPODC] = useState<any>()
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
    getValues,
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
          proof_of_delivery: watermark,
          is_delivered,
          reason: data.reason
        }
        // handleRTO(payload, resetData)
        photo ? handleRTO(payload, resetData)  : toast("Please attached proof of delivery", { type: "warning" }) 
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
          toast.error("Location permission is blocked. Please enable the location browser permission to proceed.");
        }
      );
    } else {
      console.log("Geolocation is not suported by this browser");
    }
  };

  const convertDMSToDD = (degrees: any, minutes: any, seconds: any, direction: any) => {
    let dd = degrees + minutes / 60 + seconds / (60 * 60);

    if (direction === 'S' || direction === 'W') {
      dd = dd * -1;
    }

    return dd;
  };

  const handleExifImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file:any = event.target.files
    if (file?.length > 0) {
      const selectedFile = file[0]
      setPhoto(await fileTobase64(selectedFile))
      await EXIF.getData(selectedFile, () => {
        const  orientation = EXIF.getAllTags(selectedFile)
        if (orientation && orientation.GPSLatitude && orientation.GPSLongitude) {
          const latitude = convertDMSToDD(
            orientation.GPSLatitude[0],
            orientation.GPSLatitude[1],
            orientation.GPSLatitude[2],
            orientation.GPSLatitudeRef
          );

          const longitude = convertDMSToDD(
            orientation.GPSLongitude[0],
            orientation.GPSLongitude[1],
            orientation.GPSLongitude[2],
            orientation.GPSLongitudeRef
          );

          // console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
          let payload = {
            latitude,
            longitude
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
        } else {
          toast.warning("No location detected.")
          setLocation({})
        }
      })
    } else {
      console.log("no selected file")
    }
  }

  const fileTobase64 = (file: any) => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
  })


  const podCheckCallback = useCallback(async(order: string) => {
    const order_prefix = order.split("-")[0]

    if(order_prefix.toLowerCase() === "FS".toLowerCase() || order_prefix.toLowerCase() === "PO".toLowerCase()) { 
      await PODCheck({order_name: order}).then(res => {
        console.log(res.data)
        setPODC(res.data)      
        
      }).catch(err => {
        console.log("@PODC:", err.response.data.message)
      })
    }
    if(order_prefix.toLowerCase() === "TH".toLowerCase()) {
      await PODCheckTH({order_name: order}).then(res => {
        console.log(res.data)
        setPODC(res.data)      
        
      }).catch(err => {
        console.log("@PODC:", err.response.data.message)
      })
    }
    if(order_prefix.toLowerCase() === "VN".toLowerCase()) { 
      await PODCheckVN({order_name: order}).then(res => {
        console.log(res.data)
        setPODC(res.data)      
        
      }).catch(err => {
        console.log("@PODC:", err.response.data.message)
      })
    }
    
    // await PODCheck({order_name: order}).then(res => {
    //   console.log(res.data)
    //   setPODC(res.data)      
      
    // }).catch(err => {
    //   console.log("@PODC:", err.response.data.message)
    // })

  }, [watch("order")])

  
  useEffect(() => {
    podCheckCallback(getValues("order"))
  }, [podCheckCallback])


  // const loadingCallback = useCallback(() => {
  //   if(RTODevLoading || RTOFSLoading || RTOTHLoading || RTOVNLoading) {
  //     return true
  //   }
  //    else {
  //     return false
  //    }
  // }, [RTODevLoading, RTOFSLoading, RTOTHLoading, RTOVNLoading])

  if(RTODevLoading || RTOFSLoading || RTOTHLoading || RTOVNLoading) {
    return (
      <SubmitLoading />
    )
  }


  return (
    <PageTemplates>
      <div className="landing_main min-h-screen pb-4">
        <form className="form-container flex flex-col justify-center items-center" onSubmit={handleSubmit((data) => onSubmit(data))}>
          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <input 
                className="order_number w-4/5 text-xl text-[#2E426C] font-bold text-center mt-5 shadow-lg bg-white rounded-lg p-4 outline-none"
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
          
          {PODC && !PODC?.is_end_state && 
            <input 
              type="file"
              onChange={handleExifImageChange} 
              className="exif-image w-4/5 text-sm py-4 file:rounded-md file:border-0 file:bg-[#2E426C] file:py-2.5 file:px-4 file:text-sm file:font-semibold file:text-white hover:file:bg-primary-700 focus:outline-none disabled:pointer-events-none disabled:opacity-60" 
            />
          }

          {PODC && PODC?.is_end_state && PODC?.pod &&
            <div className="w-[350] h-[450] py-8">
              <Image src={PODC?.pod} alt="POD" priority width={350} height={450}/>
            </div>
          }

          {PODC && PODC?.is_end_state &&
            <div className="w-[350] h-[450] py-8">
              <h1 className="text-xl">Already tagged as 
                <p className={`font-bold text-center text-2xl capitalize ${PODC?.status.toLowerCase() === 'delivered' ? "text-green-500" : "text-red-500"}`}>
                  {`${PODC?.status}`}
                </p>
              </h1>
            </div>
          }
      
          {PODC && !PODC?.is_end_state && 
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
          }
          
          {PODC && !PODC?.is_end_state && 
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
    type="submit"
    className="w-full text-white bg-[#4E80EE] flex justify-center items-center gap-4 cursor-pointer p-2 rounded-lg mt-2"
  >
    Submit
  </button>
            </div>
          } 
          
        </form>
      </div>
    </PageTemplates>
  );
};
