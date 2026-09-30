import { todayInMadrid, validCount, validDate } from '../lib/commerce';
import { content, ui } from '../lib/content';
import { wines, visits, type Wine } from '../lib/wines';

export function initControls() {
  const abort = new AbortController();
  const options = { signal: abort.signal };
  const menu = document.querySelector<HTMLDialogElement>('#menu-dialog')!;
  const toggle = document.querySelector<HTMLButtonElement>('.menu-toggle')!;
  const demo = document.querySelector<HTMLDialogElement>('#demo-dialog')!;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const put = (selector: string, value: string) => { document.querySelector(selector)!.textContent = value; };
  const openDialog = (dialog: HTMLDialogElement) => {
    dialog.showModal(); document.documentElement.classList.add('dialog-open');
  };
  const closeDialog = async (dialog: HTMLDialogElement) => {
    if (!dialog.open || dialog.classList.contains('is-closing')) return;
    dialog.classList.add('is-closing');
    if (!reduced.matches) await Promise.allSettled(dialog.getAnimations().map(animation => animation.finished));
    dialog.classList.remove('is-closing'); dialog.close();
  };
  [menu, demo].forEach(dialog => {
    dialog.addEventListener('cancel', event => { event.preventDefault(); void closeDialog(dialog); }, options);
    dialog.addEventListener('click', event => {
      const rect = dialog.getBoundingClientRect();
      if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) void closeDialog(dialog);
    }, options);
    dialog.addEventListener('close', () => { if (!document.querySelector('dialog[open]')) document.documentElement.classList.remove('dialog-open'); }, options);
  });
  toggle.hidden = false;
  toggle.addEventListener('click', () => { openDialog(menu); toggle.setAttribute('aria-expanded', 'true'); }, options);
  menu.addEventListener('close', () => toggle.setAttribute('aria-expanded', 'false'), options);
  document.querySelectorAll<HTMLButtonElement>('[data-close]').forEach(button => button.addEventListener('click', () => { void closeDialog(button.closest('dialog')!); }, options));
  document.addEventListener('click', event => {
    if ((event.target as Element).closest('a[href^="#"]') && menu.open) menu.close();
  }, options);

  const updateBottle = (container: Element, wine: Wine) => {
    container.querySelector('source')!.srcset = `/assets/nexus/${wine.image}-mobile.webp`;
    const img = container.querySelector('img')!;
    img.src = `/assets/nexus/${wine.image}-desktop.webp`;
    img.alt = `Botella de ${wine.name}, ${wine.origin}`;
  };
  const select = document.querySelector<HTMLSelectElement>('#wine-select')!;
  const selectedWine = () => wines.find(wine => wine.id === select.value) ?? wines[0];
  select.addEventListener('change', () => {
    const wine = selectedWine();
    updateBottle(document.querySelector('#selected-wine-art')!, wine);
    put('#wine-origin', wine.origin); put('#wine-name', `${wine.name} · ${wine.vintage}`);
    put('#wine-grape', wine.grape); put('#wine-aging', wine.aging); put('#wine-description', wine.tasting);
    document.querySelector<HTMLAnchorElement>('#wine-shop')!.href = wine.url;
  }, options);
  const showDetails = (kind: 'wine' | 'tasting', title: string, message: string, rows: [string, string][], url: string) => {
    demo.dataset.kind = kind;
    put('#demo-title', title); put('#demo-message', message);
    put('#demo-eyebrow', kind === 'wine' ? 'NEXUS & FRONTAURA · NUESTROS VINOS' : 'ENOTURISMO · EL VINO EN SU ORIGEN');
    const details = document.querySelector('#demo-details')!; details.replaceChildren();
    rows.forEach(([title, text]) => {
      const row = document.createElement('div'); const label = document.createElement('strong'); const copy = document.createElement('p');
      label.textContent = title; copy.textContent = text; row.append(label, copy); details.append(row);
    });
    put('#demo-disclaimer', kind === 'wine' ? 'Información de la ficha oficial de la bodega. Comprueba allí la añada, el formato, el precio y la disponibilidad antes de comprar.' : 'Tu selección no se ha enviado. La bodega debe confirmar horarios, condiciones y disponibilidad.');
    const link = document.querySelector<HTMLAnchorElement>('#demo-official')!;
    link.href = url; link.textContent = kind === 'wine' ? 'Ver ficha y comprar en la bodega ↗' : 'Consultar la visita con la bodega ↗';
    openDialog(demo);
  };
  document.querySelector('[data-wine-details]')!.addEventListener('click', () => {
    const wine = selectedWine();
    updateBottle(demo.querySelector('.dialog-art')!, wine);
    put('.dialog-art > span', wine.origin);
    showDetails('wine', wine.name, wine.tasting, [['Origen y añada', `${wine.origin} · ${wine.vintage}`], ['Variedad y crianza', `${wine.grape}. ${wine.aging}.`], ['En la mesa', wine.pairing]], wine.url);
  }, options);

  const tasting = document.querySelector<HTMLFormElement>('#tasting-form')!;
  const date = document.querySelector<HTMLInputElement>('#date')!;
  const persons = document.querySelector<HTMLInputElement>('#persons')!;
  const venue = document.querySelector<HTMLSelectElement>('#visit-venue')!;
  const status = document.querySelector<HTMLElement>('#tasting-status')!;
  const setError = (input: HTMLInputElement, message: string) => {
    const error = document.getElementById(`${input.id}-error`)!;
    error.textContent = message; error.hidden = !message; input.setAttribute('aria-invalid', String(Boolean(message)));
  };
  date.min = todayInMadrid();
  tasting.addEventListener('input', () => { status.textContent = ''; }, options);
  tasting.addEventListener('submit', event => {
    event.preventDefault(); date.min = todayInMadrid();
    const dateOk = validDate(date.value); const personsOk = validCount(persons.valueAsNumber);
    setError(date, dateOk ? '' : ui.dateError); setError(persons, personsOk ? '' : ui.personsError);
    if (!dateOk || !personsOk) { (dateOk ? persons : date).focus(); return; }
    const visit = visits[venue.value as keyof typeof visits] ?? visits.nexus;
    const formatted = new Intl.DateTimeFormat(content.locale, { dateStyle: 'long', timeZone: content.timezone }).format(new Date(`${date.value}T12:00:00Z`));
    status.textContent = `${visit.name} · ${formatted} · ${persons.valueAsNumber} personas. Selección pendiente de consultar con la bodega.`;
    showDetails('tasting', 'Un encuentro con el origen', 'Descubre el lugar donde nace el vino. Prepara tu encuentro con el paisaje, la bodega y sus historias.', [['Tu destino', visit.name], ['Tu propuesta', `${formatted} · ${persons.valueAsNumber} personas`], ['El siguiente paso', 'Consulta con la bodega las experiencias y los horarios disponibles.']], visit.url);
  }, options);
  window.addEventListener('pagehide', event => { if (!event.persisted) abort.abort(); }, { once: true });
}
