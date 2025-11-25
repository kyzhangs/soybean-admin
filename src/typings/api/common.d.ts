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
