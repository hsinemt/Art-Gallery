import axios from '../axios';
import type { Reclamation } from '../../types';

const API_URL = '/api/reclamation/';

export interface CreateReclamationData {
    cible?: number;
    sujet: 'system' | 'user';
    contenu: string;
}

export const reclamationService = {
    getAllReclamations: async (): Promise<Reclamation[]> => {
        const token = localStorage.getItem('auth_token');
        const response = await axios.get(API_URL, token ? { headers: { Authorization: `Token ${token}` } } : undefined);
        return response.data;
    },

    getReclamation: async (id: number): Promise<Reclamation> => {
        const response = await axios.get(`${API_URL}${id}/`);
        return response.data;
    },

    createReclamation: async (data: CreateReclamationData): Promise<Reclamation> => {
        const token = localStorage.getItem('auth_token');
        const response = await axios.post(API_URL, data, token ? { headers: { Authorization: `Token ${token}` } } : undefined);
        return response.data;
    },

    updateReclamation: async (id: number, data: Partial<CreateReclamationData>): Promise<Reclamation> => {
        const response = await axios.patch(`${API_URL}${id}/`, data);
        return response.data;
    },

    deleteReclamation: async (id: number): Promise<void> => {
        await axios.delete(`${API_URL}${id}/`);
    },

    // Obtenir les réclamations reçues par l'utilisateur
    getReceivedReclamations: async (): Promise<Reclamation[]> => {
        const token = localStorage.getItem('auth_token');
        const response = await axios.get(`${API_URL}received/`, token ? { headers: { Authorization: `Token ${token}` } } : undefined);
        return response.data;
    },

    // Obtenir les réclamations envoyées par l'utilisateur
    getSentReclamations: async (): Promise<Reclamation[]> => {
        const token = localStorage.getItem('auth_token');
        const response = await axios.get(`${API_URL}sent/`, token ? { headers: { Authorization: `Token ${token}` } } : undefined);
        return response.data;
    },
};