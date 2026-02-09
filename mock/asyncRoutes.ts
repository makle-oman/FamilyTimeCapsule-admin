// 模拟后端动态生成路由
import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 管理后台使用静态路由，不需要动态权限路由
export default defineFakeRoute([
  {
    url: "/get-async-routes",
    method: "get",
    response: () => {
      return {
        success: true,
        data: []
      };
    }
  }
]);
