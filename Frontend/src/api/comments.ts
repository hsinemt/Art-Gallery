import axios from 'axios';

export type Comment = {
  id: number;
  publication: number;
  author: number | string;
  author_username?: string | null;
  content: string;
  created_at: string;
  updated_at: string;
};

const API_BASE_URL = 'http://127.0.0.1:8000';
const TOKEN_KEY = 'auth_token';

const api = axios.create({ baseURL: API_BASE_URL });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers = config.headers ?? {};
    config.headers['Authorization'] = `Token ${token}`;
  }
  return config;
});

export async function listComments(publication: number | string): Promise<Comment[]> {
  const res = await api.get<Comment[]>('/api/comments/', { params: { publication } });
  return res.data as unknown as Comment[];
}

export async function createComment(publication: number, content: string): Promise<Comment> {
  const res = await api.post<Comment>('/api/comments/', { publication, content });
  return res.data as unknown as Comment;
}

export async function updateComment(id: number, content: string): Promise<Comment> {
  const res = await api.patch<Comment>(`/api/comments/${id}/`, { content });
  return res.data as unknown as Comment;
}

export async function deleteComment(id: number): Promise<void> {
  await api.delete(`/api/comments/${id}/`);
}

export async function summarizeComments(publication: number | string): Promise<{ summary: string | null, detail?: string } > {
  const res = await api.get<{ summary: string | null, detail?: string }>(`/api/comments/summary`, { params: { publication } });
  return res.data as any;
}


