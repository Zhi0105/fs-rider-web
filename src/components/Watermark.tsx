import React, { useEffect, useRef, useCallback, FC }  from 'react'
import { waterMarkInterface } from '@_types/watermark/interface';
import { DateFormatter } from 'utils/helpers';

export const Watermark:FC<waterMarkInterface> = ({ file, facingMode, location }) => {
  const canvasRef = useRef(null);

  const base64ToFile = async(photo: string, filename: string) => {
    const byteString = atob(photo.split(',')[1])
    const ab = new ArrayBuffer(byteString.length)
    const ia = new Uint8Array(ab)
    for(let i = 0; i < byteString.length; i+=1) {
      ia[i] = byteString.charCodeAt(i)
    }
    const blob = new Blob([ab], { type: 'image/webp' })
    const newFile = new File([blob], filename, { type: 'image/webp' })
    console.log(newFile)
  }

  const photoCallback =  useCallback((photo: string | null):any => {
     
    photo && base64ToFile(photo, 'image.webp')
  }, [])


  useEffect(() => {
    const canvas = document.getElementById("myCanvas") as HTMLCanvasElement
    const context = canvas?.getContext('2d')
    const image = new Image()
    image.src = file

    image.onload = () => {
      canvas.width = image.width
      canvas.height = image.height


      {facingMode === 'user' &&
        context?.scale(-1, 1);
        context?.drawImage(image, -image.width, 0);
        context?.setTransform(1, 0, 0, 1, 0, 0);      
      }

      {facingMode === 'environment' &&
        context?.drawImage(image, 0, 0);
        context?.setTransform(1, 0, 0, 1, 0, 0);      
      }

      // context?.drawImage(image, 0, 0)
      

      if(context && location) {
        context.font = '17px Arial'
        context.fillStyle = 'rgb(255, 255, 255)'
        context?.fillText(`${location.address[7].formatted_address}`, 20, canvas.height + (-80))
        context?.fillText(`${location.address[0].formatted_address}`, 20, canvas.height + (-60))
        context?.fillText(`Lat ${location.latitude}, Long ${location.longitude}`, 20, canvas.height + (-40))
        context?.fillText(`${DateFormatter(file.lastModifiedDate)}`, 20, canvas.height + (-20))
      }

      // setWatermarkSrc(canvas.toDataURL())
      photoCallback(canvas.toDataURL())
    }

  }, [file, photoCallback])


  return (
    <canvas ref={canvasRef} id="myCanvas" className='w-full p-4' />
  )
}
