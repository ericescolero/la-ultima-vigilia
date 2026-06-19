import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;

const requiredFiles = [
  "index.html",
  "la-guerra-silenciosa/index.html",
  "el-remanente/index.html",
  "mision/index.html",
  "blog/index.html",
  "blog/la-guerra-silenciosa-hombres/index.html",
  "manuales/index.html",
  "gracias/index.html",
  "descargar/la-guerra-silenciosa/index.html",
  "privacidad/index.html",
  "terminos/index.html",
  "assets/css/styles.css",
  "assets/js/email-capture.js",
  "config/site.json",
  "config/routes.json",
  "config/content-models.json",
  "config/email-funnel.json",
  "config/analytics-events.json",
  "config/canon-rules.json",
  "tsconfig.json"
];

const requiredDirs = [
  "src/app",
  "src/components",
  "src/data",
  "src/features",
  "src/lib",
  "src/styles",
  "src/types",
  "content/pages",
  "content/blog",
  "content/lead-magnets",
  "content/archetypes",
  "content/enemies",
  "content/community",
  "content/legal",
  "tests"
];

const missing = [
  ...requiredFiles.filter((file) => !existsSync(join(root, file))),
  ...requiredDirs.filter((dir) => !existsSync(join(root, dir)))
];

const htmlFiles = [];
function walk(dir) {
  for (const item of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, item.name);
    if (item.isDirectory()) walk(full);
    if (item.isFile() && item.name.endsWith(".html")) htmlFiles.push(full);
  }
}
walk(root);

const formCount = htmlFiles.reduce((count, file) => {
  const html = readFileSync(file, "utf8");
  return count + (html.match(/data-email-form/g) || []).length;
}, 0);

if (missing.length) {
  console.error("Missing foundation items:");
  for (const item of missing) console.error(`- ${item}`);
  process.exit(1);
}

console.log(`Foundation OK: ${htmlFiles.length} HTML pages, ${formCount} email forms.`);
