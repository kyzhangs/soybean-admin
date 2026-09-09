<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useMessage } from 'naive-ui';
import { useAuthStore } from '@/store/modules/auth';
import { useRouterPush } from '@/hooks/common/router';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';
import { fetchPublicAuthProviders, getAuthProviderLoginUrl } from '@/service/api';

defineOptions({
  name: 'PwdLogin'
});

const authStore = useAuthStore();
const route = useRoute();
const message = useMessage();
const { toggleLoginModule } = useRouterPush();
const { formRef, validate } = useNaiveForm();

interface FormModel {
  username: string;
  password: string;
}

const model: FormModel = reactive({
  username: '',
  password: ''
});
const authProviders = ref<Api.Authx.PublicAuthProvider[]>([]);
const primaryAuthProvider = computed(() => authProviders.value[0]);
const otherAuthProviders = computed(() => authProviders.value.slice(1));

const rules = computed<Record<keyof FormModel, App.Global.FormRule[]>>(() => {
  // inside computed to make locale reactive, if not apply i18n, you can define it without computed
  const { createRequiredRule } = useFormRules();

  return {
    username: [createRequiredRule($t('form.username.required'))],
    password: [createRequiredRule($t('form.pwd.required'))]
  };
});

async function handleSubmit() {
  await validate();
  await authStore.login(model.username, model.password);
}

async function loadAuthProviders() {
  const { data, error } = await fetchPublicAuthProviders();
  if (!error) authProviders.value = data;
}

function handleProviderLogin(provider: Api.Authx.PublicAuthProvider) {
  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/';
  const callbackUrl = `${window.location.origin}/login/callback`;
  window.location.assign(getAuthProviderLoginUrl(provider.code, redirect, callbackUrl));
}

function handlePrimaryProviderLogin() {
  if (!primaryAuthProvider.value) {
    message.warning($t('page.login.cas.disabled'));
    return;
  }

  handleProviderLogin(primaryAuthProvider.value);
}

onMounted(loadAuthProviders);
</script>

<template>
  <NForm ref="formRef" :model="model" :rules="rules" size="large" :show-label="false" @keyup.enter="handleSubmit">
    <NFormItem path="username">
      <NInput v-model:value="model.username" :placeholder="$t('page.login.common.usernamePlaceholder')" />
    </NFormItem>
    <NFormItem path="password">
      <NInput
        v-model:value="model.password"
        type="password"
        show-password-on="click"
        :placeholder="$t('page.login.common.passwordPlaceholder')"
      />
    </NFormItem>
    <NSpace vertical :size="24">
      <div class="flex-y-center justify-between">
        <NCheckbox>{{ $t('page.login.pwdLogin.rememberMe') }}</NCheckbox>
        <NButton quaternary @click="toggleLoginModule('reset-pwd')">
          {{ $t('page.login.pwdLogin.forgetPassword') }}
        </NButton>
      </div>
      <NButton type="primary" size="large" round block :loading="authStore.loginLoading" @click="handleSubmit">
        {{ $t('common.confirm') }}
      </NButton>
      <a
        href="#"
        class="flex items-center justify-center gap-6px text-primary transition-colors hover:text-primary-hover hover:underline"
        @click.prevent="handlePrimaryProviderLogin"
      >
        <span>{{ $t('page.login.cas.login') }}</span>
      </a>
      <!--
          <div class="flex-y-center justify-between gap-12px">
            <NButton class="flex-1" block @click="toggleLoginModule('code-login')">
              {{ $t(loginModuleRecord['code-login']) }}
            </NButton>
            <NButton class="flex-1" block @click="toggleLoginModule('register')">
              {{ $t(loginModuleRecord.register) }}
            </NButton>
          </div>
      -->
      <template v-if="otherAuthProviders.length">
        <NDivider class="text-14px text-#666 !m-0">{{ $t('page.login.pwdLogin.otherAccountLogin') }}</NDivider>
        <div class="flex-center flex-wrap gap-12px">
          <NButton
            v-for="provider in otherAuthProviders"
            :key="provider.code"
            secondary
            strong
            @click="handleProviderLogin(provider)"
          >
            <template v-if="provider.icon" #icon><SvgIcon :icon="provider.icon" /></template>
            {{ provider.name }}
          </NButton>
        </div>
      </template>
    </NSpace>
  </NForm>
</template>
