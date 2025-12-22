<script setup lang="tsx">
import { computed, h, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { NButton, NCard, NInput } from 'naive-ui';
import { useLoading } from '@sa/hooks';
import { fetchGetRolePermissions, fetchUpdateRolePermissions } from '@/service/api';
import { useTabStore } from '@/store/modules/tab';
import { useRouterPush } from '@/hooks/common/router';
import PermissionHeader from './modules/permission-header.vue';
import MenuPermissions from './modules/menu-permissions.vue';
import ButtonPermissions from './modules/button-permissions.vue';
import ApiPermissions from './modules/api-permissions.vue';

defineOptions({ name: 'RolePermissions' });

const route = useRoute();
const { routerPushByKey } = useRouterPush();
const { loading, startLoading, endLoading } = useLoading();
const tabStore = useTabStore();
// 角色
const RoleCode = computed<string>(() => route.query.code as string);

// 权限选中状态
const role = ref<Api.SystemManage.Role | null>(null);
const menuCheckedKeys = ref<string[]>([]);
const buttonCheckedKeys = ref<string[]>([]);
const apiCheckedKeys = ref<number[]>([]);

// 添加倒计时相关状态
const countdown = ref<number>(0);
let countdownTimer: NodeJS.Timeout | null = null;

// 确认对话框输入框的值
const confirmInput = ref<string>('');

// 获取角色权限
async function getRolePermissions() {
  if (!RoleCode.value) return;
  startLoading();
  const { error, data } = await fetchGetRolePermissions({ code: RoleCode.value });
  if (!error) {
    role.value = data.role;
    menuCheckedKeys.value = data.menus;
    buttonCheckedKeys.value = data.buttons;
    apiCheckedKeys.value = data.apis;
  }
  endLoading();
}

// 执行保存权限的实际操作
async function doSavePermissions() {
  const data: Api.SystemManage.RolePermissionsUpdateParams = {
    code: RoleCode.value,
    menus: menuCheckedKeys.value,
    buttons: buttonCheckedKeys.value,
    apis: apiCheckedKeys.value
  };

  startLoading();
  const { error, data: result } = await fetchUpdateRolePermissions(data);
  if (!error) {
    window.$message?.success('权限保存成功');
    role.value = result.role;
    menuCheckedKeys.value = result.menus;
    buttonCheckedKeys.value = result.buttons;
    apiCheckedKeys.value = result.apis;
  }
  endLoading();
}

// 保存权限
async function savePermissions() {
  if (!RoleCode.value) {
    window.$message?.warning('请先选择角色');
    return;
  }

  // 重置确认输入框
  confirmInput.value = '';

  window.$dialog?.warning({
    title: '确认保存权限',
    content: () =>
      h('div', { style: 'padding: 8px 0' }, [
        h(
          'div',
          { style: 'margin-bottom: 12px; color: #666' },
          '您即将保存当前角色的权限配置，此操作将覆盖现有权限设置。'
        ),
        h('div', { style: 'margin-bottom: 8px' }, '请输入"确认"以继续：'),
        h('div', { style: 'display: flex; gap: 8px; align-items: center' }, [
          h(NInput, {
            value: confirmInput.value,
            placeholder: '请输入"确认"',
            style: 'flex: 1',
            onUpdateValue: (value: string) => {
              confirmInput.value = value;
            }
          }),
          h(
            NButton,
            {
              size: 'medium',
              onClick: () => {
                confirmInput.value = '确认';
              }
            },
            '一键填入'
          )
        ])
      ]),
    positiveText: '确认',
    negativeText: '取消',
    positiveButtonProps: { type: 'primary' },
    onPositiveClick: () => {
      if (confirmInput.value !== '确认') {
        window.$message?.error('请输入"确认"以继续操作');
        return false; // 阻止对话框关闭
      }
      doSavePermissions();
      return true;
    }
  });
}

async function goRoleManagementAndCloseTab() {
  await routerPushByKey('system-manage_roles');
  await tabStore.removeTabByRouteName('system-manage_permissions');
}

// 启动倒计时并跳转
function startCountdown() {
  countdown.value = 3;

  // 清除之前的定时器（如果存在）
  if (countdownTimer) {
    clearInterval(countdownTimer);
  }

  countdownTimer = setInterval(() => {
    countdown.value -= 1;

    if (countdown.value <= 0) {
      clearInterval(countdownTimer!);
      countdownTimer = null;
      // 跳转到角色管理页面
      goRoleManagementAndCloseTab();
    }
  }, 1000);
}

// 监听 role 变化，当 role 为 null 时启动倒计时
watch(
  role,
  newRole => {
    if (!newRole) {
      startCountdown();
    } else {
      // 如果有角色，清除倒计时
      if (countdownTimer) {
        clearInterval(countdownTimer);
        countdownTimer = null;
      }
      countdown.value = 0;
    }
  },
  { immediate: true }
);

// 组件卸载时清除定时器
onBeforeUnmount(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer);
  }
});

onMounted(() => {
  getRolePermissions();
});
</script>

<template>
  <div class="h-full flex flex-col gap-16px overflow-hidden p-16px">
    <PermissionHeader
      :loading="loading"
      :selected-role="role"
      :menu-count="menuCheckedKeys.length"
      :button-count="buttonCheckedKeys.length"
      :api-count="apiCheckedKeys.length"
      @save="savePermissions"
    />

    <div v-if="role" class="min-h-0 flex flex-1 gap-16px">
      <MenuPermissions v-model:checked-keys="menuCheckedKeys" :loading="loading" />
      <ButtonPermissions v-model:checked-keys="buttonCheckedKeys" :loading="loading" />
      <ApiPermissions v-model:checked-keys="apiCheckedKeys" :loading="loading" />
    </div>

    <NCard v-else :bordered="false" class="flex-center flex-1 shadow-sm">
      <div class="text-center">
        <icon-custom-role-empty class="text-120px text-gray-200" />
        <div v-if="countdown > 0" class="mt-8px text-14px text-gray-500">{{ countdown }}秒后自动跳转到角色管理页面</div>
        <NButton quaternary type="primary" class="mt-16px" @click="goRoleManagementAndCloseTab">
          立即前往角色管理
        </NButton>
      </div>
    </NCard>
  </div>
</template>

<style scoped></style>
