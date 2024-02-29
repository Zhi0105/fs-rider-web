import React, { useEffect, useState } from "react";
// import { GeneralSettings } from "@_api/general/generalSettings"
import { PageTemplates } from "./Templates/PageTemplates";
import Lottie from "lottie-react";
import img from "@_assets/image.json";
import { DropDown } from "@_components/Forms/Select";
import { Controller, useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface PODInterface {
  pod_id?: number;
}

export const Landing = () => {
  const [selectedStatus, setSelectedStatus] = useState<number | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment" | null>(
    null
  );

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
    formState: { errors },
  } = useForm<PODInterface>({
    defaultValues: {
      pod_id: 0,
    },
  });

  const onSubmit = (data: PODInterface): void => {
    console.log(data);

    // Clear local storage or total reset
    localStorage.removeItem("capturedPhoto");
    localStorage.removeItem("facingMode");
    setPhoto(null);
  };

  return (
    <PageTemplates>
      <div className="landing_main min-h-screen pb-4">
        <section className="form-container flex flex-col justify-center items-center">
          <div className="order_number w-4/5 tex-xl text-[#2E426C] font-bold text-center mt-5 shadow-lg bg-white rounded-lg p-4">
            FS-1120240221100010
          </div>

          <div className="image_preview mt-5 w-4/5 rounded-lg bg-[#F3F3F3]">
            {photo ? (
              <Image
                src={photo}
                alt="Captured"
                className={`p-4 ${
                  facingMode === "user" ? "transform scale-x-[-1]" : ""
                } object-cover w-full h-[78%]`}
                width={100}
                height={100}
              />
            ) : (
              <Lottie animationData={img} className="p-4" />
            )}
          </div>

          <div className="mt-5 w-4/5 bg-white rounded-lg shadow-lg p-4">
            <button
              // onClick={handleSubmit((data) => onSubmit(data))}
              type="button"
              className="w-full text-white bg-[#555A6E] flex justify-center items-center gap-4 cursor-pointer p-2 rounded-lg mb-5"
            >
              {/* <BiLogIn width={50} height={50} /> */}
              <Link href={"/camera"}>Proof of Delivery</Link>
            </button>

            <form onSubmit={handleSubmit((data) => onSubmit(data))}>
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
            </form>
          </div>
        </section>
      </div>
    </PageTemplates>
  );
};
