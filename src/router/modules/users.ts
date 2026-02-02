const Layout = () => import("@/layout/index.vue");

export default {
  path: "/users",
  name: "Users",
  component: Layout,
  redirect: "/users/list",
  meta: {
    icon: "ep/user",
    title: "用户管理",
    rank: 2
  },
  children: [
    {
      path: "/users/list",
      name: "UserList",
      component: () => import("@/views/users/list.vue"),
      meta: {
        title: "用户列表"
      }
    },
    {
      path: "/users/families",
      name: "FamilyList",
      component: () => import("@/views/users/families.vue"),
      meta: {
        title: "家庭列表"
      }
    }
  ]
} satisfies RouteConfigsTable;
