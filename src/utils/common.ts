import { $t } from '@/locales';

/**
 * Transform record to option
 *
 * @example
 *   ```ts
 *   const record = {
 *     key1: 'label1',
 *     key2: 'label2'
 *   };
 *   const options = transformRecordToOption(record);
 *   // [
 *   //   { value: 'key1', label: 'label1' },
 *   //   { value: 'key2', label: 'label2' }
 *   // ]
 *   ```;
 *
 * @param record
 */
export function transformRecordToOption<T extends Record<string, string>>(record: T) {
  return Object.entries(record).map(([value, label]) => ({
    value,
    label
  })) as CommonType.Option<keyof T, T[keyof T]>[];
}

/**
 * Transform option list to record
 *
 * @example
 *   ```ts
 *   const options = [
 *     { value: 'key1', label: 'label1' },
 *     { value: 'key2', label: 'label2' }
 *   ];
 *   const record = transformOptionToRecord(options);
 *   // {
 *   //   key1: 'label1',
 *   //   key2: 'label2'
 *   // }
 *   ```
 *
 * @param options
 */
export function transformOptionToRecord(options: CommonType.Option<string, string>[]) {
  return options.reduce<Record<string, string>>((record, option) => {
    if (option.value !== undefined && option.label !== undefined) {
      record[String(option.value)] = option.label;
    }
    return record;
  }, {});
}

/**
 * Translate options
 *
 * @param options
 */
export function translateOptions(options: CommonType.Option<string, App.I18n.I18nKey>[]) {
  return options.map(option => ({
    ...option,
    label: $t(option.label)
  }));
}

/**
 * Toggle html class
 *
 * @param className
 */
export function toggleHtmlClass(className: string) {
  function add() {
    document.documentElement.classList.add(className);
  }

  function remove() {
    document.documentElement.classList.remove(className);
  }

  return {
    add,
    remove
  };
}

/**
 * 计算表格序号
 *
 * @example
 *   ```ts
 *   // 简单序号（从1开始）
 *   render: (_, index) => getTableIndex(index)
 *   // 返回: 1, 2, 3, ...
 *   ```
 *
 * @example
 *   ```ts
 *   // 分页序号（根据页码计算）
 *   const searchParams = reactive({ page: 2, page_size: 10 });
 *   render: (_, index) => getTableIndex(index, searchParams)
 *   // 第2页返回: 11, 12, 13, ...
 *   ```
 *
 * @param index 当前行在页面中的索引（从0开始）
 * @param searchParams 可选的搜索参数对象，包含 page 和 page_size 字段
 * @returns 计算后的序号
 */
export function getTableIndex(
  index: number,
  searchParams?: { page?: number | null; page_size?: number | null }
): number {
  // 如果没有传入搜索参数，返回简单序号
  if (!searchParams) {
    return index + 1;
  }

  // 从搜索参数中提取分页信息并计算
  const page = searchParams.page ?? 1;
  const pageSize = searchParams.page_size ?? 10;

  return index + 1 + (page - 1) * pageSize;
}
