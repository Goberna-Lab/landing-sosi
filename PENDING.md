# Pendiente — landing-sosi

Lo que quedó fuera del alcance de esta sesión, para continuar después.

## Laptop (1366px)
- **CTA laptop** (`CTALaptop.astro`) y **Contacto laptop** (`ContactoLaptop.astro`): no se auditaron contra Figma en esta sesión (en desktop ambos salieron limpios en la auditoría, pero no se verificó específicamente la versión laptop).
- **Biografía laptop — pestañas "Mi formación"/"Mi experiencia"**: el contenido y las posiciones se construyeron adaptando los offsets del frame de Figma en 1920px (no existe un frame equivalente en 1366px para estos 2 estados), escalando los anchos de texto proporcionalmente. Falta una revisión visual en el navegador para confirmar que las posiciones se vean bien — no se pudo verificar con captura de pantalla en esta sesión.
- **Experiencia laptop**: revisar visualmente el resultado final del timeline interactivo y las tarjetas POLÍTICA/PERSONAL con los íconos agregados (no se confirmó con captura tras el último fix).

## Mobile (430px)
- Solo se tocaron `HeroMobile.astro` (alineación + tagline) y `BlogMobile.astro` (badge "ENE" + 4to punto de paginación) al inicio de la sesión, como parte del plan original aprobado.
- **No se hizo ninguna auditoría exhaustiva de mobile contra Figma** más allá de esa revisión inicial (posiciones, copy, imágenes). Dado todo lo que se encontró en desktop y laptop durante esta sesión, es muy probable que mobile tenga bugs similares sin descubrir.
- Ninguna de las funcionalidades nuevas (contador animado de Stats, timeline interactivo de Experiencia, pestañas de Biografía con contenido real) se portó a mobile.

## Otros
- **Discusión de arquitectura**: se evaluó y se descartó fusionar desktop+laptop en una sola versión escalada (los 3 frames de Figma están ajustados a mano, no son un solo diseño escalado — distinto aspect ratio, recortes de foto no proporcionales). Pendiente si se quiere revisar: centralizar el copy compartido entre las 3 versiones en un solo lugar (hoy está triplicado, lo que causó el bug del tagline "Candidata a la alcaldía" vs "Teniente Alcaldesa" — se corrigió a mano en los 3 archivos, pero un cambio de copy futuro requeriría repetir el proceso).
- **Lazy-loading de imágenes**: las 3 versiones se renderizan simultáneamente en el DOM (solo se ocultan por CSS), así que el navegador descarga las imágenes de las 3 en cada visita. No se implementó ninguna optimización (`loading="lazy"` en las versiones ocultas) — quedó solo como sugerencia discutida.
