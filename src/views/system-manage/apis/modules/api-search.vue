<script setup lang="ts">
  import { nextTick, ref } from 'vue';
  import { apiMethodOptions, enableStatusOptions } from '@/constants/business';
  import { fetchGetApiTagsList } from '@/service/api';
  import { translateOptions } from '@/utils/common';
  import { $t } from '@/locales';

  defineOptions({
    name: 'ApiSearch'
  });

  interface Emits {
    (e: 'search'): void;
  }

  const emit = defineEmits<Emits>();

  const model = defineModel<Api.SystemManage.ApiSearchParams>('model', { required: true });

  function resetModel() {
    model.value = {
      page: 1,
      page_size: 10,
      keyword: null,
      method: null,
      tag: null,
      status: null
    };
  }

  function search() {
    nextTick(() => {
      emit('search');
    });
  }

  const tagOptions = ref();

  async function handleGetTagOptions() {
    const { error, data } = await fetchGetApiTagsList();
    if (!error) {
      tagOptions.value = data;
    }
  }
</script>

<template>
  <NCard :bordered="false" size="small" class="card-wrapper">
    <NCollapse :default-expanded-names="['role-search']">
      <NCollapseItem :title="$t('common.search')" name="role-search">
        <NForm :model="model" label-placement="left" :label-width="80">
          <NGrid responsive="screen" item-responsive>
            <NFormItemGi span="24 s:12 m:6" :label="$t('common.keyword')" path="keyword" class="pr-24px">
              <NInput
                v-model:value="model.keyword"
                :placeholder="$t('page.manage.api.form.keyword')"
                clearable
                @keyup.enter="search"
                @clear="search"
              />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:5" :label="$t('page.manage.api.method')" path="method">
              <NSelect
                v-model:value="model.method"
                :placeholder="$t('page.manage.api.form.method')"
                :options="translateOptions(apiMethodOptions)"
                clearable
                @update:value="search"
              />
            </NFormItemGi>

            <NFormItemGi span="24 s:12 m:5" :label="$t('page.manage.api.tags')" path="tag" class="pr-24px">
              <NCascader
                v-model:value="model.tag"
                :options="tagOptions"
                :placeholder="$t('page.manage.api.form.tags')"
                filterable
                clearable
                @update:value="search"
                @clear="search"
                @click.once="handleGetTagOptions"
              />
            </NFormItemGi>

            <NFormItemGi span="24 s:12 m:5" :label="$t('page.manage.api.status')" path="status" class="pr-24px">
              <NSelect
                v-model:value="model.status"
                :placeholder="$t('page.manage.api.form.status')"
                :options="translateOptions(enableStatusOptions)"
                clearable
                @update:value="search"
              />
            </NFormItemGi>

            <NFormItemGi span="24 s:12 m:3">
              <NSpace class="w-full" justify="end">
                <NButton @click="resetModel">
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
