# 证据与边界

这本册子里的案例来自真实项目，但它们不是「专业交付」的证明。

这份文档说明：哪些结论有直接证据，哪些来自过程记录，哪些只是人的判断；以及哪些东西没有被放进仓库。

## 证据分级

| 级别 | 含义 | 例子 |
|---|---|---|
| **A · 文件可核** | 仓库或原始工程中有可直接打开、复算的文件 | 渲染图、验证 JSON、音频、工程文件 |
| **B · 过程记录** | 来自会话日志、构建记录或当时的统计输出，原始文件可能已删除 | BWU v4 的段落电平、旋律统计、G2P 错误 |
| **C · 人的判断** | 作者或用户的主观验收结论 | 「听起来很诡异」「未获最终认可」 |

文章中的核心论点不依赖某一个数字；数字的作用是让过程可检查，而不是制造「客观」的假象。

## 三维案例

| 结论 | 证据 | 级别 |
|---|---|---|
| 离线版 2,101 primitives / 247,038 tris / 255 draw calls / 36.9 fps @ 1440×1080 | `rainy-night-mart/codex-threejs/outputs/验证记录.json`、`work/verification.json` | A |
| 离线版零外部请求、无控制台错误 | 同上，`externalRequests: []`、`errors: []` | A |
| Route A 自动门 15.5 秒周期，关闭位 ±0.615，开门过程 ±1.714 | `rainy-night-mart/README.md`、实拍记录 | A |
| Route A 在 Edge 中无控制台错误，交互已检查 | `rainy-night-mart/README.md` | A |
| Quiet Room 2,224 个对象、189 张打包图像 | `quiet-room-cg/HANDOFF.md`、`student_project_qa.json` | A |
| Quiet Room 1600×900 整景与 1800×1100 近景实际渲染成功 | `quiet-room-cg/HANDOFF.md` | A |
| Quiet Room 没有完成版动画 MP4，未获最终认可 | `quiet-room-cg/README.md`、`HANDOFF.md` | A |
| Alpine Drive 1280×920、Cycles GPU、72 采样 + OIDN、AgX | `alpine-drive-cg/README.md` | A |
| Alpine Drive 于 2026-10-20 终止，v63 未进入成片 | `alpine-drive-cg/README.md` | A |
| Alpine Drive 已知问题：村庄比例、山体、车内简化几何 | `alpine-drive-cg/README.md` | C（作者自评） |

**边界说明**

- 36.9 fps 是 1440×1080、Intel UHD 的单机样本，不是通用性能承诺。
- 两套 Three.js 场景是风格化实时场景，不是写实影视资产；它们的通过只针对「浏览器实时演示」这一范围。
- Quiet Room 与 Alpine Drive 的工程、贴图与阶段文件仍在本地，本仓库只收录压缩后的展示图与结论。

## 音乐案例

### 15 秒作品

| 结论 | 证据 | 级别 |
|---|---|---|
| 15.36 s / 140.625 BPM / C 小调 / 9 小节 / 21 条分轨 | `ritten-musicByAI/README.md` | A |
| −9.18 LUFS / 真峰 −1.13 dBTP / LRA 1.5 | `ritten-musicByAI/analysis/pride_envy_douyin_stats.json` | A |
| 频谱重心 2529.8 Hz，参考 2497.6 Hz | 同上 | A |
| 代码 MIT，音乐 CC BY 4.0 | `ritten-musicByAI/LICENSE`、`LICENSE-MUSIC` | A |

### BWU v4

| 结论 | 证据 | 级别 |
|---|---|---|
| 3:04.2 音乐 / 99 BPM / B 小调（谱面 F# 小调 +5）/ 76 小节 / 9 段 | 2026-10-19 会话记录 | B |
| 12 轨采样 bed + 7 轨 ACE 人声 | 同上 | B |
| 40 首语料：中位 99.4 BPM、189 s、7 段；152 verse / 33 chorus | 当时的 `BWU_GRAMMAR.md` 与会话记录 | B |
| 段落 RMS：intro −23.3 / verse −19.6 / chorus −17.1 / bridge −17.2 / outro −16.7 dB | 同上 | B |
| 旋律原为 5 个半音、89% 级进；重写后 19 个半音，跳进 16% | 会话记录 | B |
| G2P 错误：every→ev-eh、permission→sigh、stop→sdop、score→sgor、quiet→kwee-et | 会话记录 | B |
| outro 一度比 chorus 低近 10 dB，后修正到 −3.0 dB | 会话记录 | B |
| 定版混音曾为 −13.19 LUFS / −1.5 dBTP | 会话记录 | B |
| 用户判断「听起来很诡异」，实验于 2026-10-20 终止 | 用户原话与会话记录 | C |

**边界说明**

- BWU v4 的工程、语料分析、参考音频与导出文件已按用户要求删除；本仓库不重新分发完整歌曲，只保留 15 秒作品与复盘。
- 40 首语料的统计是当时一次分析的记录，原始分析文件已删除；数字按会话记录保留，未重新计算。
- 「ACE Studio 是否专业」与「这条路线是否适合当前交付物」是两个问题。案例 02 给出了比文章更完整的对话上下文。
- 本仓库不分发 BoyWithUke 的任何音频或歌词；参考只用于类型、结构与参数分析。

## 文章与图示

| 内容 | 说明 |
|---|---|
| `article/workflow-decomposition.md` | 原文全文，加入图示与案例链接 |
| `site/assets/diagrams/*.svg` | 为本仓库绘制的原创图示，使用系统字体 |
| `site/assets/images/og-cover.png` | 为本仓库生成的封面 |
| `site/assets/images/*.jpg` | 从原始渲染图压缩，用于网页展示 |

图示与封面由作者生成，随正文以 CC BY 4.0 授权。

## 时间线（可确认的部分）

| 日期 | 事件 |
|---|---|
| 2026-10-18 | 开始音乐实验；第一版 2:47 古典 tone poem 被否；改为 15.36 秒抖音向 BGM |
| 2026-10-19 | 分析 40 首 BWU 语料；v1–v4 返工；ACE 人声重建、逐音素修正、重混 |
| 2026-10-20 | 用户判断 v4「诡异」；音乐实验终止，工程文件删除；Alpine Drive 终止 |
| 2026-10 | 整理本文、案例、图示与仓库 |

三维实验与 Three.js 对照的具体日期未在项目中记录，因此不写入时间线。

## 未声称的事情

- 没有声称这些作品达到专业交付水准；
- 没有声称所有资产均由 AI 从零生成；
- 没有声称 36.9 fps、−9.18 LUFS 等单一指标代表普遍质量；
- 没有声称 ACE Studio、Blender 或 Three.js 本身「不专业」；
- 没有把用户的否定意见包装成客观行业结论。

## 原始项目与链接

- Three.js 对照：`rainy-night-mart`（本地工程，含两套实现与验证记录）
- Quiet Room：`quiet-room-cg`（本地工程，未完成、未获批准）
- Alpine Drive：`alpine-drive-cg`（本地归档，已终止）
- 15 秒音乐：[ritten-musicByAI](https://github.com/rittenpoems-beep/ritten-musicByAI)（公开仓库）
- 个人站：[ritten-poems](https://github.com/rittenpoems-beep/ritten-poems)

如果你要引用本仓库中的数字，请同时引用对应的边界说明，不要把单机样本写成通用结论。
