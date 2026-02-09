<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import { ElMessage } from "element-plus";
import dayjs from "dayjs";
import { getUsers } from "@/api/admin";

defineOptions({
  name: "UserList"
});

// 格式化时间
const formatTime = (time: string) => {
  if (!time) return "-";
  return dayjs(time).format("YYYY-MM-DD HH:mm");
};

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
  keyword: ""
});

// 加载数据
const loadData = async () => {
  loading.value = true;
  try {
    const res = await getUsers({
      page: pagination.page,
      limit: pagination.limit,
      keyword: searchForm.keyword || undefined
    });
    if (res.code === 200 && res.data) {
      tableData.value = res.data.items;
      total.value = res.data.total;
    }
  } catch (error) {
    console.error("加载用户列表失败:", error);
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
  searchForm.keyword = "";
  pagination.page = 1;
  loadData();
};

// 查看详情
const handleViewDetail = (row: any) => {
  ElMessage.info(`查看用户详情: ${row.nickname}`);
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

onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="user-list-container">
    <!-- 搜索栏 -->
    <el-card shadow="never" class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="关键词">
          <el-input
            v-model="searchForm.keyword"
            placeholder="手机号/昵称"
            clearable
            @keyup.enter="handleSearch"
          />
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
        <el-table-column type="index" label="#" />
        <el-table-column prop="phone" label="手机号" />
        <el-table-column prop="nickname" label="昵称">
          <template #default="{ row }">
            <div class="user-info">
              <el-avatar :size="32" :src="row.avatar || ''" class="user-avatar">
                {{ row.nickname?.charAt(0) }}
              </el-avatar>
              <span>{{ row.nickname }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="familyName" label="所属家庭" width="150">
          <template #default="{ row }">
            <el-tag v-if="row.familyName" type="success" size="small">
              {{ row.familyName }}
            </el-tag>
            <span v-else class="text-gray-400">未加入</span>
          </template>
        </el-table-column>
        <el-table-column prop="memoriesCount" label="记录数" width="100">
          <template #default="{ row }">
            <span class="text-primary">{{ row.memoriesCount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="注册时间" width="180">
          <template #default="{ row }">
            {{ formatTime(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button
              type="primary"
              link
              size="small"
              @click="handleViewDetail(row)"
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
.user-list-container {
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

.user-info {
  display: flex;
  gap: 8px;
  align-items: center;
}

.user-avatar {
  color: #fff;
  background-color: #e07a5f;
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.text-primary {
  font-weight: 500;
  color: #409eff;
}

.text-gray-400 {
  color: #c0c4cc;
}

.mr-1 {
  margin-right: 4px;
}
</style>
