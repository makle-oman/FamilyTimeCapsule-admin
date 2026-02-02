<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { getMemories, deleteMemory } from "@/api/admin";

defineOptions({
  name: "MemoryList"
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
  keyword: "",
  type: ""
});

// 加载数据
const loadData = async () => {
  loading.value = true;
  try {
    const res = await getMemories({
      page: pagination.page,
      limit: pagination.limit,
      type: searchForm.type || undefined,
      keyword: searchForm.keyword || undefined
    });
    if (res.code === 200 && res.data) {
      tableData.value = res.data.items;
      total.value = res.data.total;
    }
  } catch (error) {
    console.error("加载记忆列表失败:", error);
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
  searchForm.type = "";
  pagination.page = 1;
  loadData();
};

// 查看详情
const handleViewDetail = (row: any) => {
  ElMessage.info(`查看记忆详情: ${row.id}`);
};

// 删除
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除这条记忆吗？此操作不可恢复。`, "警告", {
    confirmButtonText: "确定删除",
    cancelButtonText: "取消",
    type: "warning"
  }).then(async () => {
    try {
      await deleteMemory(row.id);
      ElMessage.success("删除成功");
      loadData();
    } catch (error) {
      ElMessage.error("删除失败");
    }
  });
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

// 获取类型标签
const getTypeTag = (type: string) => {
  const map: Record<string, { text: string; type: string }> = {
    TEXT: { text: "文字", type: "" },
    PHOTO: { text: "照片", type: "success" },
    VOICE: { text: "语音", type: "warning" }
  };
  return map[type] || { text: type, type: "info" };
};

onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="memory-list-container">
    <!-- 搜索栏 -->
    <el-card shadow="never" class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="关键词">
          <el-input
            v-model="searchForm.keyword"
            placeholder="内容/作者"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="类型">
          <el-select
            v-model="searchForm.type"
            placeholder="全部"
            clearable
            style="width: 120px"
          >
            <el-option label="文字" value="TEXT" />
            <el-option label="照片" value="PHOTO" />
            <el-option label="语音" value="VOICE" />
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
        <el-table-column prop="type" label="类型" width="80">
          <template #default="{ row }">
            <el-tag :type="getTypeTag(row.type).type as any" size="small">
              {{ getTypeTag(row.type).text }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="内容" min-width="300">
          <template #default="{ row }">
            <div class="content-cell">
              <span class="content-text">{{ row.content }}</span>
              <span v-if="row.imagesCount > 0" class="images-count">
                <IconifyIconOnline icon="ep:picture" />
                {{ row.imagesCount }}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="authorName" label="作者" width="120" />
        <el-table-column prop="familyName" label="家庭" width="150">
          <template #default="{ row }">
            <el-tag type="info" size="small">{{ row.familyName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="resonanceCount"
          label="共鸣"
          width="80"
          align="center"
        >
          <template #default="{ row }">
            <span class="resonance-count">
              <IconifyIconOnline icon="ep:star-filled" class="text-warning" />
              {{ row.resonanceCount }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button
              type="primary"
              link
              size="small"
              @click="handleViewDetail(row)"
            >
              查看
            </el-button>
            <el-button
              type="danger"
              link
              size="small"
              @click="handleDelete(row)"
            >
              删除
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
.memory-list-container {
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

.content-cell {
  display: flex;
  gap: 8px;
  align-items: center;
}

.content-text {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.images-count {
  display: flex;
  flex-shrink: 0;
  gap: 4px;
  align-items: center;
  font-size: 12px;
  color: #67c23a;
}

.resonance-count {
  display: flex;
  gap: 4px;
  align-items: center;
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
