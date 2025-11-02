<script setup lang="ts">
  import { computed, shallowRef, watch } from 'vue';
  import { fetchGetFirstLevelMenus, fetchGetMenuTree } from '@/service/api';
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

  const title = computed(() => $t('common.edit') + $t('page.manage.role.button.menuAuth'));

  // const home = shallowRef('');

  // async function getHome() {
  //   // eslint-disable-next-line no-console
  //   console.log(props.roleId);

  //   home.value = 'home';
  // }

  // async function updateHome(val: string) {
  //   // request

  //   home.value = val;
  // }

  const firstLevelMenus = shallowRef<string[]>([]);

  async function getFirstLevelMenus() {
    const { error, data } = await fetchGetFirstLevelMenus();

    if (!error) {
      firstLevelMenus.value = data;
    }
  }

  // const pageSelectOptions = computed(() => {
  //   const opts: CommonType.Option[] = firstLevelMenus.value.map(menu => ({
  //     label: menu.label,
  //     value: menu.value
  //   }));
  //   return opts;
  // });

  const tree = shallowRef<Api.SystemManage.MenuTree[]>([]);

  async function getTree() {
    const { error, data } = await fetchGetMenuTree();

    if (!error) {
      tree.value = data;
    }
  }

  const checks = shallowRef<number[]>([]);

  async function getChecks() {
    // eslint-disable-next-line no-console
    console.log(props.roleId);
    // request
    checks.value = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
  }

  function handleSubmit() {
    // eslint-disable-next-line no-console
    console.log(checks.value, props.roleId);
    // request

    window.$message?.success?.($t('common.modifySuccess'));

    closeModal();
  }

  function init() {
    // getHome();
    getFirstLevelMenus();
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
  <NModal v-model:show="visible" :title="title" preset="card" class="w-480px">
    <!--
 <div class="flex-y-center gap-16px pb-12px">
      <div>{{ $t('page.manage.menu.home') }}</div>
      <NSelect :value="home" :options="pageSelectOptions" size="small" class="w-160px" @update:value="updateHome" />
    </div> 
-->
    <NTree
      v-model:checked-keys="checks"
      :data="tree"
      key-field="id"
      checkable
      expand-on-click
      virtual-scroll
      block-line
      class="h-280px"
    />
    <template #footer>
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
