const Layout = () => import("@/layout/index.vue");

export default {
  path: "/content",
  name: "Content",
  component: Layout,
  redirect: "/content/memories",
  meta: {
    icon: "ep/document",
    title: "内容管理",
    rank: 3
  },
  children: [
    {
      path: "/content/memories",
      name: "MemoryList",
      component: () => import("@/views/content/memories.vue"),
      meta: {
        title: "记忆列表"
      }
    },
    {
      path: "/content/photos",
      name: "PhotoList",
      component: () => import("@/views/content/photos.vue"),
      meta: {
        title: "照片列表"
      }
    },
    {
      path: "/content/letters",
      name: "LetterList",
      component: () => import("@/views/content/letters.vue"),
      meta: {
        title: "信件列表"
      }
    },
    {
      path: "/content/questions",
      name: "QuestionList",
      component: () => import("@/views/content/questions.vue"),
      meta: {
        title: "每日问答"
      }
    }
  ]
} satisfies RouteConfigsTable;
