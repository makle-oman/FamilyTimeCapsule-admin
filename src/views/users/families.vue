<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import { ElMessage } from "element-plus";
import dayjs from "dayjs";
import { getFamilies } from "@/api/admin";

defineOptions({
  name: "FamilyList"
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
    const res = await getFamilies({
      page: pagination.page,
      limit: pagination.limit,
      keyword: searchForm.keyword || undefined
    });
    if (res.code === 200 && res.data) {
      tableData.value = res.data.items;
      total.value = res.data.total;
    }
  } catch (error) {
    console.error("加载家庭列表失败:", error);
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
  ElMessage.info(`查看家庭详情: ${row.name}`);
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
  <div class="family-list-container">
    <!-- 搜索栏 -->
    <el-card shadow="never" class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="家庭名称">
          <el-input
            v-model="searchForm.keyword"
            placeholder="请输入家庭名称"
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
        <el-table-column type="index" label="#" width="60" />
        <el-table-column prop="name" label="家庭名称" width="150">
          <template #default="{ row }">
            <div class="family-name">
              <IconifyIconOnline icon="ep:house" class="family-icon" />
              <span>{{ row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="slogan"
          label="家庭口号"
          min-width="200"
          show-overflow-tooltip
        />
        <el-table-column prop="inviteCode" label="邀请码" width="100">
          <template #default="{ row }">
            <el-tag type="info" size="small">{{ row.inviteCode }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="membersCount"
          label="成员"
          width="80"
          align="center"
        >
          <template #default="{ row }">
            <span class="stat-num">{{ row.membersCount }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="memoriesCount"
          label="记忆"
          width="80"
          align="center"
        >
          <template #default="{ row }">
            <span class="stat-num text-primary">{{ row.memoriesCount }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="photosCount"
          label="照片"
          width="80"
          align="center"
        >
          <template #default="{ row }">
            <span class="stat-num text-success">{{ row.photosCount }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="lettersCount"
          label="信件"
          width="80"
          align="center"
        >
          <template #default="{ row }">
            <span class="stat-num text-warning">{{ row.lettersCount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="establishedYear" label="建立年份" width="100" />
        <el-table-column label="创建时间" width="180">
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
              查看详情
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
.family-list-container {
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

.family-name {
  display: flex;
  gap: 8px;
  align-items: center;
}

.family-icon {
  color: #e07a5f;
}

.stat-num {
  font-weight: 500;
}

.text-primary {
  color: #409eff;
}

.text-success {
  color: #67c23a;
}

.text-warning {
  color: #e6a23c;
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
