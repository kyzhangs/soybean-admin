/** The global namespace for the app */
declare namespace App {
  /**
   * I18n namespace
   *
   * Locales type
   */
  namespace I18n {
    type RouteKey = import('@elegant-router/types').RouteKey;

    type LangType = 'en-US' | 'zh-CN';

    type LangOption = {
      label: string;
      key: LangType;
    };

    type I18nRouteKey = Exclude<RouteKey, 'root' | 'not-found'>;

    type FormMsg = {
      required: string;
      invalid: string;
    };

    type Schema = {
      system: {
        title: string;
        updateTitle: string;
        updateContent: string;
        updateConfirm: string;
        updateCancel: string;
      };
      common: {
        action: string;
        add: string;
        addSuccess: string;
        backToHome: string;
        batchDelete: string;
        batchOperate: string;
        batchOperateCompleted: string;
        cancel: string;
        close: string;
        check: string;
        expandColumn: string;
        columnSetting: string;
        config: string;
        confirm: string;
        delete: string;
        deleteSuccess: string;
        confirmDelete: string;
        edit: string;
        warning: string;
        error: string;
        index: string;
        keywordSearch: string;
        logout: string;
        logoutConfirm: string;
        lookForward: string;
        modify: string;
        modifySuccess: string;
        noData: string;
        operate: string;
        pleaseCheckValue: string;
        refresh: string;
        reset: string;
        search: string;
        switch: string;
        tip: string;
        trigger: string;
        update: string;
        updateSuccess: string;
        userCenter: string;
        yesOrNo: {
          yes: string;
          no: string;
        };
        keyword: string;
        create_time: string;
        update_time: string;
        enable: string;
        disable: string;
        confirmEnable: string;
        confirmDisable: string;
        enableSuccess: string;
        disableSuccess: string;
        batchEnable: string;
        confirmBatchEnable: string;
        batchDisable: string;
        confirmBatchDisable: string;
      };
      request: {
        logout: string;
        logoutMsg: string;
        logoutWithModal: string;
        logoutWithModalMsg: string;
        refreshToken: string;
        tokenExpired: string;
      };
      theme: {
        themeDrawerTitle: string;
        tabs: {
          appearance: string;
          layout: string;
          general: string;
          preset: string;
        };
        appearance: {
          themeSchema: { title: string } & Record<UnionKey.ThemeScheme, string>;
          grayscale: string;
          colourWeakness: string;
          themeColor: {
            title: string;
            followPrimary: string;
          } & Record<Theme.ThemeColorKey, string>;
          recommendColor: string;
          recommendColorDesc: string;
          themeRadius: {
            title: string;
          };
          preset: {
            title: string;
            apply: string;
            applySuccess: string;
            [key: string]:
              | {
                  name: string;
                  desc: string;
                }
              | string;
          };
        };
        layout: {
          layoutMode: { title: string } & Record<UnionKey.ThemeLayoutMode, string> & {
              [K in `${UnionKey.ThemeLayoutMode}_detail`]: string;
            };
          tab: {
            title: string;
            visible: string;
            cache: string;
            cacheTip: string;
            height: string;
            mode: { title: string } & Record<UnionKey.ThemeTabMode, string>;
            closeByMiddleClick: string;
            closeByMiddleClickTip: string;
          };
          header: {
            title: string;
            height: string;
            breadcrumb: {
              visible: string;
              showIcon: string;
            };
          };
          sider: {
            title: string;
            inverted: string;
            width: string;
            collapsedWidth: string;
            mixWidth: string;
            mixCollapsedWidth: string;
            mixChildMenuWidth: string;
            autoSelectFirstMenu: string;
            autoSelectFirstMenuTip: string;
          };
          footer: {
            title: string;
            visible: string;
            fixed: string;
            height: string;
            right: string;
          };
          content: {
            title: string;
            scrollMode: { title: string; tip: string } & Record<UnionKey.ThemeScrollMode, string>;
            page: {
              animate: string;
              mode: { title: string } & Record<UnionKey.ThemePageAnimateMode, string>;
            };
            fixedHeaderAndTab: string;
          };
        };
        general: {
          title: string;
          watermark: {
            title: string;
            visible: string;
            text: string;
            enableUserName: string;
            enableTime: string;
            timeFormat: string;
          };
          multilingual: {
            title: string;
            visible: string;
          };
          globalSearch: {
            title: string;
            visible: string;
          };
        };
        configOperation: {
          copyConfig: string;
          copySuccessMsg: string;
          resetConfig: string;
          resetSuccessMsg: string;
        };
      };
      route: Record<I18nRouteKey, string>;
      page: {
        login: {
          common: {
            loginOrRegister: string;
            usernamePlaceholder: string;
            phonePlaceholder: string;
            codePlaceholder: string;
            passwordPlaceholder: string;
            confirmPasswordPlaceholder: string;
            codeLogin: string;
            confirm: string;
            back: string;
            validateSuccess: string;
            loginSuccess: string;
            welcomeBack: string;
          };
          pwdLogin: {
            title: string;
            rememberMe: string;
            forgetPassword: string;
            register: string;
            otherAccountLogin: string;
            otherLoginMode: string;
            superAdmin: string;
            admin: string;
            user: string;
          };
          codeLogin: {
            title: string;
            getCode: string;
            reGetCode: string;
            sendCodeSuccess: string;
            imageCodePlaceholder: string;
          };
          register: {
            title: string;
            agreement: string;
            protocol: string;
            policy: string;
          };
          resetPwd: {
            title: string;
          };
          bindWeChat: {
            title: string;
          };
        };
        about: {
          title: string;
          introduction: string;
          projectInfo: {
            title: string;
            version: string;
            latestBuildTime: string;
            githubLink: string;
            previewLink: string;
          };
          prdDep: string;
          devDep: string;
        };
        home: {
          branchDesc: string;
          greeting: string;
          weatherDesc: string;
          projectCount: string;
          todo: string;
          message: string;
          downloadCount: string;
          registerCount: string;
          schedule: string;
          study: string;
          work: string;
          rest: string;
          entertainment: string;
          visitCount: string;
          turnover: string;
          dealCount: string;
          projectNews: {
            title: string;
            moreNews: string;
            desc1: string;
            desc2: string;
            desc3: string;
            desc4: string;
            desc5: string;
          };
          creativity: string;
        };
        function: {
          tab: {
            tabOperate: {
              title: string;
              addTab: string;
              addTabDesc: string;
              closeTab: string;
              closeCurrentTab: string;
              closeAboutTab: string;
              addMultiTab: string;
              addMultiTabDesc1: string;
              addMultiTabDesc2: string;
            };
            tabTitle: {
              title: string;
              changeTitle: string;
              change: string;
              resetTitle: string;
              reset: string;
            };
          };
          multiTab: {
            routeParam: string;
            backTab: string;
          };
          toggleAuth: {
            toggleAccount: string;
            authHook: string;
            superAdminVisible: string;
            adminVisible: string;
            adminOrUserVisible: string;
          };
          request: {
            repeatedErrorOccurOnce: string;
            repeatedError: string;
            repeatedErrorMsg1: string;
            repeatedErrorMsg2: string;
          };
        };
        alova: {
          scenes: {
            captchaSend: string;
            autoRequest: string;
            visibilityRequestTips: string;
            pollingRequestTips: string;
            networkRequestTips: string;
            refreshTime: string;
            startRequest: string;
            stopRequest: string;
            requestCrossComponent: string;
            triggerAllRequest: string;
          };
        };
        proNaive: {
          form: {
            basic: {
              title: string;
              appName: string;
              appStatus: string;
              createTime: string;
              responseDate: string;
              specificationInfo: string;
              specificate: string;
              specificationName: string;
              specificationValue: string;
              specificationColorRed: string;
              specificationColorOrange: string;
              addSpecificateItem: string;
              fillValue: string;
              reset: string;
              submit: string;
              add: string;
              delete: string;
              color: string;
              normal: string;
              anomaly: string;
            };
            query: {
              title1: string;
              title2: string;
              appName: string;
              appStatus: string;
              createTime: string;
              responseDate: string;
              endDate: string;
              field: string;
            };
            step: {
              title: string;
              step1: {
                title: string;
                field: string;
                nextStep: string;
              };
              step2: {
                title: string;
                field: string;
                prevStep: string;
                submit: string;
              };
            };
          };
          table: {
            remote: {
              filterCondition: string;
              name: string;
              createTime: string;
              responseTime: string;
              title: string;
              replicableText: string;
              tags: string;
              dateFormatting: string;
              image: string;
            };
            rowEdit: {
              title: string;
              reset: string;
              submit: string;
              edit: string;
              delete: string;
              save: string;
              task: string;
              score: string;
              time: string;
              name: string;
              action: string;
            };
          };
        };
        'system-manage': {
          common: {
            status: {
              enable: string;
              disable: string;
            };
          };
          users: {
            title: string;
            add: string;
            edit: string;
            genderType: {
              male: string;
              female: string;
              unknown: string;
            };
            username: string;
            gender: string;
            name: string;
            phone: string;
            email: string;
            is_active: string;
            active_time: string;
            last_login: string;
            status: string;
            roles: string;
            contact: string;
            form: {
              username: string;
              gender: string;
              name: string;
              phone: string;
              email: string;
              is_active: string;
              status: string;
              roles: string;
              keyword: string;
              contact: string;
            };
          };
          roles: {
            title: string;
            add: string;
            edit: string;
            authSettings: string;
            menuAuth: string;
            buttonAuth: string;
            name: string;
            code: string;
            status: string;
            home: string;
            description: string;
            form: {
              keyword: string;
              name: string;
              code: string;
              home: string;
              status: string;
              description: string;
            };
          };
          apis: {
            title: string;
            syncApi: string;
            confirmSyncApi: string;
            apiMethod: {
              get: string;
              post: string;
              put: string;
              patch: string;
              delete: string;
            };
            name: string;
            path: string;
            method: string;
            summary: string;
            operation_id: string;
            tags: string;
            description: string;
            status: string;
            form: {
              keyword: string;
              tag: string;
              method: string;
              status: string;
            };
          };
          menus: {
            home: string;
            title: string;
            id: string;
            parentId: string;
            menuType: string;
            menuName: string;
            routeName: string;
            routePath: string;
            pathParam: string;
            layout: string;
            page: string;
            i18nKey: string;
            icon: string;
            localIcon: string;
            iconTypeTitle: string;
            order: string;
            constant: string;
            keepAlive: string;
            href: string;
            hideInMenu: string;
            activeMenu: string;
            multiTab: string;
            fixedIndexInTab: string;
            query: string;
            button: string;
            buttonCode: string;
            buttonDesc: string;
            menuStatus: string;
            form: {
              home: string;
              menuType: string;
              menuName: string;
              routeName: string;
              routePath: string;
              pathParam: string;
              layout: string;
              page: string;
              i18nKey: string;
              icon: string;
              localIcon: string;
              order: string;
              keepAlive: string;
              href: string;
              hideInMenu: string;
              activeMenu: string;
              multiTab: string;
              fixedInTab: string;
              fixedIndexInTab: string;
              queryKey: string;
              queryValue: string;
              button: string;
              buttonCode: string;
              buttonDesc: string;
              menuStatus: string;
            };
            addMenu: string;
            editMenu: string;
            addChildMenu: string;
            type: {
              directory: string;
              menu: string;
            };
            iconType: {
              iconify: string;
              local: string;
            };
          };
        };
      };
      form: {
        required: string;
        username: FormMsg;
        phone: FormMsg;
        pwd: FormMsg;
        confirmPwd: FormMsg;
        code: FormMsg;
        email: FormMsg;
      };
      dropdown: Record<Global.DropdownKey, string>;
      icon: {
        themeConfig: string;
        themeSchema: string;
        lang: string;
        fullscreen: string;
        fullscreenExit: string;
        reload: string;
        collapse: string;
        expand: string;
        pin: string;
        unpin: string;
      };
      datatable: {
        itemCount: string;
      };
    };

    type GetI18nKey<T extends Record<string, unknown>, K extends keyof T = keyof T> = K extends string
      ? T[K] extends Record<string, unknown>
        ? `${K}.${GetI18nKey<T[K]>}`
        : K
      : never;

    type I18nKey = GetI18nKey<Schema>;

    type TranslateOptions<Locales extends string> = import('vue-i18n').TranslateOptions<Locales>;

    interface $T {
      (key: I18nKey): string;
      (key: I18nKey, plural: number, options?: TranslateOptions<LangType>): string;
      (key: I18nKey, defaultMsg: string, options?: TranslateOptions<I18nKey>): string;
      (key: I18nKey, list: unknown[], options?: TranslateOptions<I18nKey>): string;
      (key: I18nKey, list: unknown[], plural: number): string;
      (key: I18nKey, list: unknown[], defaultMsg: string): string;
      (key: I18nKey, named: Record<string, unknown>, options?: TranslateOptions<LangType>): string;
      (key: I18nKey, named: Record<string, unknown>, plural: number): string;
      (key: I18nKey, named: Record<string, unknown>, defaultMsg: string): string;
    }
  }
}
