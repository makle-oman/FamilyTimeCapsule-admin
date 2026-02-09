import { defineStore } from "pinia";
import { store } from "../utils";
import type { NotificationData } from "@/utils/socket";

export interface NotificationItem {
  id: string;
  avatar: string;
  title: string;
  datetime: string;
  type: string;
  description: string;
  status?: "primary" | "success" | "warning" | "info" | "danger";
  extra?: string;
  read?: boolean;
}

interface NotificationState {
  notifications: NotificationItem[];
  connected: boolean;
}

/**
 * 格式化时间为相对时间
 */
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "刚刚";
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;
  return date.toLocaleDateString("zh-CN");
}

export const useNotificationStore = defineStore("notification", {
  state: (): NotificationState => ({
    notifications: [],
    connected: false
  }),

  getters: {
    /** 未读通知数量 */
    unreadCount(): number {
      return this.notifications.filter(n => !n.read).length;
    },

    /** 通知列表（按tabs格式） */
    noticeTabsData() {
      return [
        {
          key: "1",
          name: "通知",
          list: this.notifications,
          emptyText: "暂无通知"
        }
      ];
    }
  },

  actions: {
    /** 设置连接状态 */
    setConnected(status: boolean) {
      this.connected = status;
    },

    /** 添加新通知 */
    addNotification(data: NotificationData) {
      const notification: NotificationItem = {
        id: data.id,
        avatar:
          data.type === "memory"
            ? "https://xiaoxian521.github.io/hyperlink/svg/smile1.svg"
            : "https://xiaoxian521.github.io/hyperlink/svg/smile2.svg",
        title: data.title,
        description: `[${data.familyName}] ${data.description}`,
        datetime: formatRelativeTime(data.createdAt),
        type: "1",
        status: data.type === "memory" ? "success" : "primary",
        read: false
      };

      // 添加到列表头部
      this.notifications.unshift(notification);

      // 限制最多保留 50 条通知
      if (this.notifications.length > 50) {
        this.notifications.pop();
      }
    },

    /** 标记通知为已读 */
    markAsRead(id: string) {
      const notification = this.notifications.find(n => n.id === id);
      if (notification) {
        notification.read = true;
      }
    },

    /** 标记所有通知为已读 */
    markAllAsRead() {
      this.notifications.forEach(n => (n.read = true));
    },

    /** 清空所有通知 */
    clearAll() {
      this.notifications = [];
    }
  }
});

export function useNotificationStoreHook() {
  return useNotificationStore(store);
}
