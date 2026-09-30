import { content } from './content';
export interface Format { id: string; label: string; units: number }
export interface Retailer { name: string; url: string; address?: string }
export interface Product { id: string; name: string; formats: Format[]; price: number | null; currency: string; stock: number | null; checkoutUrl: string | null }
export interface Slot { id: string; label: string; capacity: number }
export type Availability = { status: 'demo' } | { status: 'available'; slots: Slot[] } | { status: 'empty' };
export type Checkout = { status: 'demo' } | { status: 'unavailable' } | { status: 'redirect'; url: string };
export interface TastingInput { date: string; persons: number; slotId: string }
export type TastingResult = { status: 'demo' } | { status: 'received'; requestId: string };
export interface CommerceAdapter {
  getProduct(id: string): Promise<Product>;
  getRetailers(productId: string): Promise<Retailer[]>;
  getTastingAvailability(date: string, persons: number): Promise<Availability>;
  createTastingRequest(input: TastingInput): Promise<TastingResult>;
  createCheckout(productId: string, formatId: string, quantity: number): Promise<Checkout>;
}
export function todayInMadrid(now = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: content.timezone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
  return ['year', 'month', 'day'].map(type => parts.find(part => part.type === type)!.value).join('-');
}
export const validCount = (n: number) => Number.isInteger(n) && n >= 1 && n <= 12;
export function validDate(date: string, today = todayInMadrid()): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const parsed = new Date(`${date}T12:00:00Z`);
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === date && date >= today;
}
export function authorizedCheckout(url: string, allowed: readonly string[]): boolean {
  try { const target = new URL(url); return target.protocol === 'https:' && !target.username && !target.password && allowed.includes(target.origin); } catch { return false; }
}
// Explicit allowlist, populated only when the shop and its domain have been approved.
export const checkoutOrigins: readonly string[] = [];
const requireProduct = (id: string) => { if (id !== content.product.id) throw new Error('Producto desconocido'); };
export const demoAdapter: CommerceAdapter = {
  async getProduct(id) { requireProduct(id); return structuredClone(content.product); },
  async getRetailers(id) { requireProduct(id); return structuredClone(content.product.retailers); },
  async getTastingAvailability(date, persons) { if (!validDate(date) || !validCount(persons)) throw new Error('Consulta no válida'); return { status: 'demo' }; },
  async createTastingRequest(input) { if (!validDate(input.date) || !validCount(input.persons)) throw new Error('Solicitud no válida'); return { status: 'demo' }; },
  async createCheckout(id, formatId, quantity) {
    requireProduct(id);
    if (!validCount(quantity) || !content.product.formats.some(f => f.id === formatId)) throw new Error('Selección no válida');
    return { status: 'demo' };
  },
};
export const adapter: CommerceAdapter = demoAdapter;
