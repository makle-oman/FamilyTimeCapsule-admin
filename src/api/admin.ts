import { http } from "@/utils/http";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:1314";

// ========== 仪表盘统计 ==========
export const getDashboardStats = () => {
  return http.get<any, any>(`${BASE_URL}/api/admin/dashboard/stats`);
};

export const getDashboardTrends = () => {
  return http.get<any, any>(`${BASE_URL}/api/admin/dashboard/trend`);
};

// ========== 用户管理 ==========
export const getUsers = (params: {
  page?: number;
  limit?: number;
  keyword?: string;
}) => {
  return http.get<any, any>(`${BASE_URL}/api/admin/users`, { params });
};

// ========== 家庭管理 ==========
export const getFamilies = (params: {
  page?: number;
  limit?: number;
  keyword?: string;
}) => {
  return http.get<any, any>(`${BASE_URL}/api/admin/families`, { params });
};

// ========== 内容管理 ==========
export const getMemories = (params: {
  page?: number;
  limit?: number;
  type?: string;
  keyword?: string;
}) => {
  return http.get<any, any>(`${BASE_URL}/api/admin/memories`, { params });
};

export const deleteMemory = (id: string) => {
  return http.request<any>("delete", `${BASE_URL}/api/admin/memories/${id}`);
};

export const getPhotos = (params: { page?: number; limit?: number }) => {
  return http.get<any, any>(`${BASE_URL}/api/admin/photos`, { params });
};

export const getLetters = (params: {
  page?: number;
  limit?: number;
  status?: string;
}) => {
  return http.get<any, any>(`${BASE_URL}/api/admin/letters`, { params });
};
