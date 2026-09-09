<script setup lang="tsx">
import { computed, ref } from 'vue';
import { NTag, NTooltip } from 'naive-ui';
import { fetchGetLoginLogPage } from '@/service/api';
import { useAppStore } from '@/store/modules/app';
import { useAuthStore } from '@/store/modules/auth';
import { defaultTransform, useNaivePaginatedTable } from '@/hooks/common/table';
import { $t } from '@/locales';
import { getTableIndex } from '@/utils/common.js';
import { formatDateTime } from '@/utils/datetime';

defineOptions({
  name: 'SystemManageLoginLogs'
});

const appStore = useAppStore();
const authStore = useAuthStore();
const dateRange = ref<[number, number] | null>(null);

const searchParams = ref<Api.SystemManage.LoginLogSearchParams>({
  page: 1,
  page_size: 10,
  keyword: null,
  result: null,
  login_protocol: null,
  device: null,
  ip_address: null,
  start_time: null,
  end_time: null
});

const resultOptions = computed<CommonType.Option<Api.SystemManage.LoginResult>[]>(() => [
  { label: $t('page.system-manage.loginLogs.result.success'), value: 'success' },
  { label: $t('page.system-manage.loginLogs.result.failure'), value: 'failure' }
]);

const protocolOptions = computed<CommonType.Option<Api.UserCenter.LoginProtocol>[]>(() => [
  { label: $t('page.system-manage.loginLogs.protocol.password'), value: 'password' },
  { label: $t('page.system-manage.loginLogs.protocol.cas'), value: 'cas' },
  { label: $t('page.system-manage.loginLogs.protocol.oauth2'), value: 'oauth2' },
  { label: $t('page.system-manage.loginLogs.protocol.oidc'), value: 'oidc' },
  { label: $t('page.system-manage.loginLogs.protocol.webauthn'), value: 'webauthn' }
]);

const deviceOptions = computed<CommonType.Option<Api.UserCenter.DeviceType>[]>(() => [
  { label: $t('page.system-manage.loginLogs.device.pc'), value: 'pc' },
  { label: $t('page.system-manage.loginLogs.device.mobile'), value: 'mobile' },
  { label: $t('page.system-manage.loginLogs.device.tablet'), value: 'tablet' },
  { label: $t('page.system-manage.loginLogs.device.bot'), value: 'bot' },
  { label: $t('page.system-manage.loginLogs.device.unknown'), value: 'unknown' }
]);

const resultLabel = {
  success: 'page.system-manage.loginLogs.result.success',
  failure: 'page.system-manage.loginLogs.result.failure'
} as const;

const protocolLabel = {
  password: 'page.system-manage.loginLogs.protocol.password',
  cas: 'page.system-manage.loginLogs.protocol.cas',
  oauth2: 'page.system-manage.loginLogs.protocol.oauth2',
  oidc: 'page.system-manage.loginLogs.protocol.oidc',
  webauthn: 'page.system-manage.loginLogs.protocol.webauthn'
} as const;

const deviceLabel = {
  pc: 'page.system-manage.loginLogs.device.pc',
  mobile: 'page.system-manage.loginLogs.device.mobile',
  tablet: 'page.system-manage.loginLogs.device.tablet',
  bot: 'page.system-manage.loginLogs.device.bot',
  unknown: 'page.system-manage.loginLogs.device.unknown'
} as const;

function compact(values: Array<string | null | undefined>) {
  return values.filter((value): value is string => Boolean(value)).join(' · ');
}

function getLocation(row: Api.SystemManage.LoginLog) {
  return compact([row.country, row.region, row.city]) || $t('common.noData');
}

function getProtocol(row: Api.SystemManage.LoginLog) {
  if (row.provider_name) return row.provider_name;
  if (!row.login_protocol) return $t('common.noData');
  return $t(protocolLabel[row.login_protocol]);
}

const { columns, columnChecks, data, getData, getDataByPage, loading, mobilePagination } = useNaivePaginatedTable({
  api: () => fetchGetLoginLogPage(searchParams.value),
  transform: response => defaultTransform(response),
  onPaginationParamsChange: params => {
    searchParams.value.page = params.page ?? 1;
    searchParams.value.page_size = params.pageSize ?? 10;
  },
  columns: () => [
    {
      key: 'index',
      title: $t('common.index'),
      align: 'center',
      width: 64,
      render: (_, index) => getTableIndex(index, searchParams.value)
    },
    {
      key: 'username',
      title: $t('page.system-manage.loginLogs.account'),
      width: 100,
      render: row => (
        <div>
          <div>{row.name || $t('common.noData')}</div>
          <div class="text-12px text-gray-500">{row.username || $t('common.noData')}</div>
        </div>
      )
    },
    {
      key: 'login_protocol',
      title: $t('page.system-manage.loginLogs.loginMethod'),
      align: 'center',
      width: 130,
      render: row => getProtocol(row)
    },
    {
      key: 'device',
      title: $t('page.system-manage.loginLogs.device.title'),
      width: 120,
      render: row => (
        <div>
          <div>{compact([row.browser, row.os]) || $t('common.noData')}</div>
          <div class="text-12px text-gray-500">{$t(deviceLabel[row.device])}</div>
        </div>
      )
    },
    {
      key: 'ip_address',
      title: $t('page.system-manage.loginLogs.ipAddress'),
      align: 'center',
      width: 150,
      render: row => row.ip_address || $t('common.noData')
    },
    {
      key: 'location',
      title: $t('page.system-manage.loginLogs.location'),
      width: 80,
      ellipsis: { tooltip: true },
      render: row => getLocation(row)
    },
    {
      key: 'result',
      title: $t('page.system-manage.loginLogs.result.title'),
      align: 'center',
      width: 90,
      render: row => <NTag type={row.result === 'success' ? 'success' : 'error'}>{$t(resultLabel[row.result])}</NTag>
    },
    {
      key: 'failure_code',
      title: $t('page.system-manage.loginLogs.failureCode'),
      align: 'center',
      width: 110,
      render: row => {
        if (row.failure_code === null) return '-';
        const content = `${row.failure_code}`;
        return row.request_id ? (
          <NTooltip>
            {{
              trigger: () => <span>{content}</span>,
              default: () => `${$t('page.system-manage.loginLogs.requestId')}: ${row.request_id}`
            }}
          </NTooltip>
        ) : (
          content
        );
      }
    },
    {
      key: 'create_time',
      title: $t('page.system-manage.loginLogs.loginTime'),
      align: 'center',
      width: 190,
      render: row => formatDateTime(row.create_time, authStore.userInfo.timezone, 'datetime', appStore.locale)
    },
    {
      key: 'logout_time',
      title: $t('page.system-manage.loginLogs.logoutTime'),
      align: 'center',
      width: 190,
      render: row =>
        row.logout_time
          ? formatDateTime(row.logout_time, authStore.userInfo.timezone, 'datetime', appStore.locale)
          : $t('common.noData')
    }
  ]
});

function syncDateRange() {
  const [start, end] = dateRange.value || [];
  searchParams.value.start_time = start ? new Date(start).toISOString() : null;
  searchParams.value.end_time = end ? new Date(end).toISOString() : null;
}

function search() {
  syncDateRange();
  getDataByPage();
}

function reset() {
  searchParams.value.keyword = null;
  searchParams.value.result = null;
  searchParams.value.login_protocol = null;
  searchParams.value.device = null;
  searchParams.value.ip_address = null;
  searchParams.value.start_time = null;
  searchParams.value.end_time = null;
  dateRange.value = null;
  getDataByPage();
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <NCard :bordered="false" size="small" class="w-full card-wrapper">
      <NCollapse class="w-full" :default-expanded-names="['login-log-search']">
        <NCollapseItem :title="$t('common.search')" name="login-log-search">
          <NForm :model="searchParams" label-placement="left" label-align="right" label-width="auto">
            <NGrid responsive="screen" item-responsive>
              <NFormItemGi span="24 s:18 m:20 l:18 xl:20" :show-feedback="false">
                <NGrid responsive="screen" item-responsive>
                  <NFormItemGi
                    span="24 s:12 m:8 l:8 xl:5"
                    :label="$t('page.system-manage.loginLogs.keyword')"
                    path="keyword"
                    class="pr-24px"
                  >
                    <NInput
                      v-model:value="searchParams.keyword"
                      clearable
                      :placeholder="$t('page.system-manage.loginLogs.keywordPlaceholder')"
                      @keyup.enter="search"
                    />
                  </NFormItemGi>
                  <NFormItemGi
                    span="24 s:12 m:8 l:8 xl:5"
                    :label="$t('page.system-manage.loginLogs.result.title')"
                    path="result"
                    class="pr-24px"
                  >
                    <NSelect v-model:value="searchParams.result" clearable :options="resultOptions" />
                  </NFormItemGi>
                  <NFormItemGi
                    span="24 s:12 m:8 l:8 xl:5"
                    :label="$t('page.system-manage.loginLogs.loginMethod')"
                    path="login_protocol"
                    class="pr-24px"
                  >
                    <NSelect v-model:value="searchParams.login_protocol" clearable :options="protocolOptions" />
                  </NFormItemGi>
                  <NFormItemGi
                    span="24 s:12 m:8 l:8 xl:5"
                    :label="$t('page.system-manage.loginLogs.device.title')"
                    path="device"
                    class="pr-24px"
                  >
                    <NSelect v-model:value="searchParams.device" clearable :options="deviceOptions" />
                  </NFormItemGi>
                  <NFormItemGi
                    span="24 s:12 m:8 l:8 xl:5"
                    :label="$t('page.system-manage.loginLogs.ipAddress')"
                    path="ip_address"
                    class="pr-24px"
                  >
                    <NInput v-model:value="searchParams.ip_address" clearable />
                  </NFormItemGi>
                  <NFormItemGi
                    span="24 s:24 m:16 l:8 xl:10"
                    :label="$t('page.system-manage.loginLogs.timeRange')"
                    class="pr-24px"
                  >
                    <NDatePicker v-model:value="dateRange" type="datetimerange" clearable class="w-full" />
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

    <NCard
      :title="$t('page.system-manage.loginLogs.title')"
      :bordered="false"
      size="small"
      class="card-wrapper sm:flex-1-hidden"
    >
      <template #header-extra>
        <TableHeaderOperation v-model:columns="columnChecks" :loading="loading" @refresh="getData">
          <template #default><span class="hidden"></span></template>
        </TableHeaderOperation>
      </template>
      <NDataTable
        :columns="columns"
        :data="data"
        size="small"
        :flex-height="!appStore.isMobile"
        :scroll-x="1264"
        :loading="loading"
        remote
        :row-key="row => row.id"
        :pagination="mobilePagination"
        class="sm:h-full"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
