# 蒋廷锋个人博客

这是一个 GitHub Pages 友好的纯静态个人博客，内容方向包括 AI 发展、智能体、机器人和潜水新闻。

## 本地预览

```bash
python3 -m http.server 8000
```

然后打开 http://localhost:8000。

## 新增文章

推荐使用脚本：

```bash
node scripts/new-post.mjs "文章标题" "智能体"
```

可用分类：

- AI发展
- 智能体
- 机器人
- 潜水新闻

脚本会创建 `posts/文章-slug.md`，并自动更新 `posts.json`。如果想手动添加，也可以复制 `posts/*.md`，再在 `posts.json` 顶部增加一条记录。

## 发布到 GitHub Pages

1. 推送仓库到 GitHub。
2. 打开仓库 `Settings`。
3. 进入 `Pages`。
4. Source 选择 `Deploy from a branch`。
5. Branch 选择 `main`，目录选择 `/root`。

保存后，GitHub 会生成公开访问地址。
