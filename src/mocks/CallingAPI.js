import { appConfig } from '../settings/config.js';

const apiUrl = appConfig.api.baseUrl;
const apiKey = appConfig.api.apiKey;

console.log('API URL:', apiUrl);
console.log('Environment:', import.meta.env.MODE);

// Hàm gọi API GET
export const fetchData = async (endpoint, token) => {
    try {
        const headers = {
            'Content-Type': 'application/json',
        };
        
        // Only add Authorization header if token is provided
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }
        
        const response = await fetch(`${apiUrl}${endpoint}`, {
            method: 'GET',
            headers: headers,
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

// Hàm gọi API POST
export const postData = async (endpoint, data, token) => {
    try {
        const response = await fetch(`${apiUrl}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error posting data:', error);
        throw error;
    }
};

// Hàm gọi API PUT
export const putData = async (endpoint, data, token) => {
    try {
        console.log(`PUT Request to: ${apiUrl}${endpoint}`);
        console.log('Request body:', JSON.stringify(data, null, 2));
        
        const response = await fetch(`${apiUrl}${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });
        
        // Log response details for debugging
        console.log('Response status:', response.status, response.statusText);
        
        if (!response.ok) {
            // Try to get error details from response body
            let errorDetails = '';
            try {
                const errorText = await response.text();
                console.error('Error response body:', errorText);
                errorDetails = errorText ? ` - ${errorText}` : '';
            } catch (e) {
                console.error('Could not read error response:', e);
            }
            throw new Error(`Error: ${response.statusText}${errorDetails}`);
        }
        
        // Check if response has content before parsing JSON
        const text = await response.text();
        console.log('Response text:', text || '(empty)');
        return text ? JSON.parse(text) : null;
    } catch (error) {
        console.error('Error putting data:', error);
        throw error;
    }
};

// Hàm gọi API DELETE
export const deleteData = async (endpoint, token) => {
    try {
        const response = await fetch(`${apiUrl}${endpoint}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error deleting data:', error);
        throw error;
    }
};

// Hàm gọi API PATCH
export const patchData = async (endpoint, data, token) => {
    try {
        const response = await fetch(`${apiUrl}${endpoint}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error patching data:', error);
        throw error;
    }
};
