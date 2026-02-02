<script setup lang="ts">
import Motion from "./utils/motion";
import { useRouter } from "vue-router";
import { message } from "@/utils/message";
import { ref, reactive, toRaw, onMounted } from "vue";
import { debounce } from "@pureadmin/utils";
import { useNav } from "@/layout/hooks/useNav";
import { useEventListener } from "@vueuse/core";
import type { FormInstance } from "element-plus";
import { useLayout } from "@/layout/hooks/useLayout";
import { useUserStoreHook } from "@/store/modules/user";
import { initRouter, getTopMenu } from "@/router/utils";
import { bg, avatar, illustration } from "./utils/static";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { useDataThemeChange } from "@/layout/hooks/useDataThemeChange";
import { getCaptcha } from "@/api/user";

import dayIcon from "@/assets/svg/day.svg?component";
import darkIcon from "@/assets/svg/dark.svg?component";
import Lock from "~icons/ri/lock-fill";
import User from "~icons/ri/user-3-fill";

defineOptions({
  name: "Login"
});

const router = useRouter();
const loading = ref(false);
const disabled = ref(false);
const ruleFormRef = ref<FormInstance>();

const { initStorage } = useLayout();
initStorage();

const { dataTheme, overallStyle, dataThemeChange } = useDataThemeChange();
dataThemeChange(overallStyle.value);
const { title } = useNav();

const ruleForm = reactive({
  username: "",
  password: "",
  captchaCode: ""
});

// 验证码
const captchaId = ref("");
const captchaImg = ref("");
const captchaLoading = ref(false);

const loadCaptcha = async () => {
  captchaLoading.value = true;
  try {
    const res = await getCaptcha();
    if (res.code === 200 && res.data) {
      captchaId.value = res.data.captchaId;
      captchaImg.value = res.data.captchaImg;
    }
  } catch (error) {
    console.error("获取验证码失败:", error);
  } finally {
    captchaLoading.value = false;
  }
};

onMounted(() => {
  loadCaptcha();
});

const onLogin = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(valid => {
    if (valid) {
      if (!captchaId.value || !ruleForm.captchaCode) {
        message("请输入验证码", { type: "warning" });
        return;
      }
      loading.value = true;
      useUserStoreHook()
        .loginByUsername({
          username: ruleForm.username,
          password: ruleForm.password,
          captchaId: captchaId.value,
          captchaCode: ruleForm.captchaCode
        })
        .then(res => {
          if (res.success) {
            // 获取后端路由
            return initRouter().then(() => {
              disabled.value = true;
              router
                .push(getTopMenu(true).path)
                .then(() => {
                  message("登录成功", { type: "success" });
                })
                .finally(() => (disabled.value = false));
            });
          } else {
            message(res.message, { type: "error" });
            loadCaptcha();
          }
        })
        .catch(() => {
          loadCaptcha();
        })
        .finally(() => (loading.value = false));
    }
  });
};

const immediateDebounce: any = debounce(
  formRef => onLogin(formRef),
  1000,
  true
);

useEventListener(document, "keydown", ({ code }) => {
  if (
    ["Enter", "NumpadEnter"].includes(code) &&
    !disabled.value &&
    !loading.value
  )
    immediateDebounce(ruleFormRef.value);
});
</script>

<template>
  <div class="select-none">
    <img :src="bg" class="wave" />
    <div class="flex-c absolute right-5 top-3">
      <!-- 主题 -->
      <el-switch
        v-model="dataTheme"
        inline-prompt
        :active-icon="dayIcon"
        :inactive-icon="darkIcon"
        @change="dataThemeChange"
      />
    </div>
    <div class="login-container">
      <div class="img">
        <component :is="toRaw(illustration)" />
      </div>
      <div class="login-box">
        <div class="login-form">
          <avatar class="avatar" />
          <Motion>
            <h2 class="outline-hidden">{{ title }}</h2>
          </Motion>

          <el-form ref="ruleFormRef" :model="ruleForm" size="large">
            <Motion :delay="100">
              <el-form-item
                :rules="[
                  {
                    required: true,
                    message: '请输入账号',
                    trigger: 'blur'
                  }
                ]"
                prop="username"
              >
                <el-input
                  v-model="ruleForm.username"
                  clearable
                  placeholder="账号"
                  :prefix-icon="useRenderIcon(User)"
                />
              </el-form-item>
            </Motion>

            <Motion :delay="150">
              <el-form-item
                :rules="[
                  {
                    required: true,
                    message: '请输入密码',
                    trigger: 'blur'
                  }
                ]"
                prop="password"
              >
                <el-input
                  v-model="ruleForm.password"
                  clearable
                  show-password
                  placeholder="密码"
                  :prefix-icon="useRenderIcon(Lock)"
                />
              </el-form-item>
            </Motion>

            <Motion :delay="200">
              <el-form-item
                :rules="[
                  {
                    required: true,
                    message: '请输入验证码',
                    trigger: 'blur'
                  }
                ]"
                prop="captchaCode"
              >
                <div class="captcha-row">
                  <el-input
                    v-model="ruleForm.captchaCode"
                    clearable
                    placeholder="验证码"
                    class="captcha-input"
                  />
                  <div
                    class="captcha-img"
                    :class="{ 'captcha-loading': captchaLoading }"
                    @click="loadCaptcha"
                    v-html="captchaImg"
                  />
                </div>
              </el-form-item>
            </Motion>

            <Motion :delay="250">
              <el-button
                class="w-full mt-4!"
                size="default"
                type="primary"
                :loading="loading"
                :disabled="disabled"
                @click="onLogin(ruleFormRef)"
              >
                登录
              </el-button>
            </Motion>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("@/style/login.css");
</style>

<style lang="scss" scoped>
:deep(.el-input-group__append, .el-input-group__prepend) {
  padding: 0;
}

.captcha-row {
  display: flex;
  gap: 12px;
  align-items: center;
  width: 100%;
}

.captcha-input {
  flex: 1;
}

.captcha-img {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 40px;
  overflow: hidden;
  cursor: pointer;
  background: #f0f0f0;
  border-radius: 4px;
  transition: opacity 0.3s;

  &:hover {
    opacity: 0.8;
  }

  &.captcha-loading {
    opacity: 0.5;
  }

  :deep(svg) {
    width: 100%;
    height: 100%;
  }
}
</style>
