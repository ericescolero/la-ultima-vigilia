import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";

const siteRoot = resolve(new URL("..", import.meta.url).pathname);
const projectRoot = resolve(siteRoot, "..");
const contentDir = join(projectRoot, "content", "field-manuals");
const outputDir = join(siteRoot, "manuales");
const siteUrl = "https://laultimavigilia.com";
const defaultImage = "/assets/img/placeholders/BLOG_HERO.jpg";
const buildDate = new Intl.DateTimeFormat("sv-SE", {
  timeZone: "America/Mexico_City",
  year: "numeric",
  month: "2-digit",
  day: "2-digit"
}).format(new Date());
const rssTitle = "La Última Vigilia - Manuales de Campo";
const rssPath = "/rss.xml";
const validSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

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

function escapeXml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
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

function sitemapDate(value) {
  if (!value) return buildDate;
  const datePart = String(value).match(/^\d{4}-\d{2}-\d{2}/);
  if (datePart) return datePart[0];
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return buildDate;
  return date.toISOString().slice(0, 10);
}

function rssDate(value) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return new Date().toUTCString();
  return date.toUTCString();
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
  let lastKey = null;

  const lines = raw.split(/\r?\n/);

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (!line.trim()) continue;

    const listMatch = line.match(/^\s*-\s+(.*)$/);
    if (listMatch && activeList) {
      data[activeList].push(parseScalar(listMatch[1]));
      lastKey = activeList;
      continue;
    }

    const continuationMatch = line.match(/^\s+(.+)$/);
    if (continuationMatch && activeList && Array.isArray(data[activeList]) && data[activeList].length) {
      data[activeList][data[activeList].length - 1] = `${data[activeList][data[activeList].length - 1]} ${parseScalar(continuationMatch[1])}`;
      lastKey = activeList;
      continue;
    }

    if (continuationMatch && lastKey && !activeList && typeof data[lastKey] === "string") {
      data[lastKey] = `${data[lastKey]} ${parseScalar(continuationMatch[1])}`;
      continue;
    }

    const pairMatch = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!pairMatch) {
      lastKey = null;
      continue;
    }

    let [, key, value] = pairMatch;
    if (value === "") {
      data[key] = [];
      activeList = key;
      lastKey = key;
    } else {
      const quote = value.startsWith('"') ? '"' : value.startsWith("'") ? "'" : "";
      if (quote && !value.endsWith(quote)) {
        while (index + 1 < lines.length) {
          const nextLine = lines[index + 1];
          if (!/^\s+/.test(nextLine)) break;
          index += 1;
          value = `${value} ${nextLine.trim()}`;
          if (nextLine.trim().endsWith(quote)) break;
        }
      }
      data[key] = parseScalar(value);
      activeList = null;
      lastKey = key;
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

function excerptFromBody(body) {
  return body
    .replace(/!\[[^\]]*]\([^)]+\)/g, "")
    .replace(/\[[^\]]+]\([^)]+\)/g, "")
    .replace(/[#*_`>\-[\]()]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 155);
}

function normalizeStatus(value) {
  return String(value || "draft").trim().toLowerCase();
}

function isDraft(data) {
  return data.draft === true || data.published === false || normalizeStatus(data.status) === "draft";
}

function validateManual({ fileName, data, body }) {
  const warnings = [];
  const reasons = [];
  const title = String(data.title || "").trim();
  const slug = slugify(data.slug || basename(fileName, ".md"));
  const status = normalizeStatus(data.status);
  const bodyText = body.trim();

  if (data.draft === true) reasons.push("draft=true");
  if (data.published === false) reasons.push("published=false");
  if (!title) reasons.push("missing title");
  if (!slug) reasons.push("missing slug");
  if (slug && !validSlugPattern.test(slug)) reasons.push(`invalid slug "${slug}"`);
  if (!bodyText) reasons.push("missing body content");

  if (status !== "published") {
    reasons.push(`status is "${status || "missing"}"`);
  }

  if (!data.publish_date && !data.date) warnings.push("missing publish date; build date/RSS fallback will be used");
  if (!data.seo_description && !data.description) warnings.push("missing SEO description; body excerpt fallback will be used");
  if (!data.featured_image) warnings.push(`missing featured image; using ${defaultImage}`);
  if (!data.author) warnings.push("missing author; using Erick Escolero");

  return {
    slug,
    title,
    status,
    warnings,
    reasons: isDraft(data) || reasons.length ? [...new Set(reasons)] : []
  };
}

function readManuals() {
  const diagnostics = [];
  const errors = [];

  if (!existsSync(contentDir)) {
    return {
      manuals: [],
      diagnostics: [{ state: "ERROR", fileName: "content/field-manuals", messages: ["content directory is missing"] }],
      errors: ["content directory is missing"]
    };
  }

  const entries = readdirSync(contentDir, { withFileTypes: true })
    .filter((item) => item.isFile() && item.name.endsWith(".md"))
    .map((item) => {
      const filePath = join(contentDir, item.name);
      const { data, body } = parseFrontmatter(readFileSync(filePath, "utf8"));
      const validation = validateManual({ fileName: item.name, data, body });
      const slug = validation.slug;

      if (validation.reasons.length) {
        diagnostics.push({
          state: "SKIPPED",
          fileName: item.name,
          messages: validation.reasons
        });
        return null;
      }

      const rawTags = Array.isArray(data.tags) ? data.tags : data.tags ? [data.tags] : [];
      const tags = rawTags
        .flatMap((tag) => String(tag).split(","))
        .map((tag) => tag.trim())
        .filter(Boolean);
      const featuredImage = normalizeImage(data.featured_image);
      const title = validation.title;
      const description = data.seo_description || data.description || excerptFromBody(body);
      const manual = {
        sourceFile: item.name,
        title,
        slug,
        status: validation.status,
        author: data.author || "Erick Escolero",
        publishDate: data.publish_date || data.date || "",
        updatedDate: data.updated_date || data.updated || data.modified_date || data.modified || "",
        tags,
        featuredImage,
        featuredImageAlt: data.featured_image_alt || title,
        seoTitle: data.seo_title || `${title} | Manuales de Campo`,
        seoDescription: description,
        bodyHtml: renderMarkdown(body),
        url: `/manuales/${slug}/`,
        warnings: validation.warnings
      };

      diagnostics.push({
        state: "GENERATED",
        fileName: item.name,
        messages: [`/manuales/${slug}/`, ...validation.warnings]
      });
      return manual;
    })
    .filter(Boolean);

  const slugSources = new Map();
  for (const manual of entries) {
    if (!slugSources.has(manual.slug)) {
      slugSources.set(manual.slug, [manual.sourceFile]);
      continue;
    }
    slugSources.get(manual.slug).push(manual.sourceFile);
  }

  for (const [slug, sourceFiles] of slugSources.entries()) {
    if (sourceFiles.length > 1) {
      const message = `duplicate slug "${slug}" in ${sourceFiles.join(", ")}`;
      errors.push(message);
      diagnostics.push({
        state: "ERROR",
        fileName: slug,
        messages: [message]
      });
    }
  }

  return {
    manuals: entries.sort((a, b) => new Date(b.publishDate || 0) - new Date(a.publishDate || 0)),
    diagnostics,
    errors
  };
}

function header(active = "manuales") {
  const activeAttr = (key) => (active === key ? ' class="is-active" aria-current="page"' : "");
  const parentAttr = (keys) => (keys.includes(active) ? ' class="nav-parent is-active" aria-current="page"' : ' class="nav-parent"');
  return `<header class="site-header">
      <nav class="nav" aria-label="Principal">
        <a class="brand" href="/" aria-label="La Ultima Vigilia">
          <img class="header-logo" src="/assets/img/placeholders/LOGO_HEADER.svg" alt="La Ultima Vigilia" width="600" height="160">
        </a>
        <div class="nav-links">
          <a${activeAttr("home")} href="/">Inicio</a>
          <span class="nav-menu"><button${parentAttr(["start", "universe", "archetypes", "enemies", "battlefields"])} type="button" aria-haspopup="true">Explorar <span class="nav-caret" aria-hidden="true">▼</span></button><span class="submenu"><a${activeAttr("start")} href="/start-here/">Empieza Aquí</a><a${activeAttr("universe")} href="/the-watchman-universe/">The Watchman Universe</a><a href="/archetypes/">Arquetipos</a><a href="/enemy-forces/">Fuerzas de Corrupción</a><a href="/battlefields/">Biblioteca de Batallas</a></span></span>
          <span class="nav-menu"><button${parentAttr(["manuales"])} type="button" aria-haspopup="true">Manuales <span class="nav-caret" aria-hidden="true">▼</span></button><span class="submenu"><a${activeAttr("manuales")} href="/manuales/">Todos los Manuales</a><a href="/manuales/guerra-espiritual/">Guerra Espiritual</a><a href="/manuales/disciplina/">Disciplina</a><a href="/manuales/proposito/">Propósito</a><a href="/manuales/identidad/">Identidad</a><a href="/manuales/lujuria/">Lujuria</a><a href="/manuales/babilonia/">Babilonia</a><a href="/manuales/liderazgo/">Liderazgo</a></span></span>
          <span class="nav-menu"><button${parentAttr(["remanente"])} type="button" aria-haspopup="true">Comunidad <span class="nav-caret" aria-hidden="true">▼</span></button><span class="submenu"><a${activeAttr("remanente")} href="/el-remanente/">El Remanente</a><a href="https://t.me/laultimavigilia">Telegram</a><a href="https://www.facebook.com/groups/2222769021808686/">Facebook</a></span></span>
        </div>
        <a class="nav-cta" href="/la-guerra-silenciosa/">Descargar PDF</a>
      </nav>
    </header>`;
}

function footer() {
  return `<footer class="site-footer"><div class="container footer-grid global-footer-grid"><div class="footer-brand"><img class="footer-logo" src="/assets/img/placeholders/LOGO_HEADER.svg" alt="La Ultima Vigilia" width="600" height="160"><p>Despertar. Vigilar. Resistir Babylon. Terminar la mision.</p></div><div class="footer-column"><h3>Explorar</h3><div class="footer-links"><a href="/">Inicio</a><a href="/start-here/">Empieza Aquí</a><a href="/the-watchman-universe/">The Watchman Universe</a><a href="/archetypes/">Arquetipos</a><a href="/enemy-forces/">Fuerzas de Corrupción</a><a href="/battlefields/">Biblioteca de Batallas</a></div></div><div class="footer-column"><h3>Manuales</h3><div class="footer-links"><a href="/manuales/">Todos los Manuales</a><a href="/manuales/guerra-espiritual/">Guerra Espiritual</a><a href="/manuales/disciplina/">Disciplina</a><a href="/manuales/proposito/">Propósito</a><a href="/manuales/identidad/">Identidad</a><a href="/manuales/lujuria/">Lujuria</a></div></div><div class="footer-column"><h3>Comunidad</h3><div class="footer-links"><a href="/el-remanente/">El Remanente</a><a href="https://t.me/laultimavigilia">Telegram</a><a href="https://www.facebook.com/groups/2222769021808686/">Facebook</a><a href="/la-guerra-silenciosa/">Descargar PDF</a><a href="/privacidad/">Privacidad</a><a href="/terminos/">Terminos</a></div><div class="social-links"><a href="#" aria-label="TikTok"><img src="/assets/img/placeholders/ICON_SOCIAL_TIKTOK.svg" alt=""></a><a href="#" aria-label="Instagram"><img src="/assets/img/placeholders/ICON_SOCIAL_INSTAGRAM.svg" alt=""></a><a href="https://www.facebook.com/groups/2222769021808686/" aria-label="Facebook"><img src="/assets/img/placeholders/ICON_SOCIAL_FACEBOOK.svg" alt=""></a><a href="https://t.me/laultimavigilia" aria-label="Telegram"><img src="/assets/img/placeholders/ICON_SOCIAL_TELEGRAM.svg" alt=""></a><a href="#" aria-label="YouTube"><img src="/assets/img/placeholders/ICON_SOCIAL_YOUTUBE.svg" alt=""></a><a href="#" aria-label="Threads"><img src="/assets/img/placeholders/ICON_SOCIAL_THREADS.svg" alt=""></a></div></div></div></footer>`;
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
    <link rel="alternate" type="application/rss+xml" title="${escapeAttr(rssTitle)}" href="${siteUrl}${rssPath}">
    <meta property="og:title" content="${safeTitle}">
    <meta property="og:description" content="${safeDescription}">
    <meta property="og:type" content="${type}">
    <meta property="og:url" content="${safeCanonical}">
    <meta property="og:image" content="${safeImage}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="mailerlite-endpoint" content="https://assets.mailerlite.com/jsonp/2374679/forms/190533263957165697/subscribe">
    <link rel="stylesheet" href="/assets/css/styles.css?v=20260621-authority-pages">
    <script defer src="/assets/js/email-capture.js?v=20260620-leadmagnet-redirects"></script>
    <script defer src="/assets/js/scroll-animations.js?v=20260621-mobile-archetypes"></script>
    <script defer src="/assets/js/navigation.js?v=20260620-ecosystem-nav"></script>${schema ? `\n    <script type="application/ld+json">${jsonLd(schema)}</script>` : ""}
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
    : `<div class="manual-empty panel accent"><h2>Los Manuales de Campo estan siendo preparados.</h2><p>Cuando un manual sea publicado desde el CMS, aparecera aqui como archivo publico.</p></div>`;

  return `<!doctype html>
<html lang="es">
  ${head({
    title: "Manuales de Campo | La Ultima Vigilia",
    description: "Archivo publico de Manuales de Campo: briefings, estrategia y ensenanzas para hombres del Remanente.",
    canonical: `${siteUrl}/manuales/`,
    image: defaultImage
  })}
  <body class="is-page">
    ${header("manuales")}
    <main>
      <section class="hero page-cinematic manuales-hero"><picture class="hero-art"><img src="/assets/img/placeholders/BLOG_HERO.jpg" alt="Archivo cinematico de Manuales de Campo"></picture><div class="container hero-stage"><div class="hero-copy"><p class="eyebrow">Manuales de Campo</p><h1>Archivo de guerra para hombres despiertos</h1><p class="lead">Briefings, ensenanzas y estrategia para reconocer la corrupcion, sostener la vigilancia y cumplir la mision.</p></div></div></section>
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
    ${header("manuales")}
    <main>
      <article>
        <section class="hero page-cinematic manual-article-hero"><picture class="hero-art"><img src="${escapeAttr(manual.featuredImage)}" alt="${escapeAttr(manual.featuredImageAlt)}"></picture><div class="container hero-stage"><div class="hero-copy"><p class="eyebrow">Manual de Campo</p><h1>${escapeHtml(manual.title)}</h1><p class="lead">${escapeHtml(manual.seoDescription)}</p><div class="manual-meta"><span>${escapeHtml(manual.author)}</span><span>${escapeHtml(formatDate(manual.publishDate))}</span></div></div></div></section>
        <div class="container manual-layout">
          <aside class="manual-sidebar">
            <p class="section-kicker">Archivo</p>
            <h2>Manual de Campo</h2>
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
    "/start-here/",
    "/the-watchman-universe/",
    "/archetypes/",
    "/enemy-forces/",
    "/battlefields/",
    "/la-guerra-silenciosa/",
    "/el-remanente/",
    "/mision/",
    "/manuales/",
    rssPath,
    "/privacidad/",
    "/terminos/"
  ];
  const urls = [
    ...staticUrls.map((url) => ({ loc: url, lastmod: buildDate })),
    ...manuals.map((manual) => ({
      loc: manual.url,
      lastmod: sitemapDate(manual.updatedDate || manual.publishDate)
    }))
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${siteUrl}${url.loc}</loc><lastmod>${url.lastmod}</lastmod></url>`).join("\n")}
</urlset>
`;

  writeFileSync(join(siteRoot, "sitemap.xml"), xml);
}

function writeRss(manuals) {
  const items = manuals
    .map((manual) => {
      const link = `${siteUrl}${manual.url}`;
      return `    <item>
      <title>${escapeXml(manual.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <pubDate>${escapeXml(rssDate(manual.publishDate))}</pubDate>
      <dc:creator>${escapeXml(manual.author)}</dc:creator>
      <description>${escapeXml(manual.seoDescription)}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(rssTitle)}</title>
    <link>${siteUrl}/manuales/</link>
    <atom:link href="${siteUrl}${rssPath}" rel="self" type="application/rss+xml" />
    <description>Manuales de Campo publicados por La Última Vigilia.</description>
    <language>es</language>
    <lastBuildDate>${escapeXml(rssDate())}</lastBuildDate>
${items}
  </channel>
</rss>
`;

  writeFileSync(join(siteRoot, "rss.xml"), xml);
}

function printDiagnostics(diagnostics, manuals, errors) {
  console.log("Field Manual build report:");
  if (!diagnostics.length) {
    console.log("  SKIPPED: no markdown files found in content/field-manuals/");
  }

  for (const diagnostic of diagnostics) {
    console.log(`  ${diagnostic.state}: ${diagnostic.fileName}`);
    for (const message of diagnostic.messages) {
      console.log(`    - ${message}`);
    }
  }

  console.log(`Field Manual summary: ${manuals.length} generated, ${diagnostics.filter((item) => item.state === "SKIPPED").length} skipped, ${errors.length} error${errors.length === 1 ? "" : "s"}.`);
}

const { manuals, diagnostics, errors } = readManuals();
printDiagnostics(diagnostics, manuals, errors);

if (errors.length) {
  throw new Error(`Field Manual generation failed: ${errors.join("; ")}`);
}

rmSync(outputDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
mkdirSync(outputDir, { recursive: true });
writePage(join(outputDir, "index.html"), renderIndex(manuals));

for (const manual of manuals) {
  writePage(join(outputDir, manual.slug, "index.html"), renderArticle(manual));
}

writeSitemap(manuals);
writeRss(manuals);

console.log(`Generated Manuales de Campo: ${manuals.length} published manual${manuals.length === 1 ? "" : "s"}.`);
