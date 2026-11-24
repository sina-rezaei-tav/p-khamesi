import { readFile, writeFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";
import { museum, escape } from "../js/markup.mjs";
const root = new URL("../", import.meta.url);
const get = (name) => readFile(new URL(name, root), "utf8");
const window = {};
runInNewContext(await get("content.js"), { window });
const content = window.portfolioContent;
const index = await get("index.html");
const oldHead = index.slice(0, index.indexOf("</head>"));
const url = (path) => {
  try { return new URL(path, content.siteUrl).href; } catch { return path; }
};
const instagram = /^https?:\/\//i.test(content.instagram) ? content.instagram : "";
const person = { "@context": "https://schema.org", "@type": "Person", name: content.artist, ...(instagram ? { sameAs: [instagram] } : {}) };
const head = oldHead.replace(/(content=")[^"]*assets\/img\/social\.jpg"/g, `$1${escape(url("assets/img/social.jpg"))}"`)
  .replace(/(<script id="artist-schema" type="application\/ld\+json">)[\s\S]*?(<\/script>)/, (_, start, end) => start + JSON.stringify(person).replace(/</g, "\\u003c") + end);
await writeFile(new URL("index.html", root), `${head}</head>\n<body>\n${museum(content, "en")}\n</body>\n</html>\n`);
