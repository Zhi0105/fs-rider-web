'use client';
import React from 'react';
import { RTOContext } from './context/RTOContext';
import { useMutation, useQueryClient  } from "@tanstack/react-query";
import { RTODataInterface } from '@_types/RTO/interface';
import { SentRTODev } from '@_api/rto/rto';
import { toast } from "react-toastify"

export const RTOProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();


  const { mutate: handleSentRTODev, isLoading: RTODevLoading, error: RTOErr } = useMutation({
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

  const handleSendRTO = ( data: RTODataInterface, resetData: () => void) => {
    let newData = {
      ...data,
      resetData
    }
    handleSentRTODev(newData)
  }


  return (
    <RTOContext.Provider
      value={{
        handleRTO: (data, resetData) => { handleSendRTO(data, resetData)},
        RTODevLoading: RTODevLoading
      }}
    >
      {children}
    </RTOContext.Provider>
  )
}