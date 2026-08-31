import axios from "axios";


const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true
});

export async function getSong({ mood, excludeSongId }) {
  const response = await api.get('/api/songs', {
    params: { mood, excludeSongId: excludeSongId || undefined },
  })
  return response.data
}
