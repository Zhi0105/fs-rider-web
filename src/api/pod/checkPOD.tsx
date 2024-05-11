import { devClient, fsClient, thClient, vnClient } from "http-commons";
import { PODCheckInterface } from "@_types/pod/interface";

export const PODCheck = (payload: PODCheckInterface) => {

  const result = fsClient.get('/riders-check-order-status', {params: payload})
  return result
}

export const PODCheckTH = (payload: PODCheckInterface) => {

  const result = thClient.get('/riders-check-order-status', {params: payload})
  return result
}

export const PODCheckVN = (payload: PODCheckInterface) => {

  const result = vnClient.get('/riders-check-order-status', {params: payload})
  return result
}
