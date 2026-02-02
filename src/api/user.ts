import { http } from "@/utils/http";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:1314";

export type UserResult = {
  success: boolean;
  data: {
    /** 头像 */
    avatar: string;
    /** 用户名 */
    username: string;
    /** 昵称 */
    nickname: string;
    /** 当前登录用户的角色 */
    roles: Array<string>;
    /** 按钮级别权限 */
    permissions: Array<string>;
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: Date;
  };
};

export type RefreshTokenResult = {
  success: boolean;
  data: {
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: Date;
  };
};

export type CaptchaResult = {
  code: number;
  data: {
    captchaId: string;
    captchaImg: string;
  };
};

/** 获取图形验证码 */
export const getCaptcha = () => {
  return http.get<any, CaptchaResult>(`${BASE_URL}/api/admin/captcha`);
};

/** 登录 */
export const getLogin = (data?: object) => {
  return http.request<UserResult>("post", `${BASE_URL}/api/admin/login`, {
    data
  });
};

/** 刷新`token` */
export const refreshTokenApi = (data?: object) => {
  return http.request<RefreshTokenResult>(
    "post",
    `${BASE_URL}/api/admin/refresh-token`,
    { data }
  );
};
