/* ============================================================
   个人学术主页 · 渲染脚本
   读取 data.js 中的 SITE_DATA，把内容填进页面
   ============================================================ */

(function () {
  "use strict";

  const D = window.SITE_DATA || {};
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s == null ? "" : s);

  /* 作者列表中把「自己」加粗 */
  function highlightSelf(authors) {
    const me = (D.profile && D.profile.name) || "";
    if (!me) return esc(authors);
    return esc(authors).split(me).join("<strong>" + me + "</strong>");
  }

  const ICONS = {
    mail:    "✉️",
    github:  "🐙",
    scholar: "🎓",
    orcid:   "🆔",
    pdf:     "📄",
    link:    "🔗"
  };

  /* ---------- Hero ---------- */
  function renderHero() {
    const p = D.profile || {};
    if (p.avatar) $("avatarImg").src = p.avatar;
    if (p.name)  { $("heroName").textContent = p.name; document.title = p.name + " | 个人学术主页"; }
    if (p.enName)  $("heroEnName").textContent = p.enName;
    if (p.role)    $("heroRole").textContent = p.role;
    if (p.affiliation) $("heroAffil").textContent = p.affiliation;
    if (p.bio)     $("heroBio").textContent = p.bio;
    if ($("footerText") && D.footer) $("footerText").textContent = D.footer;

    const box = $("heroLinks");
    (p.links || []).forEach((l, i) => {
      const a = document.createElement("a");
      a.className = "pill" + (i === 0 ? " primary" : "");
      a.href = l.href || "#";
      if ((l.href || "").startsWith("http")) { a.target = "_blank"; a.rel = "noopener"; }
      a.innerHTML = (ICONS[l.icon] ? ICONS[l.icon] + " " : "") + esc(l.label);
      box.appendChild(a);
    });
  }

  /* ---------- 简介 ---------- */
  function renderAbout() {
    const box = $("aboutBody");
    ((D.profile && D.profile.about) || []).forEach((t) => {
      const p = document.createElement("p");
      p.textContent = t;
      box.appendChild(p);
    });
  }

  /* ---------- 研究方向 ---------- */
  function renderResearch() {
    const grid = $("researchGrid");
    (D.research || []).forEach((r) => {
      const c = document.createElement("div");
      c.className = "card";
      c.innerHTML =
        '<div class="card-icon">' + esc(r.icon || "💡") + "</div>" +
        "<h3>" + esc(r.title) + "</h3>" +
        "<p>" + esc(r.desc) + "</p>";
      grid.appendChild(c);
    });
  }

  /* ---------- 专业技能 ---------- */
  function renderSkills() {
    const grid = $("skillGrid");
    if (!grid) return;
    (D.skills || []).forEach((s) => {
      const c = document.createElement("div");
      c.className = "card";
      c.innerHTML =
        "<h3>" + esc(s.title) + "</h3>" +
        ((s.items || []).length
          ? '<div class="tags">' + s.items.map((t) => '<span class="tag">' + esc(t) + "</span>").join("") + "</div>"
          : "");
      grid.appendChild(c);
    });
  }

  /* ---------- 最新动态 ---------- */
  function renderNews() {
    const ul = $("newsList");
    (D.news || []).forEach((n) => {
      const li = document.createElement("li");
      li.innerHTML =
        '<span class="news-date">' + esc(n.date) + "</span>" +
        '<span class="news-text">' + (n.text || "") + "</span>";
      ul.appendChild(li);
    });
  }

  /* ---------- 论文 ---------- */
  const TYPE_LABEL = { journal: "期刊论文", conference: "会议论文", preprint: "预印本" };
  let currentFilter = "all";
  let currentQuery  = "";

  function renderFilters() {
    const types = [...new Set((D.publications || []).map((p) => p.type))];
    const box = $("pubFilters");
    [["all", "全部"]].concat(types.map((t) => [t, TYPE_LABEL[t] || t])).forEach(([val, label]) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "chip" + (val === "all" ? " active" : "");
      b.dataset.filter = val;
      b.textContent = label;
      b.addEventListener("click", () => {
        currentFilter = val;
        [...box.children].forEach((c) => c.classList.toggle("active", c === b));
        renderPubs();
      });
      box.appendChild(b);
    });
    $("pubSearch").addEventListener("input", (e) => {
      currentQuery = e.target.value.trim().toLowerCase();
      renderPubs();
    });
  }

  function renderPubs() {
    const ul = $("pubList");
    ul.innerHTML = "";

    const all = D.publications || [];
    const bar = document.querySelector(".filter-bar");
    const tip = $("pubEmpty");

    // 暂无论文：隐藏筛选栏，给出友好提示
    if (!all.length) {
      if (bar) bar.hidden = true;
      tip.hidden = false;
      tip.textContent = "暂无论文成果。有第一篇论文后，在 data.js 的 publications 里加一条即可自动显示。";
      return;
    }

    const list = all
      .filter((p) => currentFilter === "all" || p.type === currentFilter)
      .filter((p) => {
        if (!currentQuery) return true;
        return [p.title, p.authors, p.venue, String(p.year), TYPE_LABEL[p.type] || ""]
          .join(" ").toLowerCase().includes(currentQuery);
      })
      .sort((a, b) => (b.year || 0) - (a.year || 0));

    $("pubEmpty").hidden = list.length > 0;
    if (!list.length) $("pubEmpty").textContent = "没有匹配的论文。";

    list.forEach((p) => {
      const li = document.createElement("li");
      const links = (p.links || [])
        .map((l) => '<a href="' + esc(l.href) + '"' +
             ((l.href || "").startsWith("http") ? ' target="_blank" rel="noopener"' : "") +
             ">" + esc(l.label) + "</a>")
        .join("");
      li.innerHTML =
        '<p class="pub-title">' + esc(p.title) + "</p>" +
        '<p class="pub-meta">' + highlightSelf(p.authors) + "</p>" +
        '<p class="pub-meta"><span class="pub-venue">' + esc(p.venue) + "</span>" +
        ' <span class="pub-year">' + esc(p.year) + "</span>" +
        (p.note ? ' <span class="pub-note">' + esc(p.note) + "</span>" : "") + "</p>" +
        (links ? '<div class="pub-links">' + links + "</div>" : "");
      ul.appendChild(li);
    });
  }

  /* ---------- 教育经历 ---------- */
  function renderEducation() {
    const ol = $("eduTimeline");
    (D.education || []).forEach((e) => {
      const li = document.createElement("li");
      li.innerHTML =
        '<div class="tl-period">' + esc(e.period) + "</div>" +
        '<div class="tl-title">' + esc(e.title) + "</div>" +
        (e.org  ? '<div class="tl-org">'  + esc(e.org)  + "</div>" : "") +
        (e.desc ? '<div class="tl-desc">' + esc(e.desc) + "</div>" : "");
      ol.appendChild(li);
    });
  }

  /* ---------- 项目 ---------- */
  function renderProjects() {
    const grid = $("projectGrid");
    (D.projects || []).forEach((p) => {
      const c = document.createElement("div");
      c.className = "card";
      c.innerHTML =
        "<h3>" + esc(p.name) + "</h3>" +
        '<p style="color:var(--accent);font-weight:600;font-size:13.5px;margin:0 0 8px">' + esc(p.role) + "</p>" +
        "<p>" + esc(p.desc) + "</p>" +
        ((p.tags || []).length
          ? '<div class="tags">' + p.tags.map((t) => '<span class="tag">' + esc(t) + "</span>").join("") + "</div>"
          : "") +
        (p.link ? '<a class="card-link" href="' + esc(p.link) + '">查看项目 →</a>' : "");
      grid.appendChild(c);
    });
  }

  /* ---------- 荣誉 ---------- */
  function renderAwards() {
    const ul = $("awardList");
    (D.awards || []).forEach((a) => {
      const li = document.createElement("li");
      li.innerHTML =
        '<span class="award-year">' + esc(a.year) + "</span>" +
        '<span class="award-text">' + esc(a.text) + "</span>";
      ul.appendChild(li);
    });
  }

  /* ---------- 联系方式 ---------- */
  function renderContact() {
    const c = (D.profile && D.profile.contact) || {};
    const items = [
      { label: "EMAIL",   value: c.email  ? '<a href="mailto:' + esc(c.email) + '">' + esc(c.email) + "</a>" : "" },
      { label: "PHONE",   value: c.phone  || "" },
      { label: "OFFICE",  value: c.office  || "" },
      { label: "ADDRESS", value: c.address || "" }
    ].filter((i) => i.value);

    $("contactBox").innerHTML = items
      .map((i) => '<div class="contact-item"><div class="label">' + i.label +
                  '</div><div class="value">' + i.value + "</div></div>")
      .join("");
  }

  /* ---------- 导航：高亮 + 移动端折叠 ---------- */
  function initNav() {
    const links = [...document.querySelectorAll(".nav-link")];
    const sections = links
      .map((l) => document.querySelector(l.getAttribute("href")))
      .filter(Boolean);

    const spy = () => {
      const y = window.scrollY + 120;
      let active = 0;
      sections.forEach((s, i) => { if (s.offsetTop <= y) active = i; });
      links.forEach((l, i) => l.classList.toggle("active", i === active));
    };
    window.addEventListener("scroll", spy, { passive: true });
    spy();

    const nav = $("nav");
    $("navToggle").addEventListener("click", () => nav.classList.toggle("open"));
    nav.addEventListener("click", (e) => {
      if (e.target.classList.contains("nav-link")) nav.classList.remove("open");
    });
  }

  /* ---------- 深浅色 ---------- */
  function initTheme() {
    const btn = $("themeToggle");
    const saved = localStorage.getItem("theme");
    if (saved) document.documentElement.dataset.theme = saved;

    const sync = () => {
      document.querySelector(".theme-icon").textContent =
        document.documentElement.dataset.theme === "dark" ? "☀" : "◐";
    };
    sync();

    btn.addEventListener("click", () => {
      const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      localStorage.setItem("theme", next);
      sync();
    });
  }

  /* ---------- 启动 ---------- */
  renderHero();
  renderAbout();
  renderResearch();
  renderSkills();
  renderNews();
  renderFilters();
  renderPubs();
  renderEducation();
  renderProjects();
  renderAwards();
  renderContact();
  initNav();
  initTheme();
})();
