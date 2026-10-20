(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const WD = window.WD || {};

  const esc = (value) =>
    String(value ?? "").replace(/[&<>"']/g, (ch) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[ch]));

  /* ---------- masthead / mobile menu ---------- */
  const body = document.body;
  const menuBtn = $("#menuBtn");
  const topnav = $("#topnav");

  if (menuBtn && topnav) {
    const setNav = (open) => {
      body.classList.toggle("nav-open", open);
      menuBtn.setAttribute("aria-expanded", String(open));
    };
    menuBtn.addEventListener("click", () => setNav(!body.classList.contains("nav-open")));
    topnav.addEventListener("click", (e) => {
      if (e.target.closest("a")) setNav(false);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setNav(false);
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 820) setNav(false);
    });
  }

  /* ---------- scroll progress + toc ---------- */
  const progressBar = $("#progressBar");
  const headings = ["s01", "s02", "s03", "s04", "s05", "s06"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  const tocLinks = $$(".toc nav a");
  let scrollTicking = false;

  const updateScroll = () => {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progressBar) {
        const pct = max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0;
        progressBar.style.width = pct + "%";
      }
      if (headings.length) {
        let current = headings[0];
        for (const heading of headings) {
          if (heading.getBoundingClientRect().top <= 140) current = heading;
        }
        tocLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === "#" + current.id);
        });
      }
      scrollTicking = false;
    });
  };

  window.addEventListener("scroll", updateScroll, { passive: true });
  window.addEventListener("resize", updateScroll);
  updateScroll();

  /* ---------- reveal ---------- */
  const revealItems = $$(".reveal");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("in"));
  }

  /* ---------- lightbox ---------- */
  const lightbox = $("#lightbox");
  const lbImg = $("#lbImg");
  const lbCaption = $("#lbCaption");
  const lbClose = $("#lbClose");
  let lastFocused = null;

  const openLightbox = (link) => {
    if (!lightbox || !lbImg) return;
    lastFocused = document.activeElement;
    lbImg.src = link.getAttribute("href");
    lbImg.alt = link.querySelector("img")?.alt || "";
    if (lbCaption) lbCaption.textContent = link.dataset.caption || "";
    lightbox.hidden = false;
    body.classList.add("lightbox-open");
    lbClose?.focus();
  };

  const closeLightbox = () => {
    if (!lightbox || lightbox.hidden) return;
    lightbox.hidden = true;
    body.classList.remove("lightbox-open");
    lbImg?.removeAttribute("src");
    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
  };

  $$("[data-lightbox]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      openLightbox(link);
    });
  });
  lbClose?.addEventListener("click", closeLightbox);
  lightbox?.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });

  /* ---------- generic tab keyboard ---------- */
  const bindTabKeys = (container, count, onSelect) => {
    if (!container || count < 1) return;
    container.addEventListener("keydown", (e) => {
      const delta = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (delta === undefined && e.key !== "Home" && e.key !== "End") return;
      e.preventDefault();
      const tabs = $$('[role="tab"]', container);
      const selected = tabs.findIndex((tab) => tab.getAttribute("aria-selected") === "true");
      let next = selected < 0 ? 0 : selected;
      if (e.key === "Home") next = 0;
      else if (e.key === "End") next = count - 1;
      else next = (next + delta + count) % count;
      onSelect(next);
      $$('[role="tab"]', container)[next]?.focus();
    });
  };

  /* ---------- workflow atlas ---------- */
  const atlas = WD.atlas || [];
  const atlasTabs = $("#atlasTabs");
  const atlasRail = $("#atlasRail");
  const atlasIntro = $("#atlasIntro");
  const atlasDetail = $("#atlasDetail");
  const atlasCount = $("#atlasCount");
  let atlasDomain = 0;
  let atlasStage = 0;

  const fieldHtml = (label, value, extra = "") =>
    `<div class="detail-field ${extra}"><span class="field-label">${esc(label)}</span><p class="field-value">${esc(value)}</p></div>`;

  const renderAtlasTabs = () => {
    if (!atlasTabs) return;
    atlasTabs.innerHTML = "";
    atlas.forEach((domain, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "atlas-tab" + (index === atlasDomain ? " active" : "");
      button.setAttribute("role", "tab");
      button.setAttribute("aria-selected", String(index === atlasDomain));
      button.innerHTML = `${esc(domain.en)}<span>${esc(domain.label)}</span>`;
      button.addEventListener("click", () => selectDomain(index));
      atlasTabs.appendChild(button);
    });
  };

  const renderAtlasDetail = () => {
    if (!atlasDetail || !atlas.length) return;
    const domain = atlas[atlasDomain];
    const stage = domain.stages[atlasStage];
    const current = String(atlasStage + 1).padStart(2, "0");
    const total = String(domain.stages.length).padStart(2, "0");

    atlasDetail.innerHTML = `
      <div class="detail-head">
        <div>
          <p class="detail-kicker">${esc(domain.en)} / STAGE ${current}</p>
          <h3 class="detail-title">${esc(stage.name)}<small>${esc(stage.en)}</small></h3>
        </div>
        <span class="detail-progress">${current} / ${total}</span>
      </div>
      <div class="detail-grid">
        ${fieldHtml("输入 / INPUT", stage.input)}
        ${fieldHtml("输出 / OUTPUT", stage.output)}
        ${fieldHtml("AI 执行 / AI", stage.ai)}
        ${fieldHtml("人的判断 / HUMAN", stage.human)}
        ${fieldHtml("验收点 / GATE", stage.gate, "is-gate")}
        ${fieldHtml("常见失败 / FAILURE", stage.failure, "is-failure")}
      </div>
      <div class="detail-nav">
        <button type="button" class="nav-btn" data-step="-1"${atlasStage === 0 ? " disabled" : ""}>← 上一阶段</button>
        <button type="button" class="nav-btn" data-step="1"${atlasStage === domain.stages.length - 1 ? " disabled" : ""}>下一阶段 →</button>
      </div>`;

    if (atlasCount) {
      atlasCount.textContent = `${current} / ${total} · ${domain.label}`;
    }
  };

  const renderAtlasRail = () => {
    if (!atlasRail || !atlas.length) return;
    const stages = atlas[atlasDomain].stages;
    atlasRail.innerHTML = "";
    stages.forEach((stage, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "stage-btn" + (index === atlasStage ? " active" : "");
      button.setAttribute("role", "tab");
      button.setAttribute("aria-selected", String(index === atlasStage));
      button.innerHTML = `
        <span class="stage-num">${String(index + 1).padStart(2, "0")}</span>
        <span class="stage-name">${esc(stage.name)}</span>
        <span class="stage-gate">${esc(stage.gate)}</span>`;
      button.addEventListener("click", () => selectStage(index));
      atlasRail.appendChild(button);
    });
  };

  const selectStage = (index) => {
    const stages = atlas[atlasDomain]?.stages || [];
    if (!stages.length) return;
    atlasStage = Math.min(Math.max(index, 0), stages.length - 1);
    $$(".stage-btn", atlasRail).forEach((button, i) => {
      button.classList.toggle("active", i === atlasStage);
      button.setAttribute("aria-selected", String(i === atlasStage));
    });
    renderAtlasDetail();
  };

  const selectDomain = (index) => {
    if (!atlas.length) return;
    atlasDomain = Math.min(Math.max(index, 0), atlas.length - 1);
    atlasStage = 0;
    $$(".atlas-tab", atlasTabs).forEach((button, i) => {
      button.classList.toggle("active", i === atlasDomain);
      button.setAttribute("aria-selected", String(i === atlasDomain));
    });
    const domain = atlas[atlasDomain];
    if (atlasIntro) atlasIntro.textContent = domain.intro;
    renderAtlasRail();
    renderAtlasDetail();
  };

  if (atlas.length) {
    renderAtlasTabs();
    selectDomain(0);
    bindTabKeys(atlasTabs, atlas.length, selectDomain);
    if (atlasRail) {
      bindTabKeys(atlasRail, atlas[atlasDomain].stages.length, selectStage);
    }
    atlasDetail?.addEventListener("click", (e) => {
      const button = e.target.closest("[data-step]");
      if (!button) return;
      selectStage(atlasStage + Number(button.dataset.step));
    });
  }

  /* ---------- route comparator ---------- */
  const routes = WD.routes || [];
  const routeTabs = $("#routeTabs");
  const routeBrief = $("#routeBrief");
  const routeFit = $("#routeFit");
  const routeWrong = $("#routeWrong");
  const routeTrigger = $("#routeTrigger");
  let routeIndex = 0;

  const routeListHtml = (items, className) =>
    `<ul class="${className}">${items.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>`;

  const renderRouteTabs = () => {
    if (!routeTabs) return;
    routeTabs.innerHTML = "";
    routes.forEach((route, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "route-tab" + (index === routeIndex ? " active" : "");
      button.setAttribute("role", "tab");
      button.setAttribute("aria-selected", String(index === routeIndex));
      button.textContent = route.label;
      button.addEventListener("click", () => selectRoute(index));
      routeTabs.appendChild(button);
    });
  };

  const renderRoute = () => {
    if (!routes.length) return;
    const route = routes[routeIndex];

    if (routeBrief) {
      routeBrief.innerHTML = `<span class="brief-label">BRIEF / 需求</span><p class="brief-text">${esc(route.brief)}</p>`;
    }
    if (routeFit) {
      routeFit.innerHTML = `
        <div class="route-head">
          <span class="route-tag">MATCH · ${esc(route.fit.tag)}</span>
          <h3 class="route-tool">${esc(route.fit.tool)}</h3>
          <p class="route-why">${esc(route.fit.why)}</p>
        </div>
        ${routeListHtml(route.fit.list, "route-list")}
        ${routeListHtml(route.fit.checks, "route-checks")}
        ${route.caveat ? `<p class="route-note">${esc(route.caveat)}</p>` : ""}`;
    }
    if (routeWrong) {
      routeWrong.innerHTML = `
        <div class="route-head">
          <span class="route-tag">MISMATCH · ${esc(route.wrong.tag)}</span>
          <h3 class="route-tool">${esc(route.wrong.tool)}</h3>
          <p class="route-why">${esc(route.wrong.why)}</p>
        </div>
        ${routeListHtml(route.wrong.checks, "route-checks")}`;
    }
    if (routeTrigger) {
      routeTrigger.innerHTML = `<span class="trigger-label">ROUTE TRIGGER</span><span class="trigger-text">${esc(route.trigger)}</span>`;
    }
  };

  const selectRoute = (index) => {
    if (!routes.length) return;
    routeIndex = Math.min(Math.max(index, 0), routes.length - 1);
    $$(".route-tab", routeTabs).forEach((button, i) => {
      button.classList.toggle("active", i === routeIndex);
      button.setAttribute("aria-selected", String(i === routeIndex));
    });
    renderRoute();
  };

  if (routes.length) {
    renderRouteTabs();
    selectRoute(0);
    bindTabKeys(routeTabs, routes.length, selectRoute);
  }

  /* ---------- acceptance gates ---------- */
  const gateCases = WD.gateCases || [];
  const gateModes = WD.gateModes || [];
  const gateCasesEl = $("#gateCases");
  const gateModesEl = $("#gateModes");
  const gateSummary = $("#gateSummary");
  const gateGrid = $("#gateGrid");
  const gateVerdict = $("#gateVerdict");
  let gateCase = 0;
  let gateMode = "smoke";

  const statusLabels = { pass: "PASS / 通过", fail: "FAIL / 未通过", partial: "PARTIAL / 部分" };

  const renderGateCases = () => {
    if (!gateCasesEl) return;
    gateCasesEl.innerHTML = "";
    gateCases.forEach((item, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "gate-tab" + (index === gateCase ? " active" : "");
      button.setAttribute("role", "tab");
      button.setAttribute("aria-selected", String(index === gateCase));
      button.title = item.kind;
      button.textContent = item.label;
      button.addEventListener("click", () => selectGateCase(index));
      gateCasesEl.appendChild(button);
    });
  };

  const renderGateModes = () => {
    if (!gateModesEl) return;
    gateModesEl.innerHTML = "";
    gateModes.forEach((mode) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "gate-mode" + (mode.id === gateMode ? " active" : "");
      button.setAttribute("aria-pressed", String(mode.id === gateMode));
      button.title = mode.hint;
      button.textContent = mode.label;
      button.addEventListener("click", () => selectGateMode(mode.id));
      gateModesEl.appendChild(button);
    });
  };

  const renderGates = () => {
    if (!gateCases.length) return;
    const current = gateCases[gateCase];

    if (gateSummary) {
      gateSummary.textContent = `${current.label} · ${current.kind} — ${current.summary}`;
    }

    if (gateGrid) {
      gateGrid.innerHTML = current.gates.map((gate, index) => {
        const muted = gateMode === "smoke" && index >= 2;
        const cls = muted ? "gate is-muted" : `gate ${gate.status}`;
        const status = muted ? "NOT CHECKED / 未检查" : (statusLabels[gate.status] || gate.status);
        const detail = muted
          ? "冒烟测试不检查这一关。要判断它，需要参照、人的眼睛和签字。"
          : gate.detail;
        return `
          <article class="${cls}">
            <span class="gate-num">GATE ${String(index + 1).padStart(2, "0")}</span>
            <h3 class="gate-name">${esc(gate.title)}</h3>
            <span class="gate-status">${esc(status)}</span>
            <p class="gate-detail">${esc(detail)}</p>
          </article>`;
      }).join("");
    }

    if (gateVerdict) {
      const smoke = gateMode === "smoke";
      const passes = smoke || current.verdict === "可交付";
      gateVerdict.classList.toggle("pass", passes);
      gateVerdict.classList.toggle("fail", !passes);
      gateVerdict.innerHTML = `
        <div>
          <p class="verdict-label">${smoke ? "SMOKE TEST / 冒烟测试" : "FULL ACCEPTANCE / 完整验收"}</p>
          <p class="verdict-main">${smoke ? "看起来能用" : esc(current.verdict)}</p>
        </div>
        <p class="verdict-note">${esc(smoke ? current.smokeNote : current.verdictNote)}</p>`;
    }
  };

  const selectGateCase = (index) => {
    if (!gateCases.length) return;
    gateCase = Math.min(Math.max(index, 0), gateCases.length - 1);
    $$(".gate-tab", gateCasesEl).forEach((button, i) => {
      button.classList.toggle("active", i === gateCase);
      button.setAttribute("aria-selected", String(i === gateCase));
    });
    renderGates();
  };

  const selectGateMode = (id) => {
    gateMode = id;
    $$(".gate-mode", gateModesEl).forEach((button, i) => {
      const active = gateModes[i].id === id;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    renderGates();
  };

  if (gateCases.length) {
    renderGateCases();
    renderGateModes();
    selectGateCase(0);
    bindTabKeys(gateCasesEl, gateCases.length, selectGateCase);
  }

  /* ---------- worksheet ---------- */
  const wsForm = $("#wsForm");
  const wsPreview = $("#wsPreview");
  const wsHint = $("#wsHint");
  const initialPreview = wsPreview ? wsPreview.textContent : "";
  const initialHint = wsHint ? wsHint.textContent : "";
  const fieldNames = ["project", "audience", "goal", "deliverable", "reference", "stages", "routes", "acceptance", "notDoing", "stop"];

  const setHint = (message) => {
    if (wsHint) wsHint.textContent = message;
  };

  const buildMarkdown = (data) => {
    const fill = (value) => (value && value.trim() ? value.trim() : "（待补）");
    return `# 工作流拆解工作表 · ${fill(data.project)}

> 生成自《Workflow Decomposition Is All You Need》· Ritten Poems
> 先定义交付物与验收标准，再让 AI 执行。

## 00. 项目定义
- **项目名称**：${fill(data.project)}
- **受众 / 场景**：${fill(data.audience)}
- **一句话目标**：${fill(data.goal)}

## 01. 交付物定义
${fill(data.deliverable)}

## 02. 参照与标准
${fill(data.reference)}

## 03. 阶段拆解
${fill(data.stages)}

## 04. 路线候选
${fill(data.routes)}

## 05. 验收标准
${fill(data.acceptance)}

## 06. 不做什么
${fill(data.notDoing)}

## 07. 停止条件
${fill(data.stop)}

## 08. 签字前检查
- [ ] 能运行：进程、文件、页面、音频真实可用
- [ ] 符合规格：尺寸、格式、性能、时长、响度等可测量项达标
- [ ] 符合参照：在同机位 / 同场景下对照过参照
- [ ] 愿意签字：愿意把自己的名字放在交付物上
`;
  };

  const collectForm = () => {
    const data = {};
    fieldNames.forEach((name) => {
      data[name] = wsForm?.elements[name]?.value || "";
    });
    return data;
  };

  const generateMarkdown = () => {
    if (!wsForm || !wsPreview) return "";
    const data = collectForm();
    if (!data.project.trim() && !data.goal.trim()) {
      setHint("至少写清项目名称和一句话目标，再生成 Markdown。");
      wsForm.elements.project?.focus();
      return "";
    }
    const markdown = buildMarkdown(data);
    wsPreview.textContent = markdown;
    setHint("已生成。复制或下载后，把「待补」项补齐再开工。");
    return markdown;
  };

  const fillExample = () => {
    if (!wsForm) return;
    const example = WD.worksheetExample || {};
    fieldNames.forEach((name) => {
      if (fieldNames.includes(name) && wsForm.elements[name] && example[name]) {
        wsForm.elements[name].value = example[name];
      }
    });
    setHint("已载入「雨夜便利店」示例。可以直接生成，或改成你自己的项目。");
  };

  const clearForm = () => {
    if (!wsForm) return;
    wsForm.reset();
    if (wsPreview) wsPreview.textContent = initialPreview;
    setHint(initialHint);
  };

  const flashButton = (button, label) => {
    if (!button) return;
    const original = button.dataset.label || button.textContent;
    button.dataset.label = original;
    button.textContent = label;
    window.setTimeout(() => {
      button.textContent = original;
    }, 1600);
  };

  const copyMarkdown = async () => {
    const markdown = generateMarkdown();
    if (!markdown) return;
    try {
      await navigator.clipboard.writeText(markdown);
      flashButton($("#wsCopy"), "已复制");
    } catch (error) {
      const area = document.createElement("textarea");
      area.value = markdown;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      try {
        if (document.execCommand("copy")) {
          flashButton($("#wsCopy"), "已复制");
        } else {
          setHint("浏览器阻止了剪贴板访问，请手动选中右侧预览复制。");
        }
      } catch (fallbackError) {
        setHint("浏览器阻止了剪贴板访问，请手动选中右侧预览复制。");
      }
      area.remove();
    }
  };

  const downloadMarkdown = () => {
    const markdown = generateMarkdown();
    if (!markdown) return;
    const project = collectForm().project.trim() || "workflow";
    const name = project.replace(/[\\/:*?"<>|\s]+/g, "-").slice(0, 48) || "workflow";
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${name}-workflow.md`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1200);
    setHint("已下载 Markdown 文件，可直接放进仓库。");
  };

  if (wsForm) {
    $("#wsGenerate")?.addEventListener("click", generateMarkdown);
    $("#wsExample")?.addEventListener("click", fillExample);
    $("#wsClear")?.addEventListener("click", clearForm);
    $("#wsCopy")?.addEventListener("click", copyMarkdown);
    $("#wsDownload")?.addEventListener("click", downloadMarkdown);
  }
})();
