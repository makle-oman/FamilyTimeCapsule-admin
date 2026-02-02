<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import { ElMessage } from "element-plus";
import dayjs from "dayjs";
import { getLetters } from "@/api/admin";

defineOptions({
  name: "LetterList"
});

// 表格数据
const tableData = ref([]);
const loading = ref(false);
const total = ref(0);

// 分页
const pagination = reactive({
  page: 1,
  limit: 10
});

// 搜索
const searchForm = reactive({
  status: ""
});

// 加载数据
const loadData = async () => {
  loading.value = true;
  try {
    const res = await getLetters({
      page: pagination.page,
      limit: pagination.limit,
      status: searchForm.status || undefined
    });
    if (res.code === 200 && res.data) {
      tableData.value = res.data.items;
      total.value = res.data.total;
    }
  } catch (error) {
    console.error("加载信件列表失败:", error);
    ElMessage.error("加载失败");
  } finally {
    loading.value = false;
  }
};

// 搜索
const handleSearch = () => {
  pagination.page = 1;
  loadData();
};

// 重置
const handleReset = () => {
  searchForm.status = "";
  pagination.page = 1;
  loadData();
};

// 查看内容
const handleViewContent = (row: any) => {
  ElMessage.info(`信件内容: ${row.content}`);
};

// 分页变化
const handleSizeChange = (val: number) => {
  pagination.limit = val;
  loadData();
};

const handleCurrentChange = (val: number) => {
  pagination.page = val;
  loadData();
};

// 获取状态配置
const getStatusConfig = (status: string) => {
  const map: Record<string, { text: string; type: string }> = {
    SEALED: { text: "未到期", type: "info" },
    UNLOCKABLE: { text: "可开启", type: "warning" },
    OPENED: { text: "已开启", type: "success" }
  };
  return map[status] || { text: status, type: "info" };
};

// 计算剩余天数
const getDaysRemaining = (unlockTime: string) => {
  const now = dayjs();
  const unlock = dayjs(unlockTime);
  const diff = unlock.diff(now, "day");
  if (diff < 0) return "已到期";
  if (diff === 0) return "今天";
  return `${diff} 天后`;
};

onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="letter-list-container">
    <!-- 搜索栏 -->
    <el-card shadow="never" class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="状态">
          <el-select
            v-model="searchForm.status"
            placeholder="全部"
            clearable
            style="width: 120px"
          >
            <el-option label="未到期" value="SEALED" />
            <el-option label="可开启" value="UNLOCKABLE" />
            <el-option label="已开启" value="OPENED" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <IconifyIconOnline icon="ep:search" class="mr-1" />
            搜索
          </el-button>
          <el-button @click="handleReset">
            <IconifyIconOnline icon="ep:refresh" class="mr-1" />
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格 -->
    <el-card shadow="never" class="table-card">
      <el-table v-loading="loading" :data="tableData" stripe>
        <el-table-column type="index" label="#" width="60" />
        <el-table-column prop="content" label="内容预览" min-width="250">
          <template #default="{ row }">
            <div class="content-preview">
              <IconifyIconOnline icon="ep:message" class="letter-icon" />
              <span class="content-text">{{ row.content }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="senderName" label="发件人" width="100" />
        <el-table-column prop="receiverName" label="收件人" width="100" />
        <el-table-column prop="familyName" label="家庭" width="120">
          <template #default="{ row }">
            <el-tag type="info" size="small">{{ row.familyName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag
              :type="getStatusConfig(row.status).type as any"
              size="small"
            >
              {{ getStatusConfig(row.status).text }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="开启时间" width="180">
          <template #default="{ row }">
            <div class="unlock-time">
              <div>{{ row.unlockTime }}</div>
              <div v-if="row.status === 'SEALED'" class="remaining">
                {{ getDaysRemaining(row.unlockTime) }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button
              type="primary"
              link
              size="small"
              @click="handleViewContent(row)"
            >
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.limit"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.letter-list-container {
  padding: 20px;
}

.search-card {
  margin-bottom: 20px;

  :deep(.el-card__body) {
    padding-bottom: 0;
  }
}

.table-card {
  :deep(.el-card__body) {
    padding: 20px;
  }
}

.content-preview {
  display: flex;
  gap: 8px;
  align-items: center;
}

.letter-icon {
  flex-shrink: 0;
  font-size: 18px;
  color: #e07a5f;
}

.content-text {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.unlock-time {
  .remaining {
    margin-top: 4px;
    font-size: 12px;
    color: #e6a23c;
  }
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.mr-1 {
  margin-right: 4px;
}
</style>
