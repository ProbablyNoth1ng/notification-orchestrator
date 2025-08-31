import { DNDService } from '../services/dndService';

describe('DNDService', () => {
  const dndService = new DNDService();

  it('blocks notifications inside same day provided window', () => {
    const dnd = { start: '22:00', end: '23:59' };
    const ts = new Date(Date.UTC(2025, 7, 31, 22, 30)).toISOString();
    expect(dndService.isWithinDNDWindow(ts, dnd)).toBe(true);
  });

  it('blocks notifications inside overnight provided window (22:00 07:00)', () => {
    const dnd = { start: '22:00', end: '07:00' };
    const ts1 = new Date(Date.UTC(2025, 7, 31, 23, 0)).toISOString();
    const ts2 = new Date(Date.UTC(2025, 8, 1, 2, 0)).toISOString();
    expect(dndService.isWithinDNDWindow(ts1, dnd)).toBe(true);
    expect(dndService.isWithinDNDWindow(ts2, dnd)).toBe(true);
  });

  it('allows notifications outside provided window', () => {
    const dnd = { start: '22:00', end: '07:00' };
    const ts = new Date(Date.UTC(2023, 0, 2, 9, 0)).toISOString();
    expect(dndService.isWithinDNDWindow(ts, dnd)).toBe(false);
  });
});
