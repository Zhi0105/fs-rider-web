'use client';
import React from 'react';
import { RTOContext } from './context/RTOContext';
import { useMutation, useQueryClient  } from "@tanstack/react-query";
import { RTODataInterface } from '@_types/RTO/interface';
import { SentRTODev, SentRTOFS, SentRTOTH, SentRTOVN } from '@_api/rto/rto';
import { toast } from "react-toastify"

export const RTOProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();


  const { mutate: handleSentRTODev, isLoading: RTODevLoading } = useMutation({
    mutationFn: SentRTODev,
    onSuccess: (data: any) => {
        queryClient.invalidateQueries({ queryKey: ['dev-rto'] });
        toast("Sent Successful", { type: "success" })
        console.log("@RTOD:", data)
      }, 
    onError: (err: any) => {  
      toast(err.response.data.message, { type: "warning" })
      console.log("@RTODE:", err)
    },
  });
  const { mutate: handleSentRTOFS, isLoading: RTOFSLoading } = useMutation({
    mutationFn: SentRTOFS,
    onSuccess: (data: any) => {
        queryClient.invalidateQueries({ queryKey: ['fs-rto'] });
        toast("Sent Successful", { type: "success" })
        console.log("@RTOFS:", data)
      }, 
    onError: (err: any) => {  
      toast(err.response.data.message, { type: "warning" })
      console.log("@RTOFSE:", err)
    },
  });
  const { mutate: handleSentRTOTH, isLoading: RTOTHLoading } = useMutation({
    mutationFn: SentRTOTH,
    onSuccess: (data: any) => {
        queryClient.invalidateQueries({ queryKey: ['th-rto'] });
        toast("Sent Successful", { type: "success" })
        console.log("@RTOTH:", data)
      }, 
    onError: (err: any) => {  
      toast(err.response.data.message, { type: "warning" })
      console.log("@RTOTHE:", err)
    },
  });

  const { mutate: handleSentRTOVN, isLoading: RTOVNLoading } = useMutation({
    mutationFn: SentRTOVN,
    onSuccess: (data: any) => {
        queryClient.invalidateQueries({ queryKey: ['vn-rto'] });
        toast("Sent Successful", { type: "success" })
        console.log("@RTOVN:", data)
      }, 
    onError: (err: any) => {  
      toast(err.response.data.message, { type: "warning" })
      console.log("@RTOVNE:", err)
    },
  });
  
  

  const handleSendRTO = ( data: RTODataInterface, resetData: () => void) => {
    let newData = {
      ...data,
      resetData
    }
    const order_prefix = newData.order_name.split("-")[0]
    
    if(order_prefix.toLowerCase() === "FS".toLowerCase()) { handleSentRTOFS(newData) }
    if(order_prefix.toLowerCase() === "PO".toLowerCase()) { handleSentRTOFS(newData) }
    if(order_prefix.toLowerCase() === "TH".toLowerCase()) { handleSentRTOTH(newData) }
    if(order_prefix.toLowerCase() === "VN".toLowerCase()) { handleSentRTOVN(newData) }

    // handleSentRTODev(newData)
  }


  return (
    <RTOContext.Provider
      value={{
        handleRTO: (data, resetData) => { handleSendRTO(data, resetData)},
        RTODevLoading: RTODevLoading,
        RTOFSLoading: RTOFSLoading,
        RTOTHLoading: RTOTHLoading,
        RTOVNLoading: RTOVNLoading
      }}
    >
      {children}
    </RTOContext.Provider>
  )
}