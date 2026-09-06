const local: App.I18n.Schema = {
  system: {
    title: 'Manage System',
    updateTitle: 'System Version Update Notification',
    updateContent: 'A new version of the system has been detected. Do you want to refresh the page immediately?',
    updateConfirm: 'Refresh immediately',
    updateCancel: 'Later'
  },
  common: {
    action: 'Action',
    add: 'Add',
    addSuccess: 'Add Success',
    backToHome: 'Back to home',
    cancel: 'Cancel',
    close: 'Close',
    check: 'Check',
    selectAll: 'Select All',
    expandColumn: 'Expand Column',
    columnSetting: 'Column Setting',
    config: 'Config',
    confirm: 'Confirm',
    delete: 'Delete',
    deleteSuccess: 'Delete Success',
    confirmDelete: 'Are you sure you want to delete?',
    edit: 'Edit',
    warning: 'Warning',
    error: 'Error',
    index: 'Index',
    keywordSearch: 'Please enter keyword',
    logout: 'Logout',
    logoutConfirm: 'Are you sure you want to log out?',
    lookForward: 'Coming soon',
    modify: 'Modify',
    modifySuccess: 'Modify Success',
    noData: 'No Data',
    operate: 'Operate',
    pleaseCheckValue: 'Please check whether the value is valid',
    refresh: 'Refresh',
    reset: 'Reset',
    search: 'Search',
    switch: 'Switch',
    tip: 'Tip',
    trigger: 'Trigger',
    update: 'Update',
    updateSuccess: 'Update Success',
    userCenter: 'User Center',
    yesOrNo: {
      yes: 'Yes',
      no: 'No'
    },
    keyword: 'keyword',
    create_time: 'create_time',
    update_time: 'update_time',
    enable: 'Enable',
    disable: 'Disable',
    confirmEnable: 'Are you sure you want to enable?',
    confirmDisable: 'Are you sure you want to disable?',
    enableSuccess: 'Enable Success',
    disableSuccess: 'Disable Success',
    batchOperation: 'Batch Operation',
    confirmBatchOperation: 'Are you sure you want to batch operation?',
    batchOperationSuccess: 'Batch operation success',
    batchEnable: 'Batch Enable',
    confirmBatchEnable: 'Are you sure you want to batch enable?',
    batchEnableSuccess: 'Batch enable success',
    batchDisable: 'Batch Disable',
    confirmBatchDisable: 'Are you sure you want to batch diable?',
    batchDisableSuccess: 'batch disable success',
    batchDelete: 'Batch Delete',
    confirmBatchDelete: 'Are you sure you want to batch delete?',
    batchDeleteSuccess: 'Batch delete success'
  },
  request: {
    logout: 'Logout user after request failed',
    logoutMsg: 'User status is invalid, please log in again',
    logoutWithModal: 'Pop up modal after request failed and then log out user',
    logoutWithModalMsg: 'User status is invalid, please log in again',
    refreshToken: 'The requested token has expired, refresh the token',
    tokenExpired: 'The requested token has expired'
  },
  theme: {
    themeDrawerTitle: 'Theme Configuration',
    tabs: {
      appearance: 'Appearance',
      layout: 'Layout',
      general: 'General',
      preset: 'Preset'
    },
    appearance: {
      themeSchema: {
        title: 'Theme Schema',
        light: 'Light',
        dark: 'Dark',
        auto: 'Follow System'
      },
      grayscale: 'Grayscale',
      colourWeakness: 'Colour Weakness',
      themeColor: {
        title: 'Theme Color',
        primary: 'Primary',
        info: 'Info',
        success: 'Success',
        warning: 'Warning',
        error: 'Error',
        followPrimary: 'Follow Primary'
      },
      themeRadius: {
        title: 'Theme Radius'
      },
      recommendColor: 'Apply Recommended Color Algorithm',
      recommendColorDesc: 'The recommended color algorithm refers to',
      preset: {
        title: 'Theme Presets',
        apply: 'Apply',
        applySuccess: 'Preset applied successfully',
        default: {
          name: 'Default Preset',
          desc: 'Default theme preset with balanced settings'
        },
        pixel: {
          name: 'Pixel Art',
          desc: 'A retro theme with hard borders, hard shadows and bold 8-bit colors'
        },
        comic: {
          name: 'Comic Style',
          desc: 'A comic-book theme with heavy ink lines, halftone dots and punchy colors'
        },
        handDrawnDoodle: {
          name: 'Hand-Drawn Doodle',
          desc: 'A warm creative theme with notebook paper, sketchy dashed lines and marker colors'
        },
        cyberAnime: {
          name: 'Cyber Anime',
          desc: 'A futuristic anime theme with mecha HUD frames, holographic scan lines and layered neon glows'
        },
        neumorphism: {
          name: 'Neumorphism',
          desc: 'A soft tactile theme with tonal surfaces and paired light and dark shadows'
        }
      }
    },
    layout: {
      layoutMode: {
        title: 'Layout Mode',
        vertical: 'Vertical Mode',
        horizontal: 'Horizontal Mode',
        'vertical-mix': 'Vertical Mix Mode',
        'vertical-hybrid-header-first': 'Left Hybrid Header-First',
        'top-hybrid-sidebar-first': 'Top-Hybrid Sidebar-First',
        'top-hybrid-header-first': 'Top-Hybrid Header-First',
        vertical_detail: 'Vertical menu layout, with the menu on the left and content on the right.',
        'vertical-mix_detail':
          'Vertical mix-menu layout, with the primary menu on the dark left side and the secondary menu on the lighter left side.',
        'vertical-hybrid-header-first_detail':
          'Left hybrid layout, with the primary menu at the top, the secondary menu on the dark left side, and the tertiary menu on the lighter left side.',
        horizontal_detail: 'Horizontal menu layout, with the menu at the top and content below.',
        'top-hybrid-sidebar-first_detail':
          'Top hybrid layout, with the primary menu on the left and the secondary menu at the top.',
        'top-hybrid-header-first_detail':
          'Top hybrid layout, with the primary menu at the top and the secondary menu on the left.'
      },
      tab: {
        title: 'Tab Settings',
        visible: 'Tab Visible',
        cache: 'Tag Bar Info Cache',
        cacheTip: 'Keep the tab bar information after leaving the page',
        height: 'Tab Height',
        mode: {
          title: 'Tab Mode',
          slider: 'Slider',
          chrome: 'Chrome',
          button: 'Button'
        },
        closeByMiddleClick: 'Close Tab by Middle Click',
        closeByMiddleClickTip: 'Enable closing tabs by clicking with the middle mouse button'
      },
      header: {
        title: 'Header Settings',
        height: 'Header Height',
        breadcrumb: {
          visible: 'Breadcrumb Visible',
          showIcon: 'Breadcrumb Icon Visible'
        }
      },
      sider: {
        title: 'Sider Settings',
        inverted: 'Dark Sider',
        width: 'Sider Width',
        collapsedWidth: 'Sider Collapsed Width',
        mixWidth: 'Mix Sider Width',
        mixCollapsedWidth: 'Mix Sider Collapse Width',
        mixChildMenuWidth: 'Mix Child Menu Width',
        autoSelectFirstMenu: 'Auto Select First Submenu',
        autoSelectFirstMenuTip:
          'When a first-level menu is clicked, the first submenu is automatically selected and navigated to the deepest level'
      },
      footer: {
        title: 'Footer Settings',
        visible: 'Footer Visible',
        fixed: 'Fixed Footer',
        height: 'Footer Height',
        right: 'Right Footer'
      },
      content: {
        title: 'Content Area Settings',
        scrollMode: {
          title: 'Scroll Mode',
          tip: 'The theme scroll only scrolls the main part, the outer scroll can carry the header and footer together',
          wrapper: 'Wrapper',
          content: 'Content'
        },
        page: {
          animate: 'Page Animate',
          mode: {
            title: 'Page Animate Mode',
            fade: 'Fade',
            'fade-slide': 'Slide',
            'fade-bottom': 'Fade Zoom',
            'fade-scale': 'Fade Scale',
            'zoom-fade': 'Zoom Fade',
            'zoom-out': 'Zoom Out',
            none: 'None'
          }
        },
        fixedHeaderAndTab: 'Fixed Header And Tab'
      }
    },
    general: {
      title: 'General Settings',
      watermark: {
        title: 'Watermark Settings',
        visible: 'Watermark Full Screen Visible',
        text: 'Custom Watermark Text',
        enableUserName: 'Enable User Name Watermark',
        enableTime: 'Show Current Time',
        timeFormat: 'Time Format'
      },
      multilingual: {
        title: 'Multilingual Settings',
        visible: 'Display multilingual button'
      },
      globalSearch: {
        title: 'Global Search Settings',
        visible: 'Display GlobalSearch button'
      }
    },
    configOperation: {
      copyConfig: 'Copy Config',
      copySuccessMsg: 'Copy Success, Please replace the variable "themeSettings" in "src/theme/settings.ts"',
      resetConfig: 'Reset Config',
      resetSuccessMsg: 'Reset Success'
    }
  },
  route: {
    login: 'Login',
    403: 'No Permission',
    404: 'Page Not Found',
    500: 'Server Error',
    'iframe-page': 'Iframe',
    home: 'Home',
    document: 'Document',
    document_api: 'Api Document',
    document_project: 'Project Document',
    'document_project-link': 'Project Document(External Link)',
    document_video: 'Video Tutorial',
    document_vue: 'Vue Document',
    document_vite: 'Vite Document',
    document_unocss: 'UnoCSS Document',
    document_naive: 'Naive UI Document',
    'document_pro-naive': 'Pro Naive UI Document',
    document_antd: 'Ant Design Vue Document',
    document_alova: 'Alova Document',
    'user-center': 'User Center',
    about: 'About',
    function: 'System Function',
    alova: 'Alova Example',
    alova_request: 'Alova Request',
    alova_scenes: 'Scenario Request',
    'pro-naive': 'Pro Naive Example',
    'pro-naive_form': 'Form',
    'pro-naive_form_basic': 'Basic Form',
    'pro-naive_form_query': 'Query Form',
    'pro-naive_form_step': 'Step Form',
    'pro-naive_table': 'Table',
    'pro-naive_table_remote': 'Remote',
    'pro-naive_table_row-edit': 'Row Edit',
    function_tab: 'Tab',
    'function_multi-tab': 'Multi Tab',
    'function_hide-child': 'Hide Child',
    'function_hide-child_one': 'Hide Child',
    'function_hide-child_two': 'Two',
    'function_hide-child_three': 'Three',
    function_request: 'Request',
    'function_toggle-auth': 'Toggle Auth',
    'function_super-page': 'Super Admin Visible',
    'system-manage': 'System Manage',
    'system-manage_users': 'Users Manage',
    'system-manage_user-detail': 'User Detail',
    'system-manage_roles': 'Roles Manage',
    'system-manage_menus': 'Menus Manage',
    authx: 'Authentication',
    'system-manage_apis': 'APIs Manage',
    'system-manage_buttons': 'Buttons Manage',
    'multi-menu': 'Multi Menu',
    'multi-menu_first': 'Menu One',
    'multi-menu_first_child': 'Menu One Child',
    'multi-menu_second': 'Menu Two',
    'multi-menu_second_child': 'Menu Two Child',
    'multi-menu_second_child_home': 'Menu Two Child Home',
    exception: 'Exception',
    exception_403: '403',
    exception_404: '404',
    exception_500: '500',
    plugin: 'Plugin',
    plugin_copy: 'Copy',
    plugin_charts: 'Charts',
    plugin_charts_echarts: 'ECharts',
    plugin_charts_antv: 'AntV',
    plugin_charts_vchart: 'VChart',
    plugin_editor: 'Editor',
    plugin_editor_quill: 'Quill',
    plugin_editor_markdown: 'Markdown',
    plugin_icon: 'Icon',
    plugin_map: 'Map',
    plugin_print: 'Print',
    plugin_swiper: 'Swiper',
    plugin_video: 'Video',
    plugin_barcode: 'Barcode',
    plugin_pinyin: 'pinyin',
    plugin_excel: 'Excel',
    plugin_pdf: 'PDF preview',
    plugin_gantt: 'Gantt Chart',
    plugin_gantt_dhtmlx: 'dhtmlxGantt',
    plugin_gantt_vtable: 'VTableGantt',
    plugin_typeit: 'Typeit',
    plugin_tables: 'Tables',
    plugin_tables_vtable: 'VTable'
  },
  page: {
    login: {
      common: {
        loginOrRegister: 'Login / Register',
        usernamePlaceholder: 'Please enter user name',
        phonePlaceholder: 'Please enter phone number',
        codePlaceholder: 'Please enter verification code',
        passwordPlaceholder: 'Please enter password',
        confirmPasswordPlaceholder: 'Please enter password again',
        codeLogin: 'Verification code login',
        confirm: 'Confirm',
        back: 'Back',
        validateSuccess: 'Verification passed',
        loginSuccess: 'Login successfully',
        welcomeBack: 'Welcome back, {username} !'
      },
      pwdLogin: {
        title: 'Password Login',
        rememberMe: 'Remember me',
        forgetPassword: 'Forget password?',
        register: 'Register',
        otherAccountLogin: 'Other Account Login',
        otherLoginMode: 'Other Login Mode',
        superAdmin: 'Super Admin',
        admin: 'Admin',
        user: 'User'
      },
      passkey: {
        title: 'Passkey Login',
        accountTab: 'Account Login',
        biometricTab: 'Biometrics',
        login: 'Click to start biometric login',
        unsupported: 'Passkeys are unavailable in this browser or context. Use HTTPS or switch to password login.',
        failed: 'Passkey verification failed. Please try again.'
      },
      cas: {
        login: 'Single Sign-On',
        disabled: 'Single sign-on is not enabled',
        callbackTitle: 'Single Sign-On',
        exchanging: 'Completing single sign-on…',
        failed: 'The single sign-on ticket is invalid or expired. Please sign in again.',
        identityNotBound: 'Single sign-on succeeded, but this identity is not linked to a local account.',
        back: 'Back to login',
        globalLogout: 'Also sign out of single sign-on and connected systems?'
      },
      callback: {
        exchanging: 'Completing authentication…',
        failed: 'Authentication failed or the login credential has expired. Please sign in again.',
        back: 'Back to Login',
        error: {
          accountInactive: 'The account has not been activated',
          accountDeleted: 'The account has been deleted. Contact the administrator.',
          accountDisabled: 'The account has been disabled. Contact the administrator.',
          casDisabled: 'Single sign-on is not enabled',
          casFlowInvalid: 'The single sign-on flow is invalid or expired',
          casTicketMissing: 'The single sign-on ticket is missing',
          casUnavailable: 'The single sign-on service is temporarily unavailable',
          casTicketValidationFailed: 'Failed to validate the single sign-on ticket',
          casResponseInvalid: 'The single sign-on validation response is invalid',
          casSubjectMissing: 'Single sign-on did not return a stable identity',
          casIdentityNotBound: 'The single sign-on identity is not linked to a local account',
          casTicketInvalid: 'The single sign-on ticket is invalid or expired',
          casLogoutInvalid: 'The single sign-on logout notification is invalid',
          casRateLimited: 'Too many single sign-on requests. Please try again later.',
          providerNotFound: 'The authentication provider does not exist',
          providerDisabled: 'The authentication provider is disabled',
          providerConfigInvalid: 'The authentication provider configuration is invalid',
          authFlowInvalid: 'The authentication flow is invalid or expired',
          authRateLimited: 'Too many authentication requests. Please try again later.',
          authTicketInvalid: 'The authentication ticket is invalid or expired',
          externalIdentityNotBound: 'The external identity is not linked to a local account',
          providerCallbackInvalid: 'The authentication provider callback is invalid',
          providerUnavailable: 'The authentication provider is temporarily unavailable',
          externalAccountBoundElsewhere: 'This external account is linked to another user',
          providerAlreadyBound: 'The current user has already linked this authentication provider'
        }
      },
      twoFactor: {
        title: '2FA Verification',
        help: 'Enter the 6-digit code from your authenticator app, or switch to a one-time recovery code',
        codePlaceholder: 'Enter verification or recovery code',
        useRecoveryCode: 'Use a recovery code',
        useAuthenticatorCode: 'Use an authenticator code'
      },
      codeLogin: {
        title: 'Verification Code Login',
        getCode: 'Get verification code',
        reGetCode: 'Reacquire after {time}s',
        sendCodeSuccess: 'Verification code sent successfully',
        imageCodePlaceholder: 'Please enter image verification code'
      },
      register: {
        title: 'Register',
        agreement: 'I have read and agree to',
        protocol: '《User Agreement》',
        policy: '《Privacy Policy》'
      },
      resetPwd: {
        title: 'Reset Password'
      },
      bindWeChat: {
        title: 'Bind WeChat'
      }
    },
    about: {
      title: 'About',
      introduction: `SoybeanAdmin is an elegant and powerful admin template, based on the latest front-end technology stack, including Vue3, Vite7, TypeScript, Pinia and UnoCSS. It has built-in rich theme configuration and components, strict code specifications, and an automated file routing system. In addition, it also uses the online mock data solution based on ApiFox. SoybeanAdmin provides you with a one-stop admin solution, no additional configuration, and out of the box. It is also a best practice for learning cutting-edge technologies quickly.`,
      projectInfo: {
        title: 'Project Info',
        version: 'Version',
        latestBuildTime: 'Latest Build Time',
        githubLink: 'Github Link',
        previewLink: 'Preview Link'
      },
      prdDep: 'Production Dependency',
      devDep: 'Development Dependency'
    },
    home: {
      branchDesc:
        'For the convenience of everyone in developing and updating the merge, we have streamlined the code of the main branch, only retaining the homepage menu, and the rest of the content has been moved to the example branch for maintenance. The preview address displays the content of the example branch.',
      greeting: 'Good morning, {username}, today is another day full of vitality!',
      weatherDesc: 'Today is cloudy to clear, 20℃ - 25℃!',
      projectCount: 'Project Count',
      todo: 'Todo',
      message: 'Message',
      downloadCount: 'Download Count',
      registerCount: 'Register Count',
      schedule: 'Work and rest Schedule',
      study: 'Study',
      work: 'Work',
      rest: 'Rest',
      entertainment: 'Entertainment',
      visitCount: 'Visit Count',
      turnover: 'Turnover',
      dealCount: 'Deal Count',
      projectNews: {
        title: 'Project News',
        moreNews: 'More News',
        desc1: 'Soybean created the open source project soybean-admin on May 28, 2021!',
        desc2: 'Yanbowe submitted a bug to soybean-admin, the multi-tab bar will not adapt.',
        desc3: 'Soybean is ready to do sufficient preparation for the release of soybean-admin!',
        desc4: 'Soybean is busy writing project documentation for soybean-admin!',
        desc5: 'Soybean just wrote some of the workbench pages casually, and it was enough to see!'
      },
      creativity: 'Creativity'
    },
    function: {
      tab: {
        tabOperate: {
          title: 'Tab Operation',
          addTab: 'Add Tab',
          addTabDesc: 'To about page',
          closeTab: 'Close Tab',
          closeCurrentTab: 'Close Current Tab',
          closeAboutTab: 'Close "About" Tab',
          addMultiTab: 'Add Multi Tab',
          addMultiTabDesc1: 'To MultiTab page',
          addMultiTabDesc2: 'To MultiTab page(with query params)'
        },
        tabTitle: {
          title: 'Tab Title',
          changeTitle: 'Change Title',
          change: 'Change',
          resetTitle: 'Reset Title',
          reset: 'Reset'
        }
      },
      multiTab: {
        routeParam: 'Route Param',
        backTab: 'Back function_tab'
      },
      toggleAuth: {
        toggleAccount: 'Toggle Account',
        authHook: 'Auth Hook Function `hasAuth`',
        superAdminVisible: 'Super Admin Visible',
        adminVisible: 'Admin Visible',
        adminOrUserVisible: 'Admin and User Visible'
      },
      request: {
        repeatedErrorOccurOnce: 'Repeated Request Error Occurs Once',
        repeatedError: 'Repeated Request Error',
        repeatedErrorMsg1: 'Custom Request Error 1',
        repeatedErrorMsg2: 'Custom Request Error 2'
      }
    },
    alova: {
      scenes: {
        captchaSend: 'Captcha Send',
        autoRequest: 'Auto Request',
        visibilityRequestTips: 'Automatically request when switching browser window',
        pollingRequestTips: 'It will request every 3 seconds',
        networkRequestTips: 'Automatically request after network reconnecting',
        refreshTime: 'Refresh Time',
        startRequest: 'Start Request',
        stopRequest: 'Stop Request',
        requestCrossComponent: 'Request Cross Component',
        triggerAllRequest: 'Manually Trigger All Automated Requests'
      }
    },
    proNaive: {
      form: {
        basic: {
          title: 'Basic Example',
          appName: 'ApplicationName',
          appStatus: 'ApplicationStatus',
          createTime: 'CreateTime',
          responseDate: 'ResponseDate',
          specificationInfo: 'SpecificationInfo',
          specificate: 'Specificate',
          specificationName: 'SpecificationName',
          specificationValue: 'SpecificationValue',
          specificationColorRed: 'Red',
          specificationColorOrange: 'Orange',
          addSpecificateItem: 'Add Specificate Item',
          fillValue: 'FillValue',
          reset: 'Reset',
          submit: 'Submit',
          add: 'Add',
          delete: 'Delete',
          color: 'Color',
          normal: 'Normal',
          anomaly: 'Anomaly'
        },
        query: {
          title1: 'Query Example, which expands by default',
          title2: 'Query Example, which fold by default, and two lines are retained when folding',
          appName: 'ApplicationName',
          appStatus: 'ApplicationStatus',
          createTime: 'CreateTime',
          responseDate: 'ResponseDate',
          endDate: 'EndDate',
          field: 'Field'
        },
        step: {
          title: 'Step Form',
          step1: {
            title: 'Form 1',
            field: 'Form 1 field',
            nextStep: 'Next Step'
          },
          step2: {
            title: 'Form 2',
            field: 'Form 2 field',
            prevStep: 'Prev Step',
            submit: 'Submit'
          }
        }
      },
      table: {
        remote: {
          filterCondition: 'Filter Condition',
          name: 'Name',
          createTime: 'CreateTime',
          responseTime: 'ResponseTime',
          title: 'Remote Loading',
          replicableText: 'Replicable Text',
          tags: 'Tags',
          dateFormatting: 'Date Formatting',
          image: 'Image'
        },
        rowEdit: {
          title: 'Edit Table',
          reset: 'Reset',
          submit: 'Submit',
          edit: 'Edit',
          delete: 'Delete',
          save: 'Save',
          task: 'Task',
          score: 'Score',
          time: 'Time',
          name: 'Name',
          action: 'Action'
        }
      }
    },
    authx: {
      title: 'Authentication Providers',
      description: 'Manage external identity services and sign-in policies in one place',
      addProvider: 'Add Provider',
      empty: 'No authentication providers',
      protocol: 'Protocol',
      sort: 'Sort Order',
      autoProvision: 'Auto-Provision Users',
      allowed: 'Allowed',
      off: 'Off',
      clientSecret: 'Client Secret',
      configured: 'Configured',
      notConfigured: 'Not Configured',
      pendingConfiguration: 'Pending Configuration',
      cardClickTip: 'Click the card to configure authentication',
      notApplicable: 'Not Applicable',
      deleteConfirm: 'Are you sure you want to delete this authentication provider?',
      status: {
        enabled: 'Enabled',
        disabled: 'Not Enabled'
      },
      message: {
        enabled: 'Provider enabled',
        disabled: 'Provider disabled',
        deleteSuccess: 'Provider deleted successfully'
      },
      form: {
        addTitle: 'Add Authentication Provider',
        editTitle: 'Edit Basic Information',
        configTitle: 'Configure Authentication Provider',
        genericOauth2: 'Generic OAuth2',
        testAndRead: 'Test and Read User Attributes',
        section: {
          basic: 'Basic Information',
          basicTip: 'Set the name, code, and display details, then configure authentication after creation.',
          access: 'Connection Settings',
          accessTip: 'Configure endpoints and callbacks by protocol. OAuth2 supports a GitHub preset.',
          identity: 'Identity Mapping',
          identityTip: 'Test the provider first, then select attributes returned by the test.',
          advanced: 'Advanced Settings',
          advancedTip: 'Expand optional settings for profile mapping, attribute testing, and automatic user binding.'
        },
        label: {
          name: 'Name',
          code: 'Code',
          protocol: 'Protocol',
          icon: 'Icon',
          sort: 'Sort Order',
          authorizationUrl: 'Authorization URL',
          loginUrl: 'Sign-In URL',
          validationUrl: 'Ticket Validation URL',
          oauth2Type: 'OAuth2 Type',
          tokenUrl: 'Token Retrieval URL',
          userinfoUrl: 'User Info URL',
          clientId: 'Client ID',
          clientSecret: 'Client Secret',
          scopes: 'Scopes (comma-separated)',
          callbackUrl: 'Callback URL',
          backendCallbackUrl: 'Backend Callback URL',
          logoutUrl: 'Logout URL',
          casVersion: 'CAS Version',
          subjectAttribute: 'Stable Identity Attribute',
          principalFallback: 'Allow Principal Fallback',
          slo: 'Enable SLO',
          pkce: 'Enable PKCE',
          fieldMapping: 'User Profile Field Mapping',
          username: 'Username',
          personName: 'Name',
          phone: 'Phone',
          email: 'Email',
          avatar: 'Avatar',
          other: 'Other Settings',
          liveAttributes: 'Live Attributes',
          rawUserInfo: 'Raw User Information',
          autoBind: 'Auto-Bind Local Users',
          autoProvision: 'Auto-Provision Users',
          verifyTls: 'Verify TLS Certificate',
          timeout: 'Request Timeout (seconds)'
        },
        placeholder: {
          code: 'For example: cas or github',
          icon: 'For example: mdi:github',
          githubPreset: 'Filled from the GitHub preset',
          authorizationUrl: 'Enter the authorization URL',
          urlPrefix: 'Enter the URL prefix, e.g. https://cas.example.com/cas',
          clientSecretConfigured: 'Configured; leave blank to keep unchanged',
          clientSecret: 'Enter the Client Secret',
          callbackUrl: 'Uses the backend callback URL by default',
          subjectAttribute: 'Test first, then select a stable identity attribute'
        },
        validation: {
          code: 'Start with a lowercase letter and use only lowercase letters, numbers, underscores, or hyphens',
          urlRequired: 'Enter the {label}',
          urlPrefixRequired: 'Enter the prefix for the {label}',
          clientId: 'Enter the Client ID',
          userIdField: 'Select the unique user identifier field'
        },
        message: {
          profileLoaded: 'Test attributes loaded successfully',
          profileMissing: 'The test response does not contain raw user attributes',
          createSuccess: 'Provider created successfully',
          updateSuccess: 'Provider updated successfully',
          saveBeforeTest: 'Save the provider before testing attribute mapping'
        }
      }
    },
    'user-center': {
      personalInfo: 'Personal Info',
      accountInfo: 'Account Info',
      securitySettings: 'Security Settings',
      loginPwd: 'Login Password',
      loginPwdTip: 'Regular password changes help keep your account secure',
      modifyPwd: 'Change Password',
      oldPassword: 'Current Password',
      newPassword: 'New Password',
      confirmPassword: 'Confirm New Password',
      accountStatus: 'Account Status',
      userId: 'User ID',
      roles: 'Roles',
      activeTime: 'Active Time',
      lastLogin: 'Last Login',
      unassignedRole: 'No role assigned',
      timezone: {
        title: 'Time Zone',
        label: 'Display time zone',
        followDevice: 'Follow device',
        tip: 'Times are displayed in {timezone}; scheduled jobs use the system default or UTC in device mode',
        saveSuccess: 'Time zone saved'
      },
      form: {
        oldPassword: 'Please enter the current password',
        newPassword: 'Please enter a new password',
        confirmPassword: 'Please enter the new password again'
      },
      authIdentity: {
        title: 'Third-Party Accounts',
        tip: 'Link an external authentication account to use it for direct sign-in',
        bind: 'Link {provider}',
        bound: 'Linked',
        bindSuccess: 'External account linked successfully',
        bindFailed: 'Failed to link external account ({error})',
        confirmTitle: 'Confirm External Account Link',
        confirmTip: 'Confirm that the external account below belongs to you. It can then be used to sign in.',
        confirmProvider: 'Authentication Provider',
        confirmAccount: 'External Account',
        confirmName: 'Name',
        confirmEmail: 'Email',
        confirmAction: 'Confirm Link',
        sync: 'Sync Profile',
        syncSuccess: 'External profile synced successfully',
        unbind: 'Unlink',
        unbindConfirm: 'Are you sure you want to unlink this third-party account?',
        unbindSuccess: 'Account unlinked successfully'
      },
      twoFactor: {
        title: 'Two-Factor Authentication',
        tip: 'Use an authenticator code when signing in to add another layer of account protection',
        enabled: 'Enabled',
        disabled: 'Disabled',
        enable: 'Enable 2FA',
        disable: 'Disable 2FA',
        password: 'Current Password',
        code: 'Verification Code',
        reauthenticateTip: 'Verify your current password before enabling two-factor authentication',
        disableTip: 'Verify your password and current code before disabling two-factor authentication',
        scanTip: 'Scan the QR code with Google Authenticator, Microsoft Authenticator, or another TOTP app',
        qrCode: 'Two-factor authentication QR code',
        manualSecret: 'If you cannot scan the QR code, enter this key manually',
        recoveryTip:
          'Save these one-time recovery codes now. Each code can only be used once and will not be shown again.',
        confirmEnable: 'Enable',
        confirmDisable: 'Disable',
        copyRecoveryCodes: 'Copy Recovery Codes',
        copySuccess: 'Recovery codes copied',
        exportRecoveryCodes: 'Export Recovery Codes',
        exportSuccess: 'Recovery codes exported',
        clipboardUnsupported: 'Clipboard access is not supported by this browser',
        regenerateRecoveryCodes: 'Regenerate Recovery Codes',
        regenerateTip:
          'Existing recovery codes will become invalid immediately. Enter your current password and authenticator code.',
        next: 'Next',
        complete: 'Done',
        useRecoveryCode: 'Use a recovery code',
        useAuthenticatorCode: 'Use an authenticator code',
        form: {
          password: 'Enter your current password',
          code: 'Enter verification or recovery code',
          totpCode: 'Enter the 6-digit authenticator code'
        }
      },
      passkey: {
        title: 'Biometrics',
        tip: 'Bind a Passkey to sign in directly with your fingerprint, face, or device screen lock',
        bind: 'Add Biometrics',
        name: 'Device Name',
        password: 'Current Password',
        boundCount: '{count} bound',
        reauthenticateTip: 'Enter your current password, then follow the system prompt to verify this device',
        bindSuccess: 'Biometrics bound successfully',
        bindFailed: 'Failed to bind biometrics. Please try again.',
        registrationError: {
          cancelled: 'Biometric verification was cancelled or timed out',
          invalidDomain: 'Biometrics are unavailable on the current domain. Check the access URL.',
          invalidRpId: 'The biometric domain is misconfigured. Contact the administrator.',
          invalidUserId: 'The account identifier does not meet biometric requirements. Contact the administrator.',
          invalidOptions: 'The biometric options are misconfigured. Contact the administrator.',
          deviceError: 'The device could not complete biometric verification. Please try again later.',
          discoverableCredentialUnsupported:
            'This device does not support the discoverable credential required for username-free sign-in.',
          userVerificationUnsupported: 'No fingerprint, face recognition, or screen lock is configured on this device.',
          alreadyRegistered: 'Biometrics are already bound on this device.',
          algorithmUnsupported: 'This device does not support the required biometric algorithm.',
          verificationFailed: 'Device verification failed. Please try again.',
          deviceUnsupported: 'This device or browser does not support biometrics.',
          insecureContext: 'The current environment is not secure. Please use HTTPS.'
        },
        delete: 'Delete',
        deleteTitle: 'Delete Biometrics',
        deleteTip:
          'After deleting “{name}”, this device can no longer be used for biometric login. Enter your password to confirm.',
        deleteSuccess: 'Biometrics deleted',
        addedAt: 'Added',
        lastUsedAt: 'Last Used',
        neverUsed: 'Never used',
        form: {
          name: 'Enter a recognizable device name',
          password: 'Enter your current password'
        }
      }
    },
    'system-manage': {
      common: {
        status: {
          enable: 'Enable',
          disable: 'Disable'
        }
      },
      roles: {
        title: 'Role List',
        add: 'Add Role',
        edit: 'Edit Role',
        permissions: 'Permission Settings',
        permissionMenus: 'Menu Permissions',
        permissionButtons: 'Button Permissions',
        permissionApis: 'API Permissions',
        name: 'Role Name',
        code: 'Role Code',
        status: 'Role Status',
        description: 'Role Description',
        home: 'Role Home',
        form: {
          keyword: 'Please enter role name or code',
          name: 'Please enter role name',
          code: 'Please enter role code',
          status: 'Please select role status',
          description: 'Please enter role description',
          home: 'Please select role home',
          permissionKeyword: 'Enter keyword to filter'
        }
      },
      users: {
        title: 'User List',
        add: 'Add User',
        edit: 'Edit User',
        UserGender: {
          male: 'Male',
          female: 'Female',
          unknown: 'Unknown'
        },
        username: 'Username',
        gender: 'Gender',
        name: 'Name',
        phone: 'Phone',
        email: 'Email',
        is_active: 'Active',
        is_superuser: 'Is Superuser',
        active_time: 'Active Time: {active_time}',
        last_login: 'Last Login',
        status: 'Status',
        roles: 'Roles',
        contact: 'Contact',
        resetPassword: 'Reset Password',
        resetPasswordTitle: 'Reset Password for {username}',
        resetPasswordSuccess: 'Password reset successfully',
        batchResetPassword: 'Batch Reset Password',
        batchResetPasswordTitle: 'Reset Passwords ({count} Users Selected)',
        batchResetPasswordSuccess: 'Passwords reset successfully',
        confirmBatchResetPassword: 'Confirm reset password?',
        newPassword: 'New Password',
        confirmPassword: 'Confirm Password',
        form: {
          keyword: 'Please enter name or username',
          contact: 'Please enter phone or email',
          username: 'Please enter username',
          gender: 'Please select gender',
          name: 'Please enter name',
          phone: 'Please enter phone',
          email: 'Please enter email',
          is_active: 'Please select active status',
          is_superuser: 'Please select is superuser',
          status: 'Please select status',
          newPassword: 'Please enter a new password',
          confirmPassword: 'Please enter the new password again'
        }
      },
      menus: {
        title: 'Menu List',
        menuType: 'Menu Type',
        menuName: 'Menu Name',
        routeName: 'Route Name',
        routePath: 'Route Path',
        pathParam: 'Path Param',
        layout: 'Layout Component',
        page: 'Page Component',
        i18nKey: 'I18n Key',
        icon: 'Icon',
        iconTypeTitle: 'Icon Type',
        order: 'Order',
        constant: 'Constant',
        keepAlive: 'Keep Alive',
        href: 'Href',
        hideInMenu: 'Hide In Menu',
        activeMenu: 'Active Menu',
        multiTab: 'Multi Tab',
        fixedIndexInTab: 'Fixed Index In Tab',
        query: 'Query Params',
        bindButtons: 'Bind Buttons',
        menuStatus: 'Menu Status',
        form: {
          menuName: 'Please enter menu name',
          routeName: 'Please enter route name',
          routePath: 'Please enter route path',
          pathParam: 'Please enter path param',
          page: 'Please select page component',
          layout: 'Please select layout component',
          i18nKey: 'Please enter i18n key',
          icon: 'Please enter iconify name',
          localIcon: 'Please enter local icon name',
          order: 'Please enter order',
          href: 'Please enter href',
          activeMenu: 'Please select route name of the highlighted menu',
          fixedIndexInTab: 'Please enter the index fixed in the tab',
          queryKey: 'Please enter route parameter Key',
          queryValue: 'Please enter route parameter Value',
          buttonKeyword: 'Enter button name or code to filter'
        },
        addMenu: 'Add Menu',
        editMenu: 'Edit Menu',
        addChildMenu: 'Add Child Menu',
        type: {
          directory: 'Directory',
          menu: 'Menu'
        },
        iconType: {
          iconify: 'Iconify Icon',
          local: 'Local Icon'
        }
      },
      apis: {
        title: 'API List',
        add: 'Add API',
        edit: 'Edit API',
        name: 'API Name',
        summary: 'API Summary',
        path: 'API Path',
        method: 'Request Method',
        tags: 'API Tags',
        status: 'API Status',
        description: 'API Description',
        apiMethod: {
          get: 'GET',
          post: 'POST',
          put: 'PUT',
          patch: 'PATCH',
          delete: 'DELETE'
        },
        syncApi: 'Sync API',
        confirmSyncApi: 'Are you sure you want to sync the API?',
        addWhitelist: 'Add to whitelist',
        confirmAddWhitelist: 'Add this API to the whitelist? It will be accessible without signing in.',
        addWhitelistSuccess: 'API added to the whitelist',
        removeWhitelist: 'Remove from whitelist',
        confirmRemoveWhitelist: 'Remove this API from the whitelist? Authentication and permission checks will resume.',
        removeWhitelistSuccess: 'API removed from the whitelist',
        whitelistApi: 'Whitelist',
        batchAddWhitelist: 'Add selected to whitelist',
        batchRemoveWhitelist: 'Remove selected',
        confirmBatchAddWhitelist: 'Add the selected APIs to the whitelist?',
        confirmBatchRemoveWhitelist: 'Remove the selected APIs from the whitelist?',
        form: {
          keyword: 'Please enter API name, summary, path or description',
          method: 'Please select request method',
          status: 'Please select API status',
          tags: 'Please select API tags',
          whitelistApi: 'Please select whether this is a whitelist API'
        }
      },
      buttons: {
        title: 'Button List',
        add: 'Add Button',
        edit: 'Edit Button',
        name: 'Button Name',
        code: 'Button Code',
        status: 'Button Status',
        description: 'Button Description',
        form: {
          keyword: 'Please enter button name, code or description',
          name: 'Please enter button name',
          code: 'Please enter button code',
          status: 'Please select button status',
          description: 'Please enter button description'
        }
      }
    }
  },
  form: {
    required: 'Cannot be empty',
    username: {
      required: 'Please enter user name',
      invalid: 'User name format is incorrect'
    },
    phone: {
      required: 'Please enter phone number',
      invalid: 'Phone number format is incorrect'
    },
    pwd: {
      required: 'Please enter password',
      invalid: '6-18 characters, including letters, numbers, and underscores'
    },
    confirmPwd: {
      required: 'Please enter password again',
      invalid: 'The two passwords are inconsistent'
    },
    code: {
      required: 'Please enter verification code',
      invalid: 'Verification code format is incorrect'
    },
    email: {
      required: 'Please enter email',
      invalid: 'Email format is incorrect'
    }
  },
  dropdown: {
    closeCurrent: 'Close Current',
    closeOther: 'Close Other',
    closeLeft: 'Close Left',
    closeRight: 'Close Right',
    closeAll: 'Close All',
    pin: 'Pin Tab',
    unpin: 'Unpin Tab'
  },
  icon: {
    themeConfig: 'Theme Configuration',
    themeSchema: 'Theme Schema',
    lang: 'Switch Language',
    fullscreen: 'Fullscreen',
    fullscreenExit: 'Exit Fullscreen',
    reload: 'Reload Page',
    collapse: 'Collapse Menu',
    expand: 'Expand Menu',
    pin: 'Pin',
    unpin: 'Unpin'
  },
  datatable: {
    itemCount: 'Total {total} items',
    fixed: {
      left: 'Left Fixed',
      right: 'Right Fixed',
      unFixed: 'Unfixed'
    }
  }
};

export default local;
