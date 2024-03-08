import React, { useEffect, useRef, useCallback, FC }  from 'react'
import { waterMarkInterface } from '@_types/watermark/interface';
import { breakTextIntoLines, DateFormatter } from 'utils/helpers';

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
    console.log("File name: ",newFile)
  }

  const photoCallback =  useCallback((photo: string | null):any => {
    photo && base64ToFile(photo, 'proof_of_delivery.webp')
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
      
      if (context && location) {
        const backgroundOpacity = 0.7;
        const backgroundHeight = 150;
        const horizontalPadding = 30;
        const verticalPadding = 10;
        const paddingLeft = 20;
  
        context.fillStyle = `rgba(42, 42, 42, ${backgroundOpacity})`;

        context.fillRect(
          horizontalPadding,
          canvas.height - backgroundHeight + verticalPadding - 28,
          canvas.width - 2 * horizontalPadding,
          backgroundHeight - 2 * verticalPadding
        );
  
        context.font = '16px Arial';
        context.fillStyle = 'rgb(255, 255, 255)';
  
        const lineHeight = 20;
        let currentY = canvas.height - backgroundHeight + verticalPadding; 
        context.fillText(`${location.address[7].formatted_address}`, 20 + paddingLeft, currentY); // City, Country
        currentY += lineHeight;
  
        const formattedAddress = location.address[0].formatted_address;
        const maxLineWidth = canvas.width - 2 * (horizontalPadding + paddingLeft);
  
        const lines = breakTextIntoLines(formattedAddress, context, maxLineWidth);
  
        lines.forEach((line:any) => {
          context.fillText(line, 20 + paddingLeft, currentY);
          currentY += lineHeight;
        }); // complete specific address
  
        context.fillText(`Lat ${location.latitude}, Long ${location.longitude}`, 20 + paddingLeft, currentY); // long and lat
        currentY += lineHeight;
  
        context.fillText(`${DateFormatter(file.lastModifiedDate)}`, 20 + paddingLeft, currentY); // date and time
  
        photoCallback(canvas.toDataURL());
      }

      // setWatermarkSrc(canvas.toDataURL())
      photoCallback(canvas.toDataURL())
    }

  }, [file, photoCallback, facingMode, location])


  return (
    <canvas ref={canvasRef} id="myCanvas" className='w-full p-4' />
  )
}
