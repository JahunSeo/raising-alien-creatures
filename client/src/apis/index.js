import axios from "axios";

const baseURL =
  process.env.NODE_ENV === "production" ? "/api" : "http://localhost:5000/api";

console.log("[debug] NODE_ENV", process.env.NODE_ENV);

export default axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json; charset=utf-8",
  },
  // `withCredentials` indicates whether or not cross-site Access-Control requests
  // should be made using credentials
  withCredentials: true,
});
