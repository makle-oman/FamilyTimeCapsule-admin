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
    if (statsRes.code === 200 && statsRes.data) {
      stats.value = statsRes.data;
    }

    // 获取趋势数据
    const trendRes = await getDashboardTrends();
    if (trendRes.code === 200 && trendRes.data) {
      const trendData = trendRes.data;
      const dates = trendData.map((d: any) => d.date.slice(5));
      const memories = trendData.map((d: any) => d.memories);
      const users = trendData.map((d: any) => d.users);

      // 设置趋势图 - 面积图样式
      setTrendOptions({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: { backgroundColor: "#6a7985" }
          }
        },
        legend: {
          data: ["新增用户", "新增记忆"],
          top: 10,
          textStyle: { color: "#606266" }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          top: "60px",
          containLabel: true
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: dates,
          axisLine: { lineStyle: { color: "#E4E7ED" } },
          axisLabel: { color: "#909399" }
        },
        yAxis: {
          type: "value",
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { lineStyle: { color: "#E4E7ED", type: "dashed" } },
          axisLabel: { color: "#909399" }
        },
        series: [
          {
            name: "新增用户",
            type: "line",
            smooth: true,
            symbol: "circle",
            symbolSize: 8,
            showSymbol: false,
            areaStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: "rgba(64, 158, 255, 0.3)" },
                  { offset: 1, color: "rgba(64, 158, 255, 0.05)" }
                ]
              }
            },
            lineStyle: { width: 3, color: "#409EFF" },
            itemStyle: { color: "#409EFF" },
            data: users
          },
          {
            name: "新增记忆",
            type: "line",
            smooth: true,
            symbol: "circle",
            symbolSize: 8,
            showSymbol: false,
            areaStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: "rgba(103, 194, 58, 0.3)" },
                  { offset: 1, color: "rgba(103, 194, 58, 0.05)" }
                ]
              }
            },
            lineStyle: { width: 3, color: "#67C23A" },
            itemStyle: { color: "#67C23A" },
            data: memories
          }
        ]
      } as EChartsOption);
    }

    // 设置内容分布图 - 环形图样式
    setTypeOptions({
      tooltip: {
        trigger: "item",
        formatter: "{b}: {c} ({d}%)"
      },
      legend: {
        orient: "horizontal",
        bottom: 10,
        textStyle: { color: "#606266" }
      },
      series: [
        {
          name: "内容类型",
          type: "pie",
          radius: ["45%", "70%"],
          center: ["50%", "45%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 8,
            borderColor: "#fff",
            borderWidth: 3
          },
          label: {
            show: true,
            position: "center",
            formatter: () => {
              const total =
                stats.value.memoryCount +
                stats.value.photoCount +
                stats.value.letterCount;
              return `{total|${total}}\n{label|总内容}`;
            },
            rich: {
              total: {
                fontSize: 28,
                fontWeight: "bold",
                color: "#303133"
              },
              label: {
                fontSize: 14,
                color: "#909399",
                padding: [5, 0, 0, 0]
              }
            }
          },
          labelLine: { show: false },
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

// 主要统计卡片
const mainStats = computed(() => [
  {
    title: "用户总数",
    value: stats.value.userCount,
    subTitle: "总用户",
    subValue: stats.value.userCount,
    icon: "ep:user",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  },
  {
    title: "家庭数量",
    value: stats.value.familyCount,
    subTitle: "总家庭",
    subValue: stats.value.familyCount,
    icon: "ep:house",
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
  },
  {
    title: "记忆总数",
    value: stats.value.memoryCount,
    subTitle: "总记忆",
    subValue: stats.value.memoryCount,
    icon: "ep:document",
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
  },
  {
    title: "照片数量",
    value: stats.value.photoCount,
    subTitle: "总照片",
    subValue: stats.value.photoCount,
    icon: "ep:picture",
    gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
  }
]);

// 次要统计
const secondaryStats = computed(() => [
  {
    label: "今日新增用户",
    value: stats.value.todayUserCount,
    icon: "ep:user-filled",
    color: "#409EFF"
  },
  {
    label: "今日新增记忆",
    value: stats.value.todayMemoryCount,
    icon: "ep:edit-pen",
    color: "#67C23A"
  },
  {
    label: "活跃用户(7天)",
    value: stats.value.activeUsers,
    icon: "ep:check",
    color: "#E6A23C"
  },
  {
    label: "信件总数",
    value: stats.value.letterCount,
    icon: "ep:message",
    color: "#F56C6C"
  }
]);
</script>

<template>
  <div class="dashboard-container">
    <!-- 主要统计卡片 -->
    <el-row :gutter="20" class="main-stats">
      <el-col
        v-for="(item, index) in mainStats"
        :key="index"
        :xs="12"
        :sm="12"
        :md="6"
        :lg="6"
      >
        <div
          v-loading="loading"
          class="stat-card"
          :style="{ background: item.gradient }"
        >
          <div class="stat-card-inner">
            <div class="stat-content">
              <div class="stat-title">{{ item.title }}</div>
              <div class="stat-value">{{ item.value.toLocaleString() }}</div>
              <div class="stat-sub">
                <span>{{ item.subTitle }}</span>
                <span class="sub-value">{{
                  item.subValue.toLocaleString()
                }}</span>
              </div>
            </div>
            <div class="stat-icon-wrapper">
              <IconifyIconOnline :icon="item.icon" width="48" />
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="chart-section">
      <el-col :xs="24" :sm="24" :md="16" :lg="16">
        <div class="chart-card">
          <div class="chart-header">
            <div class="chart-title">
              <span class="title-text">流量趋势</span>
              <span class="title-sub">近7天数据</span>
            </div>
          </div>
          <div
            ref="trendRef"
            v-use-echart="{
              setOptions: setTrendOptions,
              getInstance: getTrendInstance
            }"
            class="trend-chart"
          />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="8" :lg="8">
        <div class="chart-card">
          <div class="chart-header">
            <div class="chart-title">
              <span class="title-text">内容分布</span>
              <span class="title-sub">按类型统计</span>
            </div>
          </div>
          <div
            ref="typeRef"
            v-use-echart="{
              setOptions: setTypeOptions,
              getInstance: getTypeInstance
            }"
            class="type-chart"
          />
        </div>
      </el-col>
    </el-row>

    <!-- 次要统计 -->
    <el-row :gutter="20" class="secondary-stats">
      <el-col
        v-for="(item, index) in secondaryStats"
        :key="index"
        :xs="12"
        :sm="12"
        :md="6"
        :lg="6"
      >
        <div v-loading="loading" class="secondary-card">
          <div class="secondary-icon" :style="{ color: item.color }">
            <IconifyIconOnline :icon="item.icon" width="24" />
          </div>
          <div class="secondary-info">
            <div class="secondary-value" :style="{ color: item.color }">
              {{ item.value }}
            </div>
            <div class="secondary-label">{{ item.label }}</div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.dashboard-container {
  min-height: calc(100vh - 120px);
  padding: 20px;
  background: #f5f7fa;
}

// 主要统计卡片
.main-stats {
  margin-bottom: 20px;
}

.stat-card {
  padding: 24px;
  margin-bottom: 20px;
  color: #fff;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgb(0 0 0 / 15%);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 15px 40px rgb(0 0 0 / 20%);
    transform: translateY(-5px);
  }
}

.stat-card-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.stat-content {
  flex: 1;
}

.stat-title {
  margin-bottom: 8px;
  font-size: 14px;
  opacity: 0.9;
}

.stat-value {
  margin-bottom: 12px;
  font-size: 36px;
  font-weight: 700;
  line-height: 1.2;
}

.stat-sub {
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 12px;
  opacity: 0.8;

  .sub-value {
    padding: 2px 8px;
    background: rgb(255 255 255 / 20%);
    border-radius: 10px;
  }
}

.stat-icon-wrapper {
  opacity: 0.3;
}

// 图表卡片
.chart-section {
  margin-bottom: 20px;
}

.chart-card {
  padding: 24px;
  margin-bottom: 20px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgb(0 0 0 / 8%);
}

.chart-header {
  margin-bottom: 20px;
}

.chart-title {
  display: flex;
  gap: 12px;
  align-items: baseline;

  .title-text {
    font-size: 18px;
    font-weight: 600;
    color: #303133;
  }

  .title-sub {
    font-size: 13px;
    color: #909399;
  }
}

.trend-chart {
  height: 320px;
}

.type-chart {
  height: 320px;
}

[v-use-echart] {
  width: 100%;
}

// 次要统计卡片
.secondary-stats {
  margin-bottom: 20px;
}

.secondary-card {
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 20px 24px;
  margin-bottom: 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgb(0 0 0 / 6%);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 24px rgb(0 0 0 / 10%);
  }
}

.secondary-icon {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: currentcolor;
  border-radius: 12px;
  opacity: 0.15;

  :deep(svg) {
    position: absolute;
    opacity: 1;
  }
}

.secondary-info {
  flex: 1;
}

.secondary-value {
  font-size: 24px;
  font-weight: 700;
  line-height: 1.2;
}

.secondary-label {
  margin-top: 4px;
  font-size: 13px;
  color: #909399;
}
</style>
