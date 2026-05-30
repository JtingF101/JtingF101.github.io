const postList = document.querySelector("#post-list");
const reader = document.querySelector("#reader");
const postContent = document.querySelector("#post-content");
const closeReader = document.querySelector("#close-reader");
const readingTime = document.querySelector("#reading-time");
const postSearch = document.querySelector("#post-search");
const postCount = document.querySelector("#post-count");
const chips = [...document.querySelectorAll("[data-filter]")];
let posts = [];
let activeFilter = "all";

const escapeHtml = (value) =>
  value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }[char]));

const inlineMarkdown = (value) =>
  escapeHtml(value)
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');

function parseMarkdown(markdown) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const html = [];
  let listOpen = false;

  const closeList = () => {
    if (listOpen) {
      html.push("</ul>");
      listOpen = false;
    }
  };

  for (const line of lines) {
    if (!line.trim()) {
      closeList();
      continue;
    }

    if (line.startsWith("# ")) {
      closeList();
      html.push(`<h1>${inlineMarkdown(line.slice(2))}</h1>`);
    } else if (line.startsWith("## ")) {
      closeList();
      html.push(`<h2>${inlineMarkdown(line.slice(3))}</h2>`);
    } else if (line.startsWith("### ")) {
      closeList();
      html.push(`<h3>${inlineMarkdown(line.slice(4))}</h3>`);
    } else if (line.startsWith("- ")) {
      if (!listOpen) {
        html.push("<ul>");
        listOpen = true;
      }
      html.push(`<li>${inlineMarkdown(line.slice(2))}</li>`);
    } else {
      closeList();
      html.push(`<p>${inlineMarkdown(line)}</p>`);
    }
  }

  closeList();
  return html.join("");
}

function renderPosts() {
  const query = postSearch.value.trim().toLowerCase();
  const visiblePosts = posts.filter((post) => {
    const matchesFilter = activeFilter === "all" || post.category === activeFilter;
    const haystack = `${post.title} ${post.category} ${post.excerpt}`.toLowerCase();
    return matchesFilter && (!query || haystack.includes(query));
  });

  postCount.textContent = `${visiblePosts.length} 篇可读笔记`;
  postList.innerHTML = visiblePosts.map((post) => `
    <article class="post-card">
      <span class="post-tag">${escapeHtml(post.category)}</span>
      <h3>${escapeHtml(post.title)}</h3>
      <p class="post-meta">${escapeHtml(post.date)} · ${escapeHtml(post.reading)}</p>
      <p>${escapeHtml(post.excerpt)}</p>
      <button class="button ghost" type="button" data-post="${escapeHtml(post.slug)}">阅读</button>
    </article>
  `).join("") || '<p class="post-count">没有匹配的文章，可以换个关键词试试。</p>';
}

async function openPost(slug) {
  const post = posts.find((item) => item.slug === slug);
  if (!post) return;

  const response = await fetch(`/${post.file}`);
  const markdown = await response.text();
  postContent.innerHTML = parseMarkdown(markdown);
  readingTime.textContent = `${post.category} · ${post.reading}`;
  reader.hidden = false;
  reader.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function loadPosts() {
  const response = await fetch("/posts.json");
  posts = await response.json();
  renderPosts();
}

postList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-post]");
  if (button) openPost(button.dataset.post);
});

closeReader.addEventListener("click", () => {
  reader.hidden = true;
  document.querySelector("#posts").scrollIntoView({ behavior: "smooth", block: "start" });
});

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    chips.forEach((item) => item.classList.remove("active"));
    chip.classList.add("active");
    activeFilter = chip.dataset.filter;
    renderPosts();
  });
});

postSearch.addEventListener("input", renderPosts);

function startSignalField() {
  const canvas = document.querySelector("#signal-field");
  const ctx = canvas.getContext("2d");
  const points = Array.from({ length: 52 }, () => ({
    x: Math.random(),
    y: Math.random(),
    vx: (Math.random() - 0.5) * 0.0009,
    vy: (Math.random() - 0.5) * 0.0009,
  }));

  const resize = () => {
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
  };

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = window.devicePixelRatio;

    points.forEach((point) => {
      point.x += point.vx;
      point.y += point.vy;
      if (point.x < 0 || point.x > 1) point.vx *= -1;
      if (point.y < 0 || point.y > 1) point.vy *= -1;
    });

    points.forEach((point, index) => {
      const x = point.x * canvas.width;
      const y = point.y * canvas.height;
      ctx.beginPath();
      ctx.arc(x, y, 2.4 * window.devicePixelRatio, 0, Math.PI * 2);
      ctx.fillStyle = index % 3 === 0 ? "rgba(223,107,79,.6)" : "rgba(14,117,108,.55)";
      ctx.fill();

      for (let next = index + 1; next < points.length; next += 1) {
        const other = points[next];
        const ox = other.x * canvas.width;
        const oy = other.y * canvas.height;
        const distance = Math.hypot(x - ox, y - oy);
        if (distance < 155 * window.devicePixelRatio) {
          ctx.strokeStyle = `rgba(23,33,31,${0.13 - distance / (155 * window.devicePixelRatio) * 0.1})`;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(ox, oy);
          ctx.stroke();
        }
      }
    });

    requestAnimationFrame(draw);
  };

  window.addEventListener("resize", resize);
  resize();
  draw();
}

loadPosts();
startSignalField();
