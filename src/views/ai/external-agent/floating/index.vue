<script setup lang="ts">
import { useChatStore } from '@/store/modules/chat';

defineOptions({ name: 'AiExternalAgentFloating' });

const store = useChatStore();
const form = store.settings;

async function saveChatbox() {
  if (await store.saveChatbox(form.chatbox)) {
    Object.assign(form.chatbox, { ...store.settings.chatbox });
    window.$message?.success('chatbox 配置已保存');
  }
}

async function saveChatbot() {
  if (await store.saveChatbot(form.chatbot)) {
    Object.assign(form.chatbot, { ...store.settings.chatbot });
    window.$message?.success('chatbot 配置已保存');
  }
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <NCard title="悬浮窗配置" :bordered="false" size="small">
      <div class="grid grid-cols-1 gap-16px xl:grid-cols-2">
        <NCard title="chatbox" size="small">
          <template #header-extra>
            <NSwitch v-model:value="form.chatbox.enabled" />
          </template>
          <NForm label-placement="left" label-width="120px">
            <NFormItem label="助手地址">
              <NInput v-model:value="form.chatbox.baseUrl" />
            </NFormItem>
            <NFormItem label="助手令牌">
              <NInput v-model:value="form.chatbox.token" type="password" show-password-on="click" />
            </NFormItem>
          </NForm>
          <div class="mt-16px flex justify-end">
            <NButton type="primary" @click="saveChatbox">保存</NButton>
          </div>
        </NCard>

        <NCard title="chatbot" size="small">
          <template #header-extra>
            <NSwitch v-model:value="form.chatbot.enabled" />
          </template>
          <NForm label-placement="left" label-width="120px">
            <NFormItem label="服务地址">
              <NInput v-model:value="form.chatbot.baseUrl" />
            </NFormItem>
            <NFormItem label="Token">
              <NInput v-model:value="form.chatbot.token" type="password" show-password-on="click" />
            </NFormItem>
          </NForm>
          <div class="mt-16px flex justify-end">
            <NButton type="primary" @click="saveChatbot">保存</NButton>
          </div>
        </NCard>
      </div>
    </NCard>
  </div>
</template>
