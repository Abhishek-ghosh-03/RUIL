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
  const t = title.toLowerCase();
  if (t.includes("release") || t.includes("v") && /\d/.test(t)) return "release";
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
    return data.map((r) => ({
      id: r.id,
      title: r.name || r.tag_name,
      type: "release",
      timestamp: r.published_at,
      url: r.html_url,
      author: r.author?.login || "unknown",
      avatarURL: r.author?.avatar_url || "",
      tag: r.tag_name,
      body: (r.body || "").slice(0, 300),
    }));
  } catch (err) {
    if (err.response?.status === 403) {
      console.warn(`[GitHub API] Rate limited or forbidden for ${repo}`);
    } else {
      console.error(`[GitHub API] Error fetching releases for ${repo}:`, err.message);
    }
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
    return data.map((c) => ({
      id: c.sha,
      title: c.commit.message.split("\n")[0],
      type: classifyType(c.commit.message),
      timestamp: c.commit.author?.date || c.commit.committer?.date,
      url: c.html_url,
      author: c.author?.login || c.commit.author?.name || "unknown",
      avatarURL: c.author?.avatar_url || "",
      sha: c.sha.slice(0, 7),
    }));
  } catch (err) {
    if (err.response?.status === 403) {
      console.warn(`[GitHub API] Rate limited or forbidden for ${repo}`);
    } else {
      console.error(`[GitHub API] Error fetching commits for ${repo}:`, err.message);
    }
    return [];
  }
}

// ── Controller ─────────────────────────────────────────────────────
export const getLibraryUpdates = async (req, res) => {
  const { library } = req.params;
  const repo = GITHUB_REPOS[library];

  if (!repo) {
    return res.status(404).json({
      error: "Library not found",
      supported: Object.keys(GITHUB_REPOS),
    });
  }

  // Check cache
  const cached = cache.get(library);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return res.json({ ...cached.data, cached: true });
  }

  if (!process.env.GITHUB_TOKEN) {
    console.warn("[Warning] GITHUB_TOKEN is not set. Rate limits will be very strict.");
  }

  try {
    const [releases, commits] = await Promise.all([
      fetchReleases(repo),
      fetchCommits(repo),
    ]);

    // Merge & deduplicate, releases first
    const seen = new Set();
    const updates = [];

    for (const r of releases) {
      if (!seen.has(r.title)) {
        seen.add(r.title);
        updates.push(r);
      }
    }
    for (const c of commits) {
      if (!seen.has(c.title)) {
        seen.add(c.title);
        updates.push(c);
      }
    }

    // Sort by timestamp descending
    updates.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    const payload = {
      library,
      repo,
      updatedAt: new Date().toISOString(),
      updates: updates.slice(0, 30),
      status: updates.length > 0 ? "success" : "limited",
      note: updates.length === 0 ? "GitHub rate limit reached or no news." : undefined
    };

    cache.set(library, { data: payload, timestamp: Date.now() });
    return res.json({ ...payload, cached: false });
  } catch (err) {
    console.error(`Error processing updates for ${library}:`, err.message);
    return res.status(500).json({ 
      error: "Internal server error fetching updates",
      message: err.message
    });
  }
};
