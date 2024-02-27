import Image from "next/image"
import logo from '@_assets/logo.webp'

export const Header = () => {
  return (
    <div className="header-main w-full flex justify-center items-center bg-[#2E426C] text-white font-bold py-4">
      <div className="flex gap-2">
        <Image src={logo} height={25} width={25} alt="book" priority />        
        FS RIDER APP
      </div>
    </div>
  )
}
