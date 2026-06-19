import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";

const siteRoot = resolve(new URL("..", import.meta.url).pathname);
const projectRoot = resolve(siteRoot, "..");
const contentDir = join(projectRoot, "content", "field-manuals");
const outputDir = join(siteRoot, "manuales");
const siteUrl = "https://laultimavigilia.com";
const defaultImage = "/assets/img/placeholders/BLOG_HERO.jpg";

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttr(value = "") {
  return escapeHtml(value).replace(/`/g, "&#96;");
}

function slugify(value = "") {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return escapeHtml(value);
  return new Intl.DateTimeFormat("es", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(date);
}

function parseScalar(value) {
  const trimmed = value.trim();
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    return trimmed
      .slice(1, -1)
      .split(",")
      .map((item) => parseScalar(item))
      .filter(Boolean);
  }
  return trimmed;
}

function parseFrontmatter(markdown) {
  if (!markdown.startsWith("---")) {
    return { data: {}, body: markdown };
  }

  const end = markdown.indexOf("\n---", 3);
  if (end === -1) {
    return { data: {}, body: markdown };
  }

  const raw = markdown.slice(3, end).trim();
  const body = markdown.slice(end + 4).trim();
  const data = {};
  let activeList = null;

  for (const line of raw.split(/\r?\n/)) {
    if (!line.trim()) continue;

    const listMatch = line.match(/^\s*-\s+(.*)$/);
    if (listMatch && activeList) {
      data[activeList].push(parseScalar(listMatch[1]));
      continue;
    }

    const pairMatch = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!pairMatch) continue;

    const [, key, value] = pairMatch;
    if (value === "") {
      data[key] = [];
      activeList = key;
    } else {
      data[key] = parseScalar(value);
      activeList = null;
    }
  }

  return { data, body };
}

function renderInline(text) {
  let output = escapeHtml(text);
  output = output.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy">');
  output = output.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  output = output.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  output = output.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  output = output.replace(/`([^`]+)`/g, "<code>$1</code>");
  return output;
}

function renderMarkdown(markdown) {
  const blocks = [];
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  let paragraph = [];
  let list = [];

  function flushParagraph() {
    if (!paragraph.length) return;
    blocks.push(`<p>${renderInline(paragraph.join(" "))}</p>`);
    paragraph = [];
  }

  function flushList() {
    if (!list.length) return;
    blocks.push(`<ul>${list.map((item) => `<li>${renderInline(item)}</li>`).join("")}</ul>`);
    list = [];
  }

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      flushList();
      continue;
    }

    const heading = trimmed.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      flushList();
      const level = Math.min(heading[1].length + 1, 4);
      blocks.push(`<h${level}>${renderInline(heading[2])}</h${level}>`);
      continue;
    }

    const listItem = trimmed.match(/^[-*]\s+(.+)$/);
    if (listItem) {
      flushParagraph();
      list.push(listItem[1]);
      continue;
    }

    flushList();
    paragraph.push(trimmed);
  }

  flushParagraph();
  flushList();
  return blocks.join("\n");
}

function normalizeImage(path) {
  if (!path) return defaultImage;
  if (/^https?:\/\//.test(path)) return path;
  if (path.startsWith("/")) return path;
  if (path.startsWith("website/")) return `/${path.replace(/^website\//, "")}`;
  return path;
}

function absoluteUrl(path) {
  if (/^https?:\/\//.test(path)) return path;
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

function jsonLd(data) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function readManuals() {
  if (!existsSync(contentDir)) return [];

  return readdirSync(contentDir, { withFileTypes: true })
    .filter((item) => item.isFile() && item.name.endsWith(".md"))
    .map((item) => {
      const filePath = join(contentDir, item.name);
      const { data, body } = parseFrontmatter(readFileSync(filePath, "utf8"));
      const slug = slugify(data.slug || basename(item.name, ".md"));
      const tags = Array.isArray(data.tags) ? data.tags : data.tags ? [data.tags] : [];
      const featuredImage = normalizeImage(data.featured_image);
      const title = data.title || slug.replace(/-/g, " ");
      const description = data.seo_description || data.description || body.replace(/[#*_`>\-\[\]()]/g, "").slice(0, 155);

      return {
        title,
        slug,
        status: data.status || "draft",
        author: data.author || "Erick Escolero",
        publishDate: data.publish_date || data.date || "",
        tags,
        featuredImage,
        featuredImageAlt: data.featured_image_alt || title,
        seoTitle: data.seo_title || `${title} | Field Manuals`,
        seoDescription: description,
        bodyHtml: renderMarkdown(body),
        url: `/manuales/${slug}/`
      };
    })
    .filter((manual) => manual.status === "published" && manual.slug)
    .sort((a, b) => new Date(b.publishDate || 0) - new Date(a.publishDate || 0));
}

function header(active = "blog") {
  const activeAttr = (key) => (active === key ? ' class="is-active" aria-current="page"' : "");
  return `<header class="site-header">
      <nav class="nav" aria-label="Principal">
        <a class="brand" href="/" aria-label="La Ultima Vigilia">
          <img class="header-logo" src="/assets/img/placeholders/LOGO_HEADER.svg" alt="La Ultima Vigilia" width="600" height="160">
        </a>
        <div class="nav-links">
          <a${activeAttr("home")} href="/">Inicio</a>
          <a${activeAttr("mision")} href="/mision/">Mision</a>
          <a${activeAttr("guerra")} href="/la-guerra-silenciosa/">La Guerra Silenciosa</a>
          <span class="nav-menu"><a${activeAttr("remanente")} href="/el-remanente/">El Remanente</a><span class="submenu"><a href="#">El Arsenal</a></span></span>
          <a${activeAttr("blog")} href="/blog/">Blog</a>
        </div>
        <a class="nav-cta" href="/la-guerra-silenciosa/">Recibir PDF</a>
      </nav>
    </header>`;
}

function footer() {
  return `<footer class="site-footer"><div class="container footer-grid global-footer-grid"><div class="footer-brand"><img class="footer-logo" src="/assets/img/placeholders/LOGO_HEADER.svg" alt="La Ultima Vigilia" width="600" height="160"><p>Despertar. Vigilar. Resistir Babylon. Terminar la mision.</p></div><div class="footer-column"><h3>Enlaces</h3><div class="footer-links"><a href="/">Inicio</a><a href="/mision/">Mision</a><a href="/la-guerra-silenciosa/">La Guerra Silenciosa</a><a href="/el-remanente/">El Remanente</a><a href="/blog/">Blog</a></div></div><div class="footer-column"><h3>Comunidad</h3><div class="footer-links"><a href="/descargar/la-guerra-silenciosa/">Descarga</a><a href="/privacidad/">Privacidad</a><a href="/terminos/">Terminos</a></div></div><div class="footer-column"><h3>Siguenos</h3><div class="social-links"><a href="#" aria-label="TikTok"><img src="/assets/img/placeholders/ICON_SOCIAL_TIKTOK.svg" alt=""></a><a href="#" aria-label="Instagram"><img src="/assets/img/placeholders/ICON_SOCIAL_INSTAGRAM.svg" alt=""></a><a href="#" aria-label="Facebook"><img src="/assets/img/placeholders/ICON_SOCIAL_FACEBOOK.svg" alt=""></a><a href="#" aria-label="Telegram"><img src="/assets/img/placeholders/ICON_SOCIAL_TELEGRAM.svg" alt=""></a><a href="#" aria-label="YouTube"><img src="/assets/img/placeholders/ICON_SOCIAL_YOUTUBE.svg" alt=""></a><a href="#" aria-label="Threads"><img src="/assets/img/placeholders/ICON_SOCIAL_THREADS.svg" alt=""></a></div></div></div></footer>`;
}

function head({ title, description, canonical, type = "website", image, schema }) {
  const safeTitle = escapeAttr(title);
  const safeDescription = escapeAttr(description);
  const safeCanonical = escapeAttr(canonical);
  const safeImage = escapeAttr(absoluteUrl(image || defaultImage));

  return `<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${safeTitle}</title>
    <meta name="description" content="${safeDescription}">
    <link rel="canonical" href="${safeCanonical}">
    <meta property="og:title" content="${safeTitle}">
    <meta property="og:description" content="${safeDescription}">
    <meta property="og:type" content="${type}">
    <meta property="og:url" content="${safeCanonical}">
    <meta property="og:image" content="${safeImage}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="mailerlite-endpoint" content="https://assets.mailerlite.com/jsonp/2374679/forms/190533263957165697/subscribe">
    <link rel="stylesheet" href="/assets/css/styles.css?v=20260618-layout">
    <script defer src="/assets/js/email-capture.js"></script>
    <script defer src="/assets/js/scroll-animations.js"></script>
    <script defer src="/assets/js/navigation.js"></script>${schema ? `\n    <script type="application/ld+json">${jsonLd(schema)}</script>` : ""}
  </head>`;
}

function ecosystemSection() {
  return `<section class="section war-room"><div class="container chamber-heading"><p class="section-kicker">El Ecosistema</p><h2>Entrena. Conéctate. Representa.</h2></div><div class="container briefing-strip"><a class="briefing-tile" href="#"><img src="/assets/img/placeholders/WAR_ROOM_BRIEFING_01.jpg" alt="Placeholder de briefing sobre guerra espiritual"><span>La Sala de Guerra</span><p>Briefings, enseñanzas y estrategia para hombres que se niegan a dormir mientras Babilonia avanza.</p></a><a class="briefing-tile" href="#"><img src="/assets/img/placeholders/WAR_ROOM_BRIEFING_02.jpg" alt="Placeholder de briefing sobre Babylon y la mente"><span>El Remanente</span><p>Telegram, Facebook y futura membresía para los que entienden que esta guerra no se pelea solos.</p></a><a class="briefing-tile" href="#"><img src="/assets/img/placeholders/WAR_ROOM_BRIEFING_03.jpg" alt="Placeholder de briefing sobre disciplina"><span>El Arsenal</span><p>Camisetas, tazas, monedas, pósters y símbolos para representar la misión fuera de la pantalla.</p></a></div><p class="center-action"><a class="button secondary" href="#">Explorar el Ecosistema</a></p></section>`;
}

function finalCta(source) {
  return `<section class="section-tight final-gathering global-cta-section"><div class="container panel accent global-cta-card"><p class="section-kicker">Primer briefing</p><h2>Recibe La Guerra Silenciosa</h2><p>Empieza con el manual que expone las siete batallas invisibles que drenan el proposito del hombre.</p><form class="email-form" action="https://assets.mailerlite.com/jsonp/2374679/forms/190533263957165697/subscribe" method="post" data-email-form data-source="${escapeAttr(source)}" data-interest="la-guerra-silenciosa"><label for="${escapeAttr(source)}-email">Correo electronico</label><div class="email-row"><input id="${escapeAttr(source)}-email" name="fields[email]" type="email" autocomplete="email" inputmode="email" placeholder="tu@correo.com" required><button type="submit">Unirme al Remanente</button></div><p class="form-message" data-form-message></p></form></div></section>`;
}

function renderIndex(manuals) {
  const cards = manuals.length
    ? manuals
        .map(
          (manual) => `<a class="manual-card" href="${manual.url}">
            <img src="${escapeAttr(manual.featuredImage)}" alt="${escapeAttr(manual.featuredImageAlt)}" loading="lazy">
            <div class="manual-card-body">
              <span>${escapeHtml(formatDate(manual.publishDate))}</span>
              <h3>${escapeHtml(manual.title)}</h3>
              <p>${escapeHtml(manual.seoDescription)}</p>
              <small>${escapeHtml(manual.tags.join(" / "))}</small>
            </div>
          </a>`
        )
        .join("\n")
    : `<div class="manual-empty panel accent"><h2>Los Field Manuals estan siendo preparados.</h2><p>Cuando un manual sea publicado desde el CMS, aparecera aqui como archivo publico.</p></div>`;

  return `<!doctype html>
<html lang="es">
  ${head({
    title: "Field Manuals | La Ultima Vigilia",
    description: "Archivo publico de Field Manuals: briefings, estrategia y ensenanzas para hombres del Remanente.",
    canonical: `${siteUrl}/manuales/`,
    image: defaultImage
  })}
  <body class="is-page">
    ${header("blog")}
    <main>
      <section class="hero page-cinematic manuales-hero"><picture class="hero-art"><img src="/assets/img/placeholders/BLOG_HERO.jpg" alt="Archivo cinematico de Field Manuals"></picture><div class="container hero-stage"><div class="hero-copy"><p class="eyebrow">Field Manuals</p><h1>Archivo de guerra para hombres despiertos</h1><p class="lead">Briefings, ensenanzas y estrategia para reconocer la corrupcion, sostener la vigilancia y cumplir la mision.</p></div></div></section>
      <section class="section atmospheric manual-archive"><div class="container chamber-heading"><p class="section-kicker">Archivo publico</p><h2>Manuales publicados</h2></div><div class="container manual-grid">${cards}</div></section>
      ${ecosystemSection()}
      ${finalCta("field-manuals-index")}
    </main>
    ${footer()}
  </body>
</html>`;
}

function renderArticle(manual) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: manual.title,
    description: manual.seoDescription,
    image: absoluteUrl(manual.featuredImage),
    author: {
      "@type": "Person",
      name: manual.author
    },
    publisher: {
      "@type": "Organization",
      name: "La Ultima Vigilia",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/assets/img/placeholders/LOGO_HEADER.svg`
      }
    },
    datePublished: manual.publishDate,
    dateModified: manual.publishDate,
    mainEntityOfPage: `${siteUrl}${manual.url}`
  };

  return `<!doctype html>
<html lang="es">
  ${head({
    title: manual.seoTitle,
    description: manual.seoDescription,
    canonical: `${siteUrl}${manual.url}`,
    type: "article",
    image: manual.featuredImage,
    schema
  })}
  <body class="is-page">
    ${header("blog")}
    <main>
      <article>
        <section class="hero page-cinematic manual-article-hero"><picture class="hero-art"><img src="${escapeAttr(manual.featuredImage)}" alt="${escapeAttr(manual.featuredImageAlt)}"></picture><div class="container hero-stage"><div class="hero-copy"><p class="eyebrow">Field Manual</p><h1>${escapeHtml(manual.title)}</h1><p class="lead">${escapeHtml(manual.seoDescription)}</p><div class="manual-meta"><span>${escapeHtml(manual.author)}</span><span>${escapeHtml(formatDate(manual.publishDate))}</span></div></div></div></section>
        <div class="container manual-layout">
          <aside class="manual-sidebar">
            <p class="section-kicker">Archivo</p>
            <h2>Field Manual</h2>
            <div class="manual-tags">${manual.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>
          </aside>
          <div class="article manual-content">
            ${manual.bodyHtml}
          </div>
        </div>
      </article>
      ${ecosystemSection()}
      ${finalCta(`field-manual-${manual.slug}`)}
    </main>
    ${footer()}
  </body>
</html>`;
}

function writePage(path, html) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, html);
}

function writeSitemap(manuals) {
  const staticUrls = [
    "/",
    "/la-guerra-silenciosa/",
    "/el-remanente/",
    "/mision/",
    "/blog/",
    "/blog/la-guerra-silenciosa-hombres/",
    "/manuales/",
    "/privacidad/",
    "/terminos/"
  ];
  const manualUrls = manuals.map((manual) => manual.url);
  const urls = [...staticUrls, ...manualUrls];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${siteUrl}${url}</loc></url>`).join("\n")}
</urlset>
`;

  writeFileSync(join(siteRoot, "sitemap.xml"), xml);
}

const manuals = readManuals();
rmSync(outputDir, { recursive: true, force: true });
mkdirSync(outputDir, { recursive: true });
writePage(join(outputDir, "index.html"), renderIndex(manuals));

for (const manual of manuals) {
  writePage(join(outputDir, manual.slug, "index.html"), renderArticle(manual));
}

writeSitemap(manuals);

console.log(`Generated Field Manuals: ${manuals.length} published manual${manuals.length === 1 ? "" : "s"}.`);
