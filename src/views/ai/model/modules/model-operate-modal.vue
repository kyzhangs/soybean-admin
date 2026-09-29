<script setup lang="tsx">
import { computed, nextTick, reactive, ref, watch } from 'vue';
import { fetchCreateModel, fetchDiscoverModels, fetchUpdateModel } from '@/service/api';
import { useNaiveForm } from '@/hooks/common/form';
import SvgIcon from '@/components/custom/svg-icon.vue';
import { $t } from '@/locales';

defineOptions({ name: 'AiModelOperateModal' });

interface Props {
  operateType: NaiveUI.TableOperateType;
  rowData: Api.AI.Model | null;
  channels: Api.AI.ModelChannel[];
}

interface Emits {
  (e: 'submitted'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const visible = defineModel<boolean>('visible', { default: false });
const submitting = defineModel<boolean>('submitting', { default: false });
const { formRef, validate, restoreValidation } = useNaiveForm();
const initializing = ref(false);
const discovering = ref(false);
const discoveredModels = ref<Api.AI.ModelDiscovery[]>([]);
const modelNameInput = ref<{ focus: () => void } | null>(null);
const isEdit = computed(() => props.operateType === 'edit');
const title = computed(() => (isEdit.value ? '编辑模型' : '添加模型'));
const form = reactive<Api.AI.ModelCreateParams>(createDefaultForm());
const channelOptions = computed(() =>
  props.channels.map(item => ({ label: item.name, value: item.id, icon: item.icon, channelName: item.channel_name }))
);
const discoveredModelOptions = computed(() =>
  discoveredModels.value.map(item => ({
    label: item.model_name,
    value: item.model_name
  }))
);
const inputModalityOptions = [
  { label: '文本', value: 'text' },
  { label: '图像', value: 'image' },
  { label: '音频', value: 'audio' },
  { label: '视频', value: 'video' }
];

function createDefaultForm(): Api.AI.ModelCreateParams {
  return {
    channel_id: '',
    model_name: '',
    display_name: null,
    context_window: 128000,
    max_tokens: 8192,
    input_modalities: ['text'],
    reasoning: false
  };
}

function applyDiscoveredModel(modelName: string | null) {
  const discovered = discoveredModels.value.find(item => item.model_name === modelName);
  if (!discovered) return;
  Object.assign(form, {
    model_name: discovered.model_name,
    display_name: discovered.display_name,
    context_window: discovered.context_window,
    max_tokens: discovered.max_tokens,
    input_modalities: [...discovered.input_modalities],
    reasoning: discovered.reasoning
  });
}

function shouldShowModelOptions() {
  return discoveredModels.value.length > 0;
}

async function discoverModels() {
  if (!form.channel_id) {
    window.$message?.warning('请先选择渠道');
    return;
  }
  const channelId = form.channel_id;
  discovering.value = true;
  try {
    const { data, error } = await fetchDiscoverModels(channelId);
    if (!error && data && form.channel_id === channelId) {
      discoveredModels.value = data;
      await nextTick();
      modelNameInput.value?.focus();
      window.$message?.success(`已获取 ${data.length} 个模型`);
    }
  } finally {
    discovering.value = false;
  }
}

function renderChannel(option: { icon?: string; label?: string; channelName?: string }) {
  return (
    <div class="flex min-h-32px items-center gap-8px">
      <span class="flex h-24px w-24px shrink-0 items-center justify-center">
        {option.icon ? <SvgIcon icon={option.icon} class="text-18px" /> : null}
      </span>
      <span class="truncate">{option.label || option.channelName}</span>
    </div>
  );
}

async function initForm() {
  initializing.value = true;
  Object.assign(form, createDefaultForm());
  discoveredModels.value = [];
  if (isEdit.value && props.rowData) {
    Object.assign(form, {
      channel_id: props.rowData.channel_id,
      model_name: props.rowData.model_name,
      display_name: props.rowData.display_name,
      context_window: props.rowData.context_window,
      max_tokens: props.rowData.max_tokens,
      input_modalities: props.rowData.input_modalities,
      reasoning: props.rowData.reasoning
    });
  } else {
    form.channel_id = props.channels[0]?.id || '';
  }
  await nextTick();
  initializing.value = false;
  restoreValidation();
}

function close() {
  visible.value = false;
}

async function submit() {
  if (!formRef.value) return;
  if (!form.channel_id || !form.model_name.trim()) {
    window.$message?.warning('请选择渠道并填写模型 ID');
    return;
  }
  await validate();
  submitting.value = true;
  try {
    const payload: Api.AI.ModelCreateParams = {
      ...form,
      model_name: form.model_name.trim(),
      display_name: form.display_name?.trim() || null
    };
    const { error } =
      isEdit.value && props.rowData ? await fetchUpdateModel(props.rowData.id, payload) : await fetchCreateModel(payload);
    if (!error) {
      window.$message?.success(isEdit.value ? '模型已更新' : '模型已添加');
      close();
      emit('submitted');
    }
  } finally {
    submitting.value = false;
  }
}

watch(visible, value => {
  if (value) void initForm();
});
watch(
  () => form.channel_id,
  () => {
    discoveredModels.value = [];
  }
);
watch(
  () => props.rowData,
  () => {
    if (visible.value) void initForm();
  }
);
</script>

<template>
  <NModal v-model:show="visible" preset="card" :title="title" :mask-closable="false" class="min-w-750px w-820px">
    <NForm ref="formRef" :model="form" label-placement="top" class="pt-5px">
      <NGrid responsive="screen" item-responsive>
        <NFormItemGi span="12" label="渠道" path="channel_id" class="pr-24px">
          <NSelect
            v-model:value="form.channel_id"
            :options="channelOptions"
            :render-label="renderChannel"
            placeholder="请选择已配置的渠道"
          />
        </NFormItemGi>
        <NFormItemGi span="12" label="模型 ID" path="model_name">
          <div class="w-full flex gap-8px">
            <NAutoComplete
              ref="modelNameInput"
              v-model:value="form.model_name"
              :options="discoveredModelOptions"
              :get-show="shouldShowModelOptions"
              class="min-w-0 flex-1"
              placeholder="例如：gpt-4o-mini"
              clearable
              @select="applyDiscoveredModel"
            />
            <NButton secondary :loading="discovering" @click="discoverModels">获取模型</NButton>
          </div>
        </NFormItemGi>
        <NFormItemGi span="12" label="显示名称" class="pr-24px">
          <NInput v-model:value="form.display_name" placeholder="可选" clearable />
        </NFormItemGi>
        <NFormItemGi span="12" label="输入类型">
          <NSelect
            v-model:value="form.input_modalities"
            :options="inputModalityOptions"
            multiple
            :consistent-menu-width="false"
            class="w-full min-w-120px"
          />
        </NFormItemGi>
        <NFormItemGi span="12" label="Context Window" class="pr-24px">
          <NInputNumber v-model:value="form.context_window" class="w-full" :min="1" />
        </NFormItemGi>
        <NFormItemGi span="12" label="Max Tokens">
          <NInputNumber v-model:value="form.max_tokens" class="w-full" :min="1" />
        </NFormItemGi>
        <NFormItemGi span="12" label="推理能力" class="pr-24px">
          <NSwitch v-model:value="form.reasoning" />
        </NFormItemGi>
      </NGrid>
    </NForm>
    <template #footer>
      <NSpace justify="end" :size="16">
        <NButton @click="close">{{ $t('common.cancel') }}</NButton>
        <NButton type="primary" :loading="submitting" @click="submit">{{ $t('common.confirm') }}</NButton>
      </NSpace>
    </template>
  </NModal>
</template>
