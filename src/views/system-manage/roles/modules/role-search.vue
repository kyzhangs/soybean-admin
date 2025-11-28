<script setup lang="ts">
import { nextTick, toRaw } from 'vue';
import { jsonClone } from '@sa/utils';
import { enableStatusOptions } from '@/constants/business';
import { translateOptions } from '@/utils/common';
import { $t } from '@/locales';

defineOptions({
  name: 'RoleSearch'
});

interface Emits {
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();

const model = defineModel<Api.SystemManage.RoleSearchParams>('model', { required: true });

const defaultModel = jsonClone(toRaw(model.value));

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
  <NCard :bordered="false" size="small" class="card-wrapper">
    <NCollapse :default-expanded-names="['role-search']">
      <NCollapseItem :title="$t('common.search')" name="role-search">
        <NForm :model="model" label-placement="left" :label-width="80">
          <NGrid responsive="screen" item-responsive>
            <NFormItemGi span="24 s:12 m:6" :label="$t('common.keyword')" path="keyword" class="pr-24px">
              <NInput
                v-model:value="model.keyword"
                :placeholder="$t('page.system-manage.roles.form.keyword')"
                clearable
                @clear="search"
                @keyup.enter="search"
              />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" :label="$t('page.system-manage.roles.code')" path="code" class="pr-24px">
              <NInput
                v-model:value="model.code"
                :placeholder="$t('page.system-manage.roles.form.code')"
                clearable
                @clear="search"
                @keyup.enter="search"
              />
            </NFormItemGi>
            <NFormItemGi
              span="24 s:12 m:6"
              :label="$t('page.system-manage.roles.status')"
              path="status"
              class="pr-24px"
            >
              <NSelect
                v-model:value="model.status"
                :placeholder="$t('page.system-manage.roles.form.status')"
                :options="translateOptions(enableStatusOptions)"
                clearable
                @clear="search"
                @update:value="search"
              />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6">
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
