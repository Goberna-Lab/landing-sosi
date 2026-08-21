import { BRAVO } from '../config/bravo';

// Forma exacta que devuelve GET /v1/public/articles?tenant=<slug>.
// Son las 12 columnas del snapshot publicado (articles.post_versions), no el borrador.
// og_image_url ya viene con COALESCE sobre cover_image_url del lado de la API.
export interface BravoArticle {
  slug: string;
  title: string;
  excerpt: string | null;
  body_html: string | null;
  cover_image_url: string | null;
  category: string | null;
  seo_title: string | null;
  seo_description: string | null;
  og_image_url: string | null;
  canonical_url: string | null;
  noindex: boolean;
  published_at: string;
}

const TIMEOUT_MS = 15_000;

/**
 * Trae los artículos publicados. SOLO para build time (getStaticPaths / frontmatter).
 *
 * ⚠️ Tira una excepción si Bravo no responde, y eso es a propósito — no lo "arregles"
 * devolviendo []. `deploy.yml` hace `rsync -rl --delete` al docroot: un build que
 * degrada en silencio a cero artículos deja el deploy en verde y borra del servidor
 * todas las rutas de artículo que estaban vivas. Un build que falla se reintenta;
 * uno que deja el blog entero en 404 hay que descubrirlo primero.
 */
export async function fetchArticles(): Promise<BravoArticle[]> {
  const url = `${BRAVO.apiUrl}/v1/public/articles?tenant=${encodeURIComponent(BRAVO.tenant)}`;

  let res: Response;
  try {
    res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
  } catch (cause) {
    throw new Error(
      `[bravo] no se pudo contactar ${url} — se aborta el build para no publicar un sitio sin artículos`,
      { cause },
    );
  }

  if (!res.ok) {
    throw new Error(
      `[bravo] ${url} respondió ${res.status} — se aborta el build para no publicar un sitio sin artículos`,
    );
  }

  const data: unknown = await res.json();
  if (!Array.isArray(data)) {
    throw new Error(`[bravo] ${url} devolvió algo que no es una lista de artículos`);
  }

  return data as BravoArticle[];
}

/** dd/mm/aaaa, que es el formato que usa el diseño en las cards y en el detalle. */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'America/Lima',
  }).format(d);
}

/** Ruta del artículo en este sitio. Tiene que coincidir con article_url_pattern del tenant. */
export function articleHref(slug: string): string {
  return `/blog/${slug}/`;
}
