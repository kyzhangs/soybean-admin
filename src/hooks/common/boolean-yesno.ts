import type { ComputedRef, Ref } from 'vue';
import { computed } from 'vue';

/**
 * 将 model 中 boolean | null 字段与 NSelect 的 'Y' | 'N' | null 双向转换
 *
 * @example
 * ```ts
 * const isActiveComputed = useBooleanYesNoComputed(model, 'is_active');
 * ```
 */
export function useBooleanYesNoComputed<T extends Record<string, unknown>>(
  model: Ref<T>,
  key: string
): ComputedRef<string | null> {
  return computed({
    get: () => {
      const val = model.value[key] as boolean | null | undefined;
      if (val === null || val === undefined) {
        return null;
      }
      return val ? 'Y' : 'N';
    },
    set: (value: string | null) => {
      (model.value as Record<string, boolean | null>)[key] = value === null ? null : value === 'Y';
    }
  });
}
