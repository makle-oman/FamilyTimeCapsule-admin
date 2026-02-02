<script setup lang="ts">
defineOptions({
  name: "Welcome"
});
</script>

<template>
  <div class="welcome-container">
    <div class="welcome-content">
      <div class="logo-section">
        <div class="logo-icon">🏠</div>
        <h1 class="title">家的时光</h1>
        <p class="subtitle">管理后台</p>
      </div>

      <div class="feature-section">
        <div class="feature-card">
          <div
            class="feature-icon"
            style="color: #409eff; background: rgb(64 158 255 / 10%)"
          >
            📊
          </div>
          <h3>数据看板</h3>
          <p>实时监控平台数据，掌握用户和内容动态</p>
        </div>
        <div class="feature-card">
          <div
            class="feature-icon"
            style="color: #67c23a; background: rgb(103 194 58 / 10%)"
          >
            👥
          </div>
          <h3>用户管理</h3>
          <p>管理用户账号，查看家庭信息</p>
        </div>
        <div class="feature-card">
          <div
            class="feature-icon"
            style="color: #e6a23c; background: rgb(230 162 60 / 10%)"
          >
            📝
          </div>
          <h3>内容管理</h3>
          <p>管理记忆、照片、信件等内容</p>
        </div>
      </div>

      <div class="info-section">
        <p>请从左侧菜单选择功能模块</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.welcome-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 120px);
  padding: 40px;
}

.welcome-content {
  max-width: 800px;
  text-align: center;
}

.logo-section {
  margin-bottom: 48px;
}

.logo-icon {
  margin-bottom: 16px;
  font-size: 64px;
}

.title {
  margin: 0 0 8px;
  font-size: 36px;
  font-weight: 600;
  color: #303133;
}

.subtitle {
  margin: 0;
  font-size: 18px;
  color: #909399;
}

.feature-section {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  justify-content: center;
  margin-bottom: 48px;
}

.feature-card {
  flex: 1;
  min-width: 200px;
  max-width: 240px;
  padding: 24px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgb(0 0 0 / 8%);
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 8px 24px rgb(0 0 0 / 12%);
    transform: translateY(-4px);
  }

  h3 {
    margin: 12px 0 8px;
    font-size: 16px;
    font-weight: 500;
    color: #303133;
  }

  p {
    margin: 0;
    font-size: 14px;
    line-height: 1.5;
    color: #909399;
  }
}

.feature-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  margin: 0 auto;
  font-size: 24px;
  border-radius: 12px;
}

.info-section {
  p {
    font-size: 14px;
    color: #c0c4cc;
  }
}
</style>
