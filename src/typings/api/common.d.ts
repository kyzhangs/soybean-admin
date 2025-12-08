/**
 * Namespace Api
 *
 * All backend api type
 */
declare namespace Api {
  namespace Common {
    /** common params of paginating */
    interface PaginatingCommonParams {
      /** current page number */
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

    /** common search params of table */
    type PageSearchParams = CommonType.RecordNullable<Pick<Common.PaginatingCommonParams, 'page' | 'page_size'>>;

    /** delete params */
    type DeleteParams = Pick<Common.CommonRecord, 'id'>;

    type BatchOperateType = 'ENABLE' | 'DISABLE' | 'DELETE';

    /** batch operate params */
    type BatchOperateParams = { operate: BatchOperateType; ids: number[] };

    interface BatchError {
      id: number;
      error: string;
    }

    type BatchOperateOut = {
      operate: BatchOperateType;
      success: number[];
      errors: BatchError[];
      pass_rate: number;
    };

    /** batch operate config */
    interface BatchConfig {
      key: BatchOperateType;
      label: string;
      icon?: string;
      needConfirm?: boolean;
      title?: string;
      content?: string;
      type?: NaiveUI.ThemeColor;
      confirmText?: string;
      cancelText?: string;
    }

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
      /** record create time */
      create_time: string;
      /** record update time */
      update_time: string;
      /** record status */
      status: EnableStatus;
    } & T &
      CommonType.RecordNullable<{
        /** record creator */
        create_by: string;
        /** record updater */
        update_by: string;
      }>;
  }
}
