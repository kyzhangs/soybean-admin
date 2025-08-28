<script setup lang="ts">
  import { nextTick } from 'vue';
  import { enableStatusOptions } from '@/constants/business';
  import { useNaiveForm } from '@/hooks/common/form';
  import { translateOptions } from '@/utils/common';
  import { $t } from '@/locales';

  defineOptions({
    name: 'RoleSearch'
  });

  interface Emits {
    (e: 'search'): void;
  }

  const emit = defineEmits<Emits>();

  const { formRef, restoreValidation } = useNaiveForm();

  const model = defineModel<Api.SystemManage.RoleSearchParams>('model', { required: true });

  function resetModel() {
    Object.assign(model.value, {
      page: 1,
      page_size: 10,
      keyword: null,
      code: null,
      status: null
    });
  }

  async function reset() {
    await restoreValidation();
    resetModel();
    await nextTick();
    emit('search');
  }

  async function search() {
    await nextTick();
    emit('search');
  }
</script>

<template>
  <NCard :bordered="false" size="small" class="card-wrapper">
    <NCollapse class="w-full" :default-expanded-names="['role-search']">
      <NCollapseItem :title="$t('common.search')" name="role-search">
        <NForm ref="formRef" :model="model" label-placement="left" :label-width="80">
          <NGrid responsive="screen" item-responsive>
            <NFormItemGi span="24 s:12 m:6" :label="$t('page.manage.role.keyword')" path="keyword" class="pr-24px">
              <NInput
                v-model:value="model.keyword"
                :placeholder="$t('page.manage.role.form.keyword')"
                clearable
                @clear="search"
                @keyup.enter="search"
              />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" :label="$t('page.manage.role.code')" path="code" class="pr-24px">
              <NInput
                v-model:value="model.code"
                :placeholder="$t('page.manage.role.form.code')"
                clearable
                @clear="search"
                @keyup.enter="search"
              />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" :label="$t('page.manage.role.status')" path="status" class="pr-24px">
              <NSelect
                v-model:value="model.status"
                :placeholder="$t('page.manage.role.form.status')"
                :options="translateOptions(enableStatusOptions)"
                clearable
                @clear="search"
                @update:value="search"
              />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6">
              <NSpace class="w-full" justify="end">
                <NButton type="default" @click="reset">
                  <template #icon>
                    <icon-ic-round-refresh class="text-icon" />
                  </template>
                  {{ $t('common.reset') }}
                </NButton>
                <NButton type="primary" ghost @click="search">
                  <template #icon>
                    <icon-ic-round-search class="text-icon" />
                  </template>
                  {{ $t('common.search') }}
                </NButton>
              </NSpace>
            </NFormItemGi>
          </NGrid>
        </NForm>
      </NCollapseItem>
    </NCollapse>
  </NCard>
</template>

<style scoped></style>
