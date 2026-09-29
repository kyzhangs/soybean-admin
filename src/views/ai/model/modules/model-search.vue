<script setup lang="ts">
import { nextTick, toRaw } from 'vue';
import { jsonClone } from '@sa/utils';
import { $t } from '@/locales';

defineOptions({ name: 'AiModelSearch' });

interface Emits {
  (e: 'search'): void;
}

interface Props {
  channels: Api.AI.ModelChannel[];
}

defineProps<Props>();
const emit = defineEmits<Emits>();
const model = defineModel<Api.AI.ModelSearchParams>('model', { required: true });
const defaultModel = jsonClone(toRaw(model.value));

function resetModel() {
  Object.assign(model.value, defaultModel);
}

async function search() {
  await nextTick();
  emit('search');
}

async function reset() {
  resetModel();
  await search();
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
                <NFormItemGi span="24 s:12 m:8 l:8 xl:8" label="模型名称" path="keyword" class="pr-24px">
                  <NInput
                    v-model:value="model.keyword"
                    placeholder="请输入模型名称"
                    clearable
                    @clear="search"
                    @keyup.enter="search"
                  />
                </NFormItemGi>
                <NFormItemGi span="24 s:12 m:8 l:8 xl:8" label="模型渠道" path="channel_id" class="pr-24px">
                  <NSelect
                    v-model:value="model.channel_id"
                    :options="channels.map(item => ({ label: item.name, value: item.id }))"
                    clearable
                    placeholder="请选择渠道"
                    @update:value="search"
                  />
                </NFormItemGi>
                <NFormItemGi span="24 s:12 m:8 l:8 xl:8" label="协议类型" path="type" class="pr-24px">
                  <NSelect
                    v-model:value="model.type"
                    :options="[
                      { label: 'OpenAI Completions', value: 'openai-completions' },
                      { label: 'OpenAI Responses', value: 'openai-responses' },
                      { label: 'Anthropic Messages', value: 'anthropic-messages' },
                      { label: 'Gemini Generate Content', value: 'gemini-generate-content' }
                    ]"
                    clearable
                    placeholder="请选择协议类型"
                    @update:value="search"
                  />
                </NFormItemGi>
              </NGrid>
            </NFormItemGi>
            <NFormItemGi span="24 s:6 m:4 l:6 xl:4">
              <NSpace class="w-full" justify="end">
                <NButton type="default" @click="reset">
                  <template #icon><icon-ic-round-refresh class="text-icon" /></template>
                  {{ $t('common.reset') }}
                </NButton>
                <NButton type="primary" ghost @click="search">
                  <template #icon><icon-ic-round-search class="text-icon" /></template>
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
