import axios from '../axios';
import type { Rapport } from '../../types';

// Backend router registers the viewset under `/api/rapport/rapports/`
const API_URL = '/api/rapport/rapports/';

export const rapportService = {
    getAllRapports: async (): Promise<Rapport[]> => {
        const response = await axios.get(API_URL);
        return response.data;
    },

    getRapport: async (id: number): Promise<Rapport> => {
        const response = await axios.get(`${API_URL}${id}/`);
        return response.data;
    },

    createRapport: async (formData: FormData): Promise<Rapport> => {
        const response = await axios.post(API_URL, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    updateRapport: async (id: number, formData: FormData): Promise<Rapport> => {
        // Use PATCH so that updating only some fields (e.g. changing image or name) works
        const response = await axios.patch(`${API_URL}${id}/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    deleteRapport: async (id: number): Promise<void> => {
        await axios.delete(`${API_URL}${id}/`);
    },
};