import { devClient } from "http-commons";
import { RTODataInterface } from "@_types/RTO/interface";

export const SentRTODev = async(payload: RTODataInterface) => {
  const { order_name, proof_of_delivery, is_delivered, reason, resetData } = payload;
  let config = {
    headers: {
        'Content-Type': 'multipart/form-data',
    },
  };

  console.log(proof_of_delivery)

  let formdata = new FormData();

  formdata.append('order_name', order_name);
  proof_of_delivery && formdata.append('proof_of_delivery', proof_of_delivery, proof_of_delivery.name)
  // reason && formdata.append('reason', reason)
  formdata.append('is_delivered', String(is_delivered));
  
  resetData && resetData()
  const result = await devClient.post('/riders-tag-order', formdata, config).then(res => {
    return res.data
  })
  return result
}