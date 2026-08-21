// Único lugar donde vive la identidad del tenant en Bravo.
// El slug tiene que coincidir EXACTO con identity.tenants.slug — no con el dominio
// ni con el nombre del repo. Cambiarlo acá lo cambia en el fetch de artículos, en
// el POST del formulario y en el shell del panel.
export const BRAVO = {
  tenant: 'sosiaspilcueta',
  apiUrl: 'https://bravo.goberna.us',
  siteUrl: 'https://sosiaspilcueta.com',
} as const;
