const viteEnv = (import.meta as any).env;
export const API_BASE_URL = viteEnv.VITE_API_URL || '/api';
