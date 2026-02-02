<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useECharts } from "@pureadmin/utils";
import type { EChartsOption } from "echarts";

defineOptions({
  name: "Dashboard"
});

// 统计数据
const stats = ref({
  totalUsers: 0,
  totalFamilies: 0,
  totalMemories: 0,
  totalPhotos: 0,
  totalLetters: 0,
  todayNewUsers: 0,
  todayNewMemories: 0,
  activeUsers: 0
});

// 加载状态
const loading = ref(true);

// 趋势图配置
const { setOptions: setTrendOptions, getInstance: getTrendInstance } =
  useECharts();
const { setOptions: setTypeOptions, getInstance: getTypeInstance } =
  useECharts();

// 模拟数据（实际使用时从API获取）
const mockStats = {
  totalUsers: 128,
  totalFamilies: 45,
  totalMemories: 1256,
  totalPhotos: 3420,
  totalLetters: 89,
  todayNewUsers: 5,
  todayNewMemories: 23,
  activeUsers: 67
};

// 近7天数据趋势
const trendData = {
  dates: ["01-27", "01-28", "01-29", "01-30", "01-31", "02-01", "02-02"],
  users: [3, 5, 2, 8, 4, 6, 5],
  memories: [15, 23, 18, 32, 25, 28, 23],
  photos: [45, 68, 52, 89, 72, 85, 78]
};

// 内容类型分布
const typeData = [
  { name: "文字记录", value: 520 },
  { name: "照片记录", value: 680 },
  { name: "语音记录", value: 56 }
];

onMounted(() => {
  // 模拟加载
  setTimeout(() => {
    stats.value = mockStats;
    loading.value = false;

    // 设置趋势图
    setTrendOptions({
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "cross" }
      },
      legend: {
        data: ["新增用户", "新增记忆", "新增照片"],
        bottom: 0
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "12%",
        containLabel: true
      },
      xAxis: {
        type: "category",
        data: trendData.dates
      },
      yAxis: {
        type: "value"
      },
      series: [
        {
          name: "新增用户",
          type: "line",
          smooth: true,
          data: trendData.users,
          itemStyle: { color: "#409EFF" }
        },
        {
          name: "新增记忆",
          type: "line",
          smooth: true,
          data: trendData.memories,
          itemStyle: { color: "#67C23A" }
        },
        {
          name: "新增照片",
          type: "bar",
          data: trendData.photos,
          itemStyle: { color: "#E6A23C" }
        }
      ]
    } as EChartsOption);

    // 设置类型分布图
    setTypeOptions({
      tooltip: {
        trigger: "item",
        formatter: "{b}: {c} ({d}%)"
      },
      legend: {
        orient: "vertical",
        left: "left",
        top: "center"
      },
      series: [
        {
          name: "内容类型",
          type: "pie",
          radius: ["40%", "70%"],
          center: ["60%", "50%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2
          },
          label: {
            show: true,
            formatter: "{b}\n{c}"
          },
          data: typeData.map((item, index) => ({
            ...item,
            itemStyle: {
              color: ["#E07A5F", "#81B29A", "#F2CC8F"][index]
            }
          }))
        }
      ]
    } as EChartsOption);
  }, 500);
});

// 统计卡片配置
const statCards = computed(() => [
  {
    title: "总用户数",
    value: stats.value.totalUsers,
    icon: "ep:user",
    color: "#409EFF",
    bgColor: "rgba(64, 158, 255, 0.1)",
    suffix: "人"
  },
  {
    title: "家庭数量",
    value: stats.value.totalFamilies,
    icon: "ep:house",
    color: "#67C23A",
    bgColor: "rgba(103, 194, 58, 0.1)",
    suffix: "个"
  },
  {
    title: "记忆总数",
    value: stats.value.totalMemories,
    icon: "ep:document",
    color: "#E6A23C",
    bgColor: "rgba(230, 162, 60, 0.1)",
    suffix: "条"
  },
  {
    title: "照片总数",
    value: stats.value.totalPhotos,
    icon: "ep:picture",
    color: "#F56C6C",
    bgColor: "rgba(245, 108, 108, 0.1)",
    suffix: "张"
  },
  {
    title: "信件总数",
    value: stats.value.totalLetters,
    icon: "ep:message",
    color: "#909399",
    bgColor: "rgba(144, 147, 153, 0.1)",
    suffix: "封"
  },
  {
    title: "今日新增用户",
    value: stats.value.todayNewUsers,
    icon: "ep:plus",
    color: "#409EFF",
    bgColor: "rgba(64, 158, 255, 0.1)",
    suffix: "人"
  },
  {
    title: "今日新增记忆",
    value: stats.value.todayNewMemories,
    icon: "ep:edit",
    color: "#67C23A",
    bgColor: "rgba(103, 194, 58, 0.1)",
    suffix: "条"
  },
  {
    title: "活跃用户",
    value: stats.value.activeUsers,
    icon: "ep:check",
    color: "#E6A23C",
    bgColor: "rgba(230, 162, 60, 0.1)",
    suffix: "人"
  }
]);
</script>

<template>
  <div class="dashboard-container">
    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stat-cards">
      <el-col
        v-for="(card, index) in statCards"
        :key="index"
        :xs="12"
        :sm="8"
        :md="6"
        :lg="6"
      >
        <el-card shadow="hover" class="stat-card" v-loading="loading">
          <div class="stat-card-content">
            <div
              class="stat-icon"
              :style="{ backgroundColor: card.bgColor, color: card.color }"
            >
              <IconifyIconOnline :icon="card.icon" width="28" />
            </div>
            <div class="stat-info">
              <div class="stat-title">{{ card.title }}</div>
              <div class="stat-value" :style="{ color: card.color }">
                {{ card.value
                }}<span class="stat-suffix">{{ card.suffix }}</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :xs="24" :sm="24" :md="16" :lg="16">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <div class="card-header">
              <span>数据趋势（近7天）</span>
            </div>
          </template>
          <div
            ref="trendRef"
            v-use-echart="{ setOptions: setTrendOptions, getInstance: getTrendInstance }"
            class="trend-chart"
          />
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="8" :lg="8">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <div class="card-header">
              <span>内容类型分布</span>
            </div>
          </template>
          <div
            ref="typeRef"
            v-use-echart="{ setOptions: setTypeOptions, getInstance: getTypeInstance }"
            class="type-chart"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.dashboard-container {
  padding: 20px;
}

.stat-cards {
  margin-bottom: 20px;
}

.stat-card {
  margin-bottom: 20px;

  :deep(.el-card__body) {
    padding: 20px;
  }
}

.stat-card-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 12px;
  flex-shrink: 0;
}

.stat-info {
  flex: 1;
  min-width: 0;
}

.stat-title {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
  line-height: 1.2;
}

.stat-suffix {
  font-size: 14px;
  font-weight: normal;
  margin-left: 4px;
}

.chart-row {
  margin-bottom: 20px;
}

.chart-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  span {
    font-size: 16px;
    font-weight: 500;
  }
}

.trend-chart {
  height: 350px;
}

.type-chart {
  height: 350px;
}

[v-use-echart] {
  width: 100%;
}
</style>
