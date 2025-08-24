<script setup lang="ts">
  import { computed } from 'vue';
  import { enableStatusOptions, userGenderOptions } from '@/constants/business';
  import { yesOrNoOptions } from '@/constants/common';
  import { useNaiveForm } from '@/hooks/common/form';
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

  // // 高级搜索展开状态
  // const showAdvancedSearch = ref(false);

  // // 切换高级搜索展开状态
  // async function toggleAdvancedSearch() {
  //   showAdvancedSearch.value = !showAdvancedSearch.value;
  // }

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
      return model.value.is_forbid ? '0' : '1';
    },
    set: (value: string | null) => {
      if (value === '0') {
        model.value.is_forbid = true;
      } else if (value === '1') {
        model.value.is_forbid = false;
      } else {
        model.value.is_forbid = null;
      }
    }
  });

  function resetModel() {
    model.value = {
      page: 1,
      page_size: 10,
      keyword: null,
      contact: null,
      gender: null,
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
  <NCard :bordered="false" size="small" class="min-w-940px w-full card-wrapper">
    <NCollapse class="w-full">
      <NCollapseItem :title="$t('common.search')" name="user-search">
        <NForm ref="formRef" :model="model" label-placement="left" label-align="right" label-width="auto">
          <NGrid responsive="screen" item-responsive>
            <NFormItemGi span="24 s:18 m:18" :show-feedback="false">
              <NGrid responsive="screen" item-responsive>
                <NFormItemGi span="24 s:8 m:8" :label="$t('common.keyword')" path="keyword" class="pr-24px">
                  <NInput
                    v-model:value="model.keyword"
                    :placeholder="$t('page.manage.user.form.keyword')"
                    clearable
                    @clear="search"
                    @keyup.enter="search"
                  />
                </NFormItemGi>

                <NFormItemGi span="24 s:8 m:8" :label="$t('page.manage.user.contact')" path="contact" class="pr-24px">
                  <NInput
                    v-model:value="model.contact"
                    :placeholder="$t('page.manage.user.form.contact')"
                    clearable
                    @keyup.enter="search"
                  />
                </NFormItemGi>

                <NFormItemGi span="24 s:8 m:8" :label="$t('page.manage.user.gender')" path="gender" class="pr-24px">
                  <NSelect
                    v-model:value="model.gender"
                    :placeholder="$t('page.manage.user.form.gender')"
                    :options="translateOptions(userGenderOptions)"
                    clearable
                    @update:value="search"
                  />
                </NFormItemGi>

                <NFormItemGi
                  span="24 s:8 m:8"
                  :label="$t('page.manage.user.isActive')"
                  path="is_active"
                  class="pr-24px"
                >
                  <NSelect
                    v-model:value="isActiveComputed"
                    :placeholder="$t('page.manage.user.form.isActive')"
                    :options="translateOptions(yesOrNoOptions)"
                    clearable
                    @update:value="search"
                  />
                </NFormItemGi>

                <NFormItemGi
                  span="24 s:8 m:8"
                  :label="$t('page.manage.user.form.isForbid')"
                  path="is_forbid"
                  class="pr-24px"
                >
                  <NSelect
                    v-model:value="isForbidComputed"
                    :placeholder="$t('page.manage.user.form.isForbid')"
                    :options="translateOptions(enableStatusOptions)"
                    clearable
                    @clear="search"
                    @update:value="search"
                  />
                </NFormItemGi>
              </NGrid>
            </NFormItemGi>

            <NFormItemGi span="24 s:6 m:6" class="pr-24px">
              <NSpace class="w-full" justify="end">
                <NButton type="default" @click="reset">
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
