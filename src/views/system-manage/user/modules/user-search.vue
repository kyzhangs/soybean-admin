<script setup lang="ts">
  import { computed } from 'vue';
  import { userGenderOptions } from '@/constants/business';
  import { yesOrNoOptions } from '@/constants/common';
  import { useFormRules, useNaiveForm } from '@/hooks/common/form';
  import { translateOptions } from '@/utils/common';
  import { $t } from '@/locales';

  defineOptions({
    name: 'UserSearch'
  });

  interface Emits {
    (e: 'search'): void;
  }

  const emit = defineEmits<Emits>();

  const { formRef, validate, restoreValidation } = useNaiveForm();

  const model = defineModel<Api.SystemManage.UserSearchParams>('model', { required: true });

  const isActiveComputed = computed({
    get: () => {
      if (model.value.is_active === null) {
        return null;
      }
      return model.value.is_active ? 'Y' : 'N';
    },
    set: (value: string | null) => {
      if (value === 'Y') {
        model.value.is_active = true;
      } else if (value === 'N') {
        model.value.is_active = false;
      } else {
        model.value.is_active = null;
      }
    }
  });

  const isForbidComputed = computed({
    get: () => {
      if (model.value.is_forbid === null) {
        return null;
      }
      return model.value.is_forbid ? 'Y' : 'N';
    },
    set: (value: string | null) => {
      if (value === 'Y') {
        model.value.is_forbid = true;
      } else if (value === 'N') {
        model.value.is_forbid = false;
      } else {
        model.value.is_forbid = null;
      }
    }
  });

  type RuleKey = Extract<keyof Api.SystemManage.UserSearchParams, 'email' | 'phone'>;

  const rules = computed<Record<RuleKey, App.Global.FormRule>>(() => {
    const { patternRules } = useFormRules(); // inside computed to make locale reactive

    return {
      email: patternRules.email,
      phone: patternRules.phone
    };
  });

  function resetModel() {
    model.value = {
      page: 1,
      page_size: 10,
      keyword: null,
      gender: null,
      phone: null,
      email: null,
      is_active: null,
      is_forbid: null
    };
  }

  async function reset() {
    await restoreValidation();
    resetModel();
  }

  async function search() {
    await validate();
    emit('search');
  }
</script>

<template>
  <NCard :bordered="false" size="small" class="card-wrapper">
    <NCollapse>
      <NCollapseItem :title="$t('common.search')" name="user-search">
        <NForm ref="formRef" :model="model" :rules="rules" label-placement="left" :label-width="80">
          <NGrid responsive="screen" item-responsive>
            <NFormItemGi span="24 s:12 m:6" :label="$t('common.keyword')" path="keyword" class="pr-24px">
              <NInput v-model:value="model.keyword" :placeholder="$t('page.manage.user.form.keyword')" />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" :label="$t('page.manage.user.email')" path="email" class="pr-24px">
              <NInput v-model:value="model.email" :placeholder="$t('page.manage.user.form.email')" />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" :label="$t('page.manage.user.phone')" path="phone" class="pr-24px">
              <NInput v-model:value="model.phone" :placeholder="$t('page.manage.user.form.phone')" />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" :label="$t('page.manage.user.gender')" path="gender" class="pr-24px">
              <NSelect
                v-model:value="model.gender"
                :placeholder="$t('page.manage.user.form.gender')"
                :options="translateOptions(userGenderOptions)"
                clearable
              />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" :label="$t('page.manage.user.isActive')" path="is_active" class="pr-24px">
              <NSelect
                v-model:value="isActiveComputed"
                :placeholder="$t('page.manage.user.form.isActive')"
                :options="translateOptions(yesOrNoOptions)"
                clearable
              />
            </NFormItemGi>
            <NFormItemGi
              span="24 s:12 m:6"
              :label="$t('page.manage.user.form.isForbid')"
              path="is_forbid"
              class="pr-24px"
            >
              <NSelect
                v-model:value="isForbidComputed"
                :placeholder="$t('page.manage.user.form.isForbid')"
                :options="translateOptions(yesOrNoOptions)"
                clearable
              />
            </NFormItemGi>
            <NFormItemGi span="24 m:12" class="pr-24px">
              <NSpace class="w-full" justify="end">
                <NButton @click="reset">
                  <template #icon>
                    <icon-ic-round-refresh class="text-icon" />
                  </template>
                  {{ $t('common.reset') }}
                </NButton>
                <NButton type="primary" ghost @click="search">
                  <template #icon>
                    <icon-ic-round-search class="text-icon" />
                  </template>
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

<style scoped></style>
