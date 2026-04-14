import axios from "axios";

// ── In-memory cache ────────────────────────────────────────────────
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// ── GitHub repo mappings (mirrors frontend data) ───────────────────
const GITHUB_REPOS = {
  shadcn:    "shadcn-ui/ui",
  mui:       "mui/material-ui",
  chakra:    "chakra-ui/chakra-ui",
  nextui:    "nextui-org/nextui",
  radix:     "radix-ui/primitives",
  mantine:   "mantinedev/mantine",
  daisyui:   "saadeghi/daisyui",
  heroui:    "heroui-inc/heroui",
  antd:      "ant-design/ant-design",
  reactaria: "adobe/react-spectrum",
  reshaped:  "formaat-design/reshaped",
  alignui:   "alignui/alignui",
  tailark:   "tailark/tailark",
  untitled:  "untitledui/untitledui",
  baseui:    "mui/base-ui",
  kibo:      "kiboui/react",
  tailwindplus: "tailwindplus/react",
};

// ── Classify a commit / release title into a badge type ────────────
function classifyType(title = "") {
  const t = (title || "").toLowerCase();
  if (t.includes("release") || (t.includes("v") && /\d/.test(t))) return "release";
  if (t.includes("fix") || t.includes("bug") || t.includes("patch")) return "fix";
  if (t.includes("feat") || t.includes("add") || t.includes("new")) return "feature";
  if (t.includes("docs") || t.includes("readme")) return "docs";
  if (t.includes("refactor") || t.includes("chore") || t.includes("ci")) return "chore";
  return "update";
}

// ── Fetch releases from GitHub ─────────────────────────────────────
async function fetchReleases(repo) {
  try {
    const headers = { "User-Agent": "RUIL-App" };
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;
    }
    const { data } = await axios.get(
      `https://api.github.com/repos/${repo}/releases?per_page=10`,
      { headers, timeout: 8000 }
    );
    
    if (!Array.isArray(data)) return [];

    return data.map((r) => ({
      id: r.id || Math.random().toString(36),
      title: r.name || r.tag_name || "New Release",
      type: "release",
      timestamp: r.published_at || new Date().toISOString(),
      url: r.html_url || `https://github.com/${repo}`,
      author: r.author?.login || "github-actions",
      avatarURL: r.author?.avatar_url || "",
      tag: r.tag_name || "",
      body: (r.body || "").slice(0, 300),
    }));
  } catch (err) {
    console.warn(`[GitHub API] Releases error for ${repo}:`, err.response?.status || err.message);
    return [];
  }
}

// ── Fetch recent commits from GitHub ───────────────────────────────
async function fetchCommits(repo) {
  try {
    const headers = { "User-Agent": "RUIL-App" };
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;
    }
    const { data } = await axios.get(
      `https://api.github.com/repos/${repo}/commits?per_page=15`,
      { headers, timeout: 8000 }
    );
    
    if (!Array.isArray(data)) return [];

    return data.map((c) => ({
      id: c.sha || Math.random().toString(36),
      title: (c.commit?.message || "Internal update").split("\n")[0],
      type: classifyType(c.commit?.message || ""),
      timestamp: c.commit?.author?.date || c.commit?.committer?.date || new Date().toISOString(),
      url: c.html_url || `https://github.com/${repo}`,
      author: c.author?.login || c.commit?.author?.name || "contributor",
      avatarURL: c.author?.avatar_url || "",
      sha: (c.sha || "").slice(0, 7),
    }));
  } catch (err) {
    console.warn(`[GitHub API] Commits error for ${repo}:`, err.response?.status || err.message);
    return [];
  }
}

// ── Controller ─────────────────────────────────────────────────────
export const getLibraryUpdates = async (req, res) => {
  try {
    const { library } = req.params;
    
    if (!library) {
      return res.status(400).json({ error: "Library ID is required" });
    }

    const repo = GITHUB_REPOS[library.toLowerCase()];

    if (!repo) {
      return res.status(404).json({
        error: "Library not found",
        supported: Object.keys(GITHUB_REPOS),
      });
    }

    // Check cache
    const cached = cache.get(library.toLowerCase());
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return res.json({ ...cached.data, cached: true });
    }

    // Fetch data in parallel
    const [releases, commits] = await Promise.all([
      fetchReleases(repo),
      fetchCommits(repo),
    ]);

    // Merge & deduplicate, releases first
    const seen = new Set();
    const updates = [];

    // Safety: Ensure we are working with arrays
    const safeReleases = Array.isArray(releases) ? releases : [];
    const safeCommits = Array.isArray(commits) ? commits : [];

    for (const r of safeReleases) {
      if (r && r.title && !seen.has(r.title)) {
        seen.add(r.title);
        updates.push(r);
      }
    }
    for (const c of safeCommits) {
      if (c && c.title && !seen.has(c.title)) {
        seen.add(c.title);
        updates.push(c);
      }
    }

    // Sort by timestamp descending with fallback for invalid dates
    updates.sort((a, b) => {
      const dateA = new Date(a.timestamp || 0).getTime();
      const dateB = new Date(b.timestamp || 0).getTime();
      return dateB - dateA;
    });

    const payload = {
      library,
      repo,
      updatedAt: new Date().toISOString(),
      updates: updates.slice(0, 30),
      status: updates.length > 0 ? "success" : "limited",
      note: updates.length === 0 ? "GitHub rate limit reached or no recent public activity found." : undefined
    };

    cache.set(library.toLowerCase(), { data: payload, timestamp: Date.now() });
    return res.json({ ...payload, cached: false });
  } catch (err) {
    console.error(`[Critical Error] Library Updates for ${req.params.library}:`, err);
    return res.status(500).json({ 
      error: "Internal server error fetching updates",
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};
