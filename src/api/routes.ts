import { http } from "@/utils/http";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:1314";

type Result = {
  success: boolean;
  data: Array<any>;
};

export const getAsyncRoutes = () => {
  return http.request<Result>("get", `${BASE_URL}/api/admin/get-async-routes`);
};
