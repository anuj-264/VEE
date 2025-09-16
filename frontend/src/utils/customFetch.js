import axios from 'axios';


const serverURL = import.meta.env.VITE_SERVER_URL;

const customFetch = axios.create({
  baseURL: serverURL,
  withCredentials: true,
});

export default customFetch;