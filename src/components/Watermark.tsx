import React, { useEffect, useRef, useCallback, FC }  from 'react'
import { waterMarkInterface } from '@_types/watermark/interface';
import { breakTextIntoLines, DateFormatter } from 'utils/helpers';
import { useWaterMarkStore } from '@_store/watermark';

export const Watermark:FC<waterMarkInterface> = ({ file, facingMode, location, order }) => {
  const canvasRef = useRef(null);
  const { setWaterMark } = useWaterMarkStore((state) => ({ setWaterMark: state.setWaterMark }));


  const base64ToFile = useCallback(async(photo: string, filename: string) => {
    const byteString = atob(photo.split(',')[1])
    const ab = new ArrayBuffer(byteString.length)
    const ia = new Uint8Array(ab)
    for(let i = 0; i < byteString.length; i+=1) {
      ia[i] = byteString.charCodeAt(i)
    }
    const blob = new Blob([ab], { type: 'image/webp' })
    const newFile = new File([blob], filename, { type: 'image/webp' })
    setWaterMark(newFile)
  }, [setWaterMark])

  const photoCallback =  useCallback((photo: string | null):any => {
    photo && base64ToFile(photo, 'proof_of_delivery.webp')
  }, [base64ToFile])


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
        const backgroundOpacity = 0.5;
        const backgroundHeight = 150;
        const horizontalPadding = 30;
        const verticalPadding = 7;
        const paddingLeft = 20;
      
        context.fillStyle = `rgba(42, 42, 42, ${backgroundOpacity})`;

        //Background
        context.fillRect(
          horizontalPadding,
          canvas.height - backgroundHeight + verticalPadding - 28,
          canvas.width - 2 * horizontalPadding,
          backgroundHeight - 2 * verticalPadding
        );
  
        context.font = '17px Arial';
        context.fillStyle = 'rgb(255, 255, 255)';
  
        const lineHeight = 20;
        let currentY = canvas.height - 150 + verticalPadding; 
        const maxLineWidth = canvas.width - 2 * (horizontalPadding + paddingLeft);
        
        // City, Country
        const cityCountryText =  location.address[7].formatted_address;
        const cityCountryLines = breakTextIntoLines(cityCountryText, context, maxLineWidth);

        cityCountryLines.forEach((line) => {
          context.fillText(line, 20 + paddingLeft, currentY);
          currentY += lineHeight;
        });
  
        // Complete specific address
        const formattedAddress = location.address[0].formatted_address;
        const formattedAddressLines = breakTextIntoLines(formattedAddress, context, maxLineWidth);

        formattedAddressLines.forEach((line) => {
          context.fillText(line, 20 + paddingLeft, currentY);
          currentY += lineHeight;
        });

        // Latitude & Longitude
        context.fillText(`Lat ${location.latitude}, Long ${location.longitude}`, 20 + paddingLeft, currentY); 
        currentY += lineHeight;

        // Date & Time
        context.fillText(`${DateFormatter(file.lastModifiedDate, order)}`, 20 + paddingLeft, currentY);
  
        photoCallback(canvas.toDataURL());
      }

      // setWatermarkSrc(canvas.toDataURL())
      photoCallback(canvas.toDataURL())
    }

  }, [file, photoCallback, facingMode, location, order])


  return (
    <canvas ref={canvasRef} id="myCanvas" className='w-full p-4' />
  )
}
