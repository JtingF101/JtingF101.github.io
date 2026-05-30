import { readFile, writeFile, access } from "node:fs/promises";
import { constants } from "node:fs";

const [, , rawTitle, rawCategory = "AI发展"] = process.argv;
const categories = ["AI发展", "智能体", "机器人", "潜水新闻", "背包旅行"];

if (!rawTitle) {
  console.error('Usage: node scripts/new-post.mjs "文章标题" "智能体"');
  process.exit(1);
}

if (!categories.includes(rawCategory)) {
  console.error(`Category must be one of: ${categories.join(", ")}`);
  process.exit(1);
}

const slug = rawTitle
  .trim()
  .toLowerCase()
  .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
  .replace(/^-+|-+$/g, "")
  || `post-${Date.now()}`;

const date = new Date().toISOString().slice(0, 10);
const file = `posts/${slug}.md`;

try {
  await access(file, constants.F_OK);
  console.error(`Post already exists: ${file}`);
  process.exit(1);
} catch {
  // New file is expected.
}

const posts = JSON.parse(await readFile("posts.json", "utf8"));
posts.unshift({
  slug,
  title: rawTitle.trim(),
  category: rawCategory,
  date,
  reading: "3 min",
  excerpt: "在这里写一句文章摘要，方便首页卡片展示。",
  file,
});

const template = `# ${rawTitle.trim()}

在这里写下开头：这个问题为什么值得关注？

## 观察

- 观点一
- 观点二
- 观点三

## 我的判断

写下你的判断、证据和保留意见。
`;

await writeFile(file, template, "utf8");
await writeFile("posts.json", `${JSON.stringify(posts, null, 2)}\n`, "utf8");

console.log(`Created ${file}`);
