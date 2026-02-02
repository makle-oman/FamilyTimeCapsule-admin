import { http } from "@/utils/http";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:1314";

// 管理员登录
export const adminLogin = (data: { username: string; password: string }) => {
  return http.post<any, any>(`${BASE_URL}/api/admin/login`, { data });
};

// ========== 仪表盘统计 ==========
export const getDashboardStats = () => {
  return http.post<any, any>(`${BASE_URL}/api/admin/dashboard/stats`);
};

export const getDashboardTrends = (params?: { days?: number }) => {
  return http.post<any, any>(`${BASE_URL}/api/admin/dashboard/trends`, { data: params });
};

// ========== 用户管理 ==========
export const getUsers = (params: { page?: number; limit?: number; keyword?: string }) => {
  return http.post<any, any>(`${BASE_URL}/api/admin/users/list`, { data: params });
};

export const getUserDetail = (userId: string) => {
  return http.post<any, any>(`${BASE_URL}/api/admin/users/detail`, { data: { userId } });
};

export const updateUserStatus = (userId: string, status: string) => {
  return http.post<any, any>(`${BASE_URL}/api/admin/users/status`, { data: { userId, status } });
};

// ========== 家庭管理 ==========
export const getFamilies = (params: { page?: number; limit?: number; keyword?: string }) => {
  return http.post<any, any>(`${BASE_URL}/api/admin/families/list`, { data: params });
};

export const getFamilyDetail = (familyId: string) => {
  return http.post<any, any>(`${BASE_URL}/api/admin/families/detail`, { data: { familyId } });
};

// ========== 内容审核 ==========
export const getMemories = (params: { page?: number; limit?: number; status?: string }) => {
  return http.post<any, any>(`${BASE_URL}/api/admin/memories/list`, { data: params });
};

export const getPhotos = (params: { page?: number; limit?: number }) => {
  return http.post<any, any>(`${BASE_URL}/api/admin/photos/list`, { data: params });
};

export const getLetters = (params: { page?: number; limit?: number }) => {
  return http.post<any, any>(`${BASE_URL}/api/admin/letters/list`, { data: params });
};

export const reviewContent = (data: { type: string; id: string; action: string; reason?: string }) => {
  return http.post<any, any>(`${BASE_URL}/api/admin/review`, { data });
};
