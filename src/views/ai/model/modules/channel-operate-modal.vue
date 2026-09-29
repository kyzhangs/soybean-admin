<script setup lang="tsx">
import { computed, nextTick, reactive, ref, watch } from 'vue';
import { fetchCreateModelChannel, fetchUpdateModelChannel } from '@/service/api';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import SvgIcon from '@/components/custom/svg-icon.vue';
import { $t } from '@/locales';

defineOptions({ name: 'AiModelChannelOperateModal' });

interface Props {
  operateType: NaiveUI.TableOperateType;
  rowData: Api.AI.ModelChannel | null;
  catalog: Api.AI.ChannelCatalog;
}

interface Emits {
  (e: 'submitted'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const visible = defineModel<boolean>('visible', { default: false });
const submitting = defineModel<boolean>('submitting', { default: false });
const { formRef, validate, restoreValidation } = useNaiveForm();
const { defaultRequiredRule } = useFormRules();
const initializing = ref(false);
const isEdit = computed(() => props.operateType === 'edit');
const title = computed(() => (isEdit.value ? '编辑渠道' : '添加渠道'));
const form = reactive<Api.AI.ModelChannelCreateParams>(createDefaultForm());
const selectedChannel = computed(() => props.catalog.channels.find(item => item.channel_code === form.channel_code));
const channelOptions = computed(() =>
  props.catalog.channels.map(item => ({ label: item.name, value: item.channel_code, icon: item.icon }))
);
const protocolTypeOptions = computed(() =>
  (selectedChannel.value?.protocols || []).map(item => ({ label: item.type, value: item.type }))
);
const chatMessageUrl = computed(() => {
  const baseUrl = form.base_url?.trim().replace(/\/+$/, '');
  return baseUrl ? `${baseUrl}/chat-message` : '';
});
const rules = {
  name: defaultRequiredRule,
  base_url: defaultRequiredRule
} satisfies Record<'name' | 'base_url', App.Global.FormRule>;

function createDefaultForm(): Api.AI.ModelChannelCreateParams {
  return {
    name: '',
    channel_code: '',
    type: 'openai-completions',
    base_url: '',
    api_key: ''
  };
}

function channelUrl(channel: Api.AI.Channel | undefined, type: Api.AI.ProtocolType) {
  return channel?.protocols.find(item => item.type === type)?.url || '';
}

function renderChannel(option: { icon?: string; label?: string }) {
  return (
    <div class="flex min-h-32px items-center gap-8px">
      <span class="flex h-24px w-24px shrink-0 items-center justify-center">
        {option.icon ? <SvgIcon icon={option.icon} class="text-18px" /> : null}
      </span>
      <span class="truncate">{option.label}</span>
    </div>
  );
}

function syncChannelDefaults(force = false) {
  const channel = selectedChannel.value;
  if (!channel) return;
  if (!channel.protocols.some(item => item.type === form.type)) {
    form.type = channel.protocols[0]?.type || 'openai-completions';
  }
  if (force || !form.base_url) form.base_url = channelUrl(channel, form.type);
}

async function initForm() {
  initializing.value = true;
  Object.assign(form, createDefaultForm());
  if (isEdit.value && props.rowData) {
    Object.assign(form, {
      name: props.rowData.name,
      channel_code: props.rowData.channel_code,
      type: props.rowData.type,
      base_url: props.rowData.base_url,
      api_key: ''
    });
  } else {
    form.channel_code = props.catalog.channels[0]?.channel_code || '';
    syncChannelDefaults();
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
  await validate();
  if (!isEdit.value && selectedChannel.value?.requires_api_key && !form.api_key?.trim()) {
    window.$message?.warning('当前渠道需要 API Key');
    return;
  }
  submitting.value = true;
  try {
    const payload: Api.AI.ModelChannelCreateParams = {
      ...form,
      name: form.name.trim(),
      base_url: form.base_url?.trim() || null,
      api_key: form.api_key?.trim() || undefined
    };
    const { error } =
      isEdit.value && props.rowData
        ? await fetchUpdateModelChannel(props.rowData.id, payload)
        : await fetchCreateModelChannel(payload);
    if (!error) {
      window.$message?.success(isEdit.value ? '渠道已更新' : '渠道已添加');
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
  () => props.rowData,
  () => {
    if (visible.value) void initForm();
  }
);
watch(
  () => form.channel_code,
  () => {
    if (!initializing.value) syncChannelDefaults(true);
  }
);
watch(
  () => form.type,
  () => {
    if (!initializing.value) syncChannelDefaults(true);
  }
);
</script>

<template>
  <NModal v-model:show="visible" preset="card" :title="title" :mask-closable="false" class="min-w-650px w-720px">
    <NForm ref="formRef" :model="form" :rules="rules" label-placement="top" class="pt-5px">
      <NGrid responsive="screen" item-responsive>
        <NFormItemGi span="12" label="渠道" path="channel_code" class="pr-24px">
          <NSelect v-model:value="form.channel_code" :options="channelOptions" :render-label="renderChannel" />
        </NFormItemGi>
        <NFormItemGi span="12" label="协议类型" path="type">
          <NSelect v-model:value="form.type" :options="protocolTypeOptions" :disabled="!selectedChannel" />
        </NFormItemGi>
      </NGrid>
      <NFormItem label="名称" path="name" required>
        <NInput v-model:value="form.name" placeholder="例如：生产环境 OpenAI" clearable />
      </NFormItem>
      <NFormItem label="Base URL" path="base_url" required>
        <div class="w-full">
          <NInput v-model:value="form.base_url" placeholder="请输入模型服务地址" clearable />
          <div v-if="chatMessageUrl" class="mt-4px text-12px text-gray-500">示例：{{ chatMessageUrl }}</div>
        </div>
      </NFormItem>
      <NFormItem label="API Key" path="api_key">
        <NInput
          v-model:value="form.api_key"
          type="password"
          show-password-on="click"
          clearable
          :placeholder="isEdit ? '留空表示沿用已保存密钥' : '请输入访问凭证'"
        />
      </NFormItem>
    </NForm>
    <template #footer>
      <NSpace justify="end" :size="16">
        <NButton @click="close">{{ $t('common.cancel') }}</NButton>
        <NButton type="primary" :loading="submitting" @click="submit">{{ $t('common.confirm') }}</NButton>
      </NSpace>
    </template>
  </NModal>
</template>
