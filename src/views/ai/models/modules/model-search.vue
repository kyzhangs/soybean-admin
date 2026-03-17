<script setup lang="ts">
import { nextTick, ref, toRaw } from 'vue';
import { jsonClone } from '@sa/utils';
import { enableStatusOptions } from '@/constants/business';
import { translateOptions } from '@/utils/common';
import { $t } from '@/locales';
import { fetchGetLLMProviderOptions } from '@/service/api';

defineOptions({
  name: 'LLMModelSearch'
});

interface Emits {
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();

const model = defineModel<Api.AI.LLMModelSearchParams>('model', { required: true });

const defaultModel = jsonClone(toRaw(model.value));

function resetModel() {
  Object.assign(model.value, defaultModel);
}

async function reset() {
  resetModel();
  await search();
}

async function search() {
  await nextTick();
  emit('search');
}

const providerOptions = ref<CommonType.Option[]>([]);

async function getProviderOptions() {
  const { error, data } = await fetchGetLLMProviderOptions();
  if (!error) {
    providerOptions.value = data;
  }
}
</script>

<template>
  <NCard :bordered="false" size="small" class="w-full card-wrapper">
    <NCollapse class="w-full" :default-expanded-names="['model-search']">
      <NCollapseItem :title="$t('common.search')" name="model-search">
        <NForm :model="model" label-placement="left" label-align="right" label-width="auto">
          <NGrid responsive="screen" item-responsive>
            <NFormItemGi span="24 s:18 m:20 l:18 xl:20" :show-feedback="false">
              <NGrid responsive="screen" item-responsive>
                <NFormItemGi span="24 s:12 m:8 l:8 xl:5" :label="$t('common.keyword')" path="keyword" class="pr-24px">
                  <NInput
                    v-model:value="model.keyword"
                    :placeholder="$t('page.ai.models.form.keyword')"
                    clearable
                    @clear="search"
                    @keyup.enter="search"
                  />
                </NFormItemGi>

                <NFormItemGi span="0 s:12 m:8 l:8 xl:5" label="厂商" path="provider_id" class="pr-24px">
                  <NSelect
                    v-model:value="model.provider_id"
                    :placeholder="$t('page.ai.models.form.provider')"
                    :options="providerOptions"
                    clearable
                    @focus="getProviderOptions"
                    @clear="search"
                    @update:value="search"
                  />
                </NFormItemGi>

                <NFormItemGi span="24 s:8 m:8 l:8 xl:5" label="模型状态" path="is_forbid" class="pr-24px">
                  <NSelect
                    v-model:value="model.status"
                    :placeholder="$t('page.ai.models.form.status')"
                    :options="translateOptions(enableStatusOptions)"
                    clearable
                    @clear="search"
                    @update:value="search"
                  />
                </NFormItemGi>
              </NGrid>
            </NFormItemGi>

            <NFormItemGi span="24 s:6 m:4 l:6 xl:4">
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
