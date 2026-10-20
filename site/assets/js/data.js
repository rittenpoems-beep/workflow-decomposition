window.WD = (() => {
  const atlas = [
    {
      id: "d3",
      label: "三维 CG",
      en: "3D / CG",
      intro: "从概念到交付的八段生产线。工具会变，阶段与闸门不变。",
      stages: [
        {
          name: "概念设计", en: "CONCEPT",
          input: "目标、受众、参考、交付用途",
          output: "视觉方向、参考板、交付物定义",
          ai: "搜集参考、生成情绪板、整理风格关键词",
          human: "定方向、锁范围、写下验收标准",
          gate: "方向确认",
          failure: "跳过参考，直接让 AI 生成成品"
        },
        {
          name: "概念图", en: "CONCEPT ART",
          input: "视觉方向、参考素材",
          output: "造型、比例、色彩、构图草图",
          ai: "生成变体、放大细节、整理色板",
          human: "挑选、修改、确认视觉语言",
          gate: "概念图确认",
          failure: "把概念图当成最终资产"
        },
        {
          name: "资产拆解", en: "ASSET BREAKDOWN",
          input: "概念图、镜头需求",
          output: "资产清单、hero / prop 优先级、预算",
          ai: "列清单、估复杂度、标注重叠",
          human: "定优先级、砍范围",
          gate: "范围锁定",
          failure: "整场景一次性生成"
        },
        {
          name: "Blockout / 建模", en: "BLOCKOUT",
          input: "资产清单、机位",
          output: "白模、比例、空间关系",
          ai: "搭基础几何、摆相机、做变体",
          human: "校构图、比例、可读性",
          gate: "白模校形",
          failure: "先做细节，后改机位"
        },
        {
          name: "材质 / LookDev", en: "MATERIALS",
          input: "白模、参考",
          output: "PBR 材质、贴图、LookDev",
          ai: "建材质、生成贴图、做旧",
          human: "对照参考、判断质感",
          gate: "同机位对照",
          failure: "材质单看很好，进场景不对"
        },
        {
          name: "灯光 / 渲染", en: "LIGHTING",
          input: "场景、氛围参考",
          output: "布光方案、渲染层、测试帧",
          ai: "布灯、跑渲染、输出 passes",
          human: "看层次、氛围、可读性",
          gate: "光影验收",
          failure: "靠提高曝光解决构图问题"
        },
        {
          name: "后期 / 合成", en: "POST",
          input: "渲染层、调色参考",
          output: "合成、调色、成片",
          ai: "合成、调色、去噪",
          human: "最终画面判断",
          gate: "画面验收",
          failure: "用后期掩盖前期问题"
        },
        {
          name: "交付", en: "DELIVERY",
          input: "成片、工程、资产",
          output: "工程、分层、清单、说明",
          ai: "打包、整理、写文档",
          human: "验收、签字",
          gate: "交付清单",
          failure: "只交一张图，不交工程"
        }
      ]
    },
    {
      id: "music",
      label: "音乐",
      en: "MUSIC",
      intro: "不是「生成一段音频」，而是从参考、约束、动机到母带的一条链路。",
      stages: [
        {
          name: "参考与流派", en: "REFERENCE",
          input: "用途、参考曲、目标受众",
          output: "BPM、调性、段落、频谱、人声密度",
          ai: "测量、转写、分轨、对比",
          human: "判断类型是否匹配、选参照",
          gate: "类型确认",
          failure: "先写歌，再想它用在哪"
        },
        {
          name: "约束定义", en: "CONSTRAINTS",
          input: "参考分析、交付场景",
          output: "时长、BPM、调性、段落数、动态目标",
          ai: "生成参数表、检查自洽",
          human: "拍板、砍掉不必要目标",
          gate: "约束锁定",
          failure: "边做边改规格"
        },
        {
          name: "作曲 / 动机", en: "MOTIF",
          input: "约束、情绪 / 主题",
          output: "动机、和声地图、hook",
          ai: "生成动机与变体、配和声",
          human: "选记忆点、判断情绪",
          gate: "动机确认",
          failure: "没有 hook 就开始编曲"
        },
        {
          name: "编曲 / 配器", en: "ARRANGEMENT",
          input: "动机、段落",
          output: "各段编配、进入 / 退出表",
          ai: "铺配器、写 MIDI、做密度对比",
          human: "听结构、判断「为什么这里进」",
          gate: "段落对照",
          failure: "全程同一密度"
        },
        {
          name: "音色 / 采样", en: "SOUND",
          input: "编配、参考音色",
          output: "音色选择、分轨",
          ai: "选音色、渲染 stems",
          human: "判断质感与融合",
          gate: "音色试听",
          failure: "用音色替代编曲"
        },
        {
          name: "人声 / 演唱", en: "VOCAL",
          input: "旋律、歌词、声线路线",
          output: "人声轨、叠唱、和声",
          ai: "合成、改音素、调时值",
          human: "听咬字、情绪、可懂度",
          gate: "咬字验收",
          failure: "只看转写，不听实际演唱"
        },
        {
          name: "混音", en: "MIX",
          input: "分轨、段落目标",
          output: "平衡、空间、动态",
          ai: "EQ、压缩、混响、侧链",
          human: "听段落弧线、判断主次",
          gate: "段落电平",
          failure: "用响度掩盖编排问题"
        },
        {
          name: "母带 / 交付", en: "MASTER",
          input: "混音、发行 / 平台标准",
          output: "成品、指标、分轨、说明",
          ai: "响度、真峰、导出、分析",
          human: "最终试听、签字",
          gate: "交付清单",
          failure: "指标合格但不好听"
        }
      ]
    },
    {
      id: "software",
      label: "软件",
      en: "SOFTWARE",
      intro: "从需求到交接。代码只是中间产物，能维护、能回滚、能交接才算交付。",
      stages: [
        {
          name: "需求分析", en: "REQUIREMENTS",
          input: "用户问题、业务约束",
          output: "需求清单、验收场景、优先级",
          ai: "访谈整理、竞品调研、写用户故事",
          human: "定优先级、确认问题",
          gate: "需求确认",
          failure: "直接写代码"
        },
        {
          name: "架构设计", en: "ARCHITECTURE",
          input: "需求、非功能约束",
          output: "模块、接口、数据模型、trade-off",
          ai: "出方案、列风险、做原型",
          human: "选型、定边界",
          gate: "架构评审",
          failure: "先堆功能，后补架构"
        },
        {
          name: "前端实现", en: "FRONTEND",
          input: "设计、接口契约",
          output: "UI、交互、状态",
          ai: "写代码、补样式、做响应式",
          human: "验交互、验可访问性",
          gate: "视觉 / 交互验收",
          failure: "只测接口，不测界面"
        },
        {
          name: "后端实现", en: "BACKEND",
          input: "接口契约、数据模型",
          output: "API、服务、迁移",
          ai: "写代码、写迁移、补日志",
          human: "定边界、审安全",
          gate: "接口契约",
          failure: "没有契约就联调"
        },
        {
          name: "测试", en: "TESTING",
          input: "实现、验收场景",
          output: "测试用例、报告、缺陷",
          ai: "写用例、跑测试、定位",
          human: "定验收场景、判断风险",
          gate: "回归通过",
          failure: "冒烟通过就上线"
        },
        {
          name: "部署", en: "DEPLOY",
          input: "测试通过、发布计划",
          output: "线上版本、回滚方案",
          ai: "写 CI/CD、部署、监控",
          human: "审批、定回滚",
          gate: "发布检查",
          failure: "手工上线、没有回滚"
        },
        {
          name: "运维 / 迭代", en: "OPERATE",
          input: "线上数据、告警",
          output: "监控、事故复盘、迭代",
          ai: "监控、告警、日志分析",
          human: "判断优先级、承担责任",
          gate: "复盘",
          failure: "出事故才看日志"
        },
        {
          name: "交付 / 文档", en: "HANDOFF",
          input: "代码、部署、运行数据",
          output: "README、运维手册、移交",
          ai: "生成文档、整理清单",
          human: "验收、签字",
          gate: "交接清单",
          failure: "只有代码，没有交接"
        }
      ]
    },
    {
      id: "video",
      label: "视频",
      en: "VIDEO",
      intro: "选题、分镜、素材、剪辑、声音、包装、发布、归档，每一步都能被单独验收。",
      stages: [
        {
          name: "选题 / 脚本", en: "SCRIPT",
          input: "目标、受众、平台",
          output: "选题、脚本、观点",
          ai: "调研、起草、列结构",
          human: "定观点、定口径",
          gate: "脚本确认",
          failure: "先找素材，后想表达"
        },
        {
          name: "分镜 / 节奏", en: "STORYBOARD",
          input: "脚本、时长",
          output: "分镜、镜头表、节奏",
          ai: "拆分镜、估时长、出变体",
          human: "定节奏、删冗余",
          gate: "分镜评审",
          failure: "一镜到底，没有节奏设计"
        },
        {
          name: "素材 / 拍摄", en: "FOOTAGE",
          input: "分镜、场景",
          output: "素材、备选、素材表",
          ai: "生成 / 整理素材、转写",
          human: "判断可用性、补拍",
          gate: "素材筛选",
          failure: "素材不够，靠剪辑救"
        },
        {
          name: "剪辑 / 字幕", en: "EDIT",
          input: "素材、脚本",
          output: "粗剪、字幕、结构",
          ai: "转写、粗剪、对齐",
          human: "定结构、定节奏",
          gate: "粗剪确认",
          failure: "先做特效，后定结构"
        },
        {
          name: "声音 / 配乐", en: "AUDIO",
          input: "粗剪、情绪",
          output: "人声、BGM、混音",
          ai: "降噪、选曲、混音",
          human: "听情绪、听清晰度",
          gate: "响度 / 清晰度",
          failure: "BGM 压过人声"
        },
        {
          name: "包装 / 调色", en: "GRADE",
          input: "剪辑、品牌规范",
          output: "调色、包装、封面",
          ai: "调色、套版、生成封面",
          human: "定风格、检查品牌",
          gate: "画面验收",
          failure: "包装过度，信息不清"
        },
        {
          name: "发布 / 复盘", en: "PUBLISH",
          input: "成片、平台规则",
          output: "发布、标题、封面、数据",
          ai: "起标题、做封面、整理数据",
          human: "定口径、按发布键",
          gate: "发布检查",
          failure: "发完不看数据"
        },
        {
          name: "交付 / 归档", en: "ARCHIVE",
          input: "成片、工程、素材",
          output: "归档、工程、授权记录",
          ai: "整理命名、打包、写说明",
          human: "验收、签字",
          gate: "归档清单",
          failure: "只剩成片，工程丢失"
        }
      ]
    }
  ];

  const routes = [
    {
      id: "web",
      label: "网页实时场景",
      brief: "做一个雨夜街角的场景，访客打开链接就能拖动、缩放、分享。",
      fit: {
        tool: "Three.js",
        tag: "浏览器实时",
        why: "实时渲染、零安装、单文件可分享；性能预算与交互都能直接验收。",
        list: ["单文件 HTML", "鼠标 / 触屏交互", "实时帧率"],
        checks: ["控制台无错误", "1440×1080 ≥ 30 fps", "离线版零外部请求"]
      },
      wrong: {
        tool: "Blender 离线渲染",
        tag: "交付形态错配",
        why: "产出是图片或视频，无法交互；工程与贴图也不适合网页加载。",
        checks: ["无法实时交互", "部署与加载成本高", "超出当前交付范围"]
      },
      trigger: "交付物是网页"
    },
    {
      id: "film",
      label: "影视级可编辑资产",
      brief: "做一个可继续修改的三维场景，交付 .blend、分层渲染与资产清单。",
      fit: {
        tool: "Blender + Cycles",
        tag: "可编辑资产",
        why: "可编辑工程、PBR 材质、灯光、分层 passes，能进入美术管线。",
        list: [".blend 工程", "分层 passes", "资产清单"],
        checks: ["同机位对照", "材质特写", "光影层次", "可交接"]
      },
      wrong: {
        tool: "Three.js",
        tag: "不是 DCC 资产",
        why: "实时场景不是可编辑 DCC 资产；无法直接交付分层渲染与工程文件。",
        checks: ["没有 .blend", "无法分层合成", "资产不可在 DCC 中编辑"]
      },
      trigger: "交付物是可编辑资产"
    },
    {
      id: "douyin",
      label: "15 秒抖音 BGM",
      brief: "做一段 15 秒、能卡点、有 hook、可替换分轨的短视频 BGM。",
      fit: {
        tool: "采样 MIDI + DAW / DSP",
        tag: "可复现",
        why: "结构、时长、BPM、分轨、母带都可控；能对齐参考并保留可修改性。",
        list: ["成品 WAV / MP3", "MIDI", "分轨"],
        checks: ["时长 / BPM 对齐", "hook 在前 2 秒", "真峰不削波"]
      },
      wrong: {
        tool: "纯端到端音频生成",
        tag: "可控性不足",
        why: "生成快，但结构、分轨、音色与母带不可逐项控制；难以对齐参考和返工。",
        checks: ["结构不可控", "分轨不可改", "返工只能重新生成"]
      },
      trigger: "需要可复现与可改分轨"
    },
    {
      id: "vocal",
      label: "英文歌逐音素控制",
      brief: "写一首英文歌，要求每个词的咬字可修、能导出多条人声轨。",
      fit: {
        tool: "ACE Studio + CLI",
        tag: "可逐音素编辑",
        why: "可逐音素编辑、导出多轨；适合需要细调英文演唱的实验。",
        list: ["人声分轨", "音素编辑", "工程文件"],
        checks: ["单句咬字测试", "高音区可懂度", "导出稳定性"]
      },
      wrong: {
        tool: "Suno / Udio 端到端",
        tag: "精度错配",
        why: "整体听感可能很好，但无法逐音素修咬字、导出可控分轨；不适合这种精度要求。",
        checks: ["无法逐音素编辑", "分轨控制有限", "返工只能重抽"]
      },
      trigger: "需要逐音素控制",
      caveat: "ACE 的声线模型仍有咬字上限；先做单句测试，再决定是否用于整首。"
    },
    {
      id: "mvp",
      label: "一周内上线内部工具",
      brief: "给团队做一个可用的内部工具，一周上线，能登录、能存数据、能导出。",
      fit: {
        tool: "成熟框架 + 托管数据库",
        tag: "把时间花在业务上",
        why: "把时间花在业务逻辑与验收上，而不是基础设施。",
        list: ["可访问的 Web 应用", "数据库", "部署与回滚"],
        checks: ["核心流程可用", "权限与备份", "监控与回滚"]
      },
      wrong: {
        tool: "从零手写基础设施",
        tag: "造轮子",
        why: "在有限时间内重复造轮子，风险高、验证慢，且不产生业务差异。",
        checks: ["上线时间不可控", "运维成本高", "安全与备份容易漏"]
      },
      trigger: "交付物是可用工具"
    }
  ];

  const gateModes = [
    { id: "smoke", label: "冒烟测试", hint: "只看 1–2 关：进程、文件、格式、指标。" },
    { id: "full", label: "完整验收", hint: "四关全看：参照、人的判断、交付责任。" }
  ];

  const gateCases = [
    {
      id: "quiet",
      label: "Quiet Room",
      kind: "三维 / Blender",
      summary: "工程能打开、能渲染，但未获最终认可。",
      gates: [
        { title: "能运行", status: "pass", detail: "Quiet_Room.blend 可打开；1600×900 整景与 1800×1100 近景实际渲染成功。" },
        { title: "符合规格", status: "pass", detail: "2,224 个对象 / 189 张贴图；尺寸、格式、渲染设置正确。" },
        { title: "符合参照", status: "fail", detail: "房间完整性、参考图光影与运镜仍有明确欠缺；无完成版动画。" },
        { title: "愿意签字", status: "fail", detail: "用户未给出最终认可；项目停在交接状态。" }
      ],
      smokeNote: "只看前两关：它像是一个完成的项目。",
      verdict: "未交付",
      verdictNote: "能打开、能出图，但没走到可交接。"
    },
    {
      id: "alpine",
      label: "Alpine Drive",
      kind: "三维 / Blender",
      summary: "有一张完整的成片，但没有达到替换标准。",
      gates: [
        { title: "能运行", status: "pass", detail: "Alpine_Drive_final.blend 可打开重渲；hero_final.png 已输出。" },
        { title: "符合规格", status: "pass", detail: "1280×920、Cycles GPU、72 采样 + OIDN、AgX；三套灯光可切换。" },
        { title: "符合参照", status: "fail", detail: "村庄比例、山体层理、车内简化几何未达替换标准；v63 未进入成片。" },
        { title: "愿意签字", status: "fail", detail: "项目于 2026-10-20 终止。" }
      ],
      smokeNote: "只看前两关：它有一张完整的成片。",
      verdict: "终止",
      verdictNote: "成片存在，但未达到参考标准。"
    },
    {
      id: "rainy",
      label: "雨夜便利店",
      kind: "三维 / Three.js",
      summary: "范围写得清楚，所以它能被诚实地验收。",
      gates: [
        { title: "能运行", status: "pass", detail: "页面加载；门循环 15.5 s；控制台无错误；离线版零外部请求。" },
        { title: "符合规格", status: "pass", detail: "2,101 primitives / 247,038 tris / 255 calls；36.9 fps @1440×1080（Intel UHD）。" },
        { title: "符合参照", status: "pass", detail: "同机位对照雨夜氛围、构图、湿地反射，达到「风格化实时」的约定范围。" },
        { title: "愿意签字", status: "pass", detail: "作为浏览器演示交付；明确不承担影视资产职责。" }
      ],
      smokeNote: "只看前两关：它也能通过，但真正的通过发生在第 3、4 关。",
      verdict: "可交付",
      verdictNote: "范围写清楚了，所以它能被诚实地验收。"
    },
    {
      id: "bwu",
      label: "BWU v4",
      kind: "音乐 / ACE Studio",
      summary: "指标全部合格，人耳不通过。",
      gates: [
        { title: "能运行", status: "pass", detail: "3:04 音乐生成；7 条 ACE 人声轨导出；工程可保存重开；混音 / 分析跑通。" },
        { title: "符合规格", status: "pass", detail: "99 BPM、B 小调、76 小节、9 段；段落电平与响度指标有报告。" },
        { title: "符合参照", status: "fail", detail: "咬字含混、旋律原只跨 5 个半音、outro 一度低 10 dB；修完后仍不像 BWU。" },
        { title: "愿意签字", status: "fail", detail: "用户判断「听起来很诡异」，实验终止。" }
      ],
      smokeNote: "只看前两关：它是最完整的一版工程。",
      verdict: "终止",
      verdictNote: "指标全部合格，人耳不通过。"
    },
    {
      id: "pride",
      label: "15 秒 BGM",
      kind: "音乐 / 采样 MIDI",
      summary: "目标窄且明确，所以它通过了。",
      gates: [
        { title: "能运行", status: "pass", detail: "15.36 s 音频生成；21 条分轨；混音、母带、分析全部跑通。" },
        { title: "符合规格", status: "pass", detail: "140.625 BPM、C 小调、9 小节；−9.18 LUFS / −1.13 dBTP / LRA 1.5。" },
        { title: "符合参照", status: "pass", detail: "频谱重心 2529.8 Hz vs 参考 2497.6 Hz；时长与节拍对齐。" },
        { title: "愿意签字", status: "pass", detail: "作为 15 秒 BGM 在公开仓库发布；目标窄且明确。" }
      ],
      smokeNote: "只看前两关：和 BWU v4 一样，它也会通过。",
      verdict: "可交付",
      verdictNote: "它没有试图成为一首完整的歌。"
    }
  ];

  const worksheetExample = {
    project: "雨夜便利店三维场景",
    goal: "做一个能在浏览器里实时浏览、具有雨夜氛围的便利店街角",
    audience: "个人站「立体附录」，访客点击即可打开",
    deliverable: "单文件 HTML（离线版）+ 源码 + 截图 + 验证记录；不交付可编辑 .blend",
    reference: "雨夜街景参考图、便利店参考；冷蓝环境 + 暖色店内光；湿地可见反射",
    stages: "1. 定义：用途、受众、交付物\n2. 参考：氛围与构图标准\n3. 资产拆解：建筑、道具、灯光清单\n4. Blockout：体块、机位、构图\n5. 材质 / 灯光：冷暖关系、反射\n6. 动画 / 交互：门、雨、涟漪\n7. 性能：帧率、draw calls\n8. 交付：HTML、源码、验证记录",
    routes: "A. Three.js 单文件 — 匹配网页实时\nB. Blender + Cycles — 适合影视资产，不匹配当前目标\nC. 视频渲染 — 不可交互，不匹配",
    acceptance: "1. 能运行：页面打开、无控制台错误\n2. 符合规格：1440×1080 ≥ 30 fps、离线零请求\n3. 符合参照：雨夜氛围、构图、冷暖对比\n4. 愿意签字：愿意作为个人站附录发布",
    notDoing: "不做影视级资产；不做 .blend；不做动画镜头；不引入外部模型与贴图",
    stop: "连续两次优化后仍低于 30 fps；离线版出现外部请求且无法定位；视觉与参考差距无法缩小"
  };

  return { atlas, routes, gateModes, gateCases, worksheetExample };
})();
