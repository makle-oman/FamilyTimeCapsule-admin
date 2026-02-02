<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import { ElMessage } from "element-plus";
import { getPhotos } from "@/api/admin";

defineOptions({
  name: "PhotoList"
});

// 表格数据
const tableData = ref([]);
const loading = ref(false);
const total = ref(0);

// 分页
const pagination = reactive({
  page: 1,
  limit: 20
});

// 预览
const previewVisible = ref(false);
const previewUrl = ref("");

// 加载数据
const loadData = async () => {
  loading.value = true;
  try {
    const res = await getPhotos({
      page: pagination.page,
      limit: pagination.limit
    });
    if (res.code === 200 && res.data) {
      tableData.value = res.data.items;
      total.value = res.data.total;
    }
  } catch (error) {
    console.error("加载照片列表失败:", error);
    ElMessage.error("加载失败");
  } finally {
    loading.value = false;
  }
};

// 预览图片
const handlePreview = (url: string) => {
  previewUrl.value = url;
  previewVisible.value = true;
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
  <div class="photo-list-container">
    <!-- 照片墙 -->
    <el-card v-loading="loading" shadow="never" class="photo-card">
      <template #header>
        <div class="card-header">
          <span>照片列表</span>
          <span class="total-count">共 {{ total }} 张</span>
        </div>
      </template>

      <div class="photo-grid">
        <div
          v-for="photo in tableData"
          :key="photo.id"
          class="photo-item"
          @click="handlePreview(photo.url)"
        >
          <el-image :src="photo.url" fit="cover" class="photo-image" lazy>
            <template #error>
              <div class="image-error">
                <IconifyIconOnline icon="ep:picture" />
              </div>
            </template>
          </el-image>
          <div class="photo-info">
            <div class="photo-content">{{ photo.content || "无描述" }}</div>
            <div class="photo-meta">
              <span class="photo-author">{{ photo.authorName }}</span>
              <span class="photo-family">{{ photo.familyName }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.limit"
          :page-sizes="[20, 40, 60, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 图片预览 -->
    <el-image-viewer
      v-if="previewVisible"
      :url-list="[previewUrl]"
      @close="previewVisible = false"
    />
  </div>
</template>

<style lang="scss" scoped>
.photo-list-container {
  padding: 20px;
}

.photo-card {
  :deep(.el-card__body) {
    padding: 20px;
  }
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .total-count {
    font-size: 14px;
    color: #909399;
  }
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}

.photo-item {
  overflow: hidden;
  cursor: pointer;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 8%);
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 8px 24px rgb(0 0 0 / 12%);
    transform: translateY(-4px);
  }
}

.photo-image {
  display: block;
  width: 100%;
  height: 180px;
}

.image-error {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 180px;
  font-size: 32px;
  color: #c0c4cc;
  background: #f5f7fa;
}

.photo-info {
  padding: 12px;
}

.photo-content {
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 14px;
  color: #303133;
  white-space: nowrap;
}

.photo-meta {
  display: flex;
  gap: 12px;
  align-items: center;
  font-size: 12px;
  color: #909399;
}

.photo-author {
  &::before {
    content: "👤 ";
  }
}

.photo-family {
  &::before {
    content: "🏠 ";
  }
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  padding-top: 20px;
  margin-top: 24px;
  border-top: 1px solid #ebeef5;
}
</style>
