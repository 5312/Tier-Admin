<div align="center"> 
<br> 
<br>
<img src="./src/assets/images/logo.png" height="140" />
<h3> Tier Admin </h3>
  <p>
    <p style="font-size: 14px">
      Tier Admin 是基于 Slash Admin 开发的后台管理系统，采用 React 19、Vite、shadcn/ui 和 TypeScript 技术栈构建。保留了 Slash Admin 的核心功能并进行了定制化开发。
    </p>
    <br />
    <br />
    <a href="#">Preview</a>
    ·
    <a href="#">Community</a>
    ·
    <a href="#">Document</a>
    <br />
    <br />
</div>

**中文** | [English](./README.md)

## 预览

|![login.png](https://d3george.github.io/github-static/slash-admin/login.png)|![login_dark.png](https://d3george.github.io/github-static/slash-admin/login_dark.png)
| ----------------------------------------------------------------- | ------------------------------------------------------------------- |
|![analysis.png](https://d3george.github.io/github-static/slash-admin/analysis.png)|![workbench.png](https://d3george.github.io/github-static/slash-admin/workbench.png)
| | 
|![analysis.png](https://d3george.github.io/github-static/slash-admin/mobile.png)|![workbench.png](https://d3george.github.io/github-static/slash-admin/mobile_dark.png)
## 特性

- 基于 Slash Admin 核心架构开发
- 使用 React 19 hooks 进行构建
- 基于 Vite 进行快速开发和热模块替换
- 集成 shadcn/ui 提供丰富的 UI 组件
- 使用 TypeScript 确保类型安全
- 响应式设计，适配各种设备
- 灵活的路由配置和权限管理
- 国际化支持
- 可定制主题和样式
- 基于 MSW 的 Mock 方案
- 使用 Zustand 进行状态管理
- 使用 React-Query 进行数据获取

## 快速开始

### 获取项目代码

```bash
git clone https://github.com/d3george/slash-admin.git
```

### 安装依赖

在项目根目录下运行以下命令安装项目依赖：

```bash
pnpm install
```

### 启动开发服务器

运行以下命令以启动开发服务器：

```bash
pnpm dev
```

访问 [http://localhost:3001](http://localhost:3001) 查看您的应用程序。

### 构建生产版本

运行以下命令以构建生产版本：

```bash
pnpm build
```

## Git贡献提交规范

- `feat` 新功能
- `fix` 修复bug
- `docs` 文档注释
- `style` 代码格式(不影响代码运行的变动)
- `refactor` 重构
- `perf` 性能优化
- `revert` 回滚commit
- `test` 测试相关
- `chore` 构建过程或辅助工具的变动
- `ci` 修改CI配置、脚本
- `types` 类型定义文件修改
- `wip` 开发中
