import axios from "axios";
import { LocationInterface } from "@_types/Location/interface";


export const getGeoLocationCoding = (location: LocationInterface) => {
  const result =  axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.latitude},${location.longitude}&key=${process.env.API_KEY}`)
  .then((response) => {
      const address = response.data.results[0].formatted_address
      if(address) return address
      if(!address) console.log("address not found")
  }).catch((error) => {
    console.log("something went wrong", error)
  })

  return result

}