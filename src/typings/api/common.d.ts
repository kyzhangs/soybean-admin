/**
 * Namespace Api
 *
 * All backend api type
 */
declare namespace Api {
  namespace Common {
    /** common params of paginating */
    interface PaginatingCommonParams {
      /** page number */
      page: number;
      /** page size */
      page_size: number;
      /** total count */
      total: number;
    }

    /** common params of paginating query list data */
    interface PaginatingQueryRecord<T = any> extends PaginatingCommonParams {
      rows: T[];
    }

    type BatchOperateType = 'DELETE' | 'ENABLE' | 'DISABLE' | 'RESET_PASSWORD' | 'ADD_WHITELIST' | 'REMOVE_WHITELIST';

    interface BatchOperateParams {
      operate: BatchOperateType;
      ids: number[];
    }

    interface BatchOperateResult {
      success: number[];
      errors: object[];
      pass_rate: number;
      operate: BatchOperateType;
    }

    /** common search params of table */
    type CommonSearchParams = Pick<Common.PaginatingCommonParams, 'page' | 'page_size'>;

    /**
     * enable status
     *
     * - "1": enabled
     * - "2": disabled
     */
    type EnableStatus = '1' | '2';

    /** common record */
    type CommonRecord<T = any> = {
      /** record id */
      id: number;
      /** status */
      status: EnableStatus;
      /** record create time */
      create_time: string;
      /** record update time */
      update_time: string;
    } & CommonType.RecordNullable<{
      /** creator */
      create_by?: string | number;
      /** update user */
      update_by?: string | number;
    }> &
      T;
  }
}
