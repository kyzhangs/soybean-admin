<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';

defineOptions({ name: 'AuthProviderOauth2Form' });

const props = defineProps<{ rowData: Api.Authx.AuthProvider; defaultCallbackUrl: string }>();
const { formRef, validate } = useNaiveForm();
const savedSettings = (
  props.rowData.protocol === 'oauth2' ? props.rowData.settings : {}
) as Partial<Api.Authx.OAuth2ProviderSettings>;
const githubPreset = {
  authorization_url: 'https://github.com/login/oauth/authorize',
  token_url: 'https://github.com/login/oauth/access_token',
  userinfo_url: 'https://api.github.com/user'
} as const;

type OAuth2AccessSettings = Pick<
  Api.Authx.OAuth2ProviderSettings,
  | 'provider_type'
  | 'authorization_url'
  | 'token_url'
  | 'userinfo_url'
  | 'callback_url'
  | 'client_id'
  | 'client_secret'
  | 'scopes'
>;
type FormModel = Omit<OAuth2AccessSettings, 'scopes' | 'client_secret'> & { scopes: string; client_secret: string };

const model = ref<FormModel>({
  provider_type: savedSettings.provider_type ?? 'generic',
  authorization_url: savedSettings.authorization_url ?? '',
  token_url: savedSettings.token_url ?? '',
  userinfo_url: savedSettings.userinfo_url ?? '',
  callback_url: savedSettings.callback_url || props.defaultCallbackUrl,
  client_id: savedSettings.client_id ?? '',
  client_secret: '',
  scopes: (savedSettings.scopes ?? ['read:user', 'user:email']).join(', ')
});
const callbackEditable = ref(false);
const isGithub = computed(() => model.value.provider_type === 'github');
const clientSecretConfigured = computed(
  () => props.rowData.protocol === 'oauth2' && props.rowData.client_secret_configured
);
const rules = computed<Record<string, App.Global.FormRule>>(() => ({
  authorization_url: createRequiredUrlRule($t('page.authx.form.label.authorizationUrl')),
  callback_url: createRequiredUrlRule($t('page.authx.form.label.callbackUrl')),
  token_url: isGithub.value ? {} : createRequiredUrlRule($t('page.authx.form.label.tokenUrl')),
  userinfo_url: isGithub.value ? {} : createRequiredUrlRule($t('page.authx.form.label.userinfoUrl')),
  client_id: {
    required: true,
    trigger: ['blur', 'input'],
    message: $t('page.authx.form.validation.clientId')
  }
}));

function createRequiredUrlRule(label: string): App.Global.FormRule {
  return {
    required: true,
    trigger: ['blur', 'input'],
    message: $t('page.authx.form.validation.urlRequired', { label })
  };
}

function applyGithubPreset() {
  if (!isGithub.value) return;
  if (!model.value.authorization_url) model.value.authorization_url = githubPreset.authorization_url;
  if (!model.value.token_url) model.value.token_url = githubPreset.token_url;
  if (!model.value.userinfo_url) model.value.userinfo_url = githubPreset.userinfo_url;
}

function buildSettings(): OAuth2AccessSettings {
  const { client_secret, scopes, ...settings } = model.value;
  return {
    ...settings,
    scopes: scopes
      .split(',')
      .map(item => item.trim())
      .filter(Boolean),
    ...(client_secret ? { client_secret } : {})
  };
}

watch(() => model.value.provider_type, applyGithubPreset, { immediate: true });
defineExpose({ validate, buildSettings });
</script>

<template>
  <NForm ref="formRef" :model="model" :rules="rules" label-placement="top">
    <NGrid :cols="24" :x-gap="16">
      <slot name="protocol" />
      <NFormItemGi :span="12" :label="$t('page.authx.form.label.oauth2Type')">
        <NSelect
          v-model:value="model.provider_type"
          :options="[
            { label: $t('page.authx.form.genericOauth2'), value: 'generic' },
            { label: 'GitHub', value: 'github' }
          ]"
        />
      </NFormItemGi>
      <NFormItemGi :span="12" :label="$t('page.authx.form.label.clientId')" path="client_id">
        <NInput v-model:value="model.client_id" :input-props="{ 'aria-label': $t('page.authx.form.label.clientId') }" />
      </NFormItemGi>
      <NFormItemGi :span="12" :label="$t('page.authx.form.label.clientSecret')">
        <NInput
          v-model:value="model.client_secret"
          type="password"
          show-password-on="click"
          :input-props="{ 'aria-label': $t('page.authx.form.label.clientSecret') }"
          :placeholder="
            clientSecretConfigured
              ? $t('page.authx.form.placeholder.clientSecretConfigured')
              : $t('page.authx.form.placeholder.clientSecret')
          "
        />
      </NFormItemGi>
      <NFormItemGi :span="24" :label="$t('page.authx.form.label.scopes')">
        <NInput v-model:value="model.scopes" :input-props="{ 'aria-label': $t('page.authx.form.label.scopes') }" />
      </NFormItemGi>
      <NFormItemGi :span="24" :label="$t('page.authx.form.label.authorizationUrl')" path="authorization_url">
        <NInput
          v-model:value="model.authorization_url"
          :disabled="isGithub"
          :input-props="{ 'aria-label': $t('page.authx.form.label.authorizationUrl') }"
          :placeholder="
            isGithub
              ? $t('page.authx.form.placeholder.githubPreset')
              : $t('page.authx.form.placeholder.authorizationUrl')
          "
        />
      </NFormItemGi>
      <NFormItemGi :span="24" :label="$t('page.authx.form.label.tokenUrl')" path="token_url">
        <NInput
          v-model:value="model.token_url"
          :disabled="isGithub"
          :input-props="{ 'aria-label': $t('page.authx.form.label.tokenUrl') }"
        />
      </NFormItemGi>
      <NFormItemGi :span="24" :label="$t('page.authx.form.label.userinfoUrl')" path="userinfo_url">
        <NInput
          v-model:value="model.userinfo_url"
          :disabled="isGithub"
          :input-props="{ 'aria-label': $t('page.authx.form.label.userinfoUrl') }"
        />
      </NFormItemGi>
      <NFormItemGi :span="24" :label="$t('page.authx.form.label.callbackUrl')" path="callback_url">
        <NInput
          v-model:value="model.callback_url"
          :disabled="!callbackEditable"
          :input-props="{ 'aria-label': $t('page.authx.form.label.callbackUrl') }"
          :placeholder="$t('page.authx.form.placeholder.callbackUrl')"
        >
          <template #suffix>
            <NButton
              v-if="!callbackEditable"
              text
              :aria-label="$t('common.edit')"
              :title="$t('common.edit')"
              @click="callbackEditable = true"
            >
              <SvgIcon icon="lucide:pencil" />
            </NButton>
          </template>
        </NInput>
      </NFormItemGi>
    </NGrid>
  </NForm>
</template>
