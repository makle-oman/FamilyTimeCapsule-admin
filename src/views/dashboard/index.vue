<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useECharts } from "@pureadmin/utils";
import type { EChartsOption } from "echarts";
import { getDashboardStats, getDashboardTrends } from "@/api/admin";

defineOptions({
  name: "Dashboard"
});

// 统计数据
const stats = ref({
  userCount: 0,
  familyCount: 0,
  memoryCount: 0,
  photoCount: 0,
  letterCount: 0,
  todayUserCount: 0,
  todayMemoryCount: 0,
  activeUsers: 0
});

// 加载状态
const loading = ref(true);

// 趋势图配置
const { setOptions: setTrendOptions, getInstance: getTrendInstance } =
  useECharts();
const { setOptions: setTypeOptions, getInstance: getTypeInstance } =
  useECharts();

// 加载数据
const loadData = async () => {
  loading.value = true;
  try {
    // 获取统计数据
    const statsRes = await getDashboardStats();
    if (statsRes.code === 0 && statsRes.data) {
      stats.value = statsRes.data;
    }

    // 获取趋势数据
    const trendRes = await getDashboardTrends();
    if (trendRes.code === 0 && trendRes.data) {
      const trendData = trendRes.data;
      const dates = trendData.map((d: any) => d.date.slice(5));
      const memories = trendData.map((d: any) => d.memories);
      const users = trendData.map((d: any) => d.users);

      // 设置趋势图
      setTrendOptions({
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "cross" }
        },
        legend: {
          data: ["新增用户", "新增记忆"],
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
          data: dates
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "新增用户",
            type: "line",
            smooth: true,
            data: users,
            itemStyle: { color: "#409EFF" }
          },
          {
            name: "新增记忆",
            type: "bar",
            data: memories,
            itemStyle: { color: "#67C23A" }
          }
        ]
      } as EChartsOption);
    }

    // 设置类型分布图（基于统计数据）
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
          data: [
            {
              name: "记忆",
              value: stats.value.memoryCount,
              itemStyle: { color: "#E07A5F" }
            },
            {
              name: "照片",
              value: stats.value.photoCount,
              itemStyle: { color: "#81B29A" }
            },
            {
              name: "信件",
              value: stats.value.letterCount,
              itemStyle: { color: "#F2CC8F" }
            }
          ]
        }
      ]
    } as EChartsOption);
  } catch (error) {
    console.error("加载数据失败:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadData();
});

// 统计卡片配置
const statCards = computed(() => [
  {
    title: "总用户数",
    value: stats.value.userCount,
    icon: "ep:user",
    color: "#409EFF",
    bgColor: "rgba(64, 158, 255, 0.1)",
    suffix: "人"
  },
  {
    title: "家庭数量",
    value: stats.value.familyCount,
    icon: "ep:house",
    color: "#67C23A",
    bgColor: "rgba(103, 194, 58, 0.1)",
    suffix: "个"
  },
  {
    title: "记忆总数",
    value: stats.value.memoryCount,
    icon: "ep:document",
    color: "#E6A23C",
    bgColor: "rgba(230, 162, 60, 0.1)",
    suffix: "条"
  },
  {
    title: "照片总数",
    value: stats.value.photoCount,
    icon: "ep:picture",
    color: "#F56C6C",
    bgColor: "rgba(245, 108, 108, 0.1)",
    suffix: "张"
  },
  {
    title: "信件总数",
    value: stats.value.letterCount,
    icon: "ep:message",
    color: "#909399",
    bgColor: "rgba(144, 147, 153, 0.1)",
    suffix: "封"
  },
  {
    title: "今日新增用户",
    value: stats.value.todayUserCount,
    icon: "ep:plus",
    color: "#409EFF",
    bgColor: "rgba(64, 158, 255, 0.1)",
    suffix: "人"
  },
  {
    title: "今日新增记忆",
    value: stats.value.todayMemoryCount,
    icon: "ep:edit",
    color: "#67C23A",
    bgColor: "rgba(103, 194, 58, 0.1)",
    suffix: "条"
  },
  {
    title: "活跃用户(7天)",
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
        <el-card v-loading="loading" shadow="hover" class="stat-card">
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
            v-use-echart="{
              setOptions: setTrendOptions,
              getInstance: getTrendInstance
            }"
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
            v-use-echart="{
              setOptions: setTypeOptions,
              getInstance: getTypeInstance
            }"
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
  gap: 16px;
  align-items: center;
}

.stat-icon {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 12px;
}

.stat-info {
  flex: 1;
  min-width: 0;
}

.stat-title {
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 14px;
  color: #909399;
  white-space: nowrap;
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
  line-height: 1.2;
}

.stat-suffix {
  margin-left: 4px;
  font-size: 14px;
  font-weight: normal;
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
