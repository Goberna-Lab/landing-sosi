import { BRAVO } from '../config/bravo';

// Se engancha a TODOS los form[data-bravo-contact] de la página. Son tres: el sitio
// renderiza las versiones desktop/laptop/mobile a la vez en el DOM y solo las oculta
// por CSS, así que el mismo formulario existe por triplicado. Cada uno se maneja solo.

const ENDPOINT = `${BRAVO.apiUrl}/v1/public/contact`;
const TIMEOUT_MS = 15_000;

const MENSAJES = {
  enviando: 'Enviando…',
  ok: '¡Gracias! Tu mensaje llegó. Te vamos a responder pronto.',
  sinContacto: 'Dejanos un correo o un teléfono para poder responderte.',
  rateLimit: 'Recibimos demasiados envíos desde tu conexión. Probá de nuevo en unos minutos.',
  invalido: 'Revisá los datos: hay algún campo que no quedó bien.',
  generico: 'No pudimos enviar tu mensaje. Probá de nuevo en un momento.',
  red: 'No pudimos conectarnos. Revisá tu conexión e intentá de nuevo.',
} as const;

function setStatus(form: HTMLFormElement, text: string, tipo: 'ok' | 'error' | 'pendiente') {
  const box = form.querySelector<HTMLElement>('[data-bravo-status]');
  if (!box) return;
  box.textContent = text;
  box.dataset.tipo = tipo;
  box.style.display = text ? 'block' : 'none';
  box.style.color = tipo === 'error' ? '#B30202' : tipo === 'ok' ? '#0F7A3D' : 'rgba(27,31,40,0.6)';
}

async function enviar(form: HTMLFormElement) {
  const submit = form.querySelector<HTMLButtonElement>('[data-bravo-submit]');
  const etiqueta = submit?.querySelector<HTMLElement>('[data-bravo-submit-label]');
  const textoOriginal = etiqueta?.textContent ?? '';

  const datos = new FormData(form);
  const payload: Record<string, string> = { tenant: BRAVO.tenant };
  for (const [clave, valor] of datos.entries()) {
    if (typeof valor === 'string' && valor.trim()) payload[clave] = valor.trim();
  }

  // El honeypot va SIEMPRE, incluso vacío: la API lo usa para descartar bots en
  // silencio (responde 200 y no guarda nada).
  payload.website = String(datos.get('website') ?? '');

  if (submit) submit.disabled = true;
  if (etiqueta) etiqueta.textContent = MENSAJES.enviando;
  setStatus(form, MENSAJES.enviando, 'pendiente');

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (res.ok) {
      // 201 = guardado. 200 = honeypot descartado en silencio; para la persona que
      // está del otro lado el resultado se ve igual, que es justo lo que se busca.
      form.reset();
      setStatus(form, MENSAJES.ok, 'ok');
      return;
    }

    // NUNCA agradecer un envío que la API rechazó: la persona se iría creyendo que
    // quedó anotada. Mostramos el error y dejamos el botón habilitado para reintentar.
    if (res.status === 429) {
      setStatus(form, MENSAJES.rateLimit, 'error');
      return;
    }
    if (res.status === 400) {
      const cuerpo = await res.json().catch(() => null);
      const err = cuerpo && typeof cuerpo === 'object' ? (cuerpo as { error?: string }).error : null;
      setStatus(form, err === 'contact_required' ? MENSAJES.sinContacto : MENSAJES.invalido, 'error');
      return;
    }
    setStatus(form, MENSAJES.generico, 'error');
  } catch {
    setStatus(form, MENSAJES.red, 'error');
  } finally {
    if (submit) submit.disabled = false;
    if (etiqueta) etiqueta.textContent = textoOriginal;
  }
}

function init() {
  const forms = document.querySelectorAll<HTMLFormElement>('form[data-bravo-contact]');
  for (const form of forms) {
    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      // Deja que el browser muestre sus propios mensajes de campo requerido primero.
      if (!form.reportValidity()) return;
      void enviar(form);
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
