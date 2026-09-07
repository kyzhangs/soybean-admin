<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import type { InputInst } from 'naive-ui';
import { useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';

defineOptions({ name: 'AuthProviderCasForm' });

type CasVersion = 2 | 3;
type CasUrlField = 'login' | 'validation' | 'logout';

interface CasUrlInput {
  prefix: string;
  uri: string;
  prefixEdited: boolean;
  uriEdited: boolean;
}

type CasUrlInputs = Record<CasUrlField, CasUrlInput>;

function getCasDefaultUris(version: CasVersion): Record<CasUrlField, string> {
  return {
    login: '/login',
    validation: version === 3 ? '/p3/serviceValidate' : '/serviceValidate',
    logout: '/logout'
  };
}

function normalizeCasUri(uri: string) {
  const value = uri.trim();
  return value && !value.startsWith('/') ? `/${value}` : value;
}

function joinCasUrl({ prefix, uri }: Pick<CasUrlInput, 'prefix' | 'uri'>) {
  const value = prefix.trim();
  if (!value) return '';
  const base = value.endsWith('://') ? value : value.replace(/\/+$/, '');
  return `${base}${normalizeCasUri(uri)}`;
}

function splitCasUrl(value: string, defaultUri: string, sharedPrefix = '', knownUris = [defaultUri]) {
  if (!value.trim()) return { prefix: sharedPrefix, uri: defaultUri };
  try {
    const url = new URL(value.trim());
    const suffix = `${url.search}${url.hash}`;
    const matchedUri = knownUris.find(uri => url.pathname.endsWith(uri));
    if (matchedUri) {
      return { prefix: `${url.origin}${url.pathname.slice(0, -matchedUri.length)}`, uri: `${matchedUri}${suffix}` };
    }
    const fullUrl = url.toString();
    if (sharedPrefix && fullUrl.startsWith(`${sharedPrefix}/`)) {
      return { prefix: sharedPrefix, uri: fullUrl.slice(sharedPrefix.length) };
    }
    const lastSlash = url.pathname.lastIndexOf('/');
    return {
      prefix: `${url.origin}${url.pathname.slice(0, lastSlash)}`,
      uri: `${url.pathname.slice(lastSlash)}${suffix}`
    };
  } catch {
    return { prefix: value, uri: defaultUri };
  }
}

function createCasUrlInputs(urls: Partial<Record<CasUrlField, string | null>>, version: CasVersion): CasUrlInputs {
  const defaults = getCasDefaultUris(version);
  const login = splitCasUrl(urls.login || '', defaults.login);
  const validation = splitCasUrl(urls.validation || '', defaults.validation, login.prefix, [
    '/p3/serviceValidate',
    '/serviceValidate'
  ]);
  const logoutCleared = urls.logout !== undefined && !urls.logout?.trim();
  const logout = splitCasUrl(urls.logout || '', defaults.logout, logoutCleared ? '' : login.prefix);
  return {
    login: { ...login, prefixEdited: false, uriEdited: login.uri !== defaults.login },
    validation: {
      ...validation,
      prefixEdited: validation.prefix !== login.prefix,
      uriEdited: !['/serviceValidate', '/p3/serviceValidate'].includes(validation.uri)
    },
    logout: {
      ...logout,
      prefixEdited: logoutCleared || logout.prefix !== login.prefix,
      uriEdited: logout.uri !== defaults.logout
    }
  };
}

const props = defineProps<{ rowData: Api.Authx.AuthProvider; defaultCallbackUrl: string }>();
const { formRef, validate } = useNaiveForm();
const savedSettings = (
  props.rowData.protocol === 'cas' ? props.rowData.settings : {}
) as Partial<Api.Authx.CasProviderSettings>;
const version = ref<CasVersion>(savedSettings.version ?? 3);
const callbackUrl = ref(savedSettings.callback_url || props.defaultCallbackUrl);
const callbackEditable = ref(false);
const callbackInputRef = ref<InputInst | null>(null);
const uriEditable = ref<Record<CasUrlField, boolean>>({ login: false, validation: false, logout: false });
const uriInputRefs: Record<CasUrlField, InputInst | null> = { login: null, validation: null, logout: null };
const urlFields = computed(
  () =>
    [
      { field: 'login', label: $t('page.authx.form.label.loginUrl'), path: 'authorization_url' },
      { field: 'validation', label: $t('page.authx.form.label.validationUrl'), path: 'validation_url' },
      { field: 'logout', label: $t('page.authx.form.label.logoutUrl'), path: 'logout_url' }
    ] as const
);
const urlInputs = ref(
  createCasUrlInputs(
    {
      login: savedSettings.authorization_url,
      validation: savedSettings.validation_url,
      logout: savedSettings.logout_url
    },
    version.value
  )
);

type CasAccessSettings = Pick<
  Api.Authx.CasProviderSettings,
  'authorization_url' | 'validation_url' | 'logout_url' | 'callback_url' | 'version'
>;

const model = computed<CasAccessSettings>(() => ({
  authorization_url: joinCasUrl(urlInputs.value.login),
  validation_url: joinCasUrl(urlInputs.value.validation),
  logout_url: joinCasUrl(urlInputs.value.logout) || null,
  callback_url: callbackUrl.value,
  version: version.value
}));
const rules = computed<Record<string, App.Global.FormRule>>(() => ({
  authorization_url: createRequiredUrlRule($t('page.authx.form.label.loginUrl'), true),
  validation_url: createRequiredUrlRule($t('page.authx.form.label.validationUrl'), true),
  callback_url: createRequiredUrlRule($t('page.authx.form.label.callbackUrl'))
}));

function createRequiredUrlRule(label: string, prefix = false): App.Global.FormRule {
  return {
    required: true,
    trigger: ['blur', 'input'],
    message: $t(prefix ? 'page.authx.form.validation.urlPrefixRequired' : 'page.authx.form.validation.urlRequired', {
      label
    })
  };
}

function updatePrefix(field: CasUrlField, value: string) {
  urlInputs.value[field].prefix = value;
  if (field !== 'login') {
    urlInputs.value[field].prefixEdited = true;
    return;
  }
  for (const dependent of [urlInputs.value.validation, urlInputs.value.logout]) {
    if (!dependent.prefixEdited) dependent.prefix = value;
  }
}

function updateUri(field: CasUrlField, value: string) {
  urlInputs.value[field].uri = value;
  urlInputs.value[field].uriEdited = true;
}

function updateVersion(value: CasVersion) {
  version.value = value;
  if (!urlInputs.value.validation.uriEdited) {
    urlInputs.value.validation.uri = getCasDefaultUris(value).validation;
  }
}

function finishUriEdit(field: CasUrlField) {
  const uri = normalizeCasUri(urlInputs.value[field].uri);
  if (uri !== urlInputs.value[field].uri) updateUri(field, uri);
  uriEditable.value[field] = false;
}

async function toggleUriEdit(field: CasUrlField) {
  if (uriEditable.value[field]) {
    finishUriEdit(field);
    return;
  }
  uriEditable.value[field] = true;
  await nextTick();
  uriInputRefs[field]?.focus();
}

async function toggleCallbackEdit() {
  callbackEditable.value = !callbackEditable.value;
  if (callbackEditable.value) {
    await nextTick();
    callbackInputRef.value?.focus();
  }
}

function buildSettings(): CasAccessSettings {
  return { ...model.value };
}

defineExpose({ validate, buildSettings });
</script>

<template>
  <NForm ref="formRef" :model="model" :rules="rules" label-placement="top">
    <NGrid :cols="24" :x-gap="16">
      <slot name="protocol" />
      <NFormItemGi :span="12" :label="$t('page.authx.form.label.casVersion')">
        <NSelect
          :value="version"
          :options="[
            { label: 'CAS 3.0', value: 3 },
            { label: 'CAS 2.0', value: 2 }
          ]"
          @update:value="updateVersion"
        />
      </NFormItemGi>
      <NFormItemGi v-for="item in urlFields" :key="item.field" :span="24" :label="item.label" :path="item.path">
        <NInputGroup>
          <NInput
            class="cas-url-prefix"
            :value="urlInputs[item.field].prefix"
            :input-props="{ 'aria-label': item.label }"
            :placeholder="$t('page.authx.form.placeholder.urlPrefix')"
            @update:value="updatePrefix(item.field, $event)"
          />
          <NInput
            :ref="instance => (uriInputRefs[item.field] = instance as InputInst | null)"
            class="cas-url-uri"
            :value="urlInputs[item.field].uri"
            :disabled="!uriEditable[item.field]"
            :input-props="{ 'aria-label': `${item.label} URI` }"
            placeholder="/"
            @update:value="updateUri(item.field, $event)"
            @keydown.enter.prevent="finishUriEdit(item.field)"
          >
            <template #suffix>
              <NButton
                text
                :aria-label="`${uriEditable[item.field] ? $t('common.confirm') : $t('common.edit')} ${item.label} URI`"
                :title="`${uriEditable[item.field] ? $t('common.confirm') : $t('common.edit')} URI`"
                @click="toggleUriEdit(item.field)"
              >
                <SvgIcon :icon="uriEditable[item.field] ? 'lucide:check' : 'lucide:pencil'" />
              </NButton>
            </template>
          </NInput>
        </NInputGroup>
      </NFormItemGi>
      <NFormItemGi :span="24" :label="$t('page.authx.form.label.callbackUrl')" path="callback_url">
        <NInput
          ref="callbackInputRef"
          v-model:value="callbackUrl"
          :disabled="!callbackEditable"
          :input-props="{ 'aria-label': $t('page.authx.form.label.callbackUrl') }"
          @keydown.enter.prevent="callbackEditable = false"
        >
          <template #suffix>
            <NButton
              text
              :aria-label="`${callbackEditable ? $t('common.confirm') : $t('common.edit')} ${$t('page.authx.form.label.callbackUrl')}`"
              :title="callbackEditable ? $t('common.confirm') : $t('common.edit')"
              @click="toggleCallbackEdit"
            >
              <SvgIcon :icon="callbackEditable ? 'lucide:check' : 'lucide:pencil'" />
            </NButton>
          </template>
        </NInput>
      </NFormItemGi>
    </NGrid>
  </NForm>
</template>

<style scoped>
.cas-url-prefix {
  flex: 1 1 55%;
  min-width: 0;
  width: 55%;
}

.cas-url-uri {
  flex: 0 1 215px;
  min-width: 0;
  width: 45%;
}
</style>
