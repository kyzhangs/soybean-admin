const local: App.I18n.Schema = {
  system: {
    title: '后台管理系统',
    updateTitle: '系统版本更新通知',
    updateContent: '检测到系统有新版本发布，是否立即刷新页面？',
    updateConfirm: '立即刷新',
    updateCancel: '稍后再说'
  },
  common: {
    action: '操作',
    add: '新增',
    addSuccess: '添加成功',
    backToHome: '返回首页',
    cancel: '取消',
    close: '关闭',
    check: '勾选',
    selectAll: '全选',
    expandColumn: '展开列',
    columnSetting: '列设置',
    config: '配置',
    confirm: '确认',
    delete: '删除',
    deleteSuccess: '删除成功',
    confirmDelete: '确认删除吗？',
    edit: '编辑',
    warning: '警告',
    error: '错误',
    index: '序号',
    keywordSearch: '请输入关键词搜索',
    logout: '退出登录',
    logoutConfirm: '确认退出登录吗？',
    lookForward: '敬请期待',
    modify: '修改',
    modifySuccess: '修改成功',
    noData: '无数据',
    operate: '操作',
    pleaseCheckValue: '请检查输入的值是否合法',
    refresh: '刷新',
    reset: '重置',
    search: '搜索',
    switch: '切换',
    tip: '提示',
    trigger: '触发',
    update: '更新',
    updateSuccess: '更新成功',
    userCenter: '个人中心',
    yesOrNo: {
      yes: '是',
      no: '否'
    },
    keyword: '关键字',
    create_time: '创建时间',
    update_time: '更新时间',
    enable: '启用',
    disable: '禁用',
    confirmEnable: '确认启用吗？',
    confirmDisable: '确认禁用吗？',
    enableSuccess: '启用成功',
    disableSuccess: '禁用成功',
    batchOperation: '批量操作',
    confirmBatchOperation: '确认批量操作吗？',
    batchOperationSuccess: '批量操作成功',
    batchEnable: '批量启用',
    confirmBatchEnable: '确认批量启用吗？',
    batchEnableSuccess: '批量启用成功',
    batchDisable: '批量禁用',
    confirmBatchDisable: '确认批量禁用吗？',
    batchDisableSuccess: '批量禁用成功',
    batchDelete: '批量删除',
    confirmBatchDelete: '确认批量删除吗？',
    batchDeleteSuccess: '批量删除成功'
  },
  request: {
    logout: '请求失败后登出用户',
    logoutMsg: '用户状态失效，请重新登录',
    logoutWithModal: '请求失败后弹出模态框再登出用户',
    logoutWithModalMsg: '用户状态失效，请重新登录',
    refreshToken: '请求的token已过期，刷新token',
    tokenExpired: 'token已过期'
  },
  theme: {
    themeDrawerTitle: '主题配置',
    tabs: {
      appearance: '外观',
      layout: '布局',
      general: '通用',
      preset: '预设'
    },
    appearance: {
      themeSchema: {
        title: '主题模式',
        light: '亮色模式',
        dark: '暗黑模式',
        auto: '跟随系统'
      },
      grayscale: '灰色模式',
      colourWeakness: '色弱模式',
      themeColor: {
        title: '主题颜色',
        primary: '主色',
        info: '信息色',
        success: '成功色',
        warning: '警告色',
        error: '错误色',
        followPrimary: '跟随主色'
      },
      themeRadius: {
        title: '主题圆角'
      },
      recommendColor: '应用推荐算法的颜色',
      recommendColorDesc: '推荐颜色的算法参照',
      preset: {
        title: '主题预设',
        apply: '应用',
        applySuccess: '预设应用成功',
        default: {
          name: '默认预设',
          desc: '默认主题预设'
        },
        pixel: {
          name: '像素艺术',
          desc: '硬边框、硬阴影和鲜明 8-bit 配色的复古主题'
        },
        comic: {
          name: '漫画风格',
          desc: '粗墨线、半调网点和高冲击力色彩组成的漫画主题'
        },
        handDrawnDoodle: {
          name: '手绘涂鸦风',
          desc: '笔记本纸张、手绘虚线和标记笔色彩组成的温暖创意主题'
        },
        cyberAnime: {
          name: '赛博动漫风',
          desc: '融合机甲 HUD、全息扫描线和多层霓虹光效的未来动漫主题'
        },
        neumorphism: {
          name: '新拟物派',
          desc: '通过同色表面和明暗双重阴影塑造柔和内凹与外凸质感'
        }
      }
    },
    layout: {
      layoutMode: {
        title: '布局模式',
        vertical: '左侧菜单模式',
        'vertical-mix': '左侧菜单混合模式',
        'vertical-hybrid-header-first': '左侧混合-顶部优先',
        horizontal: '顶部菜单模式',
        'top-hybrid-sidebar-first': '顶部混合-侧边优先',
        'top-hybrid-header-first': '顶部混合-顶部优先',
        vertical_detail: '左侧菜单布局，菜单在左，内容在右。',
        'vertical-mix_detail': '左侧双菜单布局，一级菜单在左侧深色区域，二级菜单在左侧浅色区域。',
        'vertical-hybrid-header-first_detail':
          '左侧混合布局，一级菜单在顶部，二级菜单在左侧深色区域，三级菜单在左侧浅色区域。',
        horizontal_detail: '顶部菜单布局，菜单在顶部，内容在下方。',
        'top-hybrid-sidebar-first_detail': '顶部混合布局，一级菜单在左侧，二级菜单在顶部。',
        'top-hybrid-header-first_detail': '顶部混合布局，一级菜单在顶部，二级菜单在左侧。'
      },
      tab: {
        title: '标签栏设置',
        visible: '显示标签栏',
        cache: '标签栏信息缓存',
        cacheTip: '离开页面后仍然保留标签栏信息',
        height: '标签栏高度',
        mode: {
          title: '标签栏风格',
          slider: '滑块风格',
          chrome: '谷歌风格',
          button: '按钮风格'
        },
        closeByMiddleClick: '鼠标中键关闭标签页',
        closeByMiddleClickTip: '启用后可以使用鼠标中键点击标签页进行关闭'
      },
      header: {
        title: '头部设置',
        height: '头部高度',
        breadcrumb: {
          visible: '显示面包屑',
          showIcon: '显示面包屑图标'
        }
      },
      sider: {
        title: '侧边栏设置',
        inverted: '深色侧边栏',
        width: '侧边栏宽度',
        collapsedWidth: '侧边栏折叠宽度',
        mixWidth: '混合布局侧边栏宽度',
        mixCollapsedWidth: '混合布局侧边栏折叠宽度',
        mixChildMenuWidth: '混合布局子菜单宽度',
        autoSelectFirstMenu: '自动选择第一个子菜单',
        autoSelectFirstMenuTip: '点击一级菜单时，自动选择并导航到第一个子菜单的最深层级'
      },
      footer: {
        title: '底部设置',
        visible: '显示底部',
        fixed: '固定底部',
        height: '底部高度',
        right: '底部居右'
      },
      content: {
        title: '内容区域设置',
        scrollMode: {
          title: '滚动模式',
          tip: '主题滚动仅 main 部分滚动，外层滚动可携带头部底部一起滚动',
          wrapper: '外层滚动',
          content: '主体滚动'
        },
        page: {
          animate: '页面切换动画',
          mode: {
            title: '页面切换动画类型',
            'fade-slide': '滑动',
            fade: '淡入淡出',
            'fade-bottom': '底部消退',
            'fade-scale': '缩放消退',
            'zoom-fade': '渐变',
            'zoom-out': '闪现',
            none: '无'
          }
        },
        fixedHeaderAndTab: '固定头部和标签栏'
      }
    },
    general: {
      title: '通用设置',
      watermark: {
        title: '水印设置',
        visible: '显示全屏水印',
        text: '自定义水印文本',
        enableUserName: '启用用户名水印',
        enableTime: '显示当前时间',
        timeFormat: '时间格式'
      },
      multilingual: {
        title: '多语言设置',
        visible: '显示多语言按钮'
      },
      globalSearch: {
        title: '全局搜索设置',
        visible: '显示全局搜索按钮'
      }
    },
    configOperation: {
      copyConfig: '复制配置',
      copySuccessMsg: '复制成功，请替换 src/theme/settings.ts 中的变量 themeSettings',
      resetConfig: '重置配置',
      resetSuccessMsg: '重置成功'
    }
  },
  route: {
    login: '登录',
    403: '无权限',
    404: '页面不存在',
    500: '服务器错误',
    'iframe-page': '外链页面',
    home: '首页',
    document: '文档',
    document_api: '接口文档',
    document_project: '项目文档',
    'document_project-link': '项目文档(外链)',
    document_video: '视频教程',
    document_vue: 'Vue文档',
    document_vite: 'Vite文档',
    document_unocss: 'UnoCSS文档',
    document_naive: 'Naive UI文档',
    'document_pro-naive': 'Pro Naive UI文档',
    document_antd: 'Ant Design Vue文档',
    document_alova: 'Alova文档',
    'user-center': '个人中心',
    about: '关于',
    function: '系统功能',
    alova: 'alova示例',
    alova_request: 'alova请求',
    alova_scenes: '场景化请求',
    'pro-naive': 'Pro Naive UI 示例',
    'pro-naive_form': '表单',
    'pro-naive_form_basic': '基础表单',
    'pro-naive_form_query': '查询表单',
    'pro-naive_form_step': '分步表单',
    'pro-naive_table': '表格',
    'pro-naive_table_remote': '远程加载',
    'pro-naive_table_row-edit': '行编辑',
    function_tab: '标签页',
    'function_multi-tab': '多标签页',
    'function_hide-child': '隐藏子菜单',
    'function_hide-child_one': '隐藏子菜单',
    'function_hide-child_two': '菜单二',
    'function_hide-child_three': '菜单三',
    function_request: '请求',
    'function_toggle-auth': '切换权限',
    'function_super-page': '超级管理员可见',
    'system-manage': '系统管理',
    'system-manage_users': '用户管理',
    'system-manage_user-detail': '用户详情',
    'system-manage_login-logs': '登录日志',
    'system-manage_roles': '角色管理',
    'system-manage_menus': '菜单管理',
    authx: '认证配置',
    'system-manage_apis': '接口管理',
    'system-manage_buttons': '按钮管理',
    'multi-menu': '多级菜单',
    'multi-menu_first': '菜单一',
    'multi-menu_first_child': '菜单一子菜单',
    'multi-menu_second': '菜单二',
    'multi-menu_second_child': '菜单二子菜单',
    'multi-menu_second_child_home': '菜单二子菜单首页',
    exception: '异常页',
    exception_403: '403',
    exception_404: '404',
    exception_500: '500',
    plugin: '插件示例',
    plugin_copy: '剪贴板',
    plugin_charts: '图表',
    plugin_charts_echarts: 'ECharts',
    plugin_charts_antv: 'AntV',
    plugin_charts_vchart: 'VChart',
    plugin_editor: '编辑器',
    plugin_editor_quill: '富文本编辑器',
    plugin_editor_markdown: 'MD 编辑器',
    plugin_icon: '图标',
    plugin_map: '地图',
    plugin_print: '打印',
    plugin_swiper: 'Swiper',
    plugin_video: '视频',
    plugin_barcode: '条形码',
    plugin_pinyin: '拼音',
    plugin_excel: 'Excel',
    plugin_pdf: 'PDF 预览',
    plugin_gantt: '甘特图',
    plugin_gantt_dhtmlx: 'dhtmlxGantt',
    plugin_gantt_vtable: 'VTableGantt',
    plugin_typeit: '打字机',
    plugin_tables: '表格',
    plugin_tables_vtable: 'VTable'
  },
  page: {
    login: {
      common: {
        loginOrRegister: '登录 / 注册',
        usernamePlaceholder: '请输入用户名',
        phonePlaceholder: '请输入手机号',
        codePlaceholder: '请输入验证码',
        passwordPlaceholder: '请输入密码',
        confirmPasswordPlaceholder: '请再次输入密码',
        codeLogin: '验证码登录',
        confirm: '确定',
        back: '返回',
        validateSuccess: '验证成功',
        loginSuccess: '登录成功',
        welcomeBack: '欢迎回来，{username} ！'
      },
      pwdLogin: {
        title: '密码登录',
        rememberMe: '记住我',
        forgetPassword: '忘记密码？',
        register: '注册账号',
        otherAccountLogin: '其他账号登录',
        otherLoginMode: '其他登录方式',
        superAdmin: '超级管理员',
        admin: '管理员',
        user: '普通用户'
      },
      passkey: {
        title: 'Passkey 登录',
        accountTab: '账号登录',
        biometricTab: '生物识别',
        login: '点击开启识别登录',
        unsupported: '当前浏览器或运行环境不支持 Passkey，请使用 HTTPS 或切换到密码登录',
        failed: 'Passkey 验证失败，请重试'
      },
      cas: {
        login: '统一身份认证登录',
        disabled: '未启用统一身份认证登录',
        callbackTitle: '统一身份认证',
        exchanging: '正在完成统一身份认证…',
        failed: '统一身份认证票据无效或已过期，请重新登录',
        identityNotBound: '统一身份认证已通过，但该身份尚未绑定本地账号',
        back: '返回登录',
        globalLogout: '是否同时退出统一身份认证及关联系统？'
      },
      callback: {
        exchanging: '正在完成身份认证…',
        failed: '身份认证失败或登录凭证已过期，请重新登录',
        back: '返回登录',
        error: {
          accountInactive: '账号未激活',
          accountDeleted: '账号已删除，请联系管理员',
          accountDisabled: '账号已禁用，请联系管理员',
          casDisabled: '统一身份认证未启用',
          casFlowInvalid: '统一身份认证流程无效或已过期',
          casTicketMissing: '统一身份认证票据丢失',
          casUnavailable: '统一身份认证服务暂时不可用',
          casTicketValidationFailed: '统一身份认证票据验证失败',
          casResponseInvalid: '统一身份认证验证响应格式无效',
          casSubjectMissing: '统一身份认证未返回稳定身份标识',
          casIdentityNotBound: '统一身份认证尚未绑定本地账号',
          casTicketInvalid: '统一身份认证票据无效或已过期',
          casLogoutInvalid: '统一身份认证退出通知格式无效',
          casRateLimited: '统一身份认证请求过于频繁，请稍后重试',
          providerNotFound: '认证提供方不存在',
          providerDisabled: '认证提供方未启用',
          providerConfigInvalid: '认证提供方配置无效',
          authFlowInvalid: '认证登录流程无效或已过期',
          authRateLimited: '认证登录请求过于频繁，请稍后重试',
          authTicketInvalid: '认证登录票据无效或已过期',
          externalIdentityNotBound: '外部身份尚未绑定本地账号',
          providerCallbackInvalid: '认证提供方回调无效',
          providerUnavailable: '认证提供方暂时不可用',
          externalAccountBoundElsewhere: '该外部账号已绑定其他用户',
          providerAlreadyBound: '当前用户已绑定该认证提供方'
        }
      },
      twoFactor: {
        title: '2FA 验证',
        help: '请输入认证器应用生成的 6 位动态验证码，或切换使用一次性恢复码',
        codePlaceholder: '请输入验证码或恢复码',
        useRecoveryCode: '使用恢复码',
        useAuthenticatorCode: '使用认证器验证码'
      },
      codeLogin: {
        title: '验证码登录',
        getCode: '获取验证码',
        reGetCode: '{time}秒后重新获取',
        sendCodeSuccess: '验证码发送成功',
        imageCodePlaceholder: '请输入图片验证码'
      },
      register: {
        title: '注册账号',
        agreement: '我已经仔细阅读并接受',
        protocol: '《用户协议》',
        policy: '《隐私权政策》'
      },
      resetPwd: {
        title: '重置密码'
      },
      bindWeChat: {
        title: '绑定微信'
      }
    },
    about: {
      title: '关于',
      introduction: `SoybeanAdmin 是一个优雅且功能强大的后台管理模板，基于最新的前端技术栈，包括 Vue3, Vite7, TypeScript, Pinia 和 UnoCSS。它内置了丰富的主题配置和组件，代码规范严谨，实现了自动化的文件路由系统。此外，它还采用了基于 ApiFox 的在线Mock数据方案。SoybeanAdmin 为您提供了一站式的后台管理解决方案，无需额外配置，开箱即用。同样是一个快速学习前沿技术的最佳实践。`,
      projectInfo: {
        title: '项目信息',
        version: '版本',
        latestBuildTime: '最新构建时间',
        githubLink: 'Github 地址',
        previewLink: '预览地址'
      },
      prdDep: '生产依赖',
      devDep: '开发依赖'
    },
    home: {
      branchDesc:
        '为了方便大家开发和更新合并，我们对main分支的代码进行了精简，只保留了首页菜单，其余内容已移至example分支进行维护。预览地址显示的内容即为example分支的内容。',
      greeting: '早安，{username}, 今天又是充满活力的一天!',
      weatherDesc: '今日多云转晴，20℃ - 25℃!',
      projectCount: '项目数',
      todo: '待办',
      message: '消息',
      downloadCount: '下载量',
      registerCount: '注册量',
      schedule: '作息安排',
      study: '学习',
      work: '工作',
      rest: '休息',
      entertainment: '娱乐',
      visitCount: '访问量',
      turnover: '成交额',
      dealCount: '成交量',
      projectNews: {
        title: '项目动态',
        moreNews: '更多动态',
        desc1: 'Soybean 在2021年5月28日创建了开源项目 soybean-admin!',
        desc2: 'Yanbowe 向 soybean-admin 提交了一个bug，多标签栏不会自适应。',
        desc3: 'Soybean 准备为 soybean-admin 的发布做充分的准备工作!',
        desc4: 'Soybean 正在忙于为soybean-admin写项目说明文档！',
        desc5: 'Soybean 刚才把工作台页面随便写了一些，凑合能看了！'
      },
      creativity: '创意'
    },
    function: {
      tab: {
        tabOperate: {
          title: '标签页操作',
          addTab: '添加标签页',
          addTabDesc: '跳转到关于页面',
          closeTab: '关闭标签页',
          closeCurrentTab: '关闭当前标签页',
          closeAboutTab: '关闭"关于"标签页',
          addMultiTab: '添加多标签页',
          addMultiTabDesc1: '跳转到多标签页页面',
          addMultiTabDesc2: '跳转到多标签页页面(带有查询参数)'
        },
        tabTitle: {
          title: '标签页标题',
          changeTitle: '修改标题',
          change: '修改',
          resetTitle: '重置标题',
          reset: '重置'
        }
      },
      multiTab: {
        routeParam: '路由参数',
        backTab: '返回 function_tab'
      },
      toggleAuth: {
        toggleAccount: '切换账号',
        authHook: '权限钩子函数 `hasAuth`',
        superAdminVisible: '超级管理员可见',
        adminVisible: '管理员可见',
        adminOrUserVisible: '管理员和用户可见'
      },
      request: {
        repeatedErrorOccurOnce: '重复请求错误只出现一次',
        repeatedError: '重复请求错误',
        repeatedErrorMsg1: '自定义请求错误 1',
        repeatedErrorMsg2: '自定义请求错误 2'
      }
    },
    alova: {
      scenes: {
        captchaSend: '发送验证码',
        autoRequest: '自动请求',
        visibilityRequestTips: '浏览器窗口切换自动请求数据',
        pollingRequestTips: '每3秒自动请求一次',
        networkRequestTips: '网络重连后自动请求',
        refreshTime: '更新时间',
        startRequest: '开始请求',
        stopRequest: '停止请求',
        requestCrossComponent: '跨组件触发请求',
        triggerAllRequest: '手动触发所有自动请求'
      }
    },
    proNaive: {
      form: {
        basic: {
          title: '基础示例',
          appName: '应用名称',
          appStatus: '应用状态',
          createTime: '创建时间',
          responseDate: '响应日期',
          specificationInfo: '规格信息',
          specificate: '规格',
          specificationName: '规格名',
          specificationValue: '规格值',
          specificationColorRed: '红',
          specificationColorOrange: '橙',
          addSpecificateItem: '添加规格项',
          fillValue: '填充值',
          reset: '重置',
          submit: '提交',
          add: '新建',
          delete: '删除',
          color: '颜色',
          normal: '正常',
          anomaly: '异常'
        },
        query: {
          title1: '查询表单，默认展开',
          title2: '查询表单，默认折叠，折叠时保留2行',
          appName: '应用名称',
          appStatus: '应用状态',
          createTime: '创建时间',
          responseDate: '响应日期',
          endDate: '结束日期',
          field: '字段'
        },
        step: {
          title: '分步表单',
          step1: {
            title: '表单1',
            field: '表单1字段',
            nextStep: '下一步'
          },
          step2: {
            title: '表单2',
            field: '表单2字段',
            prevStep: '上一步',
            submit: '提交'
          }
        }
      },
      table: {
        remote: {
          filterCondition: '筛选条件',
          name: '名称',
          createTime: '创建时间',
          responseTime: '响应时间',
          title: '远程加载',
          replicableText: '可复制文本',
          tags: 'tags',
          dateFormatting: '日期格式化',
          image: '图片'
        },
        rowEdit: {
          title: '编辑表格',
          reset: '重置',
          submit: '提交',
          edit: '编辑',
          delete: '删除',
          save: '保存',
          task: '任务',
          score: '评分',
          time: '时间',
          name: '名称',
          action: '操作'
        }
      }
    },
    authx: {
      title: '认证提供方',
      description: '集中管理外部身份认证服务及登录策略',
      addProvider: '新增提供方',
      empty: '暂无认证提供方',
      protocol: '认证协议',
      sort: '排序',
      autoProvision: '自动开通用户',
      allowed: '允许',
      off: '关闭',
      clientSecret: '客户端密钥',
      configured: '已配置',
      notConfigured: '未配置',
      pendingConfiguration: '待配置',
      cardClickTip: '点击卡片配置认证接入',
      notApplicable: '不适用',
      deleteConfirm: '确认删除该认证提供方？',
      status: {
        enabled: '已启用',
        disabled: '未启用'
      },
      message: {
        enabled: '已启用',
        disabled: '已停用',
        deleteSuccess: '删除成功'
      },
      form: {
        addTitle: '新增认证提供方',
        editTitle: '编辑基本信息',
        configTitle: '配置认证提供方',
        genericOauth2: '通用 OAuth2',
        testAndRead: '测试并读取用户属性',
        section: {
          basic: '基础信息',
          basicTip: '设置服务名称、编码和展示信息，创建后再完善认证配置。',
          access: '接入配置',
          accessTip: '按协议类型填写端点与回调；OAuth2 可使用 GitHub 快速模式。',
          identity: '身份映射',
          identityTip: '先测试再映射，可直接选取返回属性名。',
          advanced: '高级设置',
          advancedTip: '用户信息字段映射、属性测试及用户自动绑定等低频配置，按需展开设置。'
        },
        label: {
          name: '名称',
          code: '编码',
          protocol: '协议',
          icon: '图标',
          sort: '排序',
          authorizationUrl: '授权地址',
          loginUrl: '登录地址',
          validationUrl: '验证地址',
          oauth2Type: 'OAuth2 类型',
          tokenUrl: '获取令牌地址',
          userinfoUrl: '用户信息地址',
          clientId: 'Client ID',
          clientSecret: 'Client Secret',
          scopes: 'Scopes（逗号分隔）',
          callbackUrl: '回调地址',
          backendCallbackUrl: '后端回调地址',
          logoutUrl: '退出地址',
          casVersion: 'CAS 版本',
          subjectAttribute: '稳定身份属性',
          principalFallback: '允许 Principal 回退',
          slo: '启用 SLO',
          pkce: '启用 PKCE',
          fieldMapping: '用户信息字段映射',
          username: '用户名',
          personName: '姓名',
          phone: '手机号',
          email: '邮箱',
          avatar: '头像',
          other: '其他配置',
          liveAttributes: '获取实时属性',
          rawUserInfo: '原始用户信息',
          autoBind: '自动绑定本地用户',
          autoProvision: '自动开通用户',
          verifyTls: '校验 TLS 证书',
          timeout: '请求超时（秒）'
        },
        placeholder: {
          code: '如 cas、github',
          icon: '如 mdi:github',
          githubPreset: '已按 GitHub 默认规则填充',
          authorizationUrl: '请输入授权地址',
          urlPrefix: '请输入地址前缀，如 https://cas.example.com/cas',
          clientSecretConfigured: '已配置，留空保持不变',
          clientSecret: '请输入 Client Secret',
          callbackUrl: '默认填入后端回调地址',
          subjectAttribute: '请先测试并选择稳定身份属性'
        },
        validation: {
          code: '请输入小写字母开头的编码，仅支持小写字母、数字、下划线和中划线',
          urlRequired: '请输入{label}',
          urlPrefixRequired: '请输入{label}前缀',
          clientId: '请输入 Client ID',
          userIdField: '请输入用户唯一标识字段'
        },
        message: {
          profileLoaded: '已读取到测试返回属性',
          profileMissing: '测试返回缺少原始用户属性',
          createSuccess: '创建成功',
          updateSuccess: '更新成功',
          saveBeforeTest: '请先保存提供方后再测试属性映射'
        }
      }
    },
    'user-center': {
      personalInfo: '个人信息',
      accountInfo: '账户信息',
      securitySettings: '安全设置',
      loginPwd: '登录密码',
      loginPwdTip: '建议定期更换密码以保障账户安全',
      modifyPwd: '修改密码',
      oldPassword: '原密码',
      newPassword: '新密码',
      confirmPassword: '确认新密码',
      accountStatus: '账户状态',
      userId: '用户 ID',
      roles: '角色',
      activeTime: '激活时间',
      lastLogin: '最近登录',
      unassignedRole: '暂未分配角色',
      timezone: {
        title: '时区设置',
        label: '显示时区',
        followDevice: '跟随设备',
        tip: '当前按 {timezone} 显示；定时任务在跟随设备时使用系统默认时区或 UTC',
        saveSuccess: '时区设置已保存'
      },
      sessions: {
        title: '登录设备',
        tip: '以下是当前仍然有效的认证会话。发现陌生设备时，请立即退出该会话并修改密码。',
        empty: '暂无有效会话',
        current: '当前会话',
        revoke: '退出',
        revokeConfirm: '确认退出该设备的会话？',
        revokeCurrentConfirm: '确认退出当前会话？退出后需要重新登录。',
        revokeSuccess: '会话已退出',
        loginMethod: '登录方式',
        loginTime: '登录时间',
        lastSeen: '最近活动',
        device: {
          pc: 'PC 端',
          mobile: '移动端',
          tablet: '平板',
          bot: '自动化客户端',
          unknown: '未知设备'
        },
        protocol: {
          password: '密码',
          cas: 'CAS',
          oauth2: 'OAuth2',
          oidc: 'OIDC',
          webauthn: 'Passkey'
        }
      },
      loginLogs: {
        title: '登录历史',
        tip: '这里展示当前账号可识别的全部登录记录，包括成功和失败的登录尝试。',
        empty: '暂无登录记录',
        device: '设备',
        ipAddress: 'IP 地址',
        location: '归属地',
        failureCode: '失败代码',
        result: {
          success: '登录成功',
          failure: '登录失败'
        },
        stage: {
          password: '密码登录',
          mfa: '双因素验证',
          passkey: '生物识别',
          providerCallback: '认证回调',
          ticketExchange: '登录票据兑换'
        }
      },
      form: {
        oldPassword: '请输入原密码',
        newPassword: '请输入新密码',
        confirmPassword: '请再次输入新密码'
      },
      authIdentity: {
        title: '第三方账号',
        tip: '绑定后可直接使用对应的外部认证账号登录',
        bind: '绑定 {provider}',
        bound: '已绑定',
        bindSuccess: '外部账号绑定成功',
        bindFailed: '外部账号绑定失败（{error}）',
        confirmTitle: '确认绑定外部账号',
        confirmTip: '请确认以下外部账号属于你本人。确认后，该账号可用于登录当前账户。',
        confirmProvider: '认证提供商',
        confirmAccount: '外部账号',
        confirmName: '姓名',
        confirmEmail: '邮箱',
        confirmAction: '确认绑定',
        sync: '同步外部信息',
        syncSuccess: '外部用户信息同步成功',
        unbind: '解绑',
        unbindConfirm: '确认解绑该第三方账号？',
        unbindSuccess: '解绑成功'
      },
      twoFactor: {
        title: '双因素认证',
        tip: '登录时使用认证器动态验证码，为账户增加一层保护',
        enabled: '已启用',
        disabled: '未启用',
        enable: '启用 2FA',
        disable: '关闭 2FA',
        password: '当前密码',
        code: '验证码',
        reauthenticateTip: '启用双因素认证前，请先验证当前登录密码',
        disableTip: '关闭后登录将不再需要动态验证码，请验证密码和当前验证码',
        scanTip: '请使用 Google Authenticator、Microsoft Authenticator 等认证器扫描二维码',
        qrCode: '双因素认证二维码',
        manualSecret: '无法扫码时，可手动输入以下密钥',
        recoveryTip: '请立即保存这些一次性恢复码。每个恢复码只能使用一次，关闭窗口后将不再显示。',
        confirmEnable: '确认启用',
        confirmDisable: '确认关闭',
        copyRecoveryCodes: '复制恢复码',
        copySuccess: '恢复码已复制',
        exportRecoveryCodes: '导出恢复码',
        exportSuccess: '恢复码已导出',
        clipboardUnsupported: '当前浏览器不支持剪贴板功能',
        regenerateRecoveryCodes: '重新生成恢复码',
        regenerateTip: '重新生成后，现有恢复码将立即失效。请输入当前密码和认证器验证码。',
        next: '下一步',
        complete: '完成',
        useRecoveryCode: '使用恢复码',
        useAuthenticatorCode: '使用认证器验证码',
        form: {
          password: '请输入当前密码',
          code: '请输入验证码或恢复码',
          totpCode: '请输入认证器中的 6 位验证码'
        }
      },
      passkey: {
        title: '生物识别',
        tip: '绑定后可在登录页使用指纹、面容或设备屏幕锁直接登录',
        bind: '添加生物识别',
        name: '设备名称',
        password: '当前密码',
        boundCount: '已绑定 {count} 个',
        reauthenticateTip: '请输入当前密码，然后按照系统提示完成设备验证',
        bindSuccess: '生物识别绑定成功',
        bindFailed: '生物识别绑定失败，请重试',
        registrationError: {
          cancelled: '已取消生物识别或验证已超时',
          invalidDomain: '当前域名不支持生物识别，请检查访问地址',
          invalidRpId: '生物识别域名配置错误，请联系管理员',
          invalidUserId: '账户标识不符合生物识别要求，请联系管理员',
          invalidOptions: '生物识别参数配置错误，请联系管理员',
          deviceError: '设备无法完成生物识别，请稍后重试',
          discoverableCredentialUnsupported: '当前设备不支持免用户名登录所需的生物识别凭据',
          userVerificationUnsupported: '当前设备未配置指纹、面容或屏幕锁',
          alreadyRegistered: '该设备已绑定生物识别',
          algorithmUnsupported: '当前设备不支持系统要求的生物识别算法',
          verificationFailed: '设备验证失败，请重试',
          deviceUnsupported: '当前设备或浏览器不支持生物识别',
          insecureContext: '当前访问环境不满足安全要求，请使用 HTTPS'
        },
        delete: '删除',
        deleteTitle: '删除生物识别',
        deleteTip: '删除“{name}”后，该设备将无法再用于生物识别登录。请输入当前密码确认。',
        deleteSuccess: '生物识别已删除',
        addedAt: '添加时间',
        lastUsedAt: '最近使用',
        neverUsed: '尚未使用',
        form: {
          name: '请输入便于识别的设备名称',
          password: '请输入当前密码'
        }
      }
    },
    'system-manage': {
      common: {
        status: {
          enable: '启用',
          disable: '禁用'
        }
      },
      roles: {
        title: '角色列表',
        add: '新增角色',
        edit: '编辑角色',
        permissions: '权限设置',
        permissionMenus: '菜单权限',
        permissionButtons: '按钮权限',
        permissionApis: '接口权限',
        name: '角色名称',
        code: '角色编码',
        status: '角色状态',
        description: '角色描述',
        home: '角色主页',
        form: {
          keyword: '请输入角色名称或编码',
          name: '请输入角色名称',
          code: '请输入角色编码',
          status: '请选择角色状态',
          description: '请输入角色描述',
          home: '请选择角色主页',
          permissionKeyword: '请输入关键字过滤'
        }
      },
      users: {
        title: '用户列表',
        add: '新增用户',
        edit: '编辑用户',
        UserGender: {
          male: '男',
          female: '女',
          unknown: '未知'
        },
        username: '用户名',
        gender: '性别',
        name: '姓名',
        phone: '手机号',
        email: '邮箱',
        is_active: '是否激活',
        is_superuser: '是否超管',
        active_time: '激活时间: {active_time}',
        last_login: '最近登录时间',
        status: '用户状态',
        roles: '用户角色',
        contact: '联系方式',
        resetPassword: '重置密码',
        resetPasswordTitle: '重置密码: {username}',
        resetPasswordSuccess: '密码重置成功',
        batchResetPassword: '批量重置密码',
        batchResetPasswordTitle: '批量重置密码（已选择 {count} 个用户）',
        batchResetPasswordSuccess: '批量重置密码成功',
        confirmBatchResetPassword: '确认重置密码吗?',
        newPassword: '新密码',
        confirmPassword: '确认密码',
        form: {
          keyword: '请输入姓名或用户名',
          contact: '请输入手机号或邮箱',
          username: '请输入用户名',
          gender: '请选择性别',
          name: '请输入昵称',
          phone: '请输入手机号',
          email: '请输入邮箱',
          is_active: '请选择激活状态',
          is_superuser: '请选择是否为超管',
          status: '请选择用户状态',
          newPassword: '请输入新密码',
          confirmPassword: '请再次输入新密码'
        }
      },
      loginLogs: {
        title: '登录日志',
        searchTitle: '日志筛选',
        keyword: '账号',
        keywordPlaceholder: '请输入用户名或姓名',
        account: '账号 / 姓名',
        loginMethod: '登录方式',
        ipAddress: 'IP 地址',
        location: '归属地',
        failureCode: '失败代码',
        requestId: '请求 ID',
        loginTime: '登录时间',
        logoutTime: '登出时间',
        timeRange: '时间范围',
        result: {
          title: '结果',
          success: '成功',
          failure: '失败'
        },
        stage: {
          title: '登录阶段',
          password: '密码登录',
          mfa: '双因素验证',
          passkey: '生物识别',
          providerCallback: '认证回调',
          ticketExchange: '登录票据兑换'
        },
        protocol: {
          password: '密码',
          cas: 'CAS',
          oauth2: 'OAuth 2.0',
          oidc: 'OIDC',
          webauthn: 'Passkey'
        },
        device: {
          title: '设备',
          pc: '电脑',
          mobile: '手机',
          tablet: '平板',
          bot: '自动程序',
          unknown: '未知设备'
        }
      },
      menus: {
        title: '菜单列表',
        menuType: '菜单类型',
        menuName: '菜单名称',
        routeName: '路由名称',
        routePath: '路由路径',
        pathParam: '路径参数',
        layout: '布局',
        page: '页面组件',
        i18nKey: '国际化key',
        icon: '图标',
        iconTypeTitle: '图标类型',
        order: '排序',
        constant: '常量路由',
        keepAlive: '缓存路由',
        href: '外链',
        hideInMenu: '隐藏菜单',
        activeMenu: '高亮的菜单',
        multiTab: '支持多页签',
        fixedIndexInTab: '固定在页签中的序号',
        query: '路由参数',
        bindButtons: '关联按钮',
        menuStatus: '菜单状态',
        form: {
          menuName: '请输入菜单名称',
          routeName: '请输入路由名称',
          routePath: '请输入路由路径',
          pathParam: '请输入路径参数',
          page: '请选择页面组件',
          layout: '请选择布局组件',
          i18nKey: '请输入国际化key',
          icon: '请输入图标',
          localIcon: '请选择本地图标',
          order: '请输入排序',
          href: '请输入外链',
          activeMenu: '请选择高亮的菜单的路由名称',
          fixedIndexInTab: '请输入固定在页签中的序号',
          queryKey: '请输入路由参数Key',
          queryValue: '请输入路由参数Value',
          buttonKeyword: '请输入按钮名称或编码过滤'
        },
        addMenu: '新增菜单',
        editMenu: '编辑菜单',
        addChildMenu: '新增子菜单',
        type: {
          directory: '目录',
          menu: '菜单'
        },
        iconType: {
          iconify: 'iconify图标',
          local: '本地图标'
        }
      },
      apis: {
        title: '接口列表',
        add: '添加接口',
        edit: '编辑接口',
        name: '接口名称',
        summary: '接口摘要',
        path: '接口路径',
        method: '请求方法',
        tags: '接口标签',
        status: '接口状态',
        description: '接口描述',
        apiMethod: {
          get: 'GET',
          post: 'POST',
          put: 'PUT',
          patch: 'PATCH',
          delete: 'DELETE'
        },
        syncApi: '同步接口',
        confirmSyncApi: '确认同步接口吗？',
        addWhitelist: '加入白名单',
        confirmAddWhitelist: '确认将该接口加入白名单吗？加入后无需登录即可访问。',
        addWhitelistSuccess: '接口已加入白名单',
        removeWhitelist: '移出白名单',
        confirmRemoveWhitelist: '确认将该接口移出白名单吗？移出后将恢复登录和权限校验。',
        removeWhitelistSuccess: '接口已移出白名单',
        whitelistApi: '白名单',
        batchAddWhitelist: '批量加入白名单',
        batchRemoveWhitelist: '批量移出白名单',
        confirmBatchAddWhitelist: '确认将选中的接口加入白名单吗？',
        confirmBatchRemoveWhitelist: '确认将选中的接口移出白名单吗？',
        form: {
          keyword: '请输入接口名称、摘要、路径或描述',
          method: '请选择请求方法',
          status: '请选择接口状态',
          tags: '请选择接口标签',
          whitelistApi: '请选择是否为白名单接口'
        }
      },
      buttons: {
        title: '按钮列表',
        add: '添加按钮',
        edit: '编辑按钮',
        name: '按钮名称',
        code: '按钮编码',
        status: '按钮状态',
        description: '按钮描述',
        form: {
          keyword: '请输入按钮名称、编码或描述',
          name: '请输入按钮名称',
          code: '请输入按钮编码',
          status: '请选择按钮状态',
          description: '请输入按钮描述'
        }
      }
    }
  },
  form: {
    required: '不能为空',
    username: {
      required: '请输入用户名',
      invalid: '用户名格式不正确'
    },
    phone: {
      required: '请输入手机号',
      invalid: '手机号格式不正确'
    },
    pwd: {
      required: '请输入密码',
      invalid: '密码格式不正确，6-18位字符，包含字母、数字、下划线'
    },
    confirmPwd: {
      required: '请输入确认密码',
      invalid: '两次输入密码不一致'
    },
    code: {
      required: '请输入验证码',
      invalid: '验证码格式不正确'
    },
    email: {
      required: '请输入邮箱',
      invalid: '邮箱格式不正确'
    }
  },
  dropdown: {
    closeCurrent: '关闭',
    closeOther: '关闭其它',
    closeLeft: '关闭左侧',
    closeRight: '关闭右侧',
    closeAll: '关闭所有',
    pin: '固定标签',
    unpin: '取消固定'
  },
  icon: {
    themeConfig: '主题配置',
    themeSchema: '主题模式',
    lang: '切换语言',
    fullscreen: '全屏',
    fullscreenExit: '退出全屏',
    reload: '刷新页面',
    collapse: '折叠菜单',
    expand: '展开菜单',
    pin: '固定',
    unpin: '取消固定'
  },
  datatable: {
    itemCount: '共 {total} 条',
    fixed: {
      left: '左固定',
      right: '右固定',
      unFixed: '取消固定'
    }
  }
};

export default local;
