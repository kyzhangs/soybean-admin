<script setup lang="ts">
import { nextTick } from 'vue';
import { enableStatusOptions } from '@/constants/business';
import { useNaiveForm } from '@/hooks/common/form';
import { translateOptions } from '@/utils/common';
import { $t } from '@/locales';

defineOptions({
  name: 'ButtonSearch'
});

interface Emits {
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();

const model = defineModel<Api.SystemManage.ApiSearchParams>('model', { required: true });

function resetModel() {
  Object.assign(model.value, {
    page: 1,
    page_size: 10,
    keyword: null,
    status: null
  });
}

async function search() {
  await nextTick();
  emit('search');
}

const { formRef, restoreValidation } = useNaiveForm();

async function reset() {
  await restoreValidation();
  resetModel();
  await search();
}
</script>

<template>
  <NCard :bordered="false" size="small" class="card-wrapper">
    <NCollapse class="w-full" :default-expanded-names="['role-search']">
      <NCollapseItem :title="$t('common.search')" name="role-search">
        <NForm ref="formRef" :model="model" label-placement="left" :label-width="80">
          <NGrid responsive="screen" item-responsive>
            <NFormItemGi span="24 s:18 m:18 l:19 xl:20" :show-feedback="false">
              <NGrid responsive="screen" item-responsive>
                <NFormItemGi span="24 s:12 m:8 l:8 xl:5" :label="$t('common.keyword')" path="keyword" class="pr-24px">
                  <NInput
                    v-model:value="model.keyword"
                    :placeholder="$t('page.system-manage.buttons.form.keyword')"
                    clearable
                    @keyup.enter="search"
                    @clear="search"
                  />
                </NFormItemGi>

                <NFormItemGi
                  span="24 s:8 m:8 l:8 xl:4"
                  :label="$t('page.system-manage.buttons.status')"
                  path="status"
                  class="pr-24px"
                >
                  <NSelect
                    v-model:value="model.status"
                    :placeholder="$t('page.system-manage.buttons.form.status')"
                    :options="translateOptions(enableStatusOptions)"
                    clearable
                    @update:value="search"
                  />
                </NFormItemGi>
              </NGrid>
            </NFormItemGi>

            <NFormItemGi span="24 s:6 m:6 l:5 xl:4">
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
