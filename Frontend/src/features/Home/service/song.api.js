import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true
});

export async function getSong({ mood, excludeSongId }) {
  const response = await api.get('/api/songs', {
    params: { mood, excludeSongId: excludeSongId || undefined },
  })
  return response.data
}
