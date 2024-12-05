export const getFullFileUrl = (fileUrl: string): string => {
  const baseUrl = import.meta.env.VITE_API_URL;
  return fileUrl.startsWith('http') ? fileUrl : `${baseUrl}${fileUrl}`;
}; 