export interface RTODataInterface {
  order_name: string,
  proof_of_delivery?: any,
  is_delivered: boolean | number
}


export interface RTOContextInteface {
  handleRTO: (data:RTODataInterface, resetData: () => void) => void,
  RTODevLoading: boolean 
}