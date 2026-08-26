<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';
import { fetchCreateAuthProvider, fetchTestAuthProviderProfile, fetchUpdateAuthProvider } from '@/service/api';
import { getServiceBaseURL } from '@/utils/service';

defineOptions({ name: 'AuthxProviderOperateModal' });

interface Props {
  operateType: NaiveUI.TableOperateType;
  rowData: Api.Authx.AuthProvider | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{ (e: 'submitted'): void }>();
const visible = defineModel<boolean>('visible', { default: false });
const submitting = ref(false);
const testingProfile = ref(false);
const availableTestAttributes = ref<string[]>([]);
const rawTestProfile = ref<Record<string, unknown> | null>(null);

const { formRef, validate, restoreValidation } = useNaiveForm();
const { defaultRequiredRule } = useFormRules();
const oauth2ProviderPresets = {
  github: {
    authorization_url: 'https://github.com/login/oauth/authorize',
    token_url: 'https://github.com/login/oauth/access_token',
    userinfo_url: 'https://api.github.com/user'
  }
} as const;
const { baseURL: backendServiceBaseURL } = getServiceBaseURL(import.meta.env, false);
const isEdit = computed(() => props.operateType === 'edit');
const title = computed(() => (isEdit.value ? $t('page.authx.form.editTitle') : $t('page.authx.form.addTitle')));
const rawTestProfileJson = computed(() => JSON.stringify(rawTestProfile.value, null, 2));

type FormModel = Omit<Api.Authx.AuthProviderCreateParams, 'settings'> & {
  provider_type: 'generic' | 'github';
  authorization_url: string;
  validation_url: string;
  token_url: string;
  userinfo_url: string;
  logout_url: string;
  callback_url: string;
  client_id: string;
  client_secret: string;
  scopes: string;
  version: 2 | 3;
  slo_enabled: boolean;
  slo_trusted_networks: string[];
  subject_attribute: string;
  principal_fallback_enabled: boolean;
  use_pkce: boolean;
  user_id_field: string;
  username_field: string;
  name_field: string;
  phone_field: string;
  email_field: string;
  avatar_field: string;
};

function createDefaultModel(): FormModel {
  return {
    code: '',
    name: '',
    protocol: 'cas',
    icon: null,
    sort: 0,
    status: '2',
    auto_bind: false,
    auto_provision: false,
    verify_tls: true,
    timeout: 60,
    provider_type: 'generic',
    authorization_url: '',
    validation_url: '',
    token_url: '',
    userinfo_url: '',
    logout_url: '',
    callback_url: '',
    client_id: '',
    client_secret: '',
    scopes: 'read:user, user:email',
    version: 3,
    slo_enabled: true,
    slo_trusted_networks: [],
    subject_attribute: '',
    principal_fallback_enabled: false,
    use_pkce: true,
    user_id_field: 'id',
    username_field: 'login',
    name_field: 'name',
    phone_field: '',
    email_field: 'email',
    avatar_field: 'avatar_url'
  };
}

const model = ref<FormModel>(createDefaultModel());
const isOauth2 = computed(() => model.value.protocol === 'oauth2');
const isOauth2Github = computed(() => isOauth2.value && model.value.provider_type === 'github');
const isOauth2Generic = computed(() => isOauth2.value && model.value.provider_type === 'generic');
const oauth2DefaultCallbackUrl = () => getBackendCallbackUrl();

function getBackendCallbackUrl() {
  const code = model.value.code.trim();
  if (!code) return '';
  return `${backendServiceBaseURL.replace(/\/$/, '')}/authx/${encodeURIComponent(code)}/callback`;
}

function applyOauth2Preset(providerType: 'generic' | 'github', force = false) {
  if (!isOauth2.value || providerType !== 'github') return;
  if (force || !model.value.authorization_url)
    model.value.authorization_url = oauth2ProviderPresets.github.authorization_url;
  if (force || !model.value.token_url) model.value.token_url = oauth2ProviderPresets.github.token_url;
  if (force || !model.value.userinfo_url) model.value.userinfo_url = oauth2ProviderPresets.github.userinfo_url;
  if (!model.value.callback_url) model.value.callback_url = oauth2DefaultCallbackUrl();
}

function resetCallbackToDefault() {
  model.value.callback_url = oauth2DefaultCallbackUrl();
}

function syncCallbackDefault() {
  if (!model.value.callback_url) {
    model.value.callback_url = getBackendCallbackUrl();
  }
}

function syncOauth2PresetByType() {
  if (isOauth2Github.value) {
    applyOauth2Preset('github');
    return;
  }
  syncCallbackDefault();
}
const testAttributeOptions = computed(() => {
  const keys = new Set(availableTestAttributes.value);
  [
    model.value.subject_attribute,
    model.value.user_id_field,
    model.value.username_field,
    model.value.name_field,
    model.value.phone_field,
    model.value.email_field,
    model.value.avatar_field
  ]
    .filter((key): key is string => Boolean(key))
    .forEach(key => keys.add(key));
  return Array.from(keys).map(key => ({ label: key, value: key }));
});
const rules = computed<Record<string, App.Global.FormRule>>(() => ({
  code: {
    key: 'basic',
    required: true,
    trigger: ['blur', 'input'],
    pattern: /^[a-z][a-z0-9_-]*$/,
    message: $t('page.authx.form.validation.code')
  },
  name: { ...defaultRequiredRule, key: 'basic' },
  protocol: { ...defaultRequiredRule, key: 'basic' },
  authorization_url: { ...defaultRequiredRule, key: 'protocol' },
  callback_url: { ...defaultRequiredRule, key: 'protocol' },
  validation_url: {
    required: true,
    key: 'protocol',
    trigger: ['blur', 'input'],
    validator: () => model.value.protocol !== 'cas' || Boolean(model.value.validation_url),
    message: $t('page.authx.form.validation.validationUrl')
  },
  token_url: {
    required: true,
    key: 'protocol',
    trigger: ['blur', 'input'],
    validator: () => (isOauth2Generic.value ? Boolean(model.value.token_url) : true),
    message: $t('page.authx.form.validation.tokenUrl')
  },
  userinfo_url: {
    required: true,
    key: 'protocol',
    trigger: ['blur', 'input'],
    validator: () => (isOauth2Generic.value ? Boolean(model.value.userinfo_url) : true),
    message: $t('page.authx.form.validation.userinfoUrl')
  },
  client_id: {
    required: true,
    key: 'protocol',
    trigger: ['blur', 'input'],
    validator: () => (isOauth2.value ? Boolean(model.value.client_id) : true),
    message: $t('page.authx.form.validation.clientId')
  },
  user_id_field: {
    required: true,
    key: 'identity',
    trigger: ['blur', 'input'],
    validator: () => model.value.protocol !== 'oauth2' || Boolean(model.value.user_id_field),
    message: $t('page.authx.form.validation.userIdField')
  }
}));
function onTestProfileMessage(event: MessageEvent) {
  if (event.origin !== window.location.origin) return;
  const payload = event.data;
  if (!payload || payload.type !== 'AUTH_PROVIDER_TEST_PROFILE' || payload.providerCode !== model.value.code) return;
  const profile = payload.profile as
    | (Record<string, unknown> & {
        attributes?: Record<string, unknown>;
        raw_attributes?: Record<string, unknown>;
      })
    | undefined;
  const rawAttributes = profile?.raw_attributes || profile?.attributes;
  if (rawAttributes) {
    rawTestProfile.value = rawAttributes;
    availableTestAttributes.value = Object.keys(rawAttributes);
    window.$message?.success($t('page.authx.form.message.profileLoaded'));
  } else {
    rawTestProfile.value = null;
    availableTestAttributes.value = [];
    window.$message?.error($t('page.authx.form.message.profileMissing'));
  }
}

window.addEventListener('message', onTestProfileMessage);
onUnmounted(() => {
  window.removeEventListener('message', onTestProfileMessage);
});

function initModel() {
  model.value = createDefaultModel();
  const row = props.rowData;
  if (!row) return;

  Object.assign(model.value, {
    code: row.code,
    name: row.name,
    protocol: row.protocol,
    icon: row.icon,
    sort: row.sort,
    status: row.status,
    auto_bind: row.auto_bind,
    auto_provision: row.auto_provision,
    verify_tls: row.verify_tls,
    timeout: row.timeout
  });
  const settings = row.settings;
  Object.assign(model.value, settings);
  if ('scopes' in settings) model.value.scopes = settings.scopes.join(', ');
  syncOauth2PresetByType();
}

watch(
  () => model.value.protocol,
  () => {
    syncOauth2PresetByType();
  }
);

watch(
  () => model.value.provider_type,
  () => {
    syncOauth2PresetByType();
  }
);

watch(
  () => model.value.code,
  () => {
    syncCallbackDefault();
  }
);

function buildSettings(): Api.Authx.AuthProviderSettings {
  if (model.value.protocol === 'cas') {
    return {
      authorization_url: model.value.authorization_url,
      validation_url: model.value.validation_url,
      logout_url: model.value.logout_url || null,
      callback_url: model.value.callback_url,
      version: model.value.version,
      slo_enabled: model.value.slo_enabled,
      slo_trusted_networks: model.value.slo_trusted_networks,
      subject_attribute: model.value.subject_attribute || null,
      username_field: model.value.username_field || null,
      name_field: model.value.name_field || null,
      phone_field: model.value.phone_field || null,
      email_field: model.value.email_field || null,
      avatar_field: model.value.avatar_field || null,
      principal_fallback_enabled: model.value.principal_fallback_enabled
    };
  }

  const settings: Api.Authx.OAuth2ProviderSettings = {
    provider_type: model.value.provider_type,
    authorization_url: model.value.authorization_url,
    token_url: model.value.token_url,
    userinfo_url: model.value.userinfo_url,
    callback_url: model.value.callback_url,
    client_id: model.value.client_id,
    scopes: model.value.scopes
      .split(',')
      .map(item => item.trim())
      .filter(Boolean),
    use_pkce: model.value.use_pkce,
    user_id_field: model.value.user_id_field,
    username_field: model.value.username_field || null,
    name_field: model.value.name_field || null,
    phone_field: model.value.phone_field || null,
    email_field: model.value.email_field || null,
    avatar_field: model.value.avatar_field || null
  };
  if (model.value.client_secret) settings.client_secret = model.value.client_secret;
  return settings;
}

async function submit() {
  submitting.value = true;
  try {
    await validate();
    const payload: Api.Authx.AuthProviderCreateParams = {
      code: model.value.code,
      name: model.value.name,
      protocol: model.value.protocol,
      icon: model.value.icon,
      sort: model.value.sort,
      status: model.value.status,
      auto_bind: model.value.auto_bind,
      auto_provision: model.value.auto_provision,
      verify_tls: model.value.verify_tls,
      timeout: model.value.timeout,
      settings: buildSettings()
    };
    const response = isEdit.value
      ? await fetchUpdateAuthProvider(props.rowData!.id, payload)
      : await fetchCreateAuthProvider(payload);
    if (!response.error) {
      window.$message?.success(
        isEdit.value ? $t('page.authx.form.message.updateSuccess') : $t('page.authx.form.message.createSuccess')
      );
      visible.value = false;
      emit('submitted');
    }
  } finally {
    submitting.value = false;
  }
}

watch(visible, value => {
  if (value) {
    initModel();
    restoreValidation();
    availableTestAttributes.value = [];
    rawTestProfile.value = null;
  }
});

async function testAuthProviderProfile() {
  if (!props.rowData?.id) {
    window.$message?.warning($t('page.authx.form.message.saveBeforeTest'));
    return;
  }
  testingProfile.value = true;
  const callbackUrl = `${window.location.origin}/login/callback`;
  const { data, error } = await fetchTestAuthProviderProfile(props.rowData.id, callbackUrl);
  if (!error) {
    window.open(data.authorization_url, '_blank');
  }
  testingProfile.value = false;
}
</script>

<template>
  <NModal
    v-model:show="visible"
    :title="title"
    preset="card"
    :mask-closable="false"
    class="max-w-95vw w-820px"
    content-style="max-height: calc(100vh - 220px); overflow-y: auto;"
  >
    <NForm ref="formRef" :model="model" :rules="rules" label-placement="top">
      <NGrid :cols="24" :x-gap="16">
        <NGridItem :span="24">
          <NDivider title-placement="left" class="mb-4px mt-2px">
            {{ $t('page.authx.form.section.basic') }}
          </NDivider>
          <div class="mb-12px text-12px text-gray-500">{{ $t('page.authx.form.section.basicTip') }}</div>
        </NGridItem>
        <NFormItemGi :span="12" :label="$t('page.authx.form.label.name')" path="name">
          <NInput v-model:value="model.name" />
        </NFormItemGi>
        <NFormItemGi :span="12" :label="$t('page.authx.form.label.code')" path="code">
          <NInput v-model:value="model.code" :disabled="isEdit" :placeholder="$t('page.authx.form.placeholder.code')" />
        </NFormItemGi>
        <NFormItemGi :span="12" :label="$t('page.authx.form.label.protocol')" path="protocol">
          <NSelect
            v-model:value="model.protocol"
            :disabled="isEdit"
            :options="[
              { label: 'CAS', value: 'cas' },
              { label: 'OAuth2', value: 'oauth2' }
            ]"
          />
        </NFormItemGi>
        <NFormItemGi :span="12" :label="$t('page.authx.form.label.icon')">
          <NInput v-model:value="model.icon" :placeholder="$t('page.authx.form.placeholder.icon')" />
        </NFormItemGi>
        <NFormItemGi :span="12" :label="$t('page.authx.form.label.sort')">
          <NInputNumber v-model:value="model.sort" class="w-full" />
        </NFormItemGi>
        <NGridItem :span="24">
          <NDivider title-placement="left" class="mb-4px mt-18px">
            {{ $t('page.authx.form.section.access') }}
          </NDivider>
          <div class="mb-12px text-12px text-gray-500">{{ $t('page.authx.form.section.accessTip') }}</div>
        </NGridItem>
        <NFormItemGi :span="24" :label="$t('page.authx.form.label.authorizationUrl')" path="authorization_url">
          <NInput
            v-model:value="model.authorization_url"
            :disabled="isOauth2Github"
            :placeholder="
              isOauth2Github
                ? $t('page.authx.form.placeholder.githubPreset')
                : $t('page.authx.form.placeholder.authorizationUrl')
            "
          />
        </NFormItemGi>
        <NFormItemGi
          v-if="model.protocol === 'cas'"
          :span="24"
          :label="$t('page.authx.form.label.validationUrl')"
          path="validation_url"
        >
          <NInput v-model:value="model.validation_url" />
        </NFormItemGi>
        <template v-else>
          <NFormItemGi :span="24" :label="$t('page.authx.form.label.oauth2Type')">
            <NSelect
              v-model:value="model.provider_type"
              :options="[
                { label: $t('page.authx.form.genericOauth2'), value: 'generic' },
                { label: 'GitHub', value: 'github' }
              ]"
            />
          </NFormItemGi>
          <NGridItem v-if="isOauth2Github" :span="24">
            <NAlert class="mb-12px" type="info" show-icon>
              {{ $t('page.authx.form.githubTip') }}
            </NAlert>
          </NGridItem>
          <NFormItemGi v-if="isOauth2Generic" :span="24" :label="$t('page.authx.form.label.tokenUrl')" path="token_url">
            <NInput v-model:value="model.token_url" />
          </NFormItemGi>
          <NFormItemGi
            v-if="isOauth2Generic"
            :span="24"
            :label="$t('page.authx.form.label.userinfoUrl')"
            path="userinfo_url"
          >
            <NInput v-model:value="model.userinfo_url" />
          </NFormItemGi>
          <NFormItemGi :span="12" :label="$t('page.authx.form.label.clientId')" path="client_id">
            <NInput v-model:value="model.client_id" />
          </NFormItemGi>
          <NFormItemGi :span="12" :label="$t('page.authx.form.label.clientSecret')">
            <NInput
              v-model:value="model.client_secret"
              type="password"
              show-password-on="click"
              :placeholder="
                isEdit && rowData?.client_secret_configured
                  ? $t('page.authx.form.placeholder.clientSecretConfigured')
                  : $t('page.authx.form.placeholder.clientSecret')
              "
            />
          </NFormItemGi>
          <NFormItemGi :span="24" :label="$t('page.authx.form.label.scopes')">
            <NInput v-model:value="model.scopes" />
          </NFormItemGi>
        </template>
        <NFormItemGi v-if="isOauth2" :span="24" :label="$t('page.authx.form.label.callbackUrl')" path="callback_url">
          <NSpace vertical size="small" class="w-full">
            <NInput v-model:value="model.callback_url" :placeholder="$t('page.authx.form.placeholder.callbackUrl')" />
            <NButton size="small" text type="primary" :disabled="!model.code.trim()" @click="resetCallbackToDefault">
              {{ $t('page.authx.form.useDefaultCallback') }}
            </NButton>
          </NSpace>
        </NFormItemGi>
        <NFormItemGi v-else :span="24" :label="$t('page.authx.form.label.backendCallbackUrl')" path="callback_url">
          <NInput v-model:value="model.callback_url" />
        </NFormItemGi>
        <NFormItemGi v-if="model.protocol === 'cas'" :span="24" :label="$t('page.authx.form.label.logoutUrl')">
          <NInput v-model:value="model.logout_url" />
        </NFormItemGi>
        <NFormItemGi v-if="model.protocol === 'cas'" :span="12" :label="$t('page.authx.form.label.casVersion')">
          <NSelect
            v-model:value="model.version"
            :options="[
              { label: 'CAS 3.0', value: 3 },
              { label: 'CAS 2.0', value: 2 }
            ]"
          />
        </NFormItemGi>
        <NGridItem :span="24">
          <NDivider title-placement="left" class="mb-4px mt-18px">
            {{ $t('page.authx.form.section.identity') }}
          </NDivider>
          <div class="mb-12px text-12px text-gray-500">{{ $t('page.authx.form.section.identityTip') }}</div>
        </NGridItem>
        <template v-if="model.protocol === 'cas'">
          <NFormItemGi :span="12" :label="$t('page.authx.form.label.subjectAttribute')">
            <NSelect
              v-model:value="model.subject_attribute"
              :options="testAttributeOptions"
              filterable
              clearable
              :placeholder="$t('page.authx.form.placeholder.subjectAttribute')"
            />
          </NFormItemGi>
          <NFormItemGi :span="12" :label="$t('page.authx.form.label.principalFallback')">
            <NSwitch v-model:value="model.principal_fallback_enabled" />
          </NFormItemGi>
          <NFormItemGi :span="12" :label="$t('page.authx.form.label.slo')">
            <NSwitch v-model:value="model.slo_enabled" />
          </NFormItemGi>
        </template>
        <template v-else>
          <NFormItemGi :span="12" :label="$t('page.authx.form.label.subjectAttribute')" path="user_id_field">
            <NSelect
              v-model:value="model.user_id_field"
              :options="testAttributeOptions"
              filterable
              clearable
              :placeholder="$t('page.authx.form.placeholder.subjectAttribute')"
            />
          </NFormItemGi>
          <NFormItemGi :span="12" :label="$t('page.authx.form.label.pkce')">
            <NSwitch v-model:value="model.use_pkce" />
          </NFormItemGi>
        </template>

        <NGridItem :span="24">
          <NDivider title-placement="left" class="mb-4px mt-8px">
            {{ $t('page.authx.form.section.advanced') }}
          </NDivider>
          <div class="mb-12px text-12px text-gray-500">{{ $t('page.authx.form.section.advancedTip') }}</div>
          <NCollapse :default-expanded-names="['field-map', 'other']" class="w-full">
            <NCollapseItem :title="$t('page.authx.form.label.fieldMapping')" name="field-map">
              <NGrid :cols="24" :x-gap="12" :y-gap="8" class="w-full">
                <NFormItemGi :span="8" :label="$t('page.authx.form.label.username')">
                  <NSelect v-model:value="model.username_field" :options="testAttributeOptions" filterable clearable />
                </NFormItemGi>
                <NFormItemGi :span="8" :label="$t('page.authx.form.label.personName')">
                  <NSelect v-model:value="model.name_field" :options="testAttributeOptions" filterable clearable />
                </NFormItemGi>
                <NFormItemGi :span="8" :label="$t('page.authx.form.label.phone')">
                  <NSelect v-model:value="model.phone_field" :options="testAttributeOptions" filterable clearable />
                </NFormItemGi>
                <NFormItemGi :span="8" :label="$t('page.authx.form.label.email')">
                  <NSelect v-model:value="model.email_field" :options="testAttributeOptions" filterable clearable />
                </NFormItemGi>
                <NFormItemGi :span="8" :label="$t('page.authx.form.label.avatar')">
                  <NSelect v-model:value="model.avatar_field" :options="testAttributeOptions" filterable clearable />
                </NFormItemGi>
              </NGrid>
            </NCollapseItem>
            <NCollapseItem :title="$t('page.authx.form.label.other')" name="other">
              <NGrid :cols="24" :x-gap="12" :y-gap="8" class="w-full">
                <NFormItemGi :span="24" :label="$t('page.authx.form.label.liveAttributes')">
                  <NSpace>
                    <NButton size="small" type="primary" :loading="testingProfile" @click="testAuthProviderProfile">
                      {{ $t('page.authx.form.testAndRead') }}
                    </NButton>
                  </NSpace>
                </NFormItemGi>

                <NFormItemGi v-if="rawTestProfile" :span="24" :label="$t('page.authx.form.label.rawUserInfo')">
                  <pre
                    class="max-h-320px w-full overflow-auto rounded-8px bg-gray-100 p-12px text-12px leading-20px dark:bg-gray-800"
                    >{{ rawTestProfileJson }}</pre
                  >
                </NFormItemGi>

                <NFormItemGi :span="12" :label="$t('page.authx.form.label.autoBind')">
                  <NSwitch v-model:value="model.auto_bind" />
                </NFormItemGi>
                <NFormItemGi :span="12" :label="$t('page.authx.form.label.autoProvision')">
                  <NSwitch v-model:value="model.auto_provision" />
                </NFormItemGi>
              </NGrid>
            </NCollapseItem>
          </NCollapse>
        </NGridItem>
      </NGrid>
    </NForm>
    <template #footer>
      <NSpace justify="end">
        <NButton @click="visible = false">{{ $t('common.cancel') }}</NButton>
        <NButton type="primary" :loading="submitting" @click="submit">{{ $t('common.confirm') }}</NButton>
      </NSpace>
    </template>
  </NModal>
</template>
