<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion
} from "@/api/admin";

defineOptions({
  name: "QuestionList"
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
  keyword: ""
});

// 弹窗
const dialogVisible = ref(false);
const dialogTitle = ref("新增问题");
const isEdit = ref(false);
const formLoading = ref(false);

// 表单
const formRef = ref();
const formData = reactive({
  id: "",
  content: ""
});

const formRules = {
  content: [{ required: true, message: "请输入问题内容", trigger: "blur" }]
};

// 加载数据
const loadData = async () => {
  loading.value = true;
  try {
    const res = await getQuestions({
      page: pagination.page,
      limit: pagination.limit,
      keyword: searchForm.keyword || undefined
    });
    if (res.code === 200 && res.data) {
      tableData.value = res.data.items;
      total.value = res.data.total;
    }
  } catch (error) {
    console.error("加载问答列表失败:", error);
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

// 新增
const handleAdd = () => {
  isEdit.value = false;
  dialogTitle.value = "新增问题";
  formData.id = "";
  formData.content = "";
  dialogVisible.value = true;
};

// 编辑
const handleEdit = (row: any) => {
  isEdit.value = true;
  dialogTitle.value = "编辑问题";
  formData.id = row.id;
  formData.content = row.content;
  dialogVisible.value = true;
};

// 删除
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除这条问题吗？此操作不可恢复。`, "警告", {
    confirmButtonText: "确定删除",
    cancelButtonText: "取消",
    type: "warning"
  }).then(async () => {
    try {
      await deleteQuestion(row.id);
      ElMessage.success("删除成功");
      loadData();
    } catch (error) {
      ElMessage.error("删除失败");
    }
  });
};

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid: boolean) => {
    if (!valid) return;

    formLoading.value = true;
    try {
      if (isEdit.value) {
        await updateQuestion(formData.id, {
          content: formData.content
        });
        ElMessage.success("更新成功");
      } else {
        await createQuestion({
          content: formData.content
        });
        ElMessage.success("创建成功");
      }
      dialogVisible.value = false;
      loadData();
    } catch (error: any) {
      ElMessage.error(error.message || "操作失败");
    } finally {
      formLoading.value = false;
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

onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="question-list-container">
    <!-- 搜索栏 -->
    <el-card shadow="never" class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="问题内容">
          <el-input
            v-model="searchForm.keyword"
            placeholder="请输入问题内容"
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
          <el-button type="success" @click="handleAdd">
            <IconifyIconOnline icon="ep:plus" class="mr-1" />
            新增问题
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格 -->
    <el-card shadow="never" class="table-card">
      <el-table v-loading="loading" :data="tableData" stripe>
        <el-table-column type="index" label="#" width="60" />
        <el-table-column prop="content" label="问题内容" min-width="300">
          <template #default="{ row }">
            <div class="question-content">
              <IconifyIconOnline
                icon="ep:chat-dot-round"
                class="question-icon"
              />
              <span>{{ row.content }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="使用家庭" min-width="200">
          <template #default="{ row }">
            <template v-if="row.usedCount > 0">
              <el-tag
                v-for="family in row.usedByFamilies.slice(0, 3)"
                :key="family.id"
                type="success"
                size="small"
                class="family-tag"
              >
                {{ family.name }}
              </el-tag>
              <el-tag
                v-if="row.usedByFamilies.length > 3"
                type="info"
                size="small"
                class="family-tag"
              >
                +{{ row.usedByFamilies.length - 3 }}
              </el-tag>
            </template>
            <span v-else class="text-gray">暂未使用</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="usedCount"
          label="使用次数"
          width="100"
          align="center"
        >
          <template #default="{ row }">
            <el-tag :type="row.usedCount > 0 ? 'primary' : 'info'" size="small">
              {{ row.usedCount }} 次
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="totalAnswers"
          label="回答总数"
          width="100"
          align="center"
        >
          <template #default="{ row }">
            <span :class="row.totalAnswers > 0 ? '' : 'text-gray'">
              {{ row.totalAnswers }} 条
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button
              type="primary"
              link
              size="small"
              @click="handleEdit(row)"
            >
              编辑
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

    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="80px"
      >
        <el-form-item label="问题内容" prop="content">
          <el-input
            v-model="formData.content"
            type="textarea"
            :rows="3"
            placeholder="请输入问题内容"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="formLoading" @click="handleSubmit">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.question-list-container {
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

.question-content {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.question-icon {
  flex-shrink: 0;
  margin-top: 2px;
  font-size: 16px;
  color: #e07a5f;
}

.text-gray {
  color: #c0c4cc;
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.mr-1 {
  margin-right: 4px;
}

.family-tag {
  margin-right: 4px;
  margin-bottom: 2px;
}
</style>
