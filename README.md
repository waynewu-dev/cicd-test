# cicd-test

用于验证 **GitHub Actions 集成 CodeBuddy CLI** 的 CI/CD 最小示例项目。

## 目录结构

```
.github/
  workflows/
    ci.yml                 # 持续集成：安装 → 测试 → 构建 → 上传产物
    codebuddy-review.yml   # PR 触发：CodeBuddy AI 代码审查并回写评论
    cd.yml                 # 持续部署：构建 → GitHub Pages 部署（+ AI 发布说明）
  codebuddy/
    review-prompt.md       # AI 审查提示词模板
.codebuddy/settings.json   # CodeBuddy 工具权限白/黑名单
src/                       # 源码
test/                      # node:test 单元测试
scripts/build.js           # 构建脚本（public/ → dist/）
public/index.html          # 静态页面
```

## 本地运行

```bash
npm test        # 运行单元测试
npm run build   # 构建到 dist/
```

## 在 GitHub 上启用

### 1. 配置密钥

仓库 → **Settings → Secrets and variables → Actions**：

| 类型 | 名称 | 说明 |
| --- | --- | --- |
| Secret | `CODEBUDDY_API_KEY` | CodeBuddy API Key（必填，否则 AI 任务自动跳过） |
| Variable | `CODEBUDDY_INTERNET_ENVIRONMENT` | 中国版填 `internal`；iOA 版填 `ioa`；海外版不设置 |

API Key 获取：海外版 `https://www.codebuddy.ai/profile/keys`，中国版 `https://copilot.tencent.com/profile/`。

### 2. 开启 GitHub Pages

**Settings → Pages → Source** 选择 **GitHub Actions**，`cd.yml` 推送到 `main` 后会自动部署。

### 3. 工作流权限

**Settings → Actions → General → Workflow permissions** 选择 **Read and write permissions**，否则 PR 评论回写会失败。

## 工作流说明

### CI（`.github/workflows/ci.yml`）

`push` / `pull_request` 到 `main` 时触发：安装依赖 → `npm test` → `npm run build` → 上传 `dist/` 产物。

### CodeBuddy 审查（`.github/workflows/codebuddy-review.yml`）

PR 打开/更新时触发：安装 `@tencent-ai/codebuddy-code` → 生成 PR diff → 以管道方式交给 CodeBuddy 非交互模式（`-p`）审查 → 结果写入 Job Summary 并评论到 PR。

核心命令：

```bash
cat pr.diff | codebuddy -p "$PROMPT" \
  --dangerously-skip-permissions \
  --allowedTools "Read Grep Glob Bash(git:*)" > review.md
```

`-p` 为 CI 无头场景必需；配合 `--allowedTools` 将能力限制为只读，避免 AI 在 CI 中改动代码。

### CD（`.github/workflows/cd.yml`）

`main` 推送时触发：构建 → `upload-pages-artifact` → `deploy-pages`；同时可选地用 CodeBuddy 依据最近 20 条提交生成发布说明。

## 验证方式

1. 新建分支并提交改动 → 开 PR，观察 `CodeBuddy Review` 是否产出审查评论（未配置密钥时该 job 会跳过）。
2. 合入 `main` → 观察 `CD` 部署，访问 Pages 地址确认页面显示的构建号。

## 参考

- CodeBuddy CLI 文档：<https://www.codebuddy.ai/docs/zh/cli/overview>
- 环境变量参考：<https://www.codebuddy.ai/docs/zh/cli/env-vars>
- 身份与访问管理：<https://www.codebuddy.ai/docs/zh/cli/iam>
