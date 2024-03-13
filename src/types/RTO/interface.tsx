export interface RTODataInterface {
  order_name: string,
  proof_of_delivery?: any,
  reason?: string,
  is_delivered: boolean | number,
  resetData?: () => void
}


export interface RTOContextInteface {
  handleRTO: (data:RTODataInterface, resetData: () => void) => void,
  RTODevLoading: boolean 
}