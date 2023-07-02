import axios from "axios";

export const http = axios.create({
  baseURL: 'http://31.129.97.124:1000',
})