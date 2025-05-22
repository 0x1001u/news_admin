# 新闻资讯平台管理后台前端

这是一个基于 Vue 3、Element Plus 和 Vite 构建的新闻资讯平台管理后台前端应用。

## 项目设置

1.  **克隆仓库:**
    ```bash
    git clone [您的仓库URL] admin-frontend
    cd admin-frontend
    ```

2.  **安装依赖:**
    ```bash
    npm install
    # 或者 yarn install
    # 或者 pnpm install
    ```

3.  **环境变量:**
    * 在项目根目录创建 `.env.development` 和 `.env.production` 文件。
    * 根据您的后端 API 地址配置 `VITE_APP_API_BASE_URL`。

    `.env.development` 示例:
    ```
    VITE_APP_API_BASE_URL=http://localhost:8000/api/v1
    ```.env.production` 示例:
    ```
    VITE_APP_API_BASE_URL=[https://your-deployed-backend-api.com/api/v1](https://your-deployed-backend-api.com/api/v1)
    ```

## 运行项目

### 开发模式

```bash
npm run dev
# 或者 yarn dev
# 或者 pnpm dev
```
这将在开发服务器上启动应用 (通常是 `http://localhost:5173`)。

### 构建生产版本

```bash
npm run build
# 或者 yarn build
# 或者 pnpm build
```
这会将应用构建到 `dist/` 目录，用于生产部署。

### 预览生产版本

```bash
npm run preview
# 或者 yarn preview
# 或者 pnpm preview
```
这会在本地预览生产构建版本。

## 部署到 Cloudflare Pages

1.  将您的项目代码推送到一个 Git 仓库 (GitHub, GitLab, Bitbucket)。
2.  登录 Cloudflare 仪表盘，导航到 "Pages" 服务。
3.  点击 "Create a project" -> "Connect to Git"，选择您的仓库。
4.  配置构建设置:
    * **Framework preset (框架预设)**: 选择 "Vue"。
    * **Build command (构建命令)**: `npm run build` (或 `yarn build`, `pnpm build`)。
    * **Build output directory (构建输出目录)**: `dist`。
    * **Root directory (根目录)**: `/`。
5.  在 "环境变量 (Environment variables)" 中添加 `VITE_APP_API_BASE_URL`，并设置为您的生产后端 API URL。
6.  点击 "Save and Deploy"。

## 模拟数据说明

为了方便开发和演示，本项目在 `src/views` 目录下的大部分页面中使用了模拟数据。这些模拟数据直接定义在组件的 `<script setup>` 块中。

**要与实际后端集成，您需要将这些组件中的模拟数据逻辑替换为对 `src/services/api.js` 中 `apiClient` 的实际调用。**

例如，在 `src/views/Users/UserListPage.vue` 中，您会看到 `mockUsers` 数组和 `fetchUsers` 函数。在实际集成时，您需要将 `users.value = mockUsers;` 替换为 `const response = await apiClient.get('/users'); users.value = response.data;`。其他页面的 CRUD 操作也需要进行类似修改。

