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
    type CommonSearchParams = Pick<Common.PaginatingCommonParams, 'page' | 'page_size'>;

    /**
     * enable status
     *
     * - "1": enabled
     * - "2": disabled
     */
    type Status = '1' | '2';

    /** common record */
    type CommonRecord<T = any> = {
      /** record id */
      id: string;
      /** record status */
      status: Status;
      /** create time */
      create_time: string;
      /** update time */
      update_time: string;
    } & T;

    interface BatchActionConfig {
      key: string;
      label: string;
      icon?: string;
      /** whether to show a confirm dialog before executing */
      confirm?: boolean;
      confirmMessage?: string;
      /** dialog type for the confirm dialog */
      dialogType?: 'success' | 'warning' | 'error' | 'info';
    }

    type BatchOperateParams = {
      ids: string[];
      data: {
        field: string;
        value: any;
      };
    };
  }
}
