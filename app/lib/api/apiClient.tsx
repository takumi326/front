import axios from "axios";
import Cookies from "js-cookie";

export const apiClient = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "access-token": Cookies.get("_access_token"),
    client: Cookies.get("_client"),
    uid: Cookies.get("_uid"),
  },
});

// "http://localhost:3000"
// "https://back-red-leaf-1146.fly.dev"
