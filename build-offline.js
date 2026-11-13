const fs = require("fs");
const path = require("path");

const root = __dirname;
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");
const js = fs.readFileSync(path.join(root, "app.js"), "utf8");
const cardBackground = fs
  .readFileSync(path.join(root, "assets", "card-bg.png"))
  .toString("base64");
const portrait = fs
  .readFileSync(path.join(root, "assets", "人像.png"))
  .toString("base64");

const inlineCss = css.replace(
  'url("assets/card-bg.png")',
  `url("data:image/png;base64,${cardBackground}")`,
);
const inlineJs = js.replaceAll(
  "assets/人像.png",
  `data:image/png;base64,${portrait}`,
);

const offlineHtml = html
  .replace('<link rel="stylesheet" href="styles.css" />', `<style>\n${inlineCss}\n</style>`)
  .replace('<script src="app.js"></script>', `<script>\n${inlineJs}\n</script>`);

fs.writeFileSync(path.join(root, "lby_tjucampuscard.html"), offlineHtml);
console.log("Generated lby_tjucampuscard.html");
