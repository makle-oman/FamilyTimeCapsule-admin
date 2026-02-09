<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import NoticeList from "./components/NoticeList.vue";
import BellIcon from "~icons/ep/bell";
import { useNotificationStoreHook } from "@/store/modules/notification";
import {
  initSocket,
  disconnectSocket,
  type NotificationData
} from "@/utils/socket";
import { ElNotification } from "element-plus";

const notificationStore = useNotificationStoreHook();

const activeKey = ref("1");

// 使用 store 中的通知数据
const notices = computed(() => notificationStore.noticeTabsData);
const noticesNum = computed(() => notificationStore.unreadCount);

const getLabel = computed(
  () => (item: any) =>
    item.name + (item.list.length > 0 ? `(${item.list.length})` : "")
);

// 初始化 Socket 连接
onMounted(() => {
  const socket = initSocket();

  socket.on("connect", () => {
    notificationStore.setConnected(true);
  });

  socket.on("disconnect", () => {
    notificationStore.setConnected(false);
  });

  // 监听新回忆创建事件
  socket.on("memory:created", (data: NotificationData) => {
    notificationStore.addNotification(data);
    // 弹出桌面通知
    ElNotification({
      title: "新回忆",
      message: data.title,
      type: "success",
      duration: 3000
    });
  });

  // 监听新信件创建事件
  socket.on("letter:created", (data: NotificationData) => {
    notificationStore.addNotification(data);
    ElNotification({
      title: "新信件",
      message: data.title,
      type: "info",
      duration: 3000
    });
  });
});

onUnmounted(() => {
  disconnectSocket();
});

// 清空通知
const handleClearAll = () => {
  notificationStore.clearAll();
};
</script>

<template>
  <el-dropdown trigger="click" placement="bottom-end">
    <span
      :class="[
        'dropdown-badge',
        'navbar-bg-hover',
        'select-none',
        Number(noticesNum) !== 0 && 'mr-[10px]'
      ]"
    >
      <el-badge :value="Number(noticesNum) === 0 ? '' : noticesNum" :max="99">
        <span class="header-notice-icon">
          <IconifyIconOffline :icon="BellIcon" />
        </span>
      </el-badge>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-tabs
          v-model="activeKey"
          :stretch="true"
          class="dropdown-tabs"
          :style="{ width: notices.length === 0 ? '200px' : '330px' }"
        >
          <el-empty
            v-if="notices.length === 0"
            description="暂无消息"
            :image-size="60"
          />
          <span v-else>
            <template v-for="item in notices" :key="item.key">
              <el-tab-pane :label="getLabel(item)" :name="`${item.key}`">
                <el-scrollbar max-height="330px">
                  <div class="noticeList-container">
                    <NoticeList :list="item.list" :emptyText="item.emptyText" />
                  </div>
                </el-scrollbar>
                <div v-if="item.list.length > 0" class="notice-footer">
                  <el-button type="primary" link @click="handleClearAll">
                    清空通知
                  </el-button>
                </div>
              </el-tab-pane>
            </template>
          </span>
        </el-tabs>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style lang="scss" scoped>
.dropdown-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 48px;
  cursor: pointer;

  .header-notice-icon {
    font-size: 18px;
  }
}

.dropdown-tabs {
  .noticeList-container {
    padding: 15px 24px 0;
  }

  :deep(.el-tabs__header) {
    margin: 0;
  }

  :deep(.el-tabs__nav-wrap)::after {
    height: 1px;
  }

  :deep(.el-tabs__nav-wrap) {
    padding: 0 36px;
  }
}

.notice-footer {
  display: flex;
  justify-content: center;
  padding: 10px 0;
  border-top: 1px solid var(--el-border-color-lighter);
}
</style>
