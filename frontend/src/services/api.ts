import axios from "axios";

const API = axios.create({
  baseURL: "https://gigflow-dashboard-1.onrender.com/api"
});

export default API;