import axios from "axios"

export const baseURL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://backend:5000'

export const axiosChegadosApi = axios.create({ baseURL })
