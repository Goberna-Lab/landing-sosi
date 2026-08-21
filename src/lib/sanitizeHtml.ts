// Copia a mano de packages/sdk/src/core/sanitize.ts del repo bravo.
//
// Por qué copiado y no `import { sanitizeHtml } from '@goberna-lab/bravo'`: el SDK
// se publica en GitHub Packages y el `npm ci` de deploy.yml corre sin GITHUB_TOKEN
// para el scope @goberna-lab, así que la instalación rompería. Misma decisión que
// feijoo, metavida y barrionuevo. Si algún día el CI tiene token, esto se reemplaza
// por el SDK, que además trae SEO por artículo y sitemap.
//
// El contenido es first-party (lo escribe el cliente en su propio panel) y la API ya
// lo pasa por sanitizeArticleBody al guardarlo, pero igual lo limpiamos antes de
// inyectarlo con set:html. Defensa en profundidad barata, no DOMPurify.
export function sanitizeHtml(html: string): string {
  if (!html) return '';
  return html
    .replace(/<\s*(script|style)\b[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, '')
    // [\s/] cubre el `/` como separador de atributos (ej. <svg/onload=...>), no solo espacios.
    .replace(/[\s/]on\w+\s*=\s*"[^"]*"/gi, '')
    .replace(/[\s/]on\w+\s*=\s*'[^']*'/gi, '')
    .replace(/[\s/]on\w+\s*=\s*[^\s>]+/gi, '')
    .replace(/(href|src|srcset|xlink:href)\s*=\s*"(?:javascript|data):[^"]*"/gi, '$1="#"')
    .replace(/(href|src|srcset|xlink:href)\s*=\s*'(?:javascript|data):[^']*'/gi, "$1='#'");
}
