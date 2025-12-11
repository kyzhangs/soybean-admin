<script setup lang="ts">
import { computed, shallowRef, watch } from 'vue';
import { NDivider } from 'naive-ui';
import { fetchGetMenuTree, fetchGetRoleHomeOptions } from '@/service/api';
import { $t } from '@/locales';

defineOptions({
  name: 'MenuAuthModal'
});

interface Props {
  /** the roleId */
  roleId: number;
}

const props = defineProps<Props>();

const visible = defineModel<boolean>('visible', {
  default: false
});

function closeModal() {
  visible.value = false;
}

const title = computed(() => $t('common.edit') + $t('page.system-manage.roles.menuAuth'));

const home = shallowRef('');

async function getHome() {
  console.log(props.roleId);

  home.value = 'home';
}

async function updateHome(val: string) {
  // request

  home.value = val;
}

const pageSelectOptions = shallowRef<CommonType.Option<string, string>[]>([]);

async function getPages() {
  const { error, data } = await fetchGetRoleHomeOptions();

  if (!error) {
    pageSelectOptions.value = data;
  }
}

const tree = shallowRef<Api.SystemManage.MenuTree[]>([]);

async function getTree() {
  const { error, data } = await fetchGetMenuTree();

  if (!error) {
    tree.value = data;
  }
}

const checks = shallowRef<number[]>([]);

async function getChecks() {
  // request
  checks.value = [1, 2, 3];
}

function handleSubmit() {
  console.log(checks.value);
  // request

  window.$message?.success?.($t('common.modifySuccess'));

  closeModal();
}

function init() {
  getHome();
  getPages();
  getTree();
  getChecks();
}

watch(visible, val => {
  if (val) {
    init();
  }
});
</script>

<template>
  <NModal v-model:show="visible" :title="title" preset="dialog" class="min-h-500px min-w-450px">
    <NDivider />
    <div class="flex-y-center gap-16px pb-24px">
      <div>{{ $t('page.system-manage.roles.home') }}</div>
      <NSelect :value="home" :options="pageSelectOptions" size="small" class="w-160px" @update:value="updateHome" />
    </div>
    <NTree
      v-model:checked-keys="checks"
      :data="tree"
      key-field="value"
      checkable
      cascade
      expand-on-click
      virtual-scroll
      block-line
      show-line
      class="h-300px"
    />
    <template #action>
      <NSpace justify="end">
        <NButton size="small" class="mt-16px" @click="closeModal">
          {{ $t('common.cancel') }}
        </NButton>
        <NButton type="primary" size="small" class="mt-16px" @click="handleSubmit">
          {{ $t('common.confirm') }}
        </NButton>
      </NSpace>
    </template>
  </NModal>
</template>

<style scoped></style>
