<script setup lang="ts">
defineOptions({ name: 'PermissionHeader' });

interface Props {
  selectedRole: Api.SystemManage.Role | null;
  menuCount: number;
  buttonCount: number;
  apiCount: number;
  loading: boolean;
}

defineProps<Props>();

interface Emits {
  (e: 'save'): void;
}

const emit = defineEmits<Emits>();
</script>

<template>
  <NCard :bordered="false" class="shadow-sm" content-style="padding: 12px 20px;">
    <div class="flex-y-center justify-between">
      <div class="flex-y-center gap-16px">
        <template v-if="selectedRole">
          <div class="h-40px w-40px flex-center rounded-full bg-primary/10 text-primary">
            <icon-majesticons-shield-check-line class="text-24px" />
          </div>
          <div>
            <div class="text-16px font-bold">{{ selectedRole.name }}</div>
            <div class="text-12px text-gray-400">设置角色的菜单、按钮和接口访问权限</div>
          </div>
          <div class="mx-8px h-24px w-1px bg-gray-200 dark:bg-gray-700"></div>
          <div class="flex gap-16px">
            <div class="flex-y-center gap-4px">
              <span class="text-12px text-gray-400">菜单:</span>
              <span class="text-primary font-bold">{{ menuCount }}</span>
            </div>
            <div class="flex-y-center gap-4px">
              <span class="text-12px text-gray-400">按钮:</span>
              <span class="text-primary font-bold">{{ buttonCount }}</span>
            </div>
            <div class="flex-y-center gap-4px">
              <span class="text-12px text-gray-400">接口:</span>
              <span class="text-primary font-bold">{{ apiCount }}</span>
            </div>
          </div>
        </template>
        <div v-else class="text-gray-400">未指定有效角色</div>
      </div>
      <NButton type="primary" :disabled="!selectedRole" :loading="loading" class="px-24px" @click="emit('save')">
        <template #icon>
          <icon-material-symbols-save-outline />
        </template>
        保存权限
      </NButton>
    </div>
  </NCard>
</template>
