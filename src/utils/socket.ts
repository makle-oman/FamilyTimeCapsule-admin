import { io, type Socket } from "socket.io-client";

let socket: Socket | null = null;

const SOCKET_URL = "http://localhost:1314/admin";

/**
 * 初始化 Socket 连接
 */
export function initSocket(): Socket {
  if (socket?.connected) {
    return socket;
  }

  socket = io(SOCKET_URL, {
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000
  });

  socket.on("connect", () => {
    console.log("[Socket] 已连接到服务器");
  });

  socket.on("disconnect", reason => {
    console.log("[Socket] 已断开连接:", reason);
  });

  socket.on("connect_error", error => {
    console.error("[Socket] 连接错误:", error.message);
  });

  return socket;
}

/**
 * 获取 Socket 实例
 */
export function getSocket(): Socket | null {
  return socket;
}

/**
 * 断开连接
 */
export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

/**
 * 通知数据接口
 */
export interface NotificationData {
  type: "memory" | "letter";
  id: string;
  title: string;
  description: string;
  familyName: string;
  authorName: string;
  createdAt: string;
}
