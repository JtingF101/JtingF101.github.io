# WILL_AFENG个人博客

这是一个 GitHub Pages 友好的纯静态个人博客，内容方向包括 AI 发展、智能体、机器人、潜水新闻和背包旅行。

## 线上预览

线上地址：<https://jtingf101.github.io>

## 新增文章

推荐使用脚本：

```bash
node scripts/new-post.mjs "文章标题" "智能体"
```

例如：

```bash
node scripts/new-post.mjs "仙本那背包潜水路线" "背包旅行"
```

可用分类：

- AI发展
- 智能体
- 机器人
- 潜水新闻
- 背包旅行

脚本会创建 `posts/文章-slug.md`，并自动更新 `posts.json`。打开新建的 Markdown 文件写正文，写完后运行：

```bash
git add .
git commit -m "Add new post"
git push
```

推送后 GitHub Pages 会自动刷新。

## 发布到 GitHub Pages

1. 推送仓库到 GitHub。
2. 打开仓库 `Settings`。
3. 进入 `Pages`。
4. Source 选择 `Deploy from a branch`。
5. Branch 选择 `main`，目录选择 `/root`。

保存后，GitHub 会生成公开访问地址。
