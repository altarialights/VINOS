import { adapter, authorizedCheckout, checkoutOrigins, todayInMadrid, validCount, validDate } from '../lib/commerce';
import { content, ui } from '../lib/content';
export function initControls() {
  const abort = new AbortController();
  const options = { signal: abort.signal };
  const menu = document.querySelector<HTMLDialogElement>('#menu-dialog')!;
  const toggle = document.querySelector<HTMLButtonElement>('.menu-toggle')!;
  const demo = document.querySelector<HTMLDialogElement>('#demo-dialog')!;
  const message = document.querySelector<HTMLElement>('#demo-message')!;
  toggle.hidden = false;
  toggle.addEventListener('click', () => { menu.showModal(); toggle.setAttribute('aria-expanded', 'true'); }, options);
  menu.addEventListener('close', () => toggle.setAttribute('aria-expanded', 'false'), options);
  document.querySelectorAll<HTMLButtonElement>('[data-close]').forEach(button => button.addEventListener('click', () => button.closest('dialog')!.close(), options));
  document.addEventListener('click', event => {
    const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!link) return;
    if (menu.open) menu.close();
    // Motion owns anchor positioning and focus, including the stacked fallback.
  }, options);
  const showDemo = (text: string) => { message.textContent = text; demo.showModal(); };
  const setError = (input: HTMLInputElement, message: string) => {
    const error = document.getElementById(`${input.id}-error`)!;
    error.textContent = message; error.hidden = !message;
    input.setAttribute('aria-invalid', String(Boolean(message)));
  };
  const purchase = document.querySelector<HTMLFormElement>('#purchase-form')!;
  const quantity = document.querySelector<HTMLInputElement>('#quantity')!;
  const summary = document.querySelector<HTMLElement>('#selection-summary')!;
  const format = () => content.product.formats.find(f => f.id === new FormData(purchase).get('format'))!;
  const updateSummary = () => {
    const selected = format(); const n = quantity.valueAsNumber;
    if (!validCount(n)) { summary.textContent = 'Cantidad pendiente de corregir'; return; }
    const bottles = n * selected.units;
    summary.textContent = `${n} × ${selected.label} · ${bottles} ${bottles === 1 ? 'botella' : 'botellas'} en total`;
    setError(quantity, '');
  };
  purchase.addEventListener('input', updateSummary, options);
  purchase.addEventListener('submit', async event => {
    event.preventDefault();
    if (!validCount(quantity.valueAsNumber)) { setError(quantity, ui.quantityError); quantity.focus(); return; }
    setError(quantity, '');
    const button = purchase.querySelector<HTMLButtonElement>('[type="submit"]')!;
    button.disabled = true; purchase.setAttribute('aria-busy', 'true');
    try {
      const result = await adapter.createCheckout(content.product.id, format().id, quantity.valueAsNumber);
      if (result.status === 'redirect') {
        if (!authorizedCheckout(result.url, checkoutOrigins)) throw new Error('Dominio no autorizado');
        location.assign(result.url);
      } else if (result.status === 'unavailable') { showDemo('Esta selección no está disponible. Revisa el formato y la cantidad.'); }
      else { showDemo(`Selección: ${summary.textContent}. ${ui.checkoutDemo}`); }
    } catch { showDemo(ui.networkError); }
    finally { button.disabled = false; purchase.removeAttribute('aria-busy'); }
  }, options);
  const retailersButton = document.querySelector<HTMLButtonElement>('[data-retailers]')!;
  const retailerStatus = document.querySelector<HTMLElement>('#retailer-status')!;
  retailersButton.addEventListener('click', async () => {
    retailersButton.disabled = true; retailerStatus.textContent = 'Consultando puntos de venta…';
    try {
      const retailers = await adapter.getRetailers(content.product.id);
      retailerStatus.replaceChildren();
      if (!retailers.length) retailerStatus.textContent = ui.retailersEmpty;
      else {
        const list = document.createElement('ul'); list.className = 'retailers';
        retailers.forEach(retailer => { const row = document.createElement('li'); const link = document.createElement('a'); const url = new URL(retailer.url); if (!['https:', 'http:'].includes(url.protocol)) return; link.href = url.href; link.textContent = retailer.name; row.append(link); if (retailer.address) row.append(` · ${retailer.address}`); list.append(row); });
        retailerStatus.append(list);
      }
    } catch { retailerStatus.textContent = ui.networkError; }
    finally { retailersButton.disabled = false; }
  }, options);
  const tasting = document.querySelector<HTMLFormElement>('#tasting-form')!;
  const date = document.querySelector<HTMLInputElement>('#date')!;
  const persons = document.querySelector<HTMLInputElement>('#persons')!;
  const status = document.querySelector<HTMLElement>('#tasting-status')!;
  const slots = document.querySelector<HTMLElement>('#tasting-slots')!;
  let requestVersion = 0;
  date.min = todayInMadrid();
  tasting.addEventListener('input', () => { requestVersion++; status.textContent = ''; slots.hidden = true; slots.replaceChildren(); }, options);
  tasting.addEventListener('submit', async event => {
    event.preventDefault(); date.min = todayInMadrid();
    const dateOk = validDate(date.value); const personsOk = validCount(persons.valueAsNumber);
    setError(date, dateOk ? '' : ui.dateError); setError(persons, personsOk ? '' : ui.personsError);
    if (!dateOk || !personsOk) { (dateOk ? persons : date).focus(); return; }
    const version = ++requestVersion;
    const selection = { date: date.value, persons: persons.valueAsNumber };
    const button = tasting.querySelector<HTMLButtonElement>('[type="submit"]')!;
    button.disabled = true; tasting.setAttribute('aria-busy', 'true'); slots.hidden = true; slots.replaceChildren();
    status.textContent = 'Consultando disponibilidad…';
    try {
      const result = await adapter.getTastingAvailability(selection.date, selection.persons);
      if (version !== requestVersion) return;
      if (result.status === 'demo') {
        const formatted = new Intl.DateTimeFormat(content.locale, { dateStyle: 'long', timeZone: content.timezone }).format(new Date(`${selection.date}T12:00:00Z`));
        status.textContent = `${formatted} · ${selection.persons} personas. ${content.tasting.demoMessage}`;
      } else if (result.status === 'empty' || !result.slots.length) { status.textContent = ui.noSlots; }
      else {
        status.textContent = 'Selecciona un horario para solicitar tu cata. La disponibilidad se validará de nuevo al enviar.';
        slots.hidden = false;
        result.slots.filter(slot => slot.capacity >= selection.persons).forEach(slot => {
          const choose = document.createElement('button'); choose.type = 'button'; choose.className = 'button secondary'; choose.textContent = slot.label;
          choose.addEventListener('click', async () => {
            choose.disabled = true;
            try { const reply = await adapter.createTastingRequest({ ...selection, slotId: slot.id }); if (version !== requestVersion) return; status.textContent = reply.status === 'received' ? `Solicitud recibida. Referencia: ${reply.requestId}. Esto no confirma una reserva.` : content.tasting.demoMessage; }
            catch { if (version === requestVersion) status.textContent = ui.networkError; }
            finally { choose.disabled = false; }
          }, options);
          slots.append(choose);
        });
        if (!slots.childElementCount) { status.textContent = ui.noSlots; slots.hidden = true; }
      }
    } catch { if (version === requestVersion) status.textContent = ui.networkError; }
    finally { button.disabled = false; tasting.removeAttribute('aria-busy'); }
  }, options);
  window.addEventListener('pagehide', event => { if (!event.persisted) abort.abort(); }, { once: true });
}
