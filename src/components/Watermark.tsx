import React, { useEffect, useRef, useCallback }  from 'react'

export const Watermark = ({ file, facingMode }: { file?:any, facingMode?: string | null }) => {
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
    const watermarkText = 'Hello world'
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

      if(context) {
        context.font = '40px Arial'
        context.fillStyle = 'rgb(255, 255, 255)'
        context?.fillText(watermarkText, 0, canvas.height + (-20))
      }

      // setWatermarkSrc(canvas.toDataURL())
      photoCallback(canvas.toDataURL())
    }

  }, [file, photoCallback])

  


  return (
    <canvas ref={canvasRef} id="myCanvas" className='w-full p-4' />
  )
}
