import axios from '../axios';
import type { User } from '../../types';

const API_URL = '/api/users/';

export const userService = {
    getAllUsers: async (): Promise<User[]> => {
        const response = await axios.get(`${API_URL}list/`);
        return response.data;
    },

    getCurrentUser: async (): Promise<User> => {
        const response = await axios.get(`${API_URL}profile/`);
        return response.data;
    },

    isAdmin: async (): Promise<boolean> => {
        try {
            const response = await axios.get(`${API_URL}is-admin/`);
            return response.data.is_admin;
        } catch {
            return false;
        }
    }
};