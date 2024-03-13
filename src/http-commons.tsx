import axios, {AxiosInstance} from "axios";

let devClient: AxiosInstance
let fsClient: AxiosInstance
let thClient: AxiosInstance
let vnClient: AxiosInstance

let headers = {
  "Access-Control-Allow-Origin": "*", // Allow requests from any origin
  "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS", // Allow specified methods
  "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept", // Allow specified headers
}

if (process.env.DEV_URL) {
  devClient = axios.create({
    baseURL: process.env.DEV_URL,
    headers
  });
}

if (process.env.FS_URL) {
  fsClient = axios.create({
    baseURL: process.env.FS_URL,
    headers
  });
}

if (process.env.TH_URL) {
  thClient = axios.create({
    baseURL: process.env.TH_URL,
    headers
  });
}

if (process.env.VN_URL) {
  vnClient = axios.create({
    baseURL: process.env.VN_URL,
    headers
  });
}

export { devClient, fsClient, thClient, vnClient };