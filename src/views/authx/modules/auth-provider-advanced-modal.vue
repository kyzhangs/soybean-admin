<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';
import { fetchTestAuthProviderProfile, fetchUpdateAuthProvider } from '@/service/api';

defineOptions({ name: 'AuthxProviderAdvancedModal' });

interface Props {
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

type FormModel = Pick<Api.Authx.AuthProvider, 'auto_bind' | 'auto_provision' | 'verify_tls' | 'timeout'> & {
  subject_attribute: string;
  principal_fallback_enabled: boolean;
  slo_enabled: boolean;
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
    auto_bind: false,
    auto_provision: false,
    verify_tls: true,
    timeout: 60,
    subject_attribute: '',
    principal_fallback_enabled: true,
    slo_enabled: true,
    use_pkce: true,
    user_id_field: 'id',
    username_field: '',
    name_field: '',
    phone_field: '',
    email_field: '',
    avatar_field: ''
  };
}

const model = ref<FormModel>(createDefaultModel());
const isCas = computed(() => props.rowData?.protocol === 'cas');
const rawTestProfileJson = computed(() => JSON.stringify(rawTestProfile.value, null, 2));
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
  user_id_field: isCas.value
    ? {}
    : {
        ...defaultRequiredRule,
        key: 'identity',
        message: $t('page.authx.form.validation.userIdField')
      }
}));

function initModel() {
  model.value = createDefaultModel();
  const row = props.rowData;
  if (!row) return;
  Object.assign(model.value, {
    auto_bind: row.auto_bind,
    auto_provision: row.auto_provision,
    verify_tls: row.verify_tls,
    timeout: row.timeout
  });
  Object.assign(model.value, row.settings);
}

function buildSettings(): Api.Authx.AuthProviderSettings {
  const fieldMapping = {
    username_field: model.value.username_field || null,
    name_field: model.value.name_field || null,
    phone_field: model.value.phone_field || null,
    email_field: model.value.email_field || null,
    avatar_field: model.value.avatar_field || null
  };
  if (isCas.value) {
    return {
      ...fieldMapping,
      subject_attribute: model.value.subject_attribute || null,
      principal_fallback_enabled: model.value.principal_fallback_enabled,
      slo_enabled: model.value.slo_enabled
    };
  }
  return {
    ...fieldMapping,
    user_id_field: model.value.user_id_field,
    use_pkce: model.value.use_pkce
  };
}

async function submit() {
  submitting.value = true;
  try {
    await validate();
    const payload: Api.Authx.AuthProviderAdvancedUpdateParams = {
      auto_bind: model.value.auto_bind,
      auto_provision: model.value.auto_provision,
      verify_tls: model.value.verify_tls,
      timeout: model.value.timeout,
      settings: buildSettings()
    };
    const response = await fetchUpdateAuthProvider(props.rowData!.id, payload);
    if (!response.error) {
      window.$message?.success($t('page.authx.form.message.updateSuccess'));
      visible.value = false;
      emit('submitted');
    }
  } finally {
    submitting.value = false;
  }
}

async function testAuthProviderProfile() {
  if (!props.rowData?.id) return;
  testingProfile.value = true;
  try {
    const callbackUrl = `${window.location.origin}/login/callback`;
    const { data, error } = await fetchTestAuthProviderProfile(props.rowData.id, callbackUrl);
    if (!error) window.open(data.authorization_url, '_blank');
  } finally {
    testingProfile.value = false;
  }
}

function onTestProfileMessage(event: MessageEvent) {
  if (event.origin !== window.location.origin) return;
  const payload = event.data;
  if (!payload || payload.type !== 'AUTH_PROVIDER_TEST_PROFILE' || payload.providerCode !== props.rowData?.code) return;
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
onUnmounted(() => window.removeEventListener('message', onTestProfileMessage));

watch(visible, value => {
  if (value) {
    initModel();
    restoreValidation();
    availableTestAttributes.value = [];
    rawTestProfile.value = null;
  }
});
</script>

<template>
  <NModal
    v-model:show="visible"
    :title="$t('page.authx.form.section.advanced')"
    preset="card"
    :mask-closable="false"
    class="max-w-95vw w-820px"
    content-style="max-height: calc(100vh - 220px); overflow-y: auto;"
  >
    <NForm ref="formRef" :model="model" :rules="rules" label-placement="top">
      <NAlert v-if="!rowData?.configured" class="mb-16px" type="warning" show-icon>
        {{ $t('page.authx.form.message.saveBeforeTest') }}
      </NAlert>
      <NGrid :cols="24" :x-gap="16">
        <NGridItem :span="24">
          <div class="mb-12px text-12px text-gray-500">{{ $t('page.authx.form.section.identityTip') }}</div>
        </NGridItem>
        <NFormItemGi v-if="isCas" :span="12" :label="$t('page.authx.form.label.subjectAttribute')">
          <NSelect
            v-model:value="model.subject_attribute"
            :options="testAttributeOptions"
            filterable
            clearable
            :placeholder="$t('page.authx.form.placeholder.subjectAttribute')"
          />
        </NFormItemGi>
        <NFormItemGi v-else :span="12" :label="$t('page.authx.form.label.subjectAttribute')" path="user_id_field">
          <NSelect
            v-model:value="model.user_id_field"
            :options="testAttributeOptions"
            filterable
            clearable
            :placeholder="$t('page.authx.form.placeholder.subjectAttribute')"
          />
        </NFormItemGi>
        <NFormItemGi :span="12" :label="$t('page.authx.form.label.liveAttributes')">
          <NButton
            size="small"
            type="primary"
            :loading="testingProfile"
            :disabled="!rowData?.configured"
            @click="testAuthProviderProfile"
          >
            {{ $t('page.authx.form.testAndRead') }}
          </NButton>
        </NFormItemGi>
        <NFormItemGi v-if="rawTestProfile" :span="24" :label="$t('page.authx.form.label.rawUserInfo')">
          <pre
            class="max-h-320px w-full overflow-auto rounded-8px bg-gray-100 p-12px text-12px leading-20px dark:bg-gray-800"
            >{{ rawTestProfileJson }}</pre
          >
        </NFormItemGi>
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

        <NGridItem :span="24">
          <div class="mb-12px text-12px text-gray-500">{{ $t('page.authx.form.section.advancedTip') }}</div>
        </NGridItem>
        <NFormItemGi v-if="isCas" :span="12" :label="$t('page.authx.form.label.principalFallback')">
          <NSwitch v-model:value="model.principal_fallback_enabled" />
        </NFormItemGi>
        <NFormItemGi v-if="isCas" :span="12" :label="$t('page.authx.form.label.slo')">
          <NSwitch v-model:value="model.slo_enabled" />
        </NFormItemGi>
        <NFormItemGi v-else :span="12" :label="$t('page.authx.form.label.pkce')">
          <NSwitch v-model:value="model.use_pkce" />
        </NFormItemGi>
        <NFormItemGi :span="12" :label="$t('page.authx.form.label.autoBind')">
          <NSwitch v-model:value="model.auto_bind" />
        </NFormItemGi>
        <NFormItemGi :span="12" :label="$t('page.authx.form.label.autoProvision')">
          <NSwitch v-model:value="model.auto_provision" />
        </NFormItemGi>
        <NFormItemGi :span="12" :label="$t('page.authx.form.label.verifyTls')">
          <NSwitch v-model:value="model.verify_tls" />
        </NFormItemGi>
        <NFormItemGi :span="12" :label="$t('page.authx.form.label.timeout')">
          <NInputNumber v-model:value="model.timeout" :min="0.5" :max="60" class="w-full" />
        </NFormItemGi>
      </NGrid>
    </NForm>
    <template #footer>
      <NSpace justify="end">
        <NButton @click="visible = false">{{ $t('common.cancel') }}</NButton>
        <NButton type="primary" :loading="submitting" :disabled="!rowData?.configured" @click="submit">
          {{ $t('common.confirm') }}
        </NButton>
      </NSpace>
    </template>
  </NModal>
</template>
