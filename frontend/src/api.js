const envApiBase = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL;
export const API_BASE = envApiBase || (import.meta.env.DEV ? "http://localhost:5000" : "");

export const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
