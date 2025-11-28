<script setup lang="ts">
import { computed, nextTick, toRaw } from 'vue';
import { jsonClone } from '@sa/utils';
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

const { formRef } = useNaiveForm();

const model = defineModel<Api.SystemManage.UserSearchParams>('model', { required: true });

const defaultModel = jsonClone(toRaw(model.value));

// 添加计算属性来处理 is_active 的类型转换
const isActiveComputed = computed({
  get: () => {
    if (model.value.is_active === null || model.value.is_active === undefined) {
      return null;
    }
    return model.value.is_active ? 'Y' : 'N';
  },
  set: (value: string | null) => {
    if (value === null) {
      model.value.is_active = null;
    } else {
      model.value.is_active = value === 'Y';
    }
  }
});

function resetModel() {
  Object.assign(model.value, defaultModel);
}

async function reset() {
  resetModel();
  await search();
}

async function search() {
  await nextTick();
  emit('search');
}
</script>

<template>
  <NCard :bordered="false" size="small" class="w-full card-wrapper">
    <NCollapse class="w-full" :default-expanded-names="['user-search']">
      <NCollapseItem :title="$t('common.search')" name="user-search">
        <NForm ref="formRef" :model="model" label-placement="left" label-align="right" label-width="auto">
          <NGrid responsive="screen" item-responsive>
            <NFormItemGi span="24 s:18 m:20 l:18 xl:20" :show-feedback="false">
              <NGrid responsive="screen" item-responsive>
                <NFormItemGi span="24 s:12 m:8 l:8 xl:5" :label="$t('common.keyword')" path="keyword" class="pr-24px">
                  <NInput
                    v-model:value="model.keyword"
                    :placeholder="$t('page.system-manage.users.form.keyword')"
                    clearable
                    @clear="search"
                    @keyup.enter="search"
                  />
                </NFormItemGi>

                <NFormItemGi
                  span="0 s:12 m:8 l:8 xl:5"
                  :label="$t('page.system-manage.users.contact')"
                  path="contact"
                  class="pr-24px"
                >
                  <NInput
                    v-model:value="model.contact"
                    :placeholder="$t('page.system-manage.users.form.contact')"
                    clearable
                    @clear="search"
                    @keyup.enter="search"
                  />
                </NFormItemGi>

                <NFormItemGi
                  span="0 s:8 m:8 l:8 xl:4"
                  :label="$t('page.system-manage.users.gender')"
                  path="gender"
                  class="pr-24px"
                >
                  <NSelect
                    v-model:value="model.gender"
                    :placeholder="$t('page.system-manage.users.form.gender')"
                    :options="translateOptions(userGenderOptions)"
                    clearable
                    @update:value="search"
                  />
                </NFormItemGi>

                <NFormItemGi
                  span="0 s:8 m:8 l:8 xl:5"
                  :label="$t('page.system-manage.users.is_active')"
                  path="is_active"
                  class="pr-24px"
                >
                  <NSelect
                    v-model:value="isActiveComputed"
                    :placeholder="$t('page.system-manage.users.form.is_active')"
                    :options="translateOptions(yesOrNoOptions)"
                    clearable
                    @update:value="search"
                  />
                </NFormItemGi>

                <NFormItemGi
                  span="24 s:8 m:8 l:8 xl:5"
                  :label="$t('page.system-manage.users.status')"
                  path="is_forbid"
                  class="pr-24px"
                >
                  <NSelect
                    v-model:value="model.status"
                    :placeholder="$t('page.system-manage.users.form.status')"
                    :options="translateOptions(enableStatusOptions)"
                    clearable
                    @clear="search"
                    @update:value="search"
                  />
                </NFormItemGi>
              </NGrid>
            </NFormItemGi>

            <NFormItemGi span="24 s:6 m:4 l:6 xl:4">
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
