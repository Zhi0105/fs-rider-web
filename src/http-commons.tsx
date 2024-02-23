import axios, {AxiosInstance} from "axios";

let apiClient: AxiosInstance;

if (process.env.BASE_URL) {
  apiClient = axios.create({
    baseURL: process.env.BASE_URL,
    headers: {
      "Access-Control-Allow-Origin": "*", // Allow requests from any origin
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS", // Allow specified methods
      "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept", // Allow specified headers
    },
  });
}

export { apiClient };