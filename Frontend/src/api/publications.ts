import axios from 'axios';

export type Publication = {
  id: number;
  title: string;
  creation_date: string; // YYYY-MM-DD
  description?: string | null;
  image?: string | null; // URL
  artist: number | string;
  artist_username?: string | null;
  created_at: string;
  updated_at: string;
};

export type CreatePublicationPayload = {
  title: string;
  creation_date: string; // YYYY-MM-DD
  description?: string;
  artist?: number | string; // optional; backend will default to current user
};

export type UpdatePublicationPayload = Partial<CreatePublicationPayload>;

const API_BASE_URL = 'http://127.0.0.1:8000';
const TOKEN_KEY = 'auth_token';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers = config.headers ?? {};
    config.headers['Authorization'] = `Token ${token}`;
  }
  return config;
});

export async function listPublications(params?: { artist?: number | string }): Promise<Publication[]> {
  const res = await api.get<Publication[]>('/api/publications/', { params });
  return res.data as unknown as Publication[];
}

export async function getPublication(id: number): Promise<Publication> {
  const res = await api.get<Publication>(`/api/publications/${id}/`);
  return res.data as unknown as Publication;
}

export async function createPublication(data: CreatePublicationPayload): Promise<Publication> {
  const res = await api.post<Publication>('/api/publications/', data);
  return res.data as unknown as Publication;
}

export async function updatePublication(id: number, data: UpdatePublicationPayload): Promise<Publication> {
  const res = await api.patch<Publication>(`/api/publications/${id}/`, data);
  return res.data as unknown as Publication;
}

export async function deletePublication(id: number): Promise<void> {
  await api.delete(`/api/publications/${id}/`);
}


