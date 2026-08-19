<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { fetchCreateAuthProvider, fetchUpdateAuthProvider } from '@/service/api';

defineOptions({ name: 'AuthxProviderOperateModal' });

interface Props {
  operateType: NaiveUI.TableOperateType;
  rowData: Api.Authx.AuthProvider | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{ (e: 'submitted'): void }>();
const visible = defineModel<boolean>('visible', { default: false });
const currentStep = ref(1);
const submitting = ref(false);

const { formRef, validate, restoreValidation } = useNaiveForm();
const { defaultRequiredRule } = useFormRules();
const isEdit = computed(() => props.operateType === 'edit');
const title = computed(() => (isEdit.value ? '编辑认证提供方' : '新增认证提供方'));

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
  email_field: string;
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
    email_field: 'email'
  };
}

const model = ref<FormModel>(createDefaultModel());
const rules: Record<string, App.Global.FormRule> = {
  code: {
    key: 'basic',
    required: true,
    trigger: ['blur', 'input'],
    pattern: /^[a-z][a-z0-9_-]*$/,
    message: '请输入小写字母开头的编码，仅支持小写字母、数字、下划线和中划线'
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
    message: '请输入 Ticket 验证地址'
  },
  token_url: {
    required: true,
    key: 'protocol',
    trigger: ['blur', 'input'],
    validator: () => model.value.protocol !== 'oauth2' || Boolean(model.value.token_url),
    message: '请输入 Token 地址'
  },
  userinfo_url: {
    required: true,
    key: 'protocol',
    trigger: ['blur', 'input'],
    validator: () => model.value.protocol !== 'oauth2' || Boolean(model.value.userinfo_url),
    message: '请输入用户信息地址'
  },
  client_id: {
    required: true,
    key: 'protocol',
    trigger: ['blur', 'input'],
    validator: () => model.value.protocol !== 'oauth2' || Boolean(model.value.client_id),
    message: '请输入 Client ID'
  },
  user_id_field: {
    required: true,
    key: 'identity',
    trigger: ['blur', 'input'],
    validator: () => model.value.protocol !== 'oauth2' || Boolean(model.value.user_id_field),
    message: '请输入用户唯一标识字段'
  }
};

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
}

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
    email_field: model.value.email_field || null
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
      window.$message?.success(isEdit.value ? '更新成功' : '创建成功');
      visible.value = false;
      emit('submitted');
    }
  } finally {
    submitting.value = false;
  }
}

async function nextStep() {
  const validationKey = currentStep.value === 1 ? 'basic' : 'protocol';
  await formRef.value?.validate(undefined, rule => rule.key === validationKey);
  currentStep.value += 1;
}

watch(visible, value => {
  if (value) {
    currentStep.value = 1;
    initModel();
    restoreValidation();
  }
});
</script>

<template>
  <NModal v-model:show="visible" :title="title" preset="card" :mask-closable="false" class="w-760px max-w-95vw">
    <NSteps :current="currentStep" size="small" class="mx-auto mb-24px max-w-620px">
      <NStep title="基本配置" description="名称与展示" />
      <NStep title="协议配置" description="服务与回调" />
      <NStep title="身份与策略" description="映射与安全" />
    </NSteps>
    <NForm ref="formRef" :model="model" :rules="rules" label-placement="top">
      <NGrid v-show="currentStep === 1" :cols="24" :x-gap="16">
        <NFormItemGi :span="12" label="名称" path="name"><NInput v-model:value="model.name" /></NFormItemGi>
        <NFormItemGi :span="12" label="编码" path="code">
          <NInput v-model:value="model.code" :disabled="isEdit" placeholder="如 cas、github" />
        </NFormItemGi>
        <NFormItemGi :span="12" label="协议" path="protocol">
          <NSelect
            v-model:value="model.protocol"
            :disabled="isEdit"
            :options="[
              { label: 'CAS', value: 'cas' },
              { label: 'OAuth2', value: 'oauth2' }
            ]"
          />
        </NFormItemGi>
        <NFormItemGi :span="12" label="图标">
          <NInput v-model:value="model.icon" placeholder="如 mdi:github" />
        </NFormItemGi>
        <NFormItemGi :span="12" label="排序"><NInputNumber v-model:value="model.sort" class="w-full" /></NFormItemGi>
      </NGrid>

      <NGrid v-show="currentStep === 2" :cols="24" :x-gap="16">
        <NFormItemGi :span="24" label="授权/登录地址" path="authorization_url">
          <NInput v-model:value="model.authorization_url" />
        </NFormItemGi>
        <NFormItemGi v-if="model.protocol === 'cas'" :span="24" label="Ticket 验证地址" path="validation_url">
          <NInput v-model:value="model.validation_url" />
        </NFormItemGi>
        <template v-else>
          <NFormItemGi :span="24" label="OAuth2 类型">
            <NSelect
              v-model:value="model.provider_type"
              :options="[
                { label: '通用 OAuth2', value: 'generic' },
                { label: 'GitHub', value: 'github' }
              ]"
            />
          </NFormItemGi>
          <NFormItemGi :span="24" label="Token 地址" path="token_url">
            <NInput v-model:value="model.token_url" />
          </NFormItemGi>
          <NFormItemGi :span="24" label="用户信息地址" path="userinfo_url">
            <NInput v-model:value="model.userinfo_url" />
          </NFormItemGi>
          <NFormItemGi :span="12" label="Client ID" path="client_id">
            <NInput v-model:value="model.client_id" />
          </NFormItemGi>
          <NFormItemGi :span="12" label="Client Secret">
            <NInput
              v-model:value="model.client_secret"
              type="password"
              show-password-on="click"
              :placeholder="
                isEdit && rowData?.client_secret_configured ? '已配置，留空保持不变' : '请输入 Client Secret'
              "
            />
          </NFormItemGi>
          <NFormItemGi :span="24" label="Scopes（逗号分隔）"><NInput v-model:value="model.scopes" /></NFormItemGi>
        </template>
        <NFormItemGi :span="24" label="后端回调地址" path="callback_url">
          <NInput v-model:value="model.callback_url" />
        </NFormItemGi>
        <NFormItemGi v-if="model.protocol === 'cas'" :span="24" label="退出地址">
          <NInput v-model:value="model.logout_url" />
        </NFormItemGi>
        <NFormItemGi v-if="model.protocol === 'cas'" :span="12" label="CAS 版本">
          <NSelect
            v-model:value="model.version"
            :options="[
              { label: 'CAS 3.0', value: 3 },
              { label: 'CAS 2.0', value: 2 }
            ]"
          />
        </NFormItemGi>
      </NGrid>

      <NGrid v-show="currentStep === 3" :cols="24" :x-gap="16">
        <template v-if="model.protocol === 'cas'">
          <NFormItemGi :span="12" label="稳定身份属性">
            <NInput v-model:value="model.subject_attribute" placeholder="如 employeeId" />
          </NFormItemGi>
          <NFormItemGi :span="12" label="允许 Principal 回退">
            <NSwitch v-model:value="model.principal_fallback_enabled" />
          </NFormItemGi>
          <NFormItemGi :span="12" label="启用 SLO"><NSwitch v-model:value="model.slo_enabled" /></NFormItemGi>
        </template>
        <template v-else>
          <NFormItemGi :span="8" label="用户唯一标识字段" path="user_id_field">
            <NInput v-model:value="model.user_id_field" placeholder="id" />
          </NFormItemGi>
          <NFormItemGi :span="8" label="用户名字段">
            <NInput v-model:value="model.username_field" placeholder="login" />
          </NFormItemGi>
          <NFormItemGi :span="8" label="邮箱字段">
            <NInput v-model:value="model.email_field" placeholder="email" />
          </NFormItemGi>
          <NFormItemGi :span="8" label="启用 PKCE"><NSwitch v-model:value="model.use_pkce" /></NFormItemGi>
        </template>

        <NFormItemGi :span="8" label="自动绑定本地用户">
          <NSwitch v-model:value="model.auto_bind" />
        </NFormItemGi>
        <NFormItemGi :span="8" label="自动开通用户"><NSwitch v-model:value="model.auto_provision" /></NFormItemGi>
        <NFormItemGi :span="8" label="校验 TLS"><NSwitch v-model:value="model.verify_tls" /></NFormItemGi>
        <NFormItemGi :span="8" label="请求超时（秒）">
          <NInputNumber v-model:value="model.timeout" :min="0.5" :max="60" :step="0.5" class="w-full" />
        </NFormItemGi>
      </NGrid>
    </NForm>
    <template #footer>
      <NSpace justify="end">
        <NButton @click="visible = false">取消</NButton>
        <NButton v-if="currentStep > 1" @click="currentStep -= 1">上一步</NButton>
        <NButton v-if="currentStep < 3" type="primary" @click="nextStep">下一步</NButton>
        <NButton v-else type="primary" :loading="submitting" @click="submit">确认</NButton>
      </NSpace>
    </template>
  </NModal>
</template>
