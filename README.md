# 个人学术主页 · Academic Homepage

一个纯静态的个人学术主页，零依赖、零构建，直接用 GitHub Pages 免费托管。

---

## 一、目录结构

```
academic-homepage/
├── index.html              # 页面骨架（一般不用改）
├── README.md
├── .gitignore
└── assets/
    ├── css/style.css       # 样式（想改配色看这里顶部 :root 变量）
    ├── js/
    │   ├── data.js         # ★ 只改这一个文件就能更新全部内容
    │   └── main.js         # 渲染逻辑（一般不用改）
    ├── img/
    │   ├── avatar.svg      # 头像占位图 → 换成你自己的照片
    │   └── favicon.svg     # 浏览器标签图标
    └── files/              # 放简历 PDF 等文件（cv.pdf 放这里）
```

## 二、怎么改内容

**只改 `assets/js/data.js`**，保存后刷新浏览器即可。里面分了 8 块：

| 字段 | 说明 |
|---|---|
| `profile` | 姓名、头衔、单位、简介、头像、链接按钮、联系方式 |
| `research` | 研究方向卡片 |
| `news` | 最新动态（支持 `<b>` 加粗） |
| `publications` | 论文列表，支持按类型筛选 + 关键词搜索 |
| `education` | 教育经历时间轴 |
| `projects` | 项目卡片 |
| `awards` | 荣誉奖励 |
| `footer` | 页脚版权 |

小技巧：
- 作者列表里**和你同名的会自动加粗**，不用手动标记。
- 换头像：把自己的照片放进 `assets/img/`，改 `profile.avatar` 为对应路径即可。
- 改主题色：改 `style.css` 顶部的 `--accent`（默认蓝色 `#2563eb`）。

## 三、本地预览

在项目目录下执行：

```bash
python -m http.server 8000
# 然后浏览器打开 http://localhost:8000
```

## 四、部署到 GitHub Pages（完整流程）

### 1. 注册 GitHub
访问 https://github.com → Sign up → 用**学校邮箱或常用邮箱**注册 → 完成邮箱验证。
> 建议用户名用姓名拼音（如 `sanzhang`），这会决定你的网址。

### 2. 创建仓库
右上角 `+` → **New repository**
- **Repository name** 必须填：`<你的用户名>.github.io`（例如 `sanzhang.github.io`）
- 勾选 **Public**（Pages 免费版需要公开仓库）
- **不要**勾选 Add a README
- 点 Create repository

### 3. 创建 Personal Access Token（推送密码）
GitHub 头像 → **Settings** → 左下 **Developer settings** → **Personal access tokens** → **Tokens (classic)** → **Generate new token (classic)**
- Note 随便填，如 `homepage`
- Expiration 选 90 days 或 No expiration
- 勾选 **`repo`**（这一项就够了）
- Generate → **立刻复制保存**（只显示一次）
> 之后 git 推送时，用户名填 GitHub 用户名，密码粘贴这个 Token。

### 4. 推送代码
在本项目目录下执行：

```bash
git init
git add .
git commit -m "Initial commit: personal academic homepage"

git branch -M main
git remote add origin https://github.com/<用户名>/<用户名>.github.io.git
git push -u origin main
```

### 5. 开启 GitHub Pages
仓库页面 → **Settings** → 左侧 **Pages** → **Build and deployment**
- Source 选 **Deploy from a branch**
- Branch 选 `main` / 文件夹选 `/ (root)` → **Save**

等 1–3 分钟，访问 `https://<用户名>.github.io` 就能看到了。

> 以后只改了 `data.js`？执行三行即可：
> ```bash
> git add .
> git commit -m "更新内容"
> git push
> ```

## 五、常见问题

- **404 打不开**：确认仓库名是 `<用户名>.github.io` 且 Pages 的 Branch 选的是 `main`。
- **改了没生效**：GitHub Pages 有 1–2 分钟缓存，等一下再刷新；也可以 Ctrl+F5 强制刷新。
- **图片不显示**：检查路径大小写，GitHub Pages 对大小写敏感。
- **想换域名**：Pages 设置页有 Custom domain，绑自己的域名即可。

---

Built with WorkBuddy · MIT License
