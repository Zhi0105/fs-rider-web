import Image from "next/image"
import nopage from '@_assets/nopage.webp'

export const NoPage = () => {
  return (
    <div className="404_main min-h-screen flex flex-col justify-center items-center">
        <div className="w-[350] h-[450]">
          <Image src={nopage} alt="book" priority />
        </div>    
        <label className="text-5xl text-[#2F2C6F] font-bold mt-5">MOBILE BROWSER ONLY</label>
        <label className="text-base mt-1 text-[#2F2C6F]">Please switch to mobile view</label>
    </div>
  )
}
