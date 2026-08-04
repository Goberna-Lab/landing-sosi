# Changelog — landing-sosi

Registro de la sesión de verificación y corrección de las 3 versiones responsive (desktop 1920px, laptop 1366px, mobile 430px) del landing de Sosi Aspilcueta, contrastadas contra el Figma fuente de verdad.

## Contexto general

- Arquitectura: 3 layouts independientes (`src/components/sections/*.astro` para desktop, `.../laptop/*Laptop.astro`, `.../mobile/*Mobile.astro`), todos renderizados en el mismo DOM y alternados por CSS (`.desktop-only` / `.laptop-only` / `.mobile-only`) según el ancho de viewport.
- Escalado: `src/layouts/Layout.astro` aplica `zoom: var(--stage-scale)` sobre `.stage`, calculando `--stage-scale = min(1, clientWidth / pageWidth)` en cada resize.
- Figma: [Sosi-Landing](https://www.figma.com/design/VtwDN7KpERFNCB817roDUJ/Sosi-Landing) — un solo canvas "Desktop" con los 3 frames principales (`SOSI-DESKTOP-1920x1080`, `SOSI-DESKTOP-1366x620`, `SOSI-DESKTOP-430x932`) más un par de frames sueltos con estados alternativos de la pestaña Biografía (`Mi formación` / `Mi experiencia`) solo en tamaño 1920px — no existe un frame equivalente en 1366px para esos dos estados; sus posiciones en laptop se derivaron adaptando los offsets de desktop (ver sección Biografía).

## Fixes globales (afectan las 3 versiones)

- **`Layout.astro`**: `<meta name="viewport">` estaba fijo en `width=1920`, rompiendo el zoom-scale y las media queries en dispositivos reales → cambiado a `width=device-width, initial-scale=1`.
- **`Layout.astro`**: el cálculo de `--stage-scale` usaba `window.innerWidth` (incluye la barra de scroll vertical en la mayoría de navegadores) → cambiado a `document.documentElement.clientWidth`, eliminando el scroll horizontal que aparecía en pantallas de ~1920px de ancho.
- **`global.css`**: `.container-main` tenía un `padding: 2rem` que desalineaba el header del desktop respecto a Figma (~32px) → quitado (la clase solo la usa el Header desktop).
- **Copy del tagline del Hero**: las 3 versiones tenían hardcodeado "Candidata a la alcaldía · Mejía, Arequipa"; Figma (los 3 frames) dice "Teniente Alcaldesa · Mejía, Arequipa" → corregido en `Hero.astro`, `HeroLaptop.astro`, `HeroMobile.astro`, más el `<title>`/`<meta description>` en `index.astro` y el default de `Layout.astro`.

## Desktop (1920px)

### Header
- Nav `gap` era `2.5rem` (40px); Figma usa 32px consistentemente entre los 6 ítems → corregido a `2rem`.

### Hero (`Hero.astro`)
- Botón CTA en `top:55.72%` en vez de `59.72%` (typo de dígito) → corregido.
- Caja de la foto (`top`/`width`/`height`) no coincidía con la máscara de Figma (quedaba más arriba y más ancha de lo debido) → corregida a `top:13.52%; width:48.59%; height:86.48%`.
- Bug de frontmatter: quedó un solo `---` suelto (sin su cierre) tras una edición anterior, y Astro lo renderizaba como texto literal (`---`) justo antes de la sección Experiencia → eliminado.

### About (`About.astro`)
- Saltos de línea manuales agregados en los 2 párrafos de texto para que corten exactamente donde el diseño lo pide.

### Experiencia (`Experiencia.astro`)
- Tarjetas **PERSONAL/POLÍTICA** estaban invertidas (POLÍTICA debía ir a la izquierda) → corregido, incluyendo el ícono de PERSONAL que usaba `balance.svg` (el de POLÍTICA) en vez de `solidarity.svg`.
- Flechas de navegación: el contenedor `flex` no tenía ancho/alto propios y sus hijos usaban porcentajes — un contenedor sin tamaño definido no puede resolver porcentajes en sus hijos, así que las flechas colapsaban visualmente a casi nada → reescrito con posicionamiento absoluto independiente (mismo patrón que los puntos del timeline), y de paso el `gap` estaba 5× más ancho de lo debido.
- Imagen del timeline bajada para que su borde inferior coincida con el punto de la fecha "2010"; se le agregó `border-radius`.
- Más espacio entre los años y los puntos del timeline (`right:70.47%` → `71.5%`).
- **Timeline convertido en interactivo**: las flechas ahora avanzan/retroceden por las 10 fechas (2022 → 2010), moviendo el punto rojo, agrandando el año activo, y actualizando la descripción y la imagen/placeholder — con animaciones (cross-fade de puntos, transición de tamaño/color del año, slide-in de texto e imagen). Faltaba además un punto completo para "2022" (el punto rojo estaba desalineado, ocupando el lugar de "2019").
- Salto de línea específico agregado en la descripción de "2013-2014" para que corte en 2 líneas exactas.

### Stats (`Stats.astro`)
- Faltaba por completo el subtítulo "Ingeniera Pesquera / Especialista Ambiental / Gestión Pública" que sí tiene Figma (y la versión laptop) → se agregó y luego, por pedido explícito, se volvió a quitar (decisión final: sin subtítulo).
- Fondo (`immersive.jpg`) era una foto completamente distinta (evento escolar) a la de Figma (pescadores en la playa) → reemplazado por `immersive.png` (la imagen correcta).
- **Contador animado** agregado a los 3 números (15+, 10, 90%): cuentan desde 0 con `IntersectionObserver`, se dispara una sola vez al entrar la sección al viewport.

### Biografía (`Biografia.astro`)
- La foto superpuesta (`about-photo.png`) estaba anclada a `right:0`; Figma la ancla por la izquierda y la desborda ~16% (recortada por el contenedor) → corregido a `left:23.19%`. Offset vertical de la foto de fondo también corregido (`-10.81%` → `-15.56%`).
- Luego, por pedido explícito, se **quitó la segunda foto superpuesta** por completo (`about-photo.png` resultó ser la textura de mapa de la sección About, mal reutilizada aquí) — se deja solo `biografia-foto-1.png` (foto de los ancianos). Se agregó `border-radius`.
- **Pestañas conectadas**: "Mi formación" y "Mi experiencia" no tenían contenido propio (el script solo cambiaba el estilo de la pestaña activa, nunca el contenido) → se construyeron los 3 bloques de contenido completos (con íconos y texto reales, extraídos de los frames de Figma en 1920px) y se conectó el cambio de pestaña para alternarlos, con animación slide-right (texto) / slide-up (foto, re-disparada por script ya que no cambia de `display`).

### Galería (`Galeria.astro`)
- Quitados 3 íconos de flecha con círculo negro (`arrow-right.svg`) que no correspondían a esta sección.
- Agregado ícono de "imagen pendiente" centrado en los 2 cuadros placeholder grises.

### Blog (`Blog.astro`)
- Fondo de la tarjeta destacada reemplazado (imagen proporcionada por el usuario, `blog-featured-bg.png`) en vez de la textura de ruido genérica.

## Laptop (1366px)

- **Header**: verificado contra Figma — coincide exactamente (usa píxeles fijos, no tenía el bug de padding de desktop).
- **Hero**: contenedor de la foto usaba las dimensiones de la imagen en vez del marco de máscara de Figma (56px desplazado, 107px más ancho de lo debido) → corregido a `left:651px; top:66px; width:635px; height:554px`. Tagline y pose de la foto ya se habían corregido antes (ver "Fixes globales").
- **About**: íconos `s-shape.svg`/`border-shape.svg` usaban `height:100%` fijo, estirándolos no-uniformemente → corregido a `height:auto`.
- **Galería**: agregado el mismo ícono de placeholder que en desktop a los 2 cuadros grises.
- **Blog**: mismo fondo nuevo que desktop (la tarjeta laptop tiene casi la misma proporción, 589×445 vs 674×509 de desktop). Corregida también la posición del texto "Conoce más sobre mí" / "Leer artículo", que estaba a 104px del borde inferior (23% de la altura) cuando debía estar a ~55px (12.3%, igual proporción que desktop).
- **Stats**: agregado el mismo contador animado que desktop. Quitado el subtítulo "Ingeniera Pesquera..." para igualar a desktop.
- **Experiencia**: portado el timeline interactivo completo (mismos 10 datos, mismas animaciones). Se agregó el punto faltante para "2022" (mismo bug que tenía desktop). Se agregaron los íconos faltantes en las tarjetas POLÍTICA/PERSONAL (`balance.svg`/`solidarity.svg`) y se corrigió la posición de la barra separadora roja, que estaba pegada al texto.
- **Biografía**: quitada la segunda foto superpuesta (mismo ajuste que desktop) y agregado `border-radius`. Construidas las pestañas "Mi formación" y "Mi experiencia" completas (íconos + texto), adaptando los offsets de desktop — la tarjeta blanca mide la misma altura (610px) en ambas versiones, así que los offsets verticales se reutilizaron directo; los anchos de texto se escalaron proporcionalmente al ancho más angosto de la tarjeta laptop (1206px vs 1520px).

## Assets nuevos agregados

- `public/images/icons/icon-cetpro.svg`, `icon-universidad.svg` — íconos vectoriales reales (reemplazan un hack de PNG con chroma-key usado temporalmente).
- `public/images/icons/noun_Diploma_1218634.svg`, `noun_dense_2855562.svg`, `noun_money_in_hand_3606493.svg`, `noun_support_1156576.svg`, `noun_Business_2603804.svg` — íconos de las pestañas de Biografía (copiados desde `src/assets/icons/`, que no se sirve públicamente).
- `public/images/icons/image-placeholder.svg` — ícono de "imagen pendiente" para los cuadros grises de Galería.
- `public/images/immersive.png` — foto correcta de Stats (pescadores en la playa).
- `public/images/blog-featured-bg.png` — foto de fondo de la tarjeta destacada del Blog.
- `public/images/immersive-old-wrong.jpg.bak` — respaldo de la imagen incorrecta anterior (fuera de la ruta servida).

## Notas de implementación

- Patrón usado para animaciones reutilizables (en `global.css`): `.exp-year`, `.exp-dot-red`, `.exp-fade-slide`, `.bio-slide-right`, `.bio-slide-up` — clases genéricas de transición/animación, reutilizadas tanto en desktop como en laptop.
- Pitfall repetido y ya identificado: aplicar `transform`/`animation` directamente a un contenedor sin tamaño propio que aloja hijos `position:absolute` rompe el cálculo de porcentajes de esos hijos (el contenedor se vuelve su nuevo "containing block" pero sin dimensiones definidas). Se resolvió siempre dándole al contenedor animado un tamaño explícito igual al de su padre (`absolute inset-0` o `left/top/width/height` fijos).
